import { db } from "./firebase";
import {
  ref,
  set,
  update,
  remove,
  onValue,
  runTransaction,
} from "firebase/database";

/* =========================
   TYPES
========================= */

export interface Queue {
  id: string;
  name: string;
  currentNumber: number;
  servingNumber: number;
  avgServiceTime: number;
  status: "active" | "paused" | "closed";
  createdAt: number;
}

/* =========================
   SUBSCRIBE (REALTIME)
========================= */

export const subscribeToQueues = (callback: (queues: Queue[]) => void) => {
  const queuesRef = ref(db, "queues");

  return onValue(queuesRef, (snapshot) => {
    const data = snapshot.val();

    if (!data) {
      callback([]);
      return;
    }

    const queues: Queue[] = Object.entries(data).map(
      ([id, value]: any) => ({
        id,
        ...value,
      })
    );

    callback(queues);
  });
};

/* =========================
   CREATE QUEUE (ADMIN)
========================= */

export const createQueue = async (
  id: string,
  name: string,
  avgServiceTime: number
) => {
  const queueRef = ref(db, `queues/${id}`);

  await set(queueRef, {
    name,
    currentNumber: 0,
    servingNumber: 0,
    avgServiceTime,
    status: "active",
    createdAt: Date.now(),
  });
};

/* =========================
   DELETE QUEUE (ADMIN)
========================= */

export const deleteQueue = async (id: string) => {
  await remove(ref(db, `queues/${id}`));
};

/* =========================
   SERVE NEXT (ADMIN)
========================= */

export const serveNext = async (id: string) => {
  const servingRef = ref(db, `queues/${id}/servingNumber`);

  await runTransaction(servingRef, (current) => {
    if (current === null) return 1;
    return current + 1;
  });
};

/* =========================
   TOGGLE PAUSE (ADMIN)
========================= */

export const toggleQueueStatus = async (
  id: string,
  currentStatus: "active" | "paused"
) => {
  await update(ref(db, `queues/${id}`), {
    status: currentStatus === "paused" ? "active" : "paused",
  });
};

/* =========================
   JOIN QUEUE (USER)
========================= */

export const joinQueue = async (id: string): Promise<number> => {
  const currentNumberRef = ref(db, `queues/${id}/currentNumber`);

  const result = await runTransaction(currentNumberRef, (current) => {
    if (current === null) return 1;
    return current + 1;
  });

  return result.snapshot.val();
};
