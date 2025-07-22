import { Button } from "@/components/ui/button";
import { Sparkles, Menu, User } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";

export const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">ResumeAI</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link 
              to="/dashboard" 
              className={`transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Dashboard
            </Link>
            <Link 
              to="/upload" 
              className={`transition-colors ${location.pathname === '/upload' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Upload
            </Link>
            <Link 
              to="/project-suggestions" 
              className={`transition-colors ${location.pathname === '/project-suggestions' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Projects
            </Link>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
              Pricing
            </a>
            <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
              FAQ
            </a>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex" asChild>
              <Link to="/auth">
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Link>
            </Button>
            <Button variant="ai" size="sm" asChild>
              <Link to="/upload">Get Started Free</Link>
            </Button>
            
            {/* Mobile menu button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border bg-background">
            <nav className="flex flex-col space-y-4 p-4">
              <Link 
                to="/dashboard" 
                className={`transition-colors ${location.pathname === '/dashboard' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/upload" 
                className={`transition-colors ${location.pathname === '/upload' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Upload
              </Link>
              <Link 
                to="/project-suggestions" 
                className={`transition-colors ${location.pathname === '/project-suggestions' ? 'text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-muted-foreground hover:text-foreground transition-colors">
                FAQ
              </a>
              <div className="pt-2 border-t border-border">
                <Button variant="ghost" size="sm" className="w-full justify-start" asChild>
                  <Link to="/auth" onClick={() => setIsMenuOpen(false)}>
                    <User className="w-4 h-4 mr-2" />
                    Sign In
                  </Link>
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};