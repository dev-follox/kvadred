import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Store, Users, Calculator, TrendingUp, Shield, Box, CheckCircle2, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import kvadredLogo from "@/assets/kvadred-logo.png";
import DemoPreview from "@/components/landing/DemoPreview";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.15, duration: 0.5 } }),
};

export default function Index() {
  const [demoOpen, setDemoOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DemoPreview open={demoOpen} onClose={() => setDemoOpen(false)} />
      <header className="sticky top-0 z-50 border-b border-border bg-card/80 backdrop-blur-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link to="/" className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold text-foreground">Kvadred</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth"><Button variant="ghost">Войти</Button></Link>
            <Link to="/auth?mode=signup"><Button className="gradient-primary text-primary-foreground">Зарегистрироваться</Button></Link>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden">
        <div className="gradient-hero absolute inset-0 pointer-events-none" />
        <div className="container mx-auto px-4 py-20 md:py-32 text-center relative">
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} custom={0} className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground max-w-4xl mx-auto leading-tight">
            Оцифруйте агентское партнёрство с дизайнерами
          </motion.h1>
          <motion.p variants={fadeUp} custom={1} initial="hidden" animate="visible" className="mt-6 text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Прозрачные выплаты, автоматический учёт бонусов и мотивация дизайнеров — всё в одной платформе для магазинов интерьера
          </motion.p>
          <motion.div variants={fadeUp} custom={2} initial="hidden" animate="visible" className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/auth?mode=signup">
              <Button size="lg" className="gradient-primary text-primary-foreground text-base">Начать бесплатно <ArrowRight className="ml-2 h-4 w-4" /></Button>
            </Link>
            <Button size="lg" variant="outline" className="text-base" onClick={() => setDemoOpen(true)}>
              <Play className="mr-2 h-4 w-4" /> Попробовать демо
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} custom={3} initial="hidden" animate="visible" className="mt-6 flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Для дизайнеров бесплатно</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Автоматический расчёт</span>
            <span className="flex items-center gap-1"><CheckCircle2 className="h-4 w-4 text-primary" /> Геймификация</span>
          </motion.div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-4 text-foreground">Как это работает</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-xl mx-auto">Три простых шага к прозрачному сотрудничеству</p>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Подключите дизайнеров", desc: "Добавьте дизайнеров и установите индивидуальные условия бонусов для каждого", step: "01" },
              { icon: Store, title: "Они приводят клиентов", desc: "Дизайнеры направляют клиентов в ваш магазин и фиксируют продажи в системе", step: "02" },
              { icon: Calculator, title: "Система считает бонусы", desc: "Автоматический расчёт, подтверждение и отслеживание всех выплат с комиссиями", step: "03" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}
                className="bg-card rounded-2xl p-8 border border-border shadow-card text-center relative">
                <span className="absolute top-4 right-4 text-4xl font-bold text-muted/20">{item.step}</span>
                <div className="mx-auto w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <item.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">{item.title}</h3>
                <p className="text-muted-foreground text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-foreground">Почему Kvadred</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "Прозрачность выплат", desc: "Полная история всех операций и бонусов в одном месте" },
              { icon: TrendingUp, title: "Геймификация", desc: "Мотивируйте дизайнеров автоматическим ростом бонусного процента" },
              { icon: Box, title: "Каталог 3D моделей", desc: "Загружайте 3D файлы товаров для удобства дизайнеров" },
              { icon: Calculator, title: "Автоматический расчёт", desc: "Бонусы и комиссии рассчитываются по вашим правилам" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-xl border border-border bg-card hover:border-primary/50 transition-colors">
                <item.icon className="h-6 w-6 text-primary mb-3" />
                <h3 className="font-semibold mb-1 text-foreground">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-12 text-foreground">Тарифы</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card rounded-2xl border-2 border-primary p-8 shadow-card relative">
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Популярный</span>
              <Store className="h-8 w-8 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Для магазинов</h3>
              <div className="text-4xl font-bold text-primary mb-1">25 000 ₸<span className="text-base font-normal text-muted-foreground">/мес</span></div>
              <p className="text-sm text-muted-foreground mb-6">+ 5% комиссия с каждой выплаты бонуса</p>
              <ul className="text-sm text-left space-y-2.5 mb-8">
                {["Полный доступ ко всем функциям", "Неограниченное количество дизайнеров", "Каталог товаров и 3D моделей", "Геймификация и автоматический расчёт", "Аналитика и отчёты"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button className="w-full gradient-primary text-primary-foreground">Начать</Button></Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
              className="bg-card rounded-2xl border border-border p-8">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold mb-2 text-foreground">Для дизайнеров</h3>
              <div className="text-4xl font-bold text-foreground mb-1">Бесплатно</div>
              <p className="text-sm text-muted-foreground mb-6">Навсегда</p>
              <ul className="text-sm text-left space-y-2.5 mb-8">
                {["Доступ ко всем магазинам платформы", "Просмотр каталогов и 3D моделей", "Отслеживание бонусов и выплат", "Подача заявок на продажи"].map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-foreground"><CheckCircle2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />{f}</li>
                ))}
              </ul>
              <Link to="/auth?mode=signup"><Button variant="outline" className="w-full">Зарегистрироваться</Button></Link>
            </motion.div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <img src={kvadredLogo} alt="Kvadred" className="h-6 w-6 object-contain" />
            <span className="font-semibold text-foreground">Kvadred</span>
          </div>
          <p className="text-sm text-muted-foreground">info@kvadred.kz</p>
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} Kvadred. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}
