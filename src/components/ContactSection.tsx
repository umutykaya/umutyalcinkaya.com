import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Mail, Github, Linkedin, Twitter, MessageCircle, Calendar, FileText, Hand, Clock } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

const WA_NUMBER = "31621574053";

const socials = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const { t } = useTranslation();
  const [quickAction, setQuickAction] = useState<string | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  const isBusinessHours = useMemo(() => {
    const now = new Date();
    const day = now.getUTCDay();
    const hour = now.getUTCHours() + 1; // CET = UTC+1 (simplified)
    return day >= 1 && day <= 5 && hour >= 9 && hour < 18;
  }, []);

  const handleWhatsApp = (data: ContactFormValues) => {
    const text = `*${data.subject}*\n\nName: ${data.name}\nEmail: ${data.email}\n\n${data.message}`;
    window.open(
      `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleEmail = (data: ContactFormValues) => {
    const subject = encodeURIComponent(data.subject);
    const body = encodeURIComponent(`Name: ${data.name}\nEmail: ${data.email}\n\n${data.message}`);
    window.open(`mailto:hello@example.com?subject=${subject}&body=${body}`);
  };

  const handleQuickAction = (action: string) => {
    setQuickAction(action);
    form.setValue("subject", action);
  };

  const quickActions = [
    { key: "bookAppointment", icon: Calendar },
    { key: "requestQuote", icon: FileText },
    { key: "sayHello", icon: Hand },
  ];

  return (
    <section id="contact" className="py-32 border-t border-border/30">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-sm font-mono text-accent mb-3">{t("contact.label")}</p>
          <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-6">
            {t("contact.title1")}<br />
            <span className="text-gradient">{t("contact.title2")}</span>
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            {t("contact.subtitle")}
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <form
            onSubmit={form.handleSubmit(handleWhatsApp)}
            className="lg:col-span-3 space-y-4"
          >
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("contact.name")}
                </label>
                <input
                  {...form.register("name")}
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={t("contact.namePlaceholder")}
                />
                {form.formState.errors.name && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.name.message}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  {t("contact.email")}
                </label>
                <input
                  {...form.register("email")}
                  type="email"
                  className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                  placeholder={t("contact.emailPlaceholder")}
                />
                {form.formState.errors.email && (
                  <p className="text-xs text-destructive mt-1">{form.formState.errors.email.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("contact.subject")}
              </label>
              <input
                {...form.register("subject")}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
                placeholder={t("contact.subjectPlaceholder")}
              />
              {form.formState.errors.subject && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.subject.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">
                {t("contact.message")}
              </label>
              <textarea
                {...form.register("message")}
                rows={4}
                className="w-full px-3 py-2.5 rounded-lg border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder={t("contact.messagePlaceholder")}
              />
              {form.formState.errors.message && (
                <p className="text-xs text-destructive mt-1">{form.formState.errors.message.message}</p>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors"
              >
                <MessageCircle size={18} />
                {t("contact.sendWhatsApp")}
              </button>
              <button
                type="button"
                onClick={form.handleSubmit(handleEmail)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground text-sm font-medium hover:bg-secondary transition-colors"
              >
                <Mail size={18} />
                {t("contact.sendEmail")}
              </button>
            </div>
          </form>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick actions */}
            <div>
              <h3 className="text-sm font-medium text-foreground mb-3">{t("contact.quickActions")}</h3>
              <div className="space-y-2">
                {quickActions.map(({ key, icon: Icon }) => (
                  <button
                    key={key}
                    onClick={() => handleQuickAction(t(`contact.${key}`))}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all duration-200 ${
                      quickAction === t(`contact.${key}`)
                        ? "border-accent/50 bg-accent/10 text-accent"
                        : "border-border/50 bg-card text-foreground hover:border-accent/30"
                    }`}
                  >
                    <Icon size={16} />
                    {t(`contact.${key}`)}
                  </button>
                ))}
              </div>
            </div>

            {/* Business hours */}
            <div className="p-4 rounded-xl border border-border/50 bg-card">
              <div className="flex items-center gap-2 mb-3">
                <Clock size={16} className="text-muted-foreground" />
                <h3 className="text-sm font-medium text-foreground">{t("contact.businessHours")}</h3>
              </div>
              <div className="space-y-1 text-sm text-muted-foreground">
                <p>{t("contact.monFri")}</p>
                <p>{t("contact.weekend")}</p>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`w-2 h-2 rounded-full ${isBusinessHours ? "bg-green-500" : "bg-muted-foreground"}`} />
                <span className={`text-xs font-medium ${isBusinessHours ? "text-green-500" : "text-muted-foreground"}`}>
                  {isBusinessHours ? t("contact.available") : t("contact.unavailable")}
                </span>
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-3">
              {socials.map(({ icon: Icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-10 h-10 rounded-lg border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-200"
                >
                  <Icon size={18} />
                </a>
              ))}
              <a
                href={`https://wa.me/${WA_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="w-10 h-10 rounded-lg border border-border/50 bg-card flex items-center justify-center text-muted-foreground hover:text-green-500 hover:border-green-500/30 transition-all duration-200"
              >
                <MessageCircle size={18} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
