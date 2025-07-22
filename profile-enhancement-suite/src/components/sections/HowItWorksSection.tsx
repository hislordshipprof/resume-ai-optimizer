import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, BarChart3, Download, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export const HowItWorksSection = () => {
  const steps = [
    {
      step: "01",
      icon: Upload,
      title: "Upload Your Resume",
      description: "Simply drag and drop your resume or paste your text. We support all major formats including PDF, DOCX, and plain text.",
      color: "bg-primary/10 text-primary"
    },
    {
      step: "02", 
      icon: BarChart3,
      title: "AI Analysis & Scoring",
      description: "Our advanced AI analyzes your resume across 50+ factors including ATS compatibility, keyword optimization, and industry standards.",
      color: "bg-success/10 text-success"
    },
    {
      step: "03",
      icon: Download,
      title: "Get Optimized Resume",
      description: "Download your improved resume with AI-generated suggestions, better formatting, and higher ATS compatibility scores.",
      color: "bg-warning/10 text-warning"
    }
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            How It Works
            <span className="block text-primary">Simple. Fast. Effective.</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Transform your resume in just 3 simple steps and start getting more interviews today.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8 relative">
            {/* Connection lines for desktop */}
            <div className="hidden md:block absolute top-16 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-primary via-success to-warning opacity-30"></div>
            
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <Card className="bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-2 group">
                  <CardContent className="p-8 text-center">
                    {/* Step number */}
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-muted rounded-full mb-6 relative z-10">
                      <span className="text-2xl font-bold text-foreground">{step.step}</span>
                    </div>

                    {/* Icon */}
                    <div className={`inline-flex items-center justify-center w-16 h-16 ${step.color} rounded-2xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-8 h-8" />
                    </div>

                    {/* Content */}
                    <h3 className="text-xl font-bold text-foreground mb-4">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>

                    {/* Arrow for mobile */}
                    {index < steps.length - 1 && (
                      <div className="md:hidden flex justify-center mt-8">
                        <ArrowRight className="w-6 h-6 text-primary" />
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div className="text-center mt-16">
            <Button size="lg" className="group" asChild>
              <Link to="/upload">
                Start Optimizing Your Resume
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <p className="text-sm text-muted-foreground mt-4">
              No credit card required • Get results in 60 seconds
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};