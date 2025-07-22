import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQSection = () => {
  const faqs = [
    {
      question: "How does the AI resume optimization work?",
      answer: "Our AI analyzes your resume using advanced natural language processing and machine learning algorithms. It evaluates factors like keyword density, ATS compatibility, formatting, content structure, and industry-specific requirements to provide personalized recommendations for improvement."
    },
    {
      question: "Will my resume pass ATS (Applicant Tracking Systems)?",
      answer: "Yes! Our optimization specifically targets ATS compatibility. We analyze over 50 factors that ATS systems look for, including proper formatting, keyword optimization, section headers, and content structure. Most users see a 90%+ ATS compatibility score after optimization."
    },
    {
      question: "What file formats do you support?",
      answer: "We support all major resume formats including PDF, DOCX, DOC, TXT, and RTF. You can also copy and paste your resume text directly. After optimization, you can download your resume in multiple formats optimized for different use cases."
    },
    {
      question: "Is my resume data secure and private?",
      answer: "Absolutely. We take privacy seriously. Your resume data is encrypted both in transit and at rest. We never share your personal information with third parties, and you can delete your data at any time. Our AI processing happens securely on our servers."
    },
    {
      question: "How long does the optimization process take?",
      answer: "The AI analysis typically takes 30-60 seconds. You'll get instant feedback with detailed scoring and suggestions. Implementing the recommendations and downloading your optimized resume can be completed in just a few minutes."
    },
    {
      question: "Can I optimize my resume for specific job descriptions?",
      answer: "Yes! Our Pro plan includes job-specific optimization. You can paste a job description, and our AI will tailor your resume to match the specific requirements, keywords, and skills mentioned in that particular job posting."
    },
    {
      question: "Do you offer industry-specific optimization?",
      answer: "Yes, we provide specialized optimization for various industries including technology, healthcare, finance, marketing, education, and more. Our AI understands industry-specific terminology, requirements, and best practices."
    },
    {
      question: "What's included in the free plan?",
      answer: "The free plan includes one resume analysis per month, basic ATS scoring, up to 5 AI suggestions, and PDF download capability. It's perfect for trying out our service and getting a taste of what AI-powered optimization can do."
    },
    {
      question: "Can I cancel my subscription at any time?",
      answer: "Yes, you can cancel your subscription at any time with no questions asked. If you cancel during a billing cycle, you'll continue to have access to Pro features until the end of that billing period."
    },
    {
      question: "Do you offer support for career coaches and recruiters?",
      answer: "Yes! Our Enterprise plan is designed for career coaches, recruiters, and HR professionals. It includes team collaboration tools, bulk processing capabilities, white-label options, and dedicated support."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Frequently Asked
            <span className="block text-primary">Questions</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to know about AI-powered resume optimization.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, index) => (
              <AccordionItem 
                key={index} 
                value={`item-${index}`}
                className="border border-border rounded-lg px-6 bg-card hover:shadow-soft transition-shadow"
              >
                <AccordionTrigger className="text-left font-semibold text-foreground py-6">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground pb-6 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Contact support */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-4">
            Still have questions? We're here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@resumeai.com" 
              className="text-primary hover:text-primary/80 transition-colors"
            >
              support@resumeai.com
            </a>
            <span className="hidden sm:inline text-muted-foreground">•</span>
            <span className="text-muted-foreground">
              Response time: Within 24 hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};