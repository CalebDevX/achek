import { Button } from "@/components/ui/button";
import { Link } from "wouter";

const caseStudies = [
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
  },
];

export default function PortfolioShowcase() {
  return (
    <section id="portfolio" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Real results from real clients - see how we've transformed businesses with digital solutions
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {caseStudies.map((study) => (
            <div key={study.id} className="group">
              <div className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-xl transition-shadow">
                <img
                  src={study.image}
                  alt={study.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-8">
                  <div className="flex items-center space-x-2 mb-4">
                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      {study.category}
                    </span>
                    <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {study.secondaryCategory}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{study.title}</h3>
                  <p className="text-muted-foreground mb-4">{study.description}</p>
                  <div className="space-y-2 mb-6">
                    {study.metrics.map((metric, index) => (
                      <div key={index} className="flex justify-between">
                        <span className="text-sm text-muted-foreground">{metric.label}</span>
                        <span className="text-sm font-medium">{metric.value}</span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    className="text-primary hover:text-primary/80 p-0"
                    data-testid={`button-view-case-study-${study.id}`}
                  >
                    View Case Study <i className="fas fa-arrow-right ml-1"></i>
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link href="/portfolio">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground"
              data-testid="button-view-all-projects"
            >
              View All Projects
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
