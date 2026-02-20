import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, type Easing } from "framer-motion";
import { Calculator, Palette, BarChart3, CheckCircle2, Star, ArrowRight, Home, Wrench, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-renovation.jpg";
import kvadredLogo from "@/assets/kvadred-logo.png";
import { useAuth } from "@/contexts/AuthContext";
import DemoModal from "@/components/DemoModal";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as Easing }
  })
};

const problemCards = [
  {
    icon: Home,
    title: "Property Owners",
    problems: ["Budget surprises derailing your project?", "Unsure what to expect or when?", "Overwhelmed by tracking every detail?"]
  },
  {
    icon: Palette,
    title: "Interior Designers",
    problems: ["Spending hours on estimates?", "Struggling to communicate timelines?", "Manual material calculations eating your time?"]
  },
  {
    icon: Wrench,
    title: "Renovation Companies",
    problems: ["Juggling multiple projects and teams?", "Client communication breakdowns?", "Lost track of materials and suppliers?"]
  }
];

const solutionCards = [
  { icon: Calculator, title: "Smart Budget Calculator", desc: "Instant cost and time estimates based on real data" },
  { icon: Palette, title: "Professional Design Tools", desc: "Templates and material libraries at your fingertips" },
  { icon: BarChart3, title: "Complete Project Management", desc: "Track teams, clients, and inventory in one place" }
];

const testimonials = [
  { name: "Sarah Chen", role: "Interior Designer", text: "Kvadred cut my estimate time by 70%. My clients love the transparency.", avatar: "SC" },
  { name: "Marcus Williams", role: "General Contractor", text: "Managing 12 projects simultaneously has never been easier. Game changer.", avatar: "MW" },
  { name: "Lisa Park", role: "Homeowner", text: "I finally understood my renovation budget before we started. No surprises!", avatar: "LP" }
];

const plans = [
  {
    name: "Property Owner",
    price: "$19",
    period: "one-time",
    tag: null,
    description: "Perfect for single renovation projects",
    features: ["Unlimited calculations", "PDF reports", "Interactive checklists", "Save projects"],
    cta: "Get Started",
    note: "Start free – pay when you're ready",
    highlight: false,
  },
  {
    name: "Interior Designer",
    price: "$49",
    period: "/month",
    tag: "Most Popular",
    description: "For design professionals",
    features: ["Everything in Owner +", "Client management", "Material library", "Branded exports", "Custom templates"],
    cta: "Start Free Trial",
    note: "14-day free trial",
    highlight: true,
  },
  {
    name: "Renovation Company",
    price: "$149",
    period: "/month",
    tag: null,
    description: "Complete business solution",
    features: ["Everything in Designer +", "Team collaboration", "Project management", "Inventory tracking", "Client portal", "Analytics"],
    cta: "Schedule Demo",
    note: "Custom enterprise plans available",
    highlight: false,
  },
];

const Index = () => {
  const { user } = useAuth();
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DemoModal open={demoOpen} onClose={() => setDemoOpen(false)} />
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Kvadred</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#problems" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Why Kvadred</a>
            <a href="#solutions" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#testimonials" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Testimonials</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Link to="/app">
                <Button size="sm" className="gradient-primary text-primary-foreground">Go to App</Button>
              </Link>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">Sign In</Button>
                </Link>
                <Link to="/auth">
                  <Button size="sm" className="gradient-primary text-primary-foreground">Get Started Free</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0" />
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div initial="hidden" animate="visible" className="space-y-6">
              <motion.h1 variants={fadeUp} custom={0} className="text-4xl font-extrabold leading-tight text-foreground md:text-5xl lg:text-6xl">
                Plan Your Renovation with{" "}
                <span className="text-primary">Confidence</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={1} className="max-w-lg text-lg text-muted-foreground">
                From concept to completion—one platform for property owners, designers, and contractors
              </motion.p>
              <motion.div variants={fadeUp} custom={2} className="flex flex-wrap gap-4">
                <Link to={user ? "/app" : "/auth"}>
                  <Button size="lg" className="gradient-primary text-primary-foreground px-8 text-base font-semibold shadow-elevated">
                    Start Free <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Button size="lg" variant="outline" className="text-base" onClick={() => setDemoOpen(true)}>Watch Demo</Button>
              </motion.div>
              <motion.div variants={fadeUp} custom={3} className="flex items-center gap-6 pt-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> No credit card</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> Free forever plan</span>
                <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-success" /> 5 min setup</span>
              </motion.div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.7, delay: 0.3 }} className="relative">
              <div className="overflow-hidden rounded-2xl shadow-elevated">
                <img src={heroImage} alt="Modern renovated kitchen interior" className="h-auto w-full object-cover" />
              </div>
              <div className="absolute -bottom-4 -left-4 rounded-xl bg-card p-4 shadow-card">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <CheckCircle2 className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">Budget On Track</p>
                    <p className="text-xs text-muted-foreground">$45,200 of $50,000</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problems */}
      <section id="problems" className="bg-card py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground md:text-4xl">
              Renovation Chaos? <span className="text-primary">We've Been There.</span>
            </motion.h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {problemCards.map((card, i) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="rounded-2xl border border-border bg-background p-8 shadow-soft transition-all hover:shadow-card">
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <card.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-4 text-xl font-bold text-foreground">{card.title}</h3>
                <ul className="space-y-3">
                  {card.problems.map((p) => (
                    <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-primary/40" />
                      {p}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solutions */}
      <section id="solutions" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground md:text-4xl">
              One Platform, <span className="text-primary">Three Solutions</span>
            </motion.h2>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3">
            {solutionCards.map((card, i) => (
              <motion.div key={card.title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="group rounded-2xl border border-border bg-card p-8 shadow-soft transition-all hover:shadow-elevated hover:border-primary/20">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl gradient-primary shadow-card transition-transform group-hover:scale-110">
                  <card.icon className="h-7 w-7 text-primary-foreground" />
                </div>
                <h3 className="mb-3 text-xl font-bold text-foreground">{card.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{card.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-card py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-16 text-center">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl font-bold text-foreground md:text-4xl">
              Choose Your <span className="text-primary">Plan</span>
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mt-4 text-muted-foreground">
              Start free, upgrade when you need more. No hidden fees.
            </motion.p>
          </motion.div>
          <div className="grid gap-8 md:grid-cols-3 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div key={plan.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className={`relative rounded-2xl border p-8 flex flex-col ${plan.highlight ? "border-primary shadow-elevated bg-background scale-[1.02]" : "border-border bg-background shadow-soft"}`}>
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
                    <Button className={`w-full mb-2 ${plan.highlight ? "gradient-primary text-primary-foreground" : ""}`} variant={plan.highlight ? "default" : "outline"}>
                      {plan.cta} <ArrowRight className="ml-1 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-center text-xs text-muted-foreground">{plan.note}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-6 text-center">
            <motion.p variants={fadeUp} custom={0} className="mb-2 text-sm font-semibold text-primary">TRUSTED BY PROFESSIONALS</motion.p>
            <motion.h2 variants={fadeUp} custom={1} className="text-3xl font-bold text-foreground md:text-4xl">
              Join 10,000+ renovation professionals
            </motion.h2>
          </motion.div>
          <div className="mb-8 flex justify-center">
            {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-warning text-warning" />)}
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={i} variants={fadeUp}
                className="rounded-2xl border border-border bg-card p-6 shadow-soft">
                <p className="mb-6 text-sm leading-relaxed text-muted-foreground italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }}
            className="rounded-3xl gradient-primary p-12 text-center md:p-20">
            <motion.h2 variants={fadeUp} custom={0} className="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">
              Start Your First Project Today
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="mb-8 text-primary-foreground/80">No credit card required for free tier</motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link to={user ? "/app" : "/auth"}>
                <Button size="lg" variant="secondary" className="px-10 text-base font-semibold shadow-elevated">
                  Get Started Free <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center md:flex-row md:justify-between md:text-left">
          <div className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred logo" className="h-6 w-6 object-contain" />
            <span className="font-bold text-foreground">Kvadred</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">About</a>
            <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            <Link to="/pricing" className="hover:text-foreground transition-colors">Pricing</Link>
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 Kvadred. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
