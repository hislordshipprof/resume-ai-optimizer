import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sparkles, TrendingUp, Zap, Target } from "lucide-react";
import heroImage from "@/assets/hero-resume-ai.jpg";
export const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent rounded-full blur-3xl animate-float" style={{
        animationDelay: "1s"
      }}></div>
      </div>

      <div className="container mx-auto px-4 z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left space-y-8">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-primary/10 backdrop-blur-sm border border-primary/20 px-4 py-2 rounded-full text-sm font-medium text-primary">
                <Sparkles className="w-4 h-4" />
                AI-Powered Resume Optimization
              </div>
              
              <h1 className="text-5xl font-bold text-foreground leading-tight lg:text-5xl">
                Beat ATS Systems &
                <span className="block text-primary">
                  Land More Interviews
                </span>
              </h1>
              
              <p className="text-xl max-w-2xl mx-auto lg:mx-0 text-muted-foreground leading-relaxed">
                AI-powered resume optimization that gets you past applicant tracking systems 
                and into the hands of hiring managers. Join 50,000+ job seekers who've 
                accelerated their careers with our intelligent platform.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
              <Link to="/upload">
                <Button size="xl" className="group bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg">
                  Start Optimizing Now
                  <Zap className="w-5 h-5 ml-2 group-hover:rotate-12 transition-transform" />
                </Button>
              </Link>
              <Button variant="outline" size="xl" className="border-2 border-muted-foreground text-foreground hover:bg-muted px-8 py-4 text-lg">
                View Demo
              </Button>
            </div>

            {/* Feature highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pt-12">
              <div className="text-center lg:text-left bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-success/10 text-success rounded-xl mb-4">
                  <TrendingUp className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">3.2x More Interviews</h3>
                <p className="text-muted-foreground">Average increase in callbacks</p>
              </div>
              
              <div className="text-center lg:text-left bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-primary/10 text-primary rounded-xl mb-4">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">60 Seconds</h3>
                <p className="text-muted-foreground">Get optimized resume fast</p>
              </div>
              
              <div className="text-center lg:text-left bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
                <div className="inline-flex items-center justify-center w-14 h-14 bg-warning/10 text-warning rounded-xl mb-4">
                  <Target className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">96% ATS Score</h3>
                <p className="text-muted-foreground">Average compatibility rating</p>
              </div>
            </div>
          </div>

          {/* Right Content - Hero Image */}
          <div className="relative">
            <div className="relative bg-card/80 backdrop-blur-sm border border-border rounded-2xl shadow-2xl p-8 transform hover:scale-[1.02] transition-transform duration-500">
              <img src={heroImage} alt="AI Resume Optimization Interface" className="w-full h-auto rounded-lg shadow-medium" />
              
              {/* Floating AI elements */}
              <div className="absolute -top-4 -right-4 bg-success text-success-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-float border border-success/20">
                96% Match
              </div>
              
              <div className="absolute -bottom-4 -left-4 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold shadow-lg animate-float border border-primary/20" style={{
              animationDelay: "0.5s"
            }}>
                AI Optimized
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
};