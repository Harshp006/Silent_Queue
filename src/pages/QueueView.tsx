import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { ref, onValue, push } from "firebase/database";
import { db } from "@/lib/firebase";

interface Member {
  id: string;
  joinedAt: number;
}

interface FirebaseQueue {
  id: string;
  name: string;
  avgServiceTime: number;
  members: Member[];
}

const QueueView = () => {
  const { id: queueId } = useParams<{ id: string }>();

  const [queue, setQueue] = useState<FirebaseQueue | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [yourPosition, setYourPosition] = useState<number | null>(null);

  // -------------------------------
  // Subscribe to SINGLE queue
  // -------------------------------
  useEffect(() => {
    if (!queueId) return

    const queueRef = ref(db, `queues/${queueId}`);

    const unsub = onValue(queueRef, (snapshot) => {
      if (!snapshot.exists()) {
        setQueue(null);
        return;
      }

      const data = snapshot.val();

      const members: Member[] = data.members
        ? Object.entries(data.members).map(([mid, m]: any) => ({
            id: mid,
            joinedAt: m.joinedAt,
          }))
        : [];

      setQueue({
        id: queueId,
        name: data.name,
        avgServiceTime: data.avgServiceTime ?? 3,
        members,
      });

      if (hasJoined) {
        setYourPosition(members.length);
      }
    });

    return () => unsub();
  }, [queueId, hasJoined]);

  // -------------------------------
  // Join queue
  // -------------------------------
  const handleJoinQueue = async () => {
    if (!queueId || hasJoined) return;

    await push(ref(db, `queues/${queueId}/members`), {
      joinedAt: Date.now(),
    });

    setHasJoined(true);
  };

  // -------------------------------
  // Guard
  // -------------------------------
    // -------------------------------
  // Guards (VERY IMPORTANT)
  // -------------------------------
  if (!queueId) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Invalid queue link</p>
      </div>
    );
  }

  if (queue === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <p className="text-lg">Queue not found or has been deleted</p>
      </div>
    );
  }


  const totalMembers = queue.members.length;
  const peopleAhead = hasJoined ? Math.max(totalMembers - 1, 0) : totalMembers;
  const estimatedWait = peopleAhead * queue.avgServiceTime;

  const progress =
    hasJoined && totalMembers > 0
      ? ((totalMembers - peopleAhead) / totalMembers) * 100
      : 0;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-narrow py-12 sm:py-20">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Queue Status</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {queue.name}
          </h1>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">People Ahead</p>
              <p className="text-5xl sm:text-6xl font-semibold text-foreground">
                {peopleAhead}
              </p>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">
                Est. Wait Time
              </p>
              <p className="text-5xl sm:text-6xl font-semibold text-foreground">
                {estimatedWait}
                <span className="text-xl text-muted-foreground ml-1">min</span>
              </p>
            </div>
          </div>

          {hasJoined && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your position</span>
                <span className="font-medium text-foreground">
                  #{yourPosition}
                </span>
              </div>
              <ProgressBar progress={progress} />
            </div>
          )}

          <button
            onClick={handleJoinQueue}
            disabled={hasJoined}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
          >
            {hasJoined ? "You're in the queue" : "Join Queue"}
          </button>
        </div>

        <p className="text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Live updates powered by Google tech
          </span>
        </p>
      </main>
    </div>
  );
};

export default QueueView;
