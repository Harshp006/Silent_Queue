import StatusBadge from "./StatusBadge";

interface QueueCardProps {
  name: string;
  currentSize: number;
  avgServiceTime: number;
  status: "active" | "paused" | "closed";
  onServeNext: () => void;
  onTogglePause: () => void;
}

const QueueCard = ({
  name,
  currentSize,
  avgServiceTime,
  status,
  onServeNext,
  onTogglePause,
}: QueueCardProps) => {
  return (
    <div className="bg-card border border-border rounded-lg p-5 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-muted-foreground mt-0.5">
            Avg. {avgServiceTime} min per person
          </p>
        </div>
        <StatusBadge status={status} />
      </div>

      <div className="flex items-baseline gap-1 mb-4">
        <span className="text-3xl font-semibold text-foreground">{currentSize}</span>
        <span className="text-sm text-muted-foreground">in queue</span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onServeNext}
          disabled={currentSize === 0 || status === "paused"}
          className="flex-1 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Serve Next
        </button>
        <button
          onClick={onTogglePause}
          className="px-4 py-2 bg-secondary text-secondary-foreground text-sm font-medium rounded-lg hover:bg-secondary/80 transition-colors"
        >
          {status === "paused" ? "Resume" : "Pause"}
        </button>
      </div>

      {/* // API Hook Placeholder: Connect to Firebase Realtime DB for live updates */}
    </div>
  );
};

export default QueueCard;
