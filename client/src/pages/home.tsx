import { useEffect, useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Code, Smartphone, TrendingUp } from "lucide-react";

export default function Home() {
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0]);

  useEffect(() => {
    document.title = "Get Your Website Online and Grow Your Business";

    const metaDescription = document.querySelector<HTMLMetaElement>(
      'meta[name="description"]'
    );
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Transform your business with Achek Digital Solutions. Professional web development, mobile apps, and digital marketing services in Nigeria. 150+ projects delivered, 99% success rate."
      );
    }

    let canonical = document.querySelector<HTMLLinkElement>(
      'link[rel="canonical"]'
    );
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://achek.com.ng/";
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const targets = [150, 50, 99];
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;

    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      setCounters(
        targets.map((t) => Math.min(Math.round((t / steps) * frame), t))
      );
      if (frame >= steps) clearInterval(timer);
    }, interval);

    return () => clearInterval(timer);
  }, []);

  const stats = [
    { value: counters[0], label: "Projects Completed", suffix: "+" },
    { value: counters[1], label: "Clients Served", suffix: "+" },
    { value: counters[2], label: "Success Rate", suffix: "%" },
  ];

  const features = [
    {
      icon: Code,
      title: "Web Development",
      description:
        "Modern, responsive websites for business, e-commerce, portfolio, and more.",
    },
    {
      icon: Smartphone,
      title: "Mobile Apps",
      description:
        "Android and iOS apps, custom features, and cross-platform solutions.",
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description:
        "SEO, social media, and online marketing to grow your business.",
    },
  ];

  return (
    <div className="pt-24 md:pt-28 custom-scrollbar" data-testid="home-page">
      <section className="min-h-screen flex items-center relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute inset-0 opacity-20 -z-10">
          <div className="absolute top-10 left-10 w-40 h-40 gradient-bg rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-56 h-56 bg-secondary rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-center md:text-left">
              <h1
                className={`text-5xl md:text-7xl font-extrabold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent animate-shimmer ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Digital Solutions <br /> That Scale
              </h1>

              <p
                className={`text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto md:mx-0 transition-all duration-1000 delay-200 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                Transform your business with cutting-edge web development,
                mobile apps, and digital marketing solutions. We bring your
                vision to life.
              </p>

              <div
                className={`flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-16 transition-all duration-1000 delay-400 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                <Link href="/contact">
                  <Button
                    size="lg"
                    className="gradient-bg text-white px-8 py-4 rounded-xl font-semibold text-lg hover:scale-105 transition-transform shadow-lg"
                  >
                    Get Free Quote
                  </Button>
                </Link>
                <Link href="/portfolio">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 rounded-xl font-semibold text-lg"
                  >
                    View Our Work
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>

              {/* Stats */}
              <div
                className={`grid grid-cols-3 gap-8 transition-all duration-1000 delay-600 ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-8"
                }`}
              >
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                      {stat.value}
                      {stat.suffix}
                    </div>
                    <div className="text-muted-foreground mt-2">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Transparent Mockup */}
            <div className="flex justify-center items-center w-full">
              <img
                src="/mockup-image.png"
                alt="Website and mobile mockup"
                className="w-full max-w-md md:max-w-lg lg:max-w-xl drop-shadow-2xl object-contain animate-float"
                style={{
                  aspectRatio: "16/10",
                  backgroundColor: "transparent",
                  border: "none",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Why Choose Achek?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We combine technical expertise with creative innovation to deliver
              solutions that drive real business results.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-8 hover:shadow-xl transition-shadow duration-300"
              >
                <CardContent className="p-0">
                  <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center mb-6">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-2xl font-semibold mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button
                size="lg"
                className="gradient-bg text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform shadow-lg"
              >
                Explore All Services
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
