interface StatusBadgeProps {
  status: "active" | "paused" | "closed";
}

const StatusBadge = ({ status }: StatusBadgeProps) => {
  const styles = {
    active: "bg-success/10 text-success border-success/20",
    paused: "bg-warning/10 text-warning border-warning/20",
    closed: "bg-muted text-muted-foreground border-border",
  };

  const labels = {
    active: "Active",
    paused: "Paused",
    closed: "Closed",
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${styles[status]}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
        status === "active" ? "bg-success" : 
        status === "paused" ? "bg-warning" : "bg-muted-foreground"
      }`} />
      {labels[status]}
    </span>
  );
};

export default StatusBadge;
