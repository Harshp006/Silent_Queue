import { Link, useLocation } from "react-router-dom";

const Header = () => {
  const location = useLocation();
  const isLanding = location.pathname === "/";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">SQ</span>
          </div>
          <span className="font-semibold text-lg text-foreground">SilentQueue</span>
        </Link>

        {isLanding && (
          <nav className="flex items-center gap-3">
            <Link
              to="/admin"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Admin Login
            </Link>
          </nav>
        )}

        {!isLanding && (
          <nav className="flex items-center gap-3">
            <Link
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-3 py-2"
            >
              Home
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
