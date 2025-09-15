import { io, Socket } from "socket.io-client";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
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

// WebSocket-based notification service
export class WebSocketNotificationService {
  private static instance: WebSocketNotificationService;
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private connectionStatus: "disconnected" | "connecting" | "connected" =
    "disconnected";

  static getInstance(): WebSocketNotificationService {
    if (!WebSocketNotificationService.instance) {
      WebSocketNotificationService.instance =
        new WebSocketNotificationService();
    }
    return WebSocketNotificationService.instance;
  }

  private getServerUrl(): string {
    // Use environment variable or default to production URL
    return process.env.NODE_ENV === "development"
      ? "http://localhost:3000"
      : "https://mfon-obong-enterprise.onrender.com";
  }

  connect(): void {
    const currentUser = useAuthStore.getState().user;
    if (!currentUser?.id) {
      console.warn(
        "WebSocketNotificationService: No authenticated user, cannot connect"
      );
      return;
    }

    // Get JWT token from your auth system
    const token =
      localStorage.getItem("accessToken") || localStorage.getItem("token");
    if (!token) {
      console.error(
        "WebSocketNotificationService: No authentication token found"
      );
      return;
    }

    console.log(
      `WebSocketNotificationService: Connecting for user ${currentUser.name} (${currentUser.role})`
    );

    this.connectionStatus = "connecting";

    this.socket = io(this.getServerUrl(), {
      auth: { token },
      transports: ["websocket", "polling"], // Fallback to polling if websocket fails
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    this.setupEventListeners();
  }

  private setupEventListeners(): void {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("✅ WebSocket connection established");
      this.connectionStatus = "connected";
      this.reconnectAttempts = 0;

      // Test connection
      this.socket?.emit("ping", "test", (response: string) => {
        console.log("✅ WebSocket ping successful:", response);
      });
    });

    this.socket.on("connect_error", (error) => {
      console.error("❌ WebSocket connection failed:", error);
      this.connectionStatus = "disconnected";

      if (error.message.includes("Authentication")) {
        console.error("Authentication failed - redirecting to login");
        // Handle auth failure - you might want to redirect to login
        useAuthStore.getState().logout?.();
      }
    });

    this.socket.on("disconnect", (reason) => {
      console.log("🔌 WebSocket disconnected:", reason);
      this.connectionStatus = "disconnected";

      if (reason === "io server disconnect") {
        console.log("Server disconnected, will auto-reconnect...");
      }
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
      console.log("🔔 New transaction via WebSocket:", data);

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
    });

    // Client created - Real-time client notifications
    this.socket.on("client_created", (data: WebSocketNotificationData) => {
      console.log("🔔 New client via WebSocket:", data);

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
    });

    // Product created - Real-time product notifications
    this.socket.on("product_created", (data: WebSocketNotificationData) => {
      console.log("🔔 New product via WebSocket:", data);

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
    });

    // Support request - Custom event for support requests
    this.socket.on(
      "support_request_created",
      (data: SupportRequestSocketData) => {
        console.log("🔔 New support request via WebSocket:", data);

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
    this.socket.on("password_reset_sent", (data: any) => {
      console.log("🔔 Password reset via WebSocket:", data);

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

    console.log("📤 Emitting support request via WebSocket:", data);
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

    console.log("📤 Emitting password reset via WebSocket:", data);
    this.socket.emit("password_reset", {
      branchAdminEmail: data.branchAdminEmail,
      temporaryPassword: data.temporaryPassword,
      userName: data.userName,
      timestamp: new Date().toISOString(),
    });
  }

  disconnect(): void {
    if (this.socket) {
      console.log("🔌 Disconnecting WebSocket");
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
