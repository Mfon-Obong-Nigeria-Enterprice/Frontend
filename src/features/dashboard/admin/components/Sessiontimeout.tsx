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
  const [timeLeft, setTimeLeft] = useState(60); // Countdown in seconds (1 minute warning)
  const warningTimeout = useRef<NodeJS.Timeout | null>(null);
  const logoutTimeout = useRef<NodeJS.Timeout | null>(null);
  const countdownInterval = useRef<NodeJS.Timeout | null>(null);

  // Updated timing based on your requirements
  const WARNING_TIME = 14 * 60 * 1000; 
  const LOGOUT_TIME = 15 * 60 * 1000; 

  const resetTimers = () => {
    if (!isAuthenticated) return;

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
  };

  const startCountdown = () => {
    countdownInterval.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (countdownInterval.current) clearInterval(countdownInterval.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleLogout = async () => {
    setShowWarning(false);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    await logout();
    navigate("/"); // Redirect to login page
  };

  const handleStayLoggedIn = () => {
    setShowWarning(false);
    if (countdownInterval.current) clearInterval(countdownInterval.current);
    resetTimers(); 
  };

 
  useEffect(() => {
    if (!isAuthenticated) return;
    
    
    resetTimers();

    const events = ["mousemove", "keydown", "click", "scroll", "touchstart", "mousedown"];
    const activityHandler = () => resetTimers();
    
    events.forEach((event) => window.addEventListener(event, activityHandler, { passive: true }));

    return () => {
      // Cleanup event listeners and timers
      events.forEach((event) => window.removeEventListener(event, activityHandler));
      if (warningTimeout.current) clearTimeout(warningTimeout.current);
      if (logoutTimeout.current) clearTimeout(logoutTimeout.current);
      if (countdownInterval.current) clearInterval(countdownInterval.current);
    };
  }, [isAuthenticated]);


  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubscribe = queryClient.getQueryCache().subscribe((event) => {
      if (event?.query?.state?.status === "success") {
        resetTimers();
      }
    });

    return () => unsubscribe?.();
  }, [isAuthenticated, queryClient]);

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