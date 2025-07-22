import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Sparkles, Zap, Crown } from "lucide-react";
import { Link } from "react-router-dom";

export const PricingSection = () => {
  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for trying out our AI-powered optimization",
      icon: Sparkles,
      features: [
        "1 resume analysis per month",
        "Basic ATS scoring",
        "5 AI suggestions",
        "PDF download",
        "Standard support"
      ],
      cta: "Get Started Free",
      popular: false,
      variant: "outline" as const
    },
    {
      name: "Pro",
      price: "$19",
      period: "per month",
      description: "Ideal for active job seekers and career changers",
      icon: Zap,
      features: [
        "Unlimited resume analyses",
        "Advanced ATS optimization",
        "Unlimited AI suggestions",
        "Multiple format downloads",
        "Industry-specific optimization",
        "Real-time collaboration",
        "Priority support",
        "Job matching insights"
      ],
      cta: "Start Pro Trial",
      popular: true,
      variant: "default" as const
    },
    {
      name: "Enterprise",
      price: "$99",
      period: "per month",
      description: "For teams, recruiters, and career coaches",
      icon: Crown,
      features: [
        "Everything in Pro",
        "Team collaboration tools",
        "Bulk resume processing",
        "White-label solutions",
        "Custom integrations",
        "Advanced analytics",
        "Dedicated account manager",
        "Training sessions"
      ],
      cta: "Contact Sales",
      popular: false,
      variant: "secondary" as const
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Simple, Transparent
            <span className="block text-primary">Pricing</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Choose the perfect plan for your career goals. Start free and upgrade when you're ready.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <Card 
              key={index} 
              className={`relative bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-2 ${
                plan.popular ? 'border-primary shadow-medium ring-2 ring-primary/20' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </div>
                </div>
              )}

              <CardHeader className="pb-4">
                <div className="flex items-center justify-between mb-4">
                  <plan.icon className={`w-8 h-8 ${plan.popular ? 'text-primary' : 'text-muted-foreground'}`} />
                  {plan.popular && <Sparkles className="w-5 h-5 text-primary" />}
                </div>
                
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.period}</span>
                </div>
                <p className="text-muted-foreground">{plan.description}</p>
              </CardHeader>

              <CardContent className="space-y-6">
                <ul className="space-y-3">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  variant={plan.variant} 
                  size="lg" 
                  className="w-full" 
                  asChild
                >
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/auth"}>
                    {plan.cta}
                  </Link>
                </Button>

                {plan.name === "Pro" && (
                  <p className="text-xs text-center text-muted-foreground">
                    7-day free trial • Cancel anytime
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ preview */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Have questions about our pricing?
          </p>
          <Button variant="ghost" asChild>
            <a href="#faq">View FAQ</a>
          </Button>
        </div>
      </div>
    </section>
  );
};