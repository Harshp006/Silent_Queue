import { Link } from "react-router-dom";
import Header from "@/components/Header";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container-narrow py-20 sm:py-32">
        <div className="text-center">
          {/* Hero */}
          <h1 className="text-4xl sm:text-5xl font-semibold text-foreground tracking-tight">
            Know your wait.
            <br />
            Save your time.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-md mx-auto">
            Real-time queue status for offices, canteens, and service counters. 
            No more guessing—just scan and see.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/queue"
              className="w-full sm:w-auto px-8 py-3 bg-primary text-primary-foreground font-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              View Queue
            </Link>
            <Link
              to="/admin"
              className="w-full sm:w-auto px-8 py-3 bg-secondary text-secondary-foreground font-medium rounded-lg hover:bg-secondary/80 transition-colors"
            >
              Admin Login
            </Link>
          </div>

          {/* Trust line */}
          <p className="mt-16 text-sm text-muted-foreground">
            Trusted by colleges, hospitals, and local businesses
          </p>
        </div>
      </main>

      {/* Simple features */}
      <section className="border-t border-border bg-card">
        <div className="container-wide py-16 sm:py-20">
          <div className="grid sm:grid-cols-3 gap-8 sm:gap-12 text-center">
            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Real-time Updates</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Live queue status refreshes automatically
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Easy to Use</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Scan a QR code or open a link—that's it
              </p>
            </div>

            <div>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="font-semibold text-foreground">Secure & Private</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No personal data required to check queues
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8">
        <div className="container-wide text-center text-sm text-muted-foreground">
          © 2025 SilentQueue. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Index;
