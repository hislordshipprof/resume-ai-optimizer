import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Zap, 
  Target, 
  BarChart3, 
  Lightbulb, 
  FileText, 
  Shield,
  Sparkles,
  TrendingUp,
  Clock
} from "lucide-react";

export const FeaturesSection = () => {
  const features = [
    {
      icon: Zap,
      title: "AI-Powered Analysis",
      description: "Advanced algorithms analyze your resume against industry standards and job requirements in seconds.",
      color: "text-primary"
    },
    {
      icon: Target,
      title: "ATS Optimization",
      description: "Ensure your resume passes Applicant Tracking Systems with our specialized formatting and keyword optimization.",
      color: "text-success"
    },
    {
      icon: BarChart3,
      title: "Real-time Scoring",
      description: "Get instant feedback with detailed scoring across multiple dimensions including keywords, format, and content.",
      color: "text-warning"
    },
    {
      icon: Lightbulb,
      title: "Smart Suggestions",
      description: "Receive personalized recommendations for improving your resume based on your target role and industry.",
      color: "text-info"
    },
    {
      icon: FileText,
      title: "Multiple Formats",
      description: "Download your optimized resume in various formats including PDF, DOCX, and ATS-friendly plain text.",
      color: "text-purple-500"
    },
    {
      icon: Shield,
      title: "Privacy Protected",
      description: "Your resume data is encrypted and secure. We never share your information with third parties.",
      color: "text-green-500"
    },
    {
      icon: Sparkles,
      title: "Industry-Specific",
      description: "Tailored optimization for different industries including tech, finance, healthcare, and more.",
      color: "text-primary"
    },
    {
      icon: TrendingUp,
      title: "Performance Tracking",
      description: "Track your application success rate and monitor improvements over time with detailed analytics.",
      color: "text-success"
    },
    {
      icon: Clock,
      title: "Quick Turnaround",
      description: "Get your optimized resume in minutes, not hours. Perfect for last-minute applications.",
      color: "text-warning"
    }
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Powerful Features for
            <span className="block text-primary">Career Success</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to create a resume that stands out from the competition 
            and gets you noticed by hiring managers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="bg-card hover:shadow-medium transition-all duration-300 hover:-translate-y-1 group">
              <CardHeader className="pb-4">
                <div className={`inline-flex items-center justify-center w-12 h-12 bg-background rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};