import { Button } from "@/components/ui/button";
import WhatsAppBotDemo from "./whatsapp-bot-demo";

export default function Hero() {
  const handleScrollTo = (elementId: string) => {
    const element = document.querySelector(elementId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="pt-24 pb-16 hero-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Digital Solutions That{" "}
            <span className="text-primary">Drive Growth</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your business with custom WhatsApp bots, web applications, and digital strategies.
            Powered by cutting-edge technology including Baileys library for seamless automation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-medium"
              onClick={() => handleScrollTo("#contact")}
              data-testid="button-start-whatsapp-demo"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              Start WhatsApp Bot Demo
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="px-8 py-4 text-lg font-medium"
              onClick={() => handleScrollTo("#portfolio")}
              data-testid="button-view-portfolio"
            >
              View Portfolio
            </Button>
          </div>
        </div>

        <div className="mt-16">
          <WhatsAppBotDemo />
        </div>
      </div>
    </section>
  );
}
