import { io, Socket } from "socket.io-client";
import { getAuthUser } from "./auth";

let socket: Socket | null = null;

export const initSocket = (): Socket | null => {
  if (socket && socket.connected) {
    return socket;
  }

  const user = getAuthUser();
  if (!user || !user.token) {
    return null;
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5001";

  socket = io(apiUrl, {
    auth: {
      token: user.token,
    },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
  });

  socket.on("connect_error", (error) => {
    console.error("Socket connection error:", error);
  });

  socket.on("connect", () => {
    console.log("Socket connected");
  });

  socket.on("disconnect", () => {
    console.log("Socket disconnected");
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  if (!socket || !socket.connected) {
    return initSocket();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export const onChatNewMessage = (
  callback: (data: any) => void
) => {
  const sock = getSocket();
  if (sock) {
    sock.on("chat:new-message", callback);
  }
  return () => {
    if (sock) {
      sock.off("chat:new-message", callback);
    }
  };
};

export const onChatListUpdated = (
  callback: (data: any) => void
) => {
  const sock = getSocket();
  if (sock) {
    sock.on("chat:list-updated", callback);
  }
  return () => {
    if (sock) {
      sock.off("chat:list-updated", callback);
    }
  };
};

export const onChatDone = (
  callback: (data: any) => void
) => {
  const sock = getSocket();
  if (sock) {
    sock.on("chat:done", callback);
  }
  return () => {
    if (sock) {
      sock.off("chat:done", callback);
    }
  };
};

export const onChatAssigned = (
  callback: (data: any) => void
) => {
  const sock = getSocket();
  if (sock) {
    sock.on("chat:assigned", callback);
  }
  return () => {
    if (sock) {
      sock.off("chat:assigned", callback);
    }
  };
};
