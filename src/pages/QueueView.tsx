import { useState } from "react";
import Header from "@/components/Header";
import ProgressBar from "@/components/ProgressBar";

const QueueView = () => {
  // Placeholder state - will be connected to Firebase Realtime DB
  const [hasJoined, setHasJoined] = useState(false);
  
  // Mock data - replace with API call
  const queueData = {
    counterName: "Admissions Office",
    peopleAhead: hasJoined ? 4 : 7,
    estimatedWait: hasJoined ? 12 : 21,
    yourPosition: hasJoined ? 5 : null,
    totalInQueue: 7,
  };

  const progress = hasJoined 
    ? ((queueData.totalInQueue - queueData.peopleAhead) / queueData.totalInQueue) * 100
    : 0;

  const handleJoinQueue = () => {
    // // API Placeholder: Add user to queue in Firebase
    setHasJoined(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-narrow py-12 sm:py-20">
        <div className="text-center mb-8">
          <p className="text-sm font-medium text-primary mb-2">Queue Status</p>
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            {queueData.counterName}
          </h1>
        </div>

        {/* Main stats card */}
        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-6">
          <div className="grid grid-cols-2 gap-6 sm:gap-8 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">People Ahead</p>
              <p className="text-5xl sm:text-6xl font-semibold text-foreground">
                {queueData.peopleAhead}
              </p>
            </div>
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-1">Est. Wait Time</p>
              <p className="text-5xl sm:text-6xl font-semibold text-foreground">
                {queueData.estimatedWait}
                <span className="text-xl text-muted-foreground ml-1">min</span>
              </p>
            </div>
          </div>

          {hasJoined && (
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Your position</span>
                <span className="font-medium text-foreground">#{queueData.yourPosition}</span>
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

        {/* Status note */}
        <p className="text-center text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
            Live updates powered by Google tech
          </span>
        </p>

        {/* // Firebase Realtime DB: Subscribe to queue updates here */}
      </main>
    </div>
  );
};

export default QueueView;
