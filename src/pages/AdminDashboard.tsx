import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import QueueCard from "@/components/QueueCard";

interface Queue {
  id: string;
  name: string;
  currentSize: number;
  avgServiceTime: number;
  status: "active" | "paused" | "closed";
}

const AdminDashboard = () => {
  // Placeholder state - will be connected to Firebase
  const [queues, setQueues] = useState<Queue[]>([
    { id: "1", name: "Admissions Office", currentSize: 7, avgServiceTime: 3, status: "active" },
    { id: "2", name: "Canteen Counter A", currentSize: 12, avgServiceTime: 2, status: "active" },
    { id: "3", name: "Library Help Desk", currentSize: 0, avgServiceTime: 5, status: "paused" },
  ]);

  const handleServeNext = (id: string) => {
    // // API Placeholder: Update queue in Firebase
    setQueues(queues.map(q => 
      q.id === id ? { ...q, currentSize: Math.max(0, q.currentSize - 1) } : q
    ));
  };

  const handleTogglePause = (id: string) => {
    // // API Placeholder: Update queue status in Firebase
    setQueues(queues.map(q => 
      q.id === id ? { ...q, status: q.status === "paused" ? "active" : "paused" } : q
    ));
  };

  const totalPeopleWaiting = queues.reduce((sum, q) => sum + q.currentSize, 0);
  const activeQueues = queues.filter(q => q.status === "active").length;

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
            <p className="text-2xl font-semibold text-foreground mt-1">~8 min</p>
          </div>
        </div>

        {/* Queue grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {queues.map((queue) => (
            <QueueCard
              key={queue.id}
              name={queue.name}
              currentSize={queue.currentSize}
              avgServiceTime={queue.avgServiceTime}
              status={queue.status}
              onServeNext={() => handleServeNext(queue.id)}
              onTogglePause={() => handleTogglePause(queue.id)}
            />
          ))}
        </div>

        {/* // Firebase Realtime DB: Subscribe to all queues for this admin */}
      </main>
    </div>
  );
};

export default AdminDashboard;
