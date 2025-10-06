/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState, useCallback } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const SessionTimeout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Timing: warn at 14 minutes, logout at 15 minutes of inactivity
  const WARNING_TIME = 14 * 60 * 1000; // 14 minutes
  const LOGOUT_TIME =15 * 60 * 1000; // 15 minutes

  const handleLogout = useCallback(async () => {
    // Clear all timers first
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    setShowWarning(false);
    await logout();
    navigate("/");
  }, [logout, navigate]);

  const startCountdown = useCallback(() => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    
    setTimeLeft(60); // Reset to 60 seconds for countdown
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) {
            clearInterval(countdownInterval.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return;

    // Clear existing timers
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setShowWarning(false);
    setTimeLeft(60);

    // Set new timers
    warningTimeout.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, WARNING_TIME);

    logoutTimeout.current = setTimeout(() => {
      handleLogout();
    }, LOGOUT_TIME);
  }, [isAuthenticated, handleLogout, startCountdown]);

  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    if (countdownInterval.current) {
      clearInterval(countdownInterval.current);
    }
    resetTimers();
  }, [resetTimers]);

  // Main activity detection effect
  useEffect(() => {
    if (!isAuthenticated) {
      // Clean up if not authenticated
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
      setShowWarning(false);
      return;
    }

    // Initialize timers when authenticated
    resetTimers();

    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
      "mousedown",
      "keypress",
      "wheel",
      "contextmenu",
      "drag",
      "drop",
      "focus",
      "blur"
    ];

    // Add event listeners directly without throttling
    const handleActivity = () => {
      resetTimers();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Handle visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimers();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange, {
      passive: true,
    });

    // Cleanup function
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isAuthenticated, resetTimers]);

  // Optional: React Query activity detection (simplified)
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query && event.query.state.status === "success") {
        // Use microtask to avoid render cycle issues
        Promise.resolve().then(() => {
          resetTimers();
        });
      }
    });

    return () => unsubscribe();
  }, [isAuthenticated, queryClient, resetTimers]);

  // Don't render if not authenticated
  if (!isAuthenticated) return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be logged out in <strong>{timeLeft} seconds</strong> due to inactivity.
          </p>
          {/* <p className="text-xs text-muted-foreground">
            Click "Stay Logged In" to continue your session.
          </p> */}
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={handleStayLoggedIn}>
            Stay Logged In
          </Button>
          <Button variant="destructive" onClick={handleLogout}>
            Logout Now
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SessionTimeout;