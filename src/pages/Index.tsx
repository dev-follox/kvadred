import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Store, Users, Calculator, TrendingUp, Shield, Box, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import kvadredLogo from "@/assets/kvadred-logo.png";
import heroBg from "@/assets/hero-bg.jpg";
import DemoPreview from "@/components/landing/DemoPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.6 } }),
};

export default function Index() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DemoPreview open={demoOpen} onClose={() => setDemoOpen(false)} />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Kvadred</span>
          </Link>
          <div className="flex items-center gap-3" />
        </div>
      </header>

      {/* Hero — full-screen with bg image */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-[#2C3830]/55" />
        <div className="relative z-10 container mx-auto px-4 text-center pt-16">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0}
            className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight uppercase tracking-wide">
            Оцифруйте агентское партнёрство с&nbsp;дизайнерами
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} initial="hidden" animate="visible"
            className="mt-6 text-lg md:text-xl text-secondary-alpha max-w-2xl mx-auto">
            Прозрачные выплаты, автоматический учёт бонусов и&nbsp;мотивация дизайнеров — всё в&nbsp;одной платформе для магазинов интерьера
          </motion.p>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="mt-10 flex flex-wrap justify-center gap-4">
            
            <Button size="lg" variant="outline" onClick={() => setDemoOpen(true)}>
              <Play className="mr-2 h-4 w-4" /> Попробовать демо
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-secondary-alpha">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Для дизайнеров бесплатно</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Автоматический расчёт</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="h-4 w-4 text-primary" /> Геймификация</span>
          </motion.div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 text-foreground uppercase tracking-wide">Как это работает</h2>
          <p className="text-center text-secondary-alpha mb-16 max-w-xl mx-auto">Три простых шага к прозрачному сотрудничеству</p>
          <div className="grid md:grid-cols-3 gap-0">
            {[
              { icon: Users, title: "Подключите дизайнеров", desc: "Добавьте дизайнеров и установите индивидуальные условия бонусов для каждого", step: "01" },
              { icon: Store, title: "Они приводят клиентов", desc: "Дизайнеры направляют клиентов в ваш магазин и фиксируют продажи в системе", step: "02" },
              { icon: Calculator, title: "Система считает бонусы", desc: "Автоматический расчёт, подтверждение и отслеживание всех выплат с комиссиями", step: "03" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className={`p-10 text-center relative ${i < 2 ? "md:border-r border-border" : ""}`}>
                <span className="text-5xl font-bold text-foreground/5 absolute top-4 right-6">{item.step}</span>
                <div className="mx-auto w-12 h-12 flex items-center justify-center mb-5">
                  <item.icon className="h-7 w-7 text-stone" strokeWidth={1.5} />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground uppercase tracking-wide">{item.title}</h3>
                <p className="text-secondary-alpha text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Kvadred */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-foreground uppercase tracking-wide">Почему Kvadred</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Прозрачность выплат", desc: "Полная история всех операций и бонусов в одном месте" },
              { icon: TrendingUp, title: "Геймификация", desc: "Мотивируйте дизайнеров автоматическим ростом бонусного процента" },
              { icon: Box, title: "Каталог 3D моделей", desc: "Загружайте 3D файлы товаров для удобства дизайнеров" },
              { icon: Calculator, title: "Автоматический расчёт", desc: "Бонусы и комиссии рассчитываются по вашим правилам" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 border border-border bg-card hover:border-primary/30 transition-colors duration-300">
                <item.icon className="h-5 w-5 text-stone mb-4" strokeWidth={1.5} />
                <h3 className="font-semibold mb-1.5 text-foreground text-sm uppercase tracking-wide">{item.title}</h3>
                <p className="text-sm text-secondary-alpha leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 bg-card">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-16 text-foreground uppercase tracking-wide">Тарифы</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-background border-2 border-primary p-8 relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1">Популярный</span>
              <Store className="h-7 w-7 text-primary mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2 text-foreground uppercase">Для магазинов</h3>
              <div className="text-4xl font-bold text-primary font-mono mb-1"><div className="text-4xl font-bold text-primary font-mono mb-1">45 000 ₸<span className="text-base font-normal text-secondary-alpha">/мес</span></div><span className="text-base font-normal text-secondary-alpha">/мес</span></div>
              <p className="text-sm text-secondary-alpha mb-6">+ 5% комиссия с каждой выплаты бонуса</p>
              <ul className="text-sm text-left space-y-3 mb-8">
                {["Полный доступ ко всем функциям", "Неограниченное количество дизайнеров", "Каталог товаров и 3D моделей", "Геймификация и автоматический расчёт", "Аналитика и отчёты"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button className="w-full">Начать</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-background border border-border p-8">
              <Users className="h-7 w-7 text-stone mx-auto mb-4" strokeWidth={1.5} />
              <h3 className="text-lg font-bold mb-2 text-foreground uppercase">Для дизайнеров</h3>
              <div className="text-4xl font-bold text-foreground font-mono mb-1">Бесплатно</div>
              <p className="text-sm text-secondary-alpha mb-6">Навсегда</p>
              <ul className="text-sm text-left space-y-3 mb-8">
                {["Доступ ко всем магазинам платформы", "Просмотр каталогов и 3D моделей", "Отслеживание бонусов и выплат", "Подача заявок на продажи"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-stone flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button variant="outline" className="w-full">Зарегистрироваться</Button></Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-footer border-t border-border py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-6 w-6 object-contain" />
            <span className="font-semibold text-foreground">Kvadred</span>
          </div>
          <p className="text-sm text-secondary-alpha">info@kvadred.kz</p>
          <p className="text-sm text-secondary-alpha">© {new Date().getFullYear()} Kvadred. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
