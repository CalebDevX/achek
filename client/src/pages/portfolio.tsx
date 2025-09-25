import Navigation from "@/components/navigation";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const portfolioItems = [
  {
    id: 1,
    title: "Fashion Retailer Automation",
    category: "E-commerce",
    secondaryCategory: "WhatsApp Bot",
    description: "Developed a comprehensive WhatsApp bot that increased customer engagement by 300% and automated 80% of customer inquiries for a fashion retailer.",
    image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    metrics: [
      { label: "Response Time", value: "Reduced by 90%" },
      { label: "Customer Satisfaction", value: "95% positive feedback" },
      { label: "Sales Increase", value: "+45% through bot" },
    ],
    technologies: ["WhatsApp Bot", "Node.js", "Baileys", "AI Integration"],
  },
  {
    id: 2,
    title: "Restaurant Chain Platform",
    category: "Restaurant",
    secondaryCategory: "Web App",
    description: "Built an integrated ordering system with WhatsApp bot, web app, and admin dashboard for a restaurant chain with 15 locations.",
    image: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    metrics: [
      { label: "Order Processing", value: "Fully Automated" },
      { label: "Daily Orders", value: "500+ via WhatsApp" },
      { label: "Staff Efficiency", value: "+60% improvement" },
    ],
    technologies: ["React", "WhatsApp Bot", "Payment Integration", "Admin Dashboard"],
  },
  {
    id: 3,
    title: "Real Estate Lead System",
    category: "Real Estate",
    secondaryCategory: "CRM Integration",
    description: "Created an intelligent lead qualification bot that pre-qualifies prospects and integrates with existing CRM systems.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    metrics: [
      { label: "Lead Quality", value: "85% qualified" },
      { label: "Agent Productivity", value: "+70% increase" },
      { label: "Conversion Rate", value: "+35% improvement" },
    ],
    technologies: ["WhatsApp Bot", "CRM Integration", "Lead Scoring", "Analytics"],
  },
  {
    id: 4,
    title: "Medical Practice Automation",
    category: "Healthcare",
    secondaryCategory: "Appointment Bot",
    description: "Implemented appointment booking and patient communication system that reduced no-shows and improved patient satisfaction.",
    image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400",
    metrics: [
      { label: "No-show Rate", value: "Reduced by 40%" },
      { label: "Booking Automation", value: "95% automated" },
      { label: "Patient Satisfaction", value: "4.9/5 rating" },
    ],
    technologies: ["WhatsApp Bot", "Calendar Integration", "SMS Reminders", "HIPAA Compliant"],
  },
];

export default function Portfolio() {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Portfolio</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover how we've transformed businesses across industries with innovative digital solutions and intelligent automation
            </p>
          </div>

          <div className="grid gap-12">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-xl transition-shadow">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative h-64 lg:h-auto">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <CardContent className="p-8 lg:p-12 flex flex-col justify-center">
                    <div className="flex items-center space-x-2 mb-4">
                      <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                        {item.category}
                      </span>
                      <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                        {item.secondaryCategory}
                      </span>
                    </div>
                    
                    <h3 className="text-2xl font-semibold mb-4">{item.title}</h3>
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {item.description}
                    </p>
                    
                    <div className="space-y-3 mb-6">
                      {item.metrics.map((metric, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">{metric.label}</span>
                          <span className="text-sm font-medium">{metric.value}</span>
                        </div>
                      ))}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-6">
                      {item.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="bg-accent text-accent-foreground px-2 py-1 rounded text-xs"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      className="self-start"
                      data-testid={`button-view-case-study-${item.id}`}
                    >
                      View Detailed Case Study
                      <i className="fas fa-arrow-right ml-2"></i>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>

          <div className="text-center mt-16">
            <h3 className="text-2xl font-semibold mb-4">Ready to Create Your Success Story?</h3>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
              Let's discuss how we can transform your business with custom digital solutions
            </p>
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-start-project"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Start Your Project
            </Button>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
