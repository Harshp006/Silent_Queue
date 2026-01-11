import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import QueueCard from "@/components/QueueCard";
import { db } from "@/lib/firebase";
import { ref, onValue, update, remove } from "firebase/database";
import { QRCodeCanvas } from "qrcode.react";
import { logout } from "@/lib/firebase";

import { trackEvent } from "@/lib/firebase";

import {
  auth,
  signInWithGoogle,
  
  observeAuthState,
} from "@/lib/firebase";

// -------------------------------
// Types
// -------------------------------
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
  const [user, setUser] = useState<any>(null);
  


  // -------------------------------
  // Observe Google Auth State
  // -------------------------------
  useEffect(() => {
    const unsubscribe = observeAuthState((firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // -------------------------------
  // Subscribe to queues (ONLY after auth)
  // -------------------------------
  useEffect(() => {
    if (!isAuthenticated || !user) return;

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
  }, [isAuthenticated, user]);

  // -------------------------------
  // Handlers
  // -------------------------------
  const handleLogin = async () => {
    const adminPassword =
      import.meta.env.VITE_ADMIN_PASSWORD || "12345";

    if (!user) {
      await signInWithGoogle();
      return;
    }

    if (passwordInput === adminPassword) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect admin password");
    }
  };

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

  // -------------------------------
  // Stats
  // -------------------------------
  const totalPeopleWaiting = queues.reduce(
    (sum, q) => sum + q.currentSize,
    0
  );
  const activeQueues = queues.filter(
    (q) => q.status === "active"
  ).length;

  // -------------------------------
  // Login Screen (UNCHANGED UI)
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
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-input rounded-lg mb-4"
          />

          <button
          
            onClick={handleLogin}
            className="w-full py-3 bg-primary text-primary-foreground rounded-lg"
            
          >
            {user ? "Verify & Enter Dashboard" : "Sign in with Google"}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------
  // Dashboard
  // -------------------------------
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-wide py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Logged in as {user?.email}
            </p>
          </div>
          {user && (
  <button
    onClick={() => logout()}
    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
  >
    Sign Out
  </button>
)}

          <Link
            to="/create"
            className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg"
          >
            + Create Queue
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <Stat label="Total Queues" value={queues.length} />
          <Stat label="Active" value={activeQueues} />
          <Stat label="People Waiting" value={totalPeopleWaiting} />
          <Stat
            label="Avg Wait"
            value={
              queues.length
                ? `~${Math.round(
                    queues.reduce(
                      (s, q) => s + q.avgServiceTime,
                      0
                    ) / queues.length
                  )} min`
                : "0 min"
            }
          />
        </div>

        {/* Queue Grid */}
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
    queue.status === "closed" ? "paused" : queue.status
  )
}

              />

              <div className="mt-4 flex flex-col items-center">
                <QRCodeCanvas
                  value={`${window.location.origin}/queue/${queue.id}`}
                  size={130}
                />
                <p className="text-xs text-muted-foreground">
                  Scan to view queue
                </p>
              </div>

              <button
                onClick={() => handleDeleteQueue(queue.id)}
                className="mt-3 w-full border border-blue-500 text-blue-500 rounded-lg py-2 hover:bg-red-500 hover:text-white"
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

const Stat = ({ label, value }: any) => (
  <div className="bg-card border rounded-lg p-4">
    <p className="text-sm text-muted-foreground">{label}</p>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

export default AdminDashboard;
