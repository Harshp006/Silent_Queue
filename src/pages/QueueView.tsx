import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";
import { ref, onValue, push } from "firebase/database";
import { db } from "@/lib/firebase";
import { trackEvent } from "@/lib/firebase";
import { runTransaction } from "firebase/database";



interface Member {
  id: string;
  joinedAt: number;
  token: number;
}

interface FirebaseQueue {
  id: string;
  name: string;
  avgServiceTime: number;
  members: Member[];
  status: "active" | "paused";
}

const QueueView = () => {
  const { id: queueId } = useParams<{ id: string }>();

  const [queue, setQueue] = useState<FirebaseQueue | null>(null);
  const [hasJoined, setHasJoined] = useState(false);
  const [yourPosition, setYourPosition] = useState<number | null>(null);
  const [viewTracked, setViewTracked] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);

 const [copied, setCopied] = useState(false);

const handleCopyLink = async () => {
  await navigator.clipboard.writeText(window.location.href);
  setCopied(true);
  setTimeout(() => setCopied(false), 2000);
};



  // -------------------------------
  // Subscribe to SINGLE queue
  // -------------------------------
  useEffect(() => {
  if (!queueId) return;

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
          token: m.token,
        }))
      : [];

    setQueue({
      id: queueId,
      name: data.name,
      avgServiceTime: data.avgServiceTime ?? 3,
      members,
      status: data.status ?? "active",
    });

    // ✅ TRACK QUEUE VIEW (ONCE)
    if (!viewTracked) {
      trackEvent("queue_viewed", {
        queue_id: queueId,
        queue_name: data.name,
      });
      setViewTracked(true);
    }

    if (hasJoined) {
      setYourPosition(members.length);
    }
  });

  return () => unsub();
}, [queueId, hasJoined, viewTracked]);

const queueLink = window.location.href;

  // -------------------------------
  // Join queue
  // -------------------------------
  const handleJoinQueue = async () => {
  if (!queueId || hasJoined) return;

  const queueRef = ref(db, `queues/${queueId}`);

  await runTransaction(queueRef, (queueData: any) => {
    if (!queueData) return queueData;

    const lastToken = queueData.lastToken ?? 0;
    const newToken = lastToken + 1;

    if (!queueData.members) queueData.members = {};

    const memberId = Date.now().toString();

    queueData.members[memberId] = {
      joinedAt: Date.now(),
      token: newToken,
    };

    queueData.lastToken = newToken;

    return queueData;
  });

  trackEvent("queue_joined", {
    queue_id: queueId,
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
          <p className="text-sm font-medium text-primary mb-2">Welcome to Portal</p>
          {/* <p className="text-sm font-medium text-primary mb-2  text-green-500">Last updated: Just Now</p> */}
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {queue.name}
          </h1>
        </div>
        <div className="mt-2 flex justify-center">
  {queue.status === "active" ? (
    <span className="px-6 py-3 rounded-full text-xm font-medium bg-green-500/10 text-green-500">
      🟢 Queue Active
    </span>
  ) : (
    <span className="px-6 py-3 rounded-full text-xm font-medium bg-yellow-500/10 text-yellow-500">
      ⏸ Queue Paused
    </span>
  )}
</div>

        {hasJoined && queue.members.length > 0 && (
  <div className="text-center mb-6">
    <p className="text-sm text-muted-foreground">Your Token Number</p>
    <p className="text-4xl font-bold text-primary">
      A-{queue.members[queue.members.length - 1].token}
    </p>
  </div>
)}

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
        <div className="mt-3 p-3 border rounded bg-black-50">
  <p className="text-xs text-blue-500 mb-1">Queue Link</p>

  <div className="flex items-center gap-2">
    <input
      value={queueLink}
      readOnly
      className="flex-1 px-2 py-1 text-sm border rounded bg-white"
    />

    <button
      onClick={handleCopyLink}
      className="px-3 py-1 text-sm rounded bg-black text-white hover:opacity-80"
    >
      Copy
    </button>
  </div>

  {copied && (
    <p className="text-green-600 text-xs mt-1">
      Link copied!
    </p>
  )}
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
            disabled={hasJoined || queue.status === "paused"}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 disabled:bg-secondary disabled:text-secondary-foreground disabled:cursor-not-allowed transition-colors"
          >
           {hasJoined
  ? "Already Joined"
  : queue.status === "paused"
  ? "Queue is Paused"
  : "Join Queue"}

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
