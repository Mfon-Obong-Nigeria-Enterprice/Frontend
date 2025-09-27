/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";

const SessionTimeout = () => {
  const { isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [showWarning, setShowWarning] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  
  const warningTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  const WARNING_TIME = 14 * 60 * 1000;
  const LOGOUT_TIME = 15* 60 * 1000;

  const clearAllTimers = () => {
    if (warningTimeoutRef.current) {
      clearTimeout(warningTimeoutRef.current);
      warningTimeoutRef.current = null;
    }
    if (logoutTimeoutRef.current) {
      clearTimeout(logoutTimeoutRef.current);
      logoutTimeoutRef.current = null;
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
      countdownIntervalRef.current = null;
    }
  };

  const resetTimers = () => {
    if (!isAuthenticated) {
      clearAllTimers();
      return;
    }
    
    lastActivityRef.current = Date.now();
    
    clearAllTimers();

    setTimeLeft(60);
    setShowWarning(false);

    warningTimeoutRef.current = setTimeout(() => {
      setShowWarning(true);
      startCountdown();
    }, WARNING_TIME);

    logoutTimeoutRef.current = setTimeout(() => {
      handleLogout();
    }, LOGOUT_TIME);
  };

  const startCountdown = () => {
    countdownIntervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
            countdownIntervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = async () => {
    setShowWarning(false);
    clearAllTimers();
    await logout();
    navigate("/", { replace: true });
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    clearAllTimers();
    resetTimers();
  };

  const throttledResetTimers = useRef(() => {
    const now = Date.now();
    if (now - lastActivityRef.current > 1000) {
      resetTimers();
    }
  }).current;

  useEffect(() => {
    if (!isAuthenticated) {
      clearAllTimers();
      return;
    }

    resetTimers();

    const events = [
      "mousemove", "mousedown", "click", "scroll", 
      "keydown", "keypress", "touchstart", "touchmove"
    ];
    
    const activityHandler = () => {
      throttledResetTimers();
    };

    events.forEach((event) => {
      document.addEventListener(event, activityHandler, { passive: true });
    });

    const visibilityHandler = () => {
      if (!document.hidden) {
        throttledResetTimers();
      }
    };
    document.addEventListener('visibilitychange', visibilityHandler);

    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, activityHandler);
      });
      document.removeEventListener('visibilitychange', visibilityHandler);
      clearAllTimers();
    };
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.state?.status === "success" || event?.query?.state?.status === "error") {
        resetTimers();
      }
    });

    return () => {
      unsubscribe();
    };
  }, [isAuthenticated, queryClient]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Dialog open={showWarning} onOpenChange={setShowWarning}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Session Expiring Soon</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Your session will expire in {timeLeft} seconds due to inactivity.
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