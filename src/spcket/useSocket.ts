import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import { v4 as uuidv4 } from "uuid";

export const useSocket = ({
  baseUrl,
  token,
  enableRequestId = true,
  enableTabId = true,
}: {
  baseUrl: string;
  token: string;
  enableRequestId?: boolean;
  enableTabId?: boolean;
}) => {
  const socketRef = useRef<Client | null>(null);
  const [isSocketConnected, setIsSocketConnected] = useState(false);

  useEffect(() => {
    const brokerUrl = `${baseUrl}?Authorization=${encodeURIComponent(`Bearer ${token}`)}` +
      (enableRequestId ? `&X-Request-Id=${uuidv4()}` : "") +
      (enableTabId ? `&TabId=${window.name}` : "");

    socketRef.current = new Client({
      brokerURL: brokerUrl,
      connectHeaders: { Authorization: `Bearer ${token}` },
      debug: console.debug,
      onConnect: () => setIsSocketConnected(true),
      onDisconnect: () => setIsSocketConnected(false),
    });

    socketRef.current.activate();

    return () => {
      if (socketRef.current) {
        socketRef.current.deactivate();
      }
    };
  }, [baseUrl, token, enableRequestId, enableTabId]);

  const subscribeToTopic = (topic: string, onMessage: (message: any) => void) => {
    if (socketRef.current && isSocketConnected) {
      return socketRef.current.subscribe(topic, (message) => onMessage(JSON.parse(message.body)));
    }
    return null;
  };

  const unsubscribe = (subscription: any) => subscription?.unsubscribe();

  return { isSocketConnected, subscribeToTopic, unsubscribe };
};
