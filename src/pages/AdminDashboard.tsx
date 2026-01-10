import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import QueueCard from "@/components/QueueCard";
import { db } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { QRCodeCanvas } from "qrcode.react";


// Type for Firebase queue
interface FirebaseQueue {
  id: string;
  name: string;
  avgServiceTime: number;
  members: { id: string; joinedAt: number }[];
  status: "active" | "paused" | "closed";
}

interface Queue {
  id: string;
  name: string;
  currentSize: number;
  avgServiceTime: number;
  status: "active" | "paused" | "closed";
}

const AdminDashboard = () => {
  const [queues, setQueues] = useState<Queue[]>([]);
  const [passwordInput, setPasswordInput] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // -------------------------------
  // Subscribe to all queues in Firebase
  // Only if authenticated
  // -------------------------------
  useEffect(() => {
    if (!isAuthenticated) return;

    const queuesRef = ref(db, "queues");

    const unsub = onValue(queuesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: any) => ({
        id,
        name: val.name,
        avgServiceTime: val.avgServiceTime,
        status: val.status,
        currentSize: val.members ? Object.keys(val.members).length : 0,
      }));

      setQueues(list);
    });

    return () => unsub();
  }, [isAuthenticated]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleServeNext = async (id: string) => {
    const membersRef = ref(db, `queues/${id}/members`);

    onValue(
      membersRef,
      (snapshot) => {
        const members = snapshot.val() || {};
        const firstKey = Object.keys(members)[0];
        if (firstKey) {
          remove(ref(db, `queues/${id}/members/${firstKey}`));
        }
      },
      { onlyOnce: true }
    );
  };

  const handleTogglePause = async (id: string, status: "active" | "paused") => {
    await update(ref(db, `queues/${id}`), {
      status: status === "active" ? "paused" : "active",
    });
  };

  const handleDeleteQueue = async (id: string) => {
    if (confirm("Delete this queue?")) {
      await remove(ref(db, `queues/${id}`));
    }
  };

  const handleLogin = () => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD || "12345"; // fallback
    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password!");
    }
  };

  // -------------------------------
  // Stats
  // -------------------------------
  const totalPeopleWaiting = queues.reduce((sum, q) => sum + q.currentSize, 0);
  const activeQueues = queues.filter((q) => q.status === "active").length;

  // -------------------------------
  // Render
  // -------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="bg-card p-8 rounded-xl shadow-md w-full max-w-sm">
          <h2 className="text-xl font-semibold text-foreground mb-4 text-center">
            Admin Login
          </h2>
          <input
            type="password"
            placeholder="Enter password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors mb-4"
          />
          <button
            onClick={handleLogin}
            className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-wide py-8 sm:py-12">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage your queues in real-time
            </p>
          </div>
          <Link
            to="/create"
            className="px-5 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors text-center"
          >
            + Create Queue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Total Queues</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{queues.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{activeQueues}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">People Waiting</p>
            <p className="text-2xl font-semibold text-foreground mt-1">{totalPeopleWaiting}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-sm text-muted-foreground">Avg Wait</p>
            <p className="text-2xl font-semibold text-foreground mt-1">
              ~{queues.length
                ? Math.round(queues.reduce((sum, q) => sum + q.avgServiceTime, 0) / queues.length)
                : 0}{" "}
              min
            </p>
          </div>
        </div>

       {/* Queue grid */}
<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
  {queues.map((queue) => (
    <div key={queue.id}>
      <QueueCard
        name={queue.name}
        currentSize={queue.currentSize}
        avgServiceTime={queue.avgServiceTime}
        status={queue.status === "closed" ? "paused" : queue.status}
        onServeNext={() => handleServeNext(queue.id)}
        onTogglePause={() =>
          handleTogglePause(
            queue.id,
            queue.status === "active" ? "active" : "paused"
          )
        }
      />

      {/* QR CODE */}
      <div className="mt-4 flex flex-col items-center gap-2">
        <QRCodeCanvas
          value={`${window.location.origin}/queue/${queue.id}`}
          size={130}
        />
        <p className="text-xs text-muted-foreground">
          Scan to view queue
        </p>
      </div>

      {/* DELETE BUTTON */}
      <button
        onClick={() => handleDeleteQueue(queue.id)}
        className="
          mt-3 w-full
          flex items-center justify-center gap-2
          px-4 py-2
          rounded-lg
          border border-blue-500/60
          text-sm font-medium
          text-blue-500
          hover:bg-red-500 hover:text-white
          transition-all duration-200
        "
      >
        🗑 Delete Queue
      </button>
    </div>
  ))}
</div>


      </main>
    </div>
  );
};

export default AdminDashboard;
