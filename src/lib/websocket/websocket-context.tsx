import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import type { ReactNode } from "react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

interface CasePickedUpEvent {
  caseId: string;
  userId: string;
  assignedTo: {
    id: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  timestamp: string;
}

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onCasePickedUp: (callback: (data: CasePickedUpEvent) => void) => () => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

interface WebSocketProviderProps {
  children: ReactNode;
}

export function WebSocketProvider({ children }: WebSocketProviderProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Create socket connection
    const socketInstance = io(API_BASE_URL, {
      withCredentials: true, // Important for CORS with cookies
      autoConnect: true,
    });

    // Connection event handlers
    socketInstance.on("connect", () => {
      console.log("WebSocket connected:", socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on("disconnect", (reason) => {
      console.log("WebSocket disconnected:", reason);
      setIsConnected(false);
    });

    socketInstance.on("error", (error) => {
      console.error("WebSocket error:", error);
    });

    setSocket(socketInstance);

    // Cleanup on unmount
    return () => {
      console.log("Disconnecting WebSocket");
      socketInstance.disconnect();
    };
  }, []);

  const onCasePickedUp = useCallback(
    (callback: (data: CasePickedUpEvent) => void) => {
      if (!socket) return () => {};

      socket.on("case:pickedUp", callback);

      // Return cleanup function
      return () => {
        socket.off("case:pickedUp", callback);
      };
    },
    [socket]
  );

  const value: WebSocketContextType = {
    socket,
    isConnected,
    onCasePickedUp,
  };

  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
}
