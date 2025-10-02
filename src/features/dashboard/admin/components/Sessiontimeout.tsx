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

  // Add refs to prevent excessive timer resets
  const lastActivityTime = useRef<number>(Date.now());

  // Timing: warn at 14 minutes, logout at 15 minutes of inactivity
  const WARNING_TIME = 14 * 60 * 1000;
  const LOGOUT_TIME = 15 * 60 * 1000;

  // Use useCallback to prevent recreation on every render
  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return;

    // Only reset if enough time has passed since last reset (throttle to 5 seconds)
    const now = Date.now();
    if (now - lastActivityTime.current < 5000) return;

    lastActivityTime.current = now;

    // Clear existing timers
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setTimeLeft(60);
    setShowWarning(false);

    // Set new timers
    warningTimeout.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, WARNING_TIME);

    logoutTimeout.current = setTimeout(() => handleLogout(), LOGOUT_TIME);
  }, [isAuthenticated]);

  const startCountdown = useCallback(() => {
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current)
            clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

 const handleLogout = useCallback(async () => {
  if (countdownInterval.current) clearInterval(countdownInterval.current);
  if (warningTimeout.current) clearTimeout(warningTimeout.current);
  if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

  setShowWarning(false);
  await logout();
  navigate("/");
}, [logout, navigate]);


  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    resetTimers();
  }, [resetTimers]);

  // Activity detection effect
  useEffect(() => {
    if (!isAuthenticated) return;

    resetTimers();

    const events = [
      "mousemove",
      "keydown",
      "keyup",
      "click",
      "scroll",
      "touchstart",
      "mousedown",
      "input",
      "change",
      "focus",
      "blur",
      "submit",
      "paste",
      "cut",
      "copy",
    ];

    // Throttled activity handler
    let activityTimeout: NodeJS.Timeout | null = null;
    const activityHandler = () => {
      if (activityTimeout) clearTimeout(activityTimeout);
      activityTimeout = setTimeout(() => {
        resetTimers();
      }, 1000); 
    };

    events.forEach((event) =>
      window.addEventListener(event, activityHandler, { passive: true })
    );
    const visibilityHandler = () => {
      if (document.visibilityState === "visible") {
        activityHandler();
      }
    };
    document.addEventListener("visibilitychange", visibilityHandler, {
      passive: true,
    });

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, activityHandler)
      );
      document.removeEventListener("visibilitychange", visibilityHandler);
      if (activityTimeout) clearTimeout(activityTimeout);
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isAuthenticated, resetTimers]);

  // React Query activity detection - Disabled to prevent excessive resets
  // The user activity events above should be sufficient for detecting user interaction
  // useEffect(() => {
  //   if (!isAuthenticated) return;
  //   const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
  //     if (event?.query?.state?.status === "success") {
  //       setTimeout(() => {
  //         resetTimers();
  //       }, 0);
  //     }
  //   });
  //   return () => unsubscribe?.();
  // }, [isAuthenticated, queryClient, resetTimers]);

  if (!isAuthenticated) return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          You will be logged out in {timeLeft} seconds due to inactivity.
        </p>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={handleStayLoggedIn}>
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