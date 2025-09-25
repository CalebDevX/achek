import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const plans = [
  {
    name: "Starter Bot",
    price: "$499",
    description: "One-time setup",
    features: [
      "Basic WhatsApp Bot",
      "Up to 100 interactions/day",
      "Simple Q&A responses",
      "Basic analytics",
      "1 month support",
    ],
    popular: false,
  },
  {
    name: "Professional Bot",
    price: "$1,299",
    description: "One-time setup",
    features: [
      "Advanced WhatsApp Bot",
      "Unlimited interactions",
      "AI-powered responses",
      "CRM integration",
      "Advanced analytics",
      "3 months support",
      "Custom workflows",
    ],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Contact for pricing",
    features: [
      "Multi-platform bots",
      "Custom integrations",
      "Dedicated support",
      "SLA guarantee",
      "White-label solutions",
      "Ongoing development",
    ],
    popular: false,
  },
];

export default function Pricing() {
  const handleScrollToContact = () => {
    const element = document.querySelector("#contact");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose the plan that fits your business needs. All plans include ongoing support and updates.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative ${
                plan.popular
                  ? "border-2 border-primary"
                  : "border border-border"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center pb-8">
                <CardTitle className="text-xl font-semibold mb-2">{plan.name}</CardTitle>
                <div className="text-3xl font-bold mb-1">{plan.price}</div>
                <div className="text-muted-foreground">{plan.description}</div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <i className="fas fa-check text-primary mr-3"></i>
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`w-full ${
                    plan.popular
                      ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                      : "bg-secondary hover:bg-secondary/80 text-secondary-foreground"
                  }`}
                  onClick={handleScrollToContact}
                  data-testid={`button-select-plan-${plan.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {plan.name === "Enterprise" ? "Contact Sales" : "Get Started"}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Need a custom solution? We offer flexible pricing for unique requirements.
          </p>
          <Button
            variant="ghost"
            className="text-primary hover:text-primary/80"
            onClick={handleScrollToContact}
            data-testid="button-schedule-consultation"
          >
            Schedule a consultation <i className="fas fa-arrow-right ml-1"></i>
          </Button>
        </div>
      </div>
    </section>
  );
}
