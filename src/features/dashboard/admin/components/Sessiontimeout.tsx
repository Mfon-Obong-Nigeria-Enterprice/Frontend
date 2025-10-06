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

const SessionTimeout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  const warningTimeout = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);
  const lastActivityTime = useRef<number>(Date.now());

  // Timings: warn at 14 mins, logout at 15 mins
  const WARNING_TIME = 14 * 60 * 1000;
  const LOGOUT_TIME = 15 * 60 * 1000;

  /** 🔹 Handle actual logout */
  const handleLogout = useCallback(async () => {
    // Clear all timers
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);

    setShowWarning(false);
    await logout();
    navigate("/");
  }, [logout, navigate]);

  /** 🔹 Start 60-second countdown when warning appears */
  const startCountdown = useCallback(() => {
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setTimeLeft(60);
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval.current!);
          handleLogout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [handleLogout]);

  /** 🔹 Reset timers whenever there is user activity */
  const resetTimers = useCallback(() => {
    if (!isAuthenticated) return;

    const now = Date.now();
    if (now - lastActivityTime.current < 2000) return; // throttle resets
    lastActivityTime.current = now;

    // Clear old timers
    if (warningTimeout.current) clearTimeout(warningTimeout.current);
    if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
    if (countdownInterval.current) clearInterval(countdownInterval.current);

    setShowWarning(false);
    setTimeLeft(60);

    // Set new warning + logout timers
    warningTimeout.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, WARNING_TIME);

    logoutTimeout.current = setTimeout(() => {
      handleLogout();
    }, LOGOUT_TIME);
  }, [isAuthenticated, handleLogout, startCountdown]);

  /** 🔹 User chooses to stay logged in */
  const handleStayLoggedIn = useCallback(() => {
    setShowWarning(false);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    resetTimers();
  }, [resetTimers]);

  /** 🔹 Watch for user activity events */
  useEffect(() => {
    if (!isAuthenticated) return;

    resetTimers();

    const events = [
      "mousemove",
      "keydown",
      "click",
      "scroll",
      "touchstart",
      "mousedown",
      "wheel",
      "input",
      "focus",
      "blur",
      "submit",
      "paste",
      "cut",
      "copy",
    ];

    const handleActivity = () => resetTimers();

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        resetTimers();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );

      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isAuthenticated, resetTimers]);

  if (!isAuthenticated) return null;

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            You will be logged out in <strong>{timeLeft} seconds</strong> due to
            inactivity.
          </p>
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
