import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import { ref, onValue } from "firebase/database";
import { db } from "@/lib/firebase";

interface Queue {
  id: string;
  name: string;
}
const StatCard = ({ title, desc }: any) => (
  <div className="rounded-xl border border-border bg-card p-6 hover:shadow-md transition-shadow">
    <h3 className="font-semibold">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
  </div>
);

const FeatureStep = ({ step, title, desc }: any) => (
  <div className="relative">
    <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-5xl font-bold text-primary/10">
      {step}
    </span>
    <h3 className="font-semibold text-lg">{title}</h3>
    <p className="mt-2 text-sm text-muted-foreground">{desc}</p>
  </div>
);


const Index = () => {
  const [queues, setQueues] = useState<Queue[]>([]);

  // Fetch all queues from Firebase
  useEffect(() => {
    const queuesRef = ref(db, "queues");
    const unsubscribe = onValue(queuesRef, (snapshot) => {
      const data = snapshot.val() || {};
      const list = Object.entries(data).map(([id, val]: any) => ({
        id,
        name: val.name,
      }));
      setQueues(list);
    });

    return () => unsubscribe();
  }, []);

  // Use first queue as default for the hero "View Queue" button
 const latestQueueId = queues.length
  ? queues[queues.length - 1].id
  : null;
  const StatusBadge = ({ label }: any) => (
  <div className="flex items-center justify-center gap-2 rounded-xl border border-border bg-card/80 px-4 py-3 backdrop-blur">
    <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
    <span className="text-sm font-medium">{label}</span>
  </div>
);
const FlowArrow = ({ className = "" }: { className?: string }) => (
  <div
    className={`absolute top-1/2 -translate-y-1/2 pointer-events-none ${className}`}
  >
    <svg
      width="48"
      height="16"
      viewBox="0 0 48 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-muted-foreground opacity-40"
    >
      <path
        d="M0 8H40M40 8L34 2M40 8L34 14"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);






 return (
  <div className="min-h-screen bg-background relative overflow-hidden">
    {/* Background glow */}
    <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/20 blur-[120px] rounded-full" />
    {/* Background layers */}
<div className="absolute inset-0 -z-10">
  {/* Gradient blobs */}
  <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-primary/25 rounded-full blur-[120px]" />
  <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-primary/15 rounded-full blur-[120px]" />

  {/* Subtle grid */}
  <div
    className="absolute inset-0 opacity-[0.03]"
    style={{
      backgroundImage:
        "linear-gradient(to right, hsl(var(--border)) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--border)) 1px, transparent 1px)",
      backgroundSize: "40px 40px",
    }}
  />
</div>

    <Header />

    {/* HERO */}
   
      <main className="container-narrow py-24 sm:py-32 relative z-10">
      <div className="text-center">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
          ● Live Queue System
        </span>

        <h1 className="text-4xl sm:text-6xl font-bold text-foreground tracking-tight">
          Know your wait.
          <br />
          <span className="text-primary">Save your time.</span>
        </h1>

        <p className="mt-6 text-lg text-muted-foreground max-w-xl mx-auto">
          A real-time queue tracking system for colleges, hospitals,
          canteens, and service desks. Just scan and check.
        </p>

        {/* CTA */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to={queues.length === 1 ? `/queue/${queues[0].id}` : "#"}
            className="px-10 py-3 bg-primary text-primary-foreground font-semibold rounded-xl hover:scale-[1.02] transition-transform shadow-lg"
          >
            {queues.length === 1 ? "View Live Queue" : "Select Queue Below"}
          </Link>

          <Link
            to="/admin"
            className="px-10 py-3 bg-secondary text-secondary-foreground font-semibold rounded-xl hover:bg-secondary/80 transition-colors"
          >
            Admin Panel
          </Link>
        </div>

       {/* IMPACT METRICS */}
<div className="mt-20 max-w-4xl mx-auto">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
    
    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <p className="text-4xl font-bold text-primary">40–60%</p>
      <p className="mt-2 font-medium text-foreground">Wait Time Reduction</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Users arrive closer to their actual turn instead of waiting in lines
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <p className="text-4xl font-bold text-primary">NO</p>
      <p className="mt-2 font-medium text-foreground">Physical Tokens Needed</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Fully digital queues remove confusion, loss, and crowding
      </p>
    </div>

    <div className="bg-card border border-border rounded-xl p-6 text-center">
      <p className="text-4xl font-bold text-primary">100%</p>
      <p className="mt-2 font-medium text-foreground">Live Transparency</p>
      <p className="mt-1 text-sm text-muted-foreground">
        Real-time updates ensure users always know their position
      </p>
    </div>

  </div>

  {/* credibility line */}
  <p className="mt-8 text-center text-sm text-muted-foreground">
    Designed for real environments.
  </p>
</div>

      </div>
    </main>
    
    <section className="py-24">
  <div className="container-wide">
    <div className="rounded-3xl border border-border bg-card shadow-xl p-10 grid sm:grid-cols-2 gap-10 items-center">
      
      <div>
        <h2 className="text-3xl font-semibold">
          Designed for real-world queues
        </h2>
        <p className="mt-4 text-muted-foreground">
          SilentQueue updates instantly using Google Firebase, ensuring
          accuracy and zero manual refresh.
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-xl" />
        <div className="relative rounded-xl bg-background p-6 border border-border">
          <p className="text-sm text-muted-foreground mb-2">Queue Status</p>
          <p className="text-4xl font-bold">12 ahead</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Est. wait: 18 mins
          </p>
        </div>
      </div>

    </div>
  </div>
</section>


    

    {/* QUEUE SELECT */}
    {queues.length > 1 && (
      <section className="border-t border-border bg-card">
        <div className="container-wide py-16 text-center">
          <h2 className="text-2xl font-semibold mb-6">
            Available Queues
          </h2>
          <div className="flex flex-wrap justify-center gap-3">
            {queues.map((queue) => (
              <Link
                key={queue.id}
                to={`/queue/${queue.id}`}
                className="px-5 py-2.5 rounded-lg bg-primary/10 text-primary font-medium hover:bg-primary hover:text-primary-foreground transition-all"
              >
                {queue.name}
              </Link>
            ))}
          </div>
        </div>
      </section>
    )}
 

   {/* HOW IT WORKS */}
<section className="relative py-28 bg-background">
  {/* subtle background */}
  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />

  <div className="container-wide relative">
    <h2 className="text-center text-3xl sm:text-4xl font-semibold mb-4">
      How SilentQueue Works
    </h2>
    <p className="text-center text-muted-foreground max-w-xl mx-auto mb-16">
      A simple, real-time flow designed to eliminate physical waiting lines
    </p>

    <div className="relative grid sm:grid-cols-3 gap-12 text-center">
      
     
     


      <FeatureStep
        step="01"
        title="Scan or Open Link"
        desc="QR code or shared link opens the live queue instantly on any device."
      />

      <FeatureStep
        step="02"
        title="Check Live Status"
        desc="Users see people ahead, position, and estimated wait in real-time."
      />

      <FeatureStep
        step="03"
        title="Admin Controls Flow"
        desc="Admins pause, resume, or close queues to manage crowd flow efficiently."
      />
     
    </div>
  </div>
</section>


    {/* SOCIAL PROOF */}
    <section className="border-t border-border bg-card py-14">
      <div className="container-wide text-center">
        <p className="text-sm text-muted-foreground mb-3">
          Used in academic & service environments
        </p>
        <p className="text-lg font-medium">
          Colleges • Hospitals • Canteens • Offices
        </p>
      </div>
    </section>

    {/* FOOTER */}
    <footer className="border-t border-border py-8">
      <div className="container-wide text-center text-sm text-muted-foreground">
        © 2025 SilentQueue — Built by Codegazer
      </div>
    </footer>
  </div>
);


};

export default Index;
