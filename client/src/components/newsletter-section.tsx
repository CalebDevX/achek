import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { newsletterApi } from "@/lib/api";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const subscribeMutation = useMutation({
    mutationFn: newsletterApi.subscribe,
    onSuccess: (data: any) => {
      if (data?.message?.includes("already subscribed") || data?.message?.includes("Already subscribed")) {
        toast({
          title: "Already Subscribed",
          description: "This email is already subscribed to Achek’s newsletter.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Subscribed Successfully!",
          description: "You’re now subscribed to Achek’s newsletter. 🎉",
        });
        setEmail("");
      }
    },
    onError: (error: any) => {
      toast({
        title: "Subscription Failed",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    subscribeMutation.mutate({ email });
  };

  return (
    <section className="py-24 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 dark:from-primary/20 dark:via-secondary/20 dark:to-accent/20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/50 dark:bg-gray-900/50 backdrop-blur-md">
          {/* Background Blobs */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 -left-16 w-40 h-40 bg-white/30 dark:bg-white/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 -right-20 w-56 h-56 bg-white/20 dark:bg-white/10 rounded-full blur-3xl animate-float"></div>
          </div>

          <div className="relative z-10 px-6 py-16 sm:px-12 sm:py-20">
            <h2 className="text-4xl md:text-5xl font-bold text-primary dark:text-white mb-4">
              Stay Updated with Achek
            </h2>
            <p className="text-lg text-muted-foreground dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Get the latest insights on digital solutions, tech trends, and web
              development delivered straight to your inbox.
            </p>

            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={subscribeMutation.isPending}
                className="flex-1 px-6 py-4 rounded-xl border-0 bg-white/20 dark:bg-gray-800/30 backdrop-blur text-gray-900 dark:text-white placeholder-gray-600 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50"
                data-testid="newsletter-email-input"
              />
              <Button
                type="submit"
                disabled={subscribeMutation.isPending}
                className="bg-primary text-white dark:bg-primary/90 dark:text-white px-8 py-4 rounded-xl font-semibold hover:scale-105 transition-transform disabled:opacity-50 whitespace-nowrap"
                data-testid="newsletter-subscribe-button"
              >
                {subscribeMutation.isPending ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>

            <p className="text-sm text-gray-700 dark:text-gray-300 mt-4">
              No spam. Unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
