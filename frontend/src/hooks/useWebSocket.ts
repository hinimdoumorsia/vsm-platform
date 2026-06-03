// ============================================================
// VSM Platform — WebSocket Hook (STOMP)
// Real-time collaboration & simulation streaming
// ============================================================
import { useEffect, useRef, useCallback } from 'react';
import { Client, IMessage, StompSubscription } from '@stomp/stompjs';
import { useVSMStore } from '../store/vsmStore';
import type { VSMNode, VSMEdge } from '../types/vsm.types';

const WS_URL = import.meta.env.VITE_WS_URL ?? 'ws://localhost:8080/ws';

type WSMessageType =
  | 'NODE_ADDED'
  | 'NODE_UPDATED'
  | 'NODE_DELETED'
  | 'EDGE_ADDED'
  | 'EDGE_DELETED'
  | 'KPI_UPDATED'
  | 'SIM_TICK'
  | 'USER_JOINED'
  | 'USER_LEFT';

interface WSMessage {
  type: WSMessageType;
  diagramId: string;
  payload: unknown;
  userId?: string;
  timestamp: string;
}

export function useVSMWebSocket(diagramId: string | null) {
  const clientRef = useRef<Client | null>(null);
  const subscriptions = useRef<StompSubscription[]>([]);
  const { addNode, updateNode, deleteNode, addEdge, deleteEdge, activeDiagramId } = useVSMStore();

  // ---- Message handler ----
  const handleMessage = useCallback((msg: IMessage) => {
    try {
      const data: WSMessage = JSON.parse(msg.body);
      if (!activeDiagramId || data.diagramId !== activeDiagramId) return;

      switch (data.type) {
        case 'NODE_ADDED':
          addNode(activeDiagramId, data.payload as VSMNode);
          break;
        case 'NODE_UPDATED': {
          const { id, ...updates } = data.payload as VSMNode;
          updateNode(activeDiagramId, id, updates);
          break;
        }
        case 'NODE_DELETED':
          deleteNode(activeDiagramId, data.payload as string);
          break;
        case 'EDGE_ADDED':
          addEdge(activeDiagramId, data.payload as VSMEdge);
          break;
        case 'EDGE_DELETED':
          deleteEdge(activeDiagramId, data.payload as string);
          break;
        case 'KPI_UPDATED':
          // KPI updates handled by recompute
          console.info('[WS] KPI_UPDATED received');
          break;
        default:
          break;
      }
    } catch (e) {
      console.error('[WS] Parse error:', e);
    }
  }, [activeDiagramId, addNode, updateNode, deleteNode, addEdge, deleteEdge]);

  // ---- Connect ----
  useEffect(() => {
    if (!diagramId) return;

    const client = new Client({
      brokerURL: WS_URL,
      reconnectDelay: 3000,
      onConnect: () => {
        console.info('[WS] Connected');
        // Subscribe to diagram-specific topic
        const sub = client.subscribe(
          `/topic/diagram.${diagramId}`,
          handleMessage
        );
        subscriptions.current.push(sub);

        // Subscribe to simulation stream
        const simSub = client.subscribe(
          `/topic/simulation.${diagramId}`,
          handleMessage
        );
        subscriptions.current.push(simSub);

        // Announce presence
        client.publish({
          destination: `/app/diagram.join`,
          body: JSON.stringify({ diagramId }),
        });
      },
      onDisconnect: () => {
        console.info('[WS] Disconnected');
      },
      onStompError: (frame) => {
        console.error('[WS] STOMP error:', frame.headers.message);
      },
    });

    client.activate();
    clientRef.current = client;

    return () => {
      subscriptions.current.forEach(s => s.unsubscribe());
      subscriptions.current = [];
      client.deactivate();
      clientRef.current = null;
    };
  }, [diagramId, handleMessage]);

  // ---- Publish helpers ----
  const publish = useCallback((type: WSMessageType, payload: unknown) => {
    const client = clientRef.current;
    if (!client?.connected || !diagramId) return;

    const msg: WSMessage = {
      type,
      diagramId,
      payload,
      timestamp: new Date().toISOString(),
    };
    client.publish({
      destination: `/app/diagram.update`,
      body: JSON.stringify(msg),
    });
  }, [diagramId]);

  return {
    publishNodeAdded:   (node: VSMNode)  => publish('NODE_ADDED', node),
    publishNodeUpdated: (node: VSMNode)  => publish('NODE_UPDATED', node),
    publishNodeDeleted: (id: string)     => publish('NODE_DELETED', id),
    publishEdgeAdded:   (edge: VSMEdge)  => publish('EDGE_ADDED', edge),
    publishEdgeDeleted: (id: string)     => publish('EDGE_DELETED', id),
    isConnected: () => clientRef.current?.connected ?? false,
  };
}