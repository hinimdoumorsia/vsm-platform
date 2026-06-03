import { useEffect, useRef, useState } from 'react';

export interface MachineTelemetry {
  id: string;
  name: string;
  position: { x: number; y: number; z: number };
  temperature: number;
  vibration: number;
  prediction: string;
  health: number;
  status: 'ok' | 'warning' | 'critical';
}

const DEFAULT_WS_URL = import.meta.env.VITE_VR_WEBSOCKET_URL ??
  `${window.location.protocol === 'https:' ? 'wss' : 'ws'}://${window.location.hostname}:8000/ws/telemetry`;

function parseTelemetryMessage(data: string): MachineTelemetry[] {
  const payload = JSON.parse(data);

  if (Array.isArray(payload)) {
    return payload;
  }

  if ('machines' in payload && Array.isArray(payload.machines)) {
    return payload.machines;
  }

  return [];
}

export function useVrTelemetry(): MachineTelemetry[] {
  const [telemetry, setTelemetry] = useState<MachineTelemetry[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<number>(0);

  useEffect(() => {
    let shouldClose = false;

    const connect = () => {
      const socket = new WebSocket(DEFAULT_WS_URL);
      socketRef.current = socket;

      socket.onopen = () => {
        reconnectRef.current = 0;
        console.debug('[VR WS] connectée', DEFAULT_WS_URL);
      };

      socket.onmessage = (event) => {
        try {
          const machines = parseTelemetryMessage(event.data);
          if (machines.length > 0) {
            setTelemetry(machines);
          }
        } catch (error) {
          console.warn('[VR WS] parse error', error);
        }
      };

      socket.onclose = () => {
        if (!shouldClose && reconnectRef.current < 10) {
          reconnectRef.current += 1;
          window.setTimeout(connect, 2000);
        }
      };

      socket.onerror = () => {
        socket.close();
      };
    };

    connect();

    return () => {
      shouldClose = true;
      socketRef.current?.close();
    };
  }, []);

  return telemetry;
}
