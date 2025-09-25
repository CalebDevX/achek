const services = [
  {
    icon: "fab fa-whatsapp",
    title: "WhatsApp Bot Development",
    description: "Custom WhatsApp bots using Baileys library for automated customer service, lead generation, and business workflows.",
    features: [
      "24/7 Automated Responses",
      "Lead Qualification",
      "Order Management",
      "Custom Integrations",
    ],
  },
  {
    icon: "fas fa-code",
    title: "Web Development",
    description: "Modern, responsive websites and web applications built with latest technologies and best practices.",
    features: [
      "React & Next.js",
      "Mobile Responsive",
      "SEO Optimized",
      "Performance Focused",
    ],
  },
  {
    icon: "fas fa-plug",
    title: "API Integration",
    description: "Seamless integration between your systems, third-party services, and automation platforms.",
    features: [
      "Payment Gateways",
      "CRM Systems",
      "E-commerce Platforms",
      "Custom APIs",
    ],
  },
  {
    icon: "fas fa-cogs",
    title: "Business Automation",
    description: "Streamline your operations with intelligent automation solutions and workflow optimization.",
    features: [
      "Process Automation",
      "Data Migration",
      "Report Generation",
      "Task Scheduling",
    ],
  },
  {
    icon: "fas fa-lightbulb",
    title: "Digital Consulting",
    description: "Strategic guidance to help you choose the right technology stack and implementation approach.",
    features: [
      "Technology Audit",
      "Architecture Planning",
      "Strategy Development",
      "ROI Analysis",
    ],
  },
  {
    icon: "fas fa-headset",
    title: "Support & Maintenance",
    description: "Ongoing support, updates, and maintenance to keep your digital solutions running smoothly.",
    features: [
      "24/7 Monitoring",
      "Regular Updates",
      "Bug Fixes",
      "Performance Optimization",
    ],
  },
];

export default function Services() {
  return (
    <section id="services" className="py-20 bg-secondary/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Digital Solutions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From WhatsApp automation to full-stack development, we deliver solutions that scale
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-card border border-border rounded-xl p-8 hover:shadow-lg transition-shadow"
              data-testid={`card-service-${service.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <div className="w-12 h-12 bg-primary/10 text-primary rounded-lg flex items-center justify-center mb-6">
                <i className={`${service.icon} text-2xl`}></i>
              </div>
              <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-muted-foreground mb-6">{service.description}</p>
              <ul className="space-y-2 text-sm">
                {service.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <i className="fas fa-check text-primary mr-2"></i>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
