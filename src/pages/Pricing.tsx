import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import kvadredLogo from "@/assets/kvadred-logo.png";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const }
  })
};

const plans = [
  {
    id: "owner",
    name: "Property Owner",
    price: "$19",
    period: "one-time",
    tag: null,
    description: "Perfect for single renovation projects",
    features: ["Unlimited calculations", "Downloadable PDF reports", "Interactive checklists", "Save projects", "Budget tracking"],
    cta: "Get Started",
    note: "Start free – pay when you're ready",
    highlight: false,
  },
  {
    id: "designer",
    name: "Interior Designer",
    price: "$49",
    period: "/month",
    tag: "Most Popular",
    description: "For design professionals",
    features: ["Everything in Owner +", "Client management", "Material library", "Branded PDF exports", "Custom templates", "Client project sharing"],
    cta: "Start Free Trial",
    note: "14-day free trial",
    highlight: true,
  },
  {
    id: "company",
    name: "Renovation Company",
    price: "$149",
    period: "/month",
    tag: null,
    description: "Complete business solution",
    features: ["Everything in Designer +", "Team collaboration (10 users)", "Project management", "Inventory tracking", "Client portal", "Analytics & reporting", "Priority support"],
    cta: "Schedule Demo",
    note: "Custom enterprise plans available",
    highlight: false,
  },
];

export default function Pricing() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Kvadred</span>
          </Link>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/app"><Button size="sm" className="gradient-primary text-primary-foreground">Go to App</Button></Link>
            ) : (
              <>
                <Link to="/auth"><Button variant="ghost" size="sm">Sign In</Button></Link>
                <Link to="/auth"><Button size="sm" className="gradient-primary text-primary-foreground">Get Started</Button></Link>
              </>
            )}
          </div>
        </div>
      </nav>

      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <motion.div initial="hidden" animate="visible" className="text-center mb-16">
            <motion.h1 variants={fadeUp} custom={0} className="text-4xl font-bold text-foreground md:text-5xl mb-4">
              Choose Your <span className="text-primary">Plan</span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free, upgrade when you need more. No hidden fees.
            </motion.p>
          </motion.div>

          <div className="grid gap-8 md:grid-cols-3">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.id}
                initial="hidden"
                animate="visible"
                custom={i}
                variants={fadeUp}
                className={`relative rounded-2xl border p-8 flex flex-col ${
                  plan.highlight
                    ? "border-primary shadow-elevated bg-card scale-[1.02]"
                    : "border-border bg-card shadow-soft"
                }`}
              >
                {plan.tag && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="gradient-primary text-primary-foreground text-xs font-bold px-4 py-1.5 rounded-full flex items-center gap-1">
                      <Star className="h-3 w-3 fill-current" /> {plan.tag}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.description}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <Check className={`h-4 w-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-primary" : "text-success"}`} />
                      <span className="text-foreground">{f}</span>
                    </li>
                  ))}
                </ul>
                <div>
                  <Link to="/auth">
                    <Button
                      className={`w-full mb-2 ${plan.highlight ? "gradient-primary text-primary-foreground" : ""}`}
                      variant={plan.highlight ? "default" : "outline"}
                    >
                      {plan.cta} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-muted-foreground">{plan.note}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial="hidden" animate="visible" className="mt-20 text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-2xl font-bold mb-4">Frequently Asked Questions</motion.h2>
            <div className="grid gap-4 md:grid-cols-2 max-w-4xl mx-auto text-left mt-8">
              {[
                { q: "Can I switch plans anytime?", a: "Yes, upgrade or downgrade at any time. Changes take effect immediately with prorated billing." },
                { q: "Is there a free trial?", a: "Designer gets 14 days free. Company gets 7 days free. No credit card required to start." },
                { q: "What happens when my trial ends?", a: "You'll be prompted to add a payment method. Your data is always preserved." },
                { q: "Do you offer refunds?", a: "Yes, we offer a 30-day money-back guarantee on all plans." },
              ].map((faq, i) => (
                <div key={i} className="p-6 rounded-xl border border-border bg-card">
                  <h4 className="font-semibold text-foreground mb-2">{faq.q}</h4>
                  <p className="text-sm text-muted-foreground">{faq.a}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
