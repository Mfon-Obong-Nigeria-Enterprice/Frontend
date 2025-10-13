import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { queryClient } from "@/lib/queryClient";
// import { syncBranchNotifications } from "@/services/passwordService";
import type { Role } from "@/types/types";
import { useEffect, useRef, useState } from "react";

interface WebSocketNotificationData {
  action: string;
  resourceType: string;
  resourceId: string;
  data: Record<string, unknown>;
  actorEmail: string;
  actorRole: string;
  branchId: string;
  branch: string;
  timestamp: string;
}

interface SupportRequestSocketData {
  email: string;
  message: string;
  issueType: string;
  timestamp: string;
}
interface PasswordRequestSocketData {
  message: string;
  temporaryPassword: string;
  createdAt: string;
}

// WebSocket-based notification service
export class WebSocketNotificationService {
  private static instance: WebSocketNotificationService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionStatus: "disconnected" | "connecting" | "connected" =
    "disconnected";
  private lastErrorTime = 0;
  private errorCount = 0;
  private readonly ERROR_THROTTLE_MS = 5000; // Only log errors every 5 seconds
  private authFailureCount = 0;
  private readonly MAX_AUTH_FAILURES = 3;

  static getInstance(): WebSocketNotificationService {
    if (!WebSocketNotificationService.instance) {
      WebSocketNotificationService.instance =
        new WebSocketNotificationService();
    }
    return WebSocketNotificationService.instance;
  }

  private getServerUrl(): string {
    // Prefer explicit socket URL override (set VITE_SOCKET_URL)
    const socketUrl = import.meta.env.VITE_SOCKET_URL as string | undefined;
    if (socketUrl && socketUrl.length) return socketUrl;

    // Fallback to API URL base if provided
    const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
    if (apiUrl) {
      try {
        return apiUrl.replace(/\/api\/?$/, "");
      } catch (e) {
        // ignore and fallback
      }
    }

    // DEV fallback: use window origin (works if vite proxies /socket.io to backend)
    if (import.meta.env.DEV) {
      return window.location.origin;
    }

    // Production fallback: current origin
    return window.location.origin;
  }

  // Cache invalidation helper methods
  private invalidateRelevantQueries(
    resourceType: string,
    _branchId?: string,
    _currentUser?: any
  ): void {
    try {
      switch (resourceType.toLowerCase()) {
        case "transaction":
          // Invalidate transactions and related data
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["clients"] }); // Transactions affect client balances
          queryClient.invalidateQueries({ queryKey: ["products"] }); // Transactions affect inventory
          queryClient.invalidateQueries({ queryKey: ["inventory"] });
          break;

        case "client":
          // Invalidate clients data
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          break;

        case "product":
          // Invalidate products and inventory
          queryClient.invalidateQueries({ queryKey: ["products"] });
          queryClient.invalidateQueries({ queryKey: ["inventory"] });
          break;

        case "category":
          // Invalidate categories and products
          queryClient.invalidateQueries({ queryKey: ["categories"] });
          queryClient.invalidateQueries({ queryKey: ["products"] });
          break;

        default:
          // For unknown types, invalidate common queries
          queryClient.invalidateQueries({ queryKey: ["transactions"] });
          queryClient.invalidateQueries({ queryKey: ["clients"] });
          queryClient.invalidateQueries({ queryKey: ["products"] });
          break;
      }

      // Also invalidate dashboard data that might be affected
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    } catch (error) {
      console.error("❌ Error invalidating queries:", error);
    }
  }

  // Error throttling to prevent console spam
  private logThrottledError(message: string, error?: any): void {
    const now = Date.now();
    this.errorCount++;

    // Only log if enough time has passed since last error log
    if (now - this.lastErrorTime > this.ERROR_THROTTLE_MS) {
      if (this.errorCount > 1) {
        console.error(
          `${message} (${this.errorCount} similar errors suppressed)`,
          error
        );
      } else {
        console.error(message, error);
      }
      this.lastErrorTime = now;
      this.errorCount = 0;
    }
  }

  // Check if user should receive real-time updates based on role and branch
  private shouldReceiveRealTimeUpdate(
    eventBranchId: string,
    currentUser: any
  ): boolean {
    if (!currentUser) return false;

    // SUPER_ADMIN sees all branches
    if (currentUser.role === "SUPER_ADMIN") return true;

    // MAINTAINER sees all branches
    if (currentUser.role === "MAINTAINER") return true;

    // ADMIN and STAFF only see their branch
    if (currentUser.role === "ADMIN" || currentUser.role === "STAFF") {
      return currentUser.branchId === eventBranchId;
    }

    return false;
  }

  connect(): void {
    const currentUser = useAuthStore.getState().user;

    if (!currentUser?.id) {
      console.warn(
        "WebSocketNotificationService: No authenticated user, cannot connect"
      );
      return;
    }

    this.connectionStatus = "connecting";

    // Socket.IO configuration for cookie-based authentication
    // withCredentials: true automatically sends cookies (accessToken/refreshToken) with the connection
    const socketConfig: any = {
      withCredentials: true, // Sends cookies with WebSocket connection
      path: "/socket.io",
      transports: ["websocket", "polling"], // Try websocket first, fallback to polling
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 2000,
      forceNew: true,
      // No auth token needed - cookies are sent automatically with withCredentials
    };

    const url = this.getServerUrl();
    console.debug("Connecting socket to", url, socketConfig);
    this.socket = io(url, socketConfig);

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      this.connectionStatus = "connected";
      this.reconnectAttempts = 0;
      // Reset error tracking on successful connection
      this.errorCount = 0;
      this.lastErrorTime = 0;
      this.authFailureCount = 0; // Reset auth failure counter

      // Test connection
      this.socket?.emit("ping", "test");
    });

    this.socket.on("connect_error", (error) => {
      this.connectionStatus = "disconnected";

      // Use throttled error logging to prevent console spam
      if (
        error.message.includes("Authentication") ||
        error.message.includes("unauthorized")
      ) {
        this.authFailureCount++;

        // Only logout after multiple consecutive auth failures
        if (this.authFailureCount >= this.MAX_AUTH_FAILURES) {
          this.logThrottledError(
            "❌ Multiple WebSocket auth failures - logging out",
            error
          );
          useAuthStore.getState().logout?.();
        } else {
          this.logThrottledError(
            `❌ WebSocket auth failed (attempt ${this.authFailureCount}/${this.MAX_AUTH_FAILURES})`,
            error
          );
        }
      } else {
        // Reset auth failure counter on non-auth errors
        this.authFailureCount = 0;
        this.logThrottledError(
          "❌ WebSocket connection failed (will retry)",
          error
        );
      }
    });

    // Add explicit authentication error handler
    this.socket.on("error", (error: any) => {
      if (
        error.type === "UnauthorizedError" ||
        error.message?.includes("unauthorized")
      ) {
        this.authFailureCount++;

        if (this.authFailureCount >= this.MAX_AUTH_FAILURES) {
          console.error("❌ WebSocket authentication error - invalid token");
          useAuthStore.getState().logout?.();
        }
      }
    });

    this.socket.on("disconnect", () => {
      // console.log("🔌 WebSocket disconnected:", reason);
      this.connectionStatus = "disconnected";
    });

    // Business event listeners
    this.setupBusinessEventListeners();
  }

  private setupBusinessEventListeners(): void {
    if (!this.socket) return;

    const { addNotification } = useNotificationStore.getState();
    const currentUser = useAuthStore.getState().user;

    // Transaction created (sales) - Real-time sales notifications
    this.socket.on("transaction_created", (data: WebSocketNotificationData) => {
      // Check if current user should receive this update
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }

      const notification = {
        id: `ws-transaction-${data.resourceId}`,
        title: "New Sale Created",
        message: `Sale ${data.data.invoiceNumber} created by ${
          data.actorEmail
        } - ₦${(data.data.totalPrice as number)?.toLocaleString() || 0}`,
        type: "success" as const,
        read: false,
        createdAt: new Date(data.timestamp),
        recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
        userId: currentUser?.id,
        action: "transaction_completed" as const,
        meta: {
          adminName: data.actorEmail,
          branch: data.branch,
          transactionId: data.resourceId,
          timestamp: data.timestamp,
          invoiceNumber: data.data.invoiceNumber as string,
          amount: data.data.totalPrice as number,
        },
      };

      addNotification(notification);

      // REAL-TIME UI UPDATE: Invalidate relevant queries to refresh data
      this.invalidateRelevantQueries("transaction", data.branchId, currentUser);
    });

    // Client created - Real-time client notifications
    this.socket.on("client_created", (data: WebSocketNotificationData) => {
      // Check if current user should receive this update
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }

      const notification = {
        id: `ws-client-${data.resourceId}`,
        title: "New Client Registered",
        message: `Client "${data.data.name}" registered by ${data.actorEmail}`,
        type: "success" as const,
        read: false,
        createdAt: new Date(data.timestamp),
        recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
        userId: currentUser?.id,
        action: "client_added" as const,
        meta: {
          adminName: data.actorEmail,
          branch: data.branch,
          timestamp: data.timestamp,
          clientName: data.data.name as string,
        },
      };

      addNotification(notification);

      // REAL-TIME UI UPDATE: Invalidate relevant queries to refresh data
      this.invalidateRelevantQueries("client", data.branchId, currentUser);
    });

    // Product created - Real-time product notifications
    this.socket.on("product_created", (data: WebSocketNotificationData) => {
      // Check if current user should receive this update
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }

      const notification = {
        id: `ws-product-${data.resourceId}`,
        title: "New Product Created",
        message: `Product "${data.data.name}" created by ${data.actorEmail}`,
        type: "info" as const,
        read: false,
        createdAt: new Date(data.timestamp),
        recipients: ["ADMIN", "MAINTAINER", "SUPER_ADMIN"] as Role[],
        userId: currentUser?.id,
        action: "product_added" as const,
        meta: {
          adminName: data.actorEmail,
          branch: data.branch,
          timestamp: data.timestamp,
          productName: data.data.name as string,
        },
      };

      addNotification(notification);

      // REAL-TIME UI UPDATE: Invalidate relevant queries to refresh data
      this.invalidateRelevantQueries("product", data.branchId, currentUser);
    });

    // Product updated - Real-time product update notifications
    this.socket.on("product_updated", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      // Invalidate queries without showing notification for updates
      this.invalidateRelevantQueries("product", data.branchId, currentUser);
    });

    // Product deleted - Real-time product deletion notifications
    this.socket.on("product_deleted", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      // Invalidate queries for product deletions
      this.invalidateRelevantQueries("product", data.branchId, currentUser);
    });

    // Client updated - Real-time client update notifications
    this.socket.on("client_updated", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("client", data.branchId, currentUser);
    });

    // Client deleted - Real-time client deletion notifications
    this.socket.on("client_deleted", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("client", data.branchId, currentUser);
    });

    // Client balance updated - Real-time balance changes
    this.socket.on(
      "client_balance_updated",
      (data: WebSocketNotificationData) => {
        if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
          return;
        }
        this.invalidateRelevantQueries("client", data.branchId, currentUser);
      }
    );

    // Transaction updated - Real-time transaction updates
    this.socket.on("transaction_updated", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("transaction", data.branchId, currentUser);
    });

    // Transaction status changed - Real-time status updates
    this.socket.on(
      "transaction_status_changed",
      (data: WebSocketNotificationData) => {
        if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
          return;
        }
        this.invalidateRelevantQueries(
          "transaction",
          data.branchId,
          currentUser
        );
      }
    );

    // Sale completed - Real-time sale completion (might be different from transaction_created)
    this.socket.on("sale_completed", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("transaction", data.branchId, currentUser);
    });

    // Category events - Real-time category management
    this.socket.on("category_created", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("category", data.branchId, currentUser);
    });

    this.socket.on("category_updated", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("category", data.branchId, currentUser);
    });

    this.socket.on("category_deleted", (data: WebSocketNotificationData) => {
      if (!this.shouldReceiveRealTimeUpdate(data.branchId, currentUser)) {
        return;
      }
      this.invalidateRelevantQueries("category", data.branchId, currentUser);
    });

    // User management events - For admins and super admins
    this.socket.on("user_created", (_data: WebSocketNotificationData) => {
      if (
        currentUser?.role === "SUPER_ADMIN" ||
        currentUser?.role === "MAINTAINER"
      ) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    });

    this.socket.on("user_updated", (_data: WebSocketNotificationData) => {
      if (
        currentUser?.role === "SUPER_ADMIN" ||
        currentUser?.role === "MAINTAINER"
      ) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    });

    this.socket.on("user_deleted", (_data: WebSocketNotificationData) => {
      if (
        currentUser?.role === "SUPER_ADMIN" ||
        currentUser?.role === "MAINTAINER"
      ) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    });

    this.socket.on("user_blocked", (_data: WebSocketNotificationData) => {
      if (
        currentUser?.role === "SUPER_ADMIN" ||
        currentUser?.role === "MAINTAINER"
      ) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    });

    this.socket.on("user_unblocked", (_data: WebSocketNotificationData) => {
      if (
        currentUser?.role === "SUPER_ADMIN" ||
        currentUser?.role === "MAINTAINER"
      ) {
        queryClient.invalidateQueries({ queryKey: ["users"] });
      }
    });

    // Support request - Custom event for support requests
    this.socket.on(
      "support_request_created",
      (data: SupportRequestSocketData) => {
        // Only send to maintainers
        if (currentUser?.role === "MAINTAINER") {
          const notification = {
            id: `ws-support-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 9)}`,
            title: "🚨 New Support Request",
            message: `Urgent: Support request from ${data.email} - "${data.issueType}"`,
            type: "error" as const,
            read: false,
            createdAt: new Date(data.timestamp),
            recipients: ["MAINTAINER"] as Role[],
            userId: undefined, // Global for all maintainers
            action: "support_request_received" as const,
            meta: {
              userEmail: data.email,
              issueType: data.issueType,
              timestamp: data.timestamp,
              urgent: true,
            },
          };

          addNotification(notification);
        }
      }
    );

    // Password reset - Custom event for password resets
    this.socket.on("password_reset_sent", (data: PasswordRequestSocketData) => {
      // Only send to branch admins
      if (currentUser?.role === "ADMIN") {
        const notification = {
          id: `ws-password-${Date.now()}-${Math.random()
            .toString(36)
            .substr(2, 9)}`,
          title: "🔑 Password Reset Available",
          message: `Temporary password generated for user. Password: ${data.temporaryPassword}`,
          type: "info" as const,
          read: false,
          createdAt: new Date(),
          recipients: ["ADMIN"] as Role[],
          userId: currentUser.id,
          action: "password_reset_received" as const,
          meta: {
            temporaryPassword: data.temporaryPassword,
            timestamp: new Date().toISOString(),
            urgent: true,
          },
        };

        addNotification(notification);
      }
    });
  }

  // Emit support request to server
  emitSupportRequest(data: {
    email: string;
    issueType: string;
    message: string;
  }): void {
    if (!this.socket?.connected) {
      console.warn("WebSocket not connected, cannot emit support request");
      return;
    }

    this.socket.emit("support_request", {
      email: data.email,
      issueType: data.issueType,
      message: data.message,
      timestamp: new Date().toISOString(),
    });
  }

  // Emit password reset to server
  emitPasswordReset(data: {
    branchAdminEmail: string;
    temporaryPassword: string;
    userName: string;
  }): void {
    if (!this.socket?.connected) {
      console.warn("WebSocket not connected, cannot emit password reset");
      return;
    }

    this.socket.emit("password_reset", {
      branchAdminEmail: data.branchAdminEmail,
      temporaryPassword: data.temporaryPassword,
      userName: data.userName,
      timestamp: new Date().toISOString(),
    });
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connectionStatus = "disconnected";
    }
  }

  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  getStatus(): { connected: boolean; status: string; attempts: number } {
    return {
      connected: this.socket?.connected || false,
      status: this.connectionStatus,
      attempts: this.reconnectAttempts,
    };
  }
}

// React hook for WebSocket notifications
export function useWebSocketNotifications(autoConnect: boolean = true) {
  const service = WebSocketNotificationService.getInstance();
  const user = useAuthStore((state) => state.user);
  const [connectionStatus, setConnectionStatus] = useState<
    "disconnected" | "connecting" | "connected"
  >("disconnected");

  // Keep service reference stable
  const serviceRef = useRef(service);

  useEffect(() => {
    if (autoConnect && user?.id) {
      service.connect();

      // Monitor connection status
      const statusInterval = setInterval(() => {
        const status = service.getStatus();
        setConnectionStatus(status.status as any);
      }, 1000);

      return () => {
        clearInterval(statusInterval);
        service.disconnect();
      };
    } else if (!user?.id) {
      service.disconnect();
      setConnectionStatus("disconnected");
    }
  }, [autoConnect, user?.id, service]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      serviceRef.current.disconnect();
    };
  }, []);

  return {
    isConnected: service.isConnected(),
    connectionStatus,
    connect: () => service.connect(),
    disconnect: () => service.disconnect(),
    emitSupportRequest: (data: {
      email: string;
      issueType: string;
      message: string;
    }) => service.emitSupportRequest(data),
    emitPasswordReset: (data: {
      branchAdminEmail: string;
      temporaryPassword: string;
      userName: string;
    }) => service.emitPasswordReset(data),
    getStatus: () => service.getStatus(),
  };
}
