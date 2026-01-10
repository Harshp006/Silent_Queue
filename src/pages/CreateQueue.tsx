import { useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { ref, push, set } from "firebase/database";
import { db } from "@/lib/firebase";
import { QRCodeCanvas } from "qrcode.react";


const CreateQueue = () => {
  const [counterName, setCounterName] = useState("");
  const [avgServiceTime, setAvgServiceTime] = useState("");
  const [isCreated, setIsCreated] = useState(false);
  const [queueLink, setQueueLink] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!counterName.trim() || !avgServiceTime) return;

  const queuesRef = ref(db, "queues");
  const newQueueRef = push(queuesRef);

  await set(newQueueRef, {
    name: counterName,
    avgServiceTime: Number(avgServiceTime),
    status: "active",
    createdAt: Date.now(),
  });

  const generatedLink = `${window.location.origin}/queue/${newQueueRef.key}`;
  setQueueLink(generatedLink);
  setIsCreated(true);
};


  const handleCopyLink = () => {
    navigator.clipboard.writeText(queueLink);
    // Optional: Add toast notification
  };

  const handleReset = () => {
    setCounterName("");
    setAvgServiceTime("");
    setIsCreated(false);
    setQueueLink("");
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-narrow py-12 sm:py-20">
        <div className="mb-8">
          <Link
            to="/admin"
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Dashboard
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-semibold text-foreground">
            Create New Queue
          </h1>
          <p className="text-muted-foreground mt-2">
            Set up a queue for your counter or service
          </p>
        </div>

        <div className="bg-card border border-border rounded-xl p-6 sm:p-8 max-w-md mx-auto">
          {!isCreated ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label 
                  htmlFor="counterName" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Counter Name
                </label>
                <input
                  id="counterName"
                  type="text"
                  value={counterName}
                  onChange={(e) => setCounterName(e.target.value)}
                  placeholder="e.g., Admissions Office"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  required
                />
              </div>

              <div>
                <label 
                  htmlFor="avgTime" 
                  className="block text-sm font-medium text-foreground mb-2"
                >
                  Average Service Time (minutes)
                </label>
                <input
                  id="avgTime"
                  type="number"
                  min="1"
                  max="60"
                  value={avgServiceTime}
                  onChange={(e) => setAvgServiceTime(e.target.value)}
                  placeholder="e.g., 5"
                  className="w-full px-4 py-2.5 bg-background border border-input rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-colors"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                Generate Queue
              </button>
            </form>
          ) : (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div>
                <h2 className="text-lg font-semibold text-foreground">Queue Created!</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Share the link or QR code with your visitors
                </p>
              </div>

              {/* QR Code placeholder */}
              {/* QR Code */}
<div className="w-40 h-40 bg-secondary border border-border rounded-lg flex items-center justify-center mx-auto">
  <QRCodeCanvas
    value={queueLink}
    size={140}
  />
</div>


              {/* Link display */}
              <div className="bg-secondary rounded-lg p-3">
                <p className="text-xs text-muted-foreground mb-1">Queue Link</p>
                <p className="text-sm font-medium text-foreground break-all">
                  {queueLink}
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleCopyLink}
                  className="flex-1 py-2.5 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Copy Link
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 py-2.5 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Create Another
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CreateQueue;
