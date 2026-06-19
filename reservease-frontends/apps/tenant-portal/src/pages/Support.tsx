import { useState } from "react";
import { motion } from "framer-motion";
import {
  MessageCircle,
  Mail,
  Phone,
  Send,
  Loader2,
  MapPin,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/layout/Layout";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: MessageCircle,
    title: "WhatsApp",
    description: "Chat with us instantly",
    value: "+233 XX XXX XXXX",
    href: "https://wa.me/1234567890",
    color: "bg-emerald-50 text-emerald-600 border-emerald-100",
  },
  {
    icon: Mail,
    title: "Email",
    description: "We'll respond within 24 hours",
    value: "support@reservease.com",
    href: "mailto:support@reservease.com",
    color: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: Phone,
    title: "Phone",
    description: "Mon-Fri, 9am-5pm GMT",
    value: "+233 XX XXX XXXX",
    href: "tel:+1234567890",
    color: "bg-primary/10 text-primary border-primary/20",
  },
];

export default function Support() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setLoading(false);
    toast({
      title: "Message Sent!",
      description: "We'll get back to you within 24 hours",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <Layout>
      <div className="relative min-h-screen overflow-hidden">
        {/* Simple Background decorations */}
        <div className="absolute inset-0 bg-background pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-[-10%] w-[50%] h-[50%] bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute top-[30%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
        </div>

        {/* Hero Section */}
        <section className="relative pt-24 pb-12 md:pt-32 md:pb-16 px-4">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-3xl mx-auto text-center relative z-10"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-6 border border-primary/20 text-primary">
                <MessageCircle className="h-8 w-8" />
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-foreground mb-6 tracking-tight">
                How can we help?
              </h1>
              <p className="text-lg text-muted-foreground font-medium max-w-xl mx-auto">
                Have questions or need assistance with your search? Our team of experts is ready to support you every step of the way.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Contact Grid */}
        <section className="relative py-12 px-4 z-10">
          <div className="container">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {contactMethods.map((method, index) => (
                <motion.a
                  key={method.title}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-8 hover:border-primary/40 transition-all duration-300 text-center flex flex-col items-center group"
                >
                  <div
                    className={cn("flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-lg mb-6 border transition-colors", method.color)}
                  >
                    <method.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {method.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-6 flex-1">
                    {method.description}
                  </p>
                  <div className="font-semibold text-foreground bg-muted/50 px-4 py-2 rounded-lg w-full">
                    {method.value}
                  </div>
                </motion.a>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="relative py-24 md:py-32 px-4">
          <div className="container">
            <div className="grid lg:grid-cols-2 gap-16 max-w-6xl mx-auto items-start">
              {/* Info Column */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-12"
              >
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-lg bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
                    <MapPin className="h-3.5 w-3.5" />
                    Our Headquarters
                  </div>
                  <h2 className="text-4xl font-black text-foreground mb-8 tracking-tight">
                    Visit our studio.
                  </h2>
                  <div className="bg-card border border-border rounded-2xl p-8 space-y-8">
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0 text-primary">
                        <MapPin className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">Address</h4>
                        <p className="text-muted-foreground font-medium">
                          123 University Avenue, East Legon
                          <br />
                          Accra, Ghana
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 flex-shrink-0 text-primary">
                        <Clock className="h-6 w-6" />
                      </div>
                      <div>
                        <h4 className="text-lg font-bold text-foreground mb-1">
                          Working Hours
                        </h4>
                        <p className="text-muted-foreground font-medium">
                          Monday - Friday: 9:00 AM - 5:00 PM
                          <br />
                          Saturday: 10:00 AM - 2:00 PM
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <motion.div
                  className="bg-primary/5 border border-primary/20 p-8 rounded-2xl text-foreground overflow-hidden relative"
                >
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold mb-3">
                      Need Urgent Help?
                    </h3>
                    <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                      For immediate assistance regarding a pending booking or urgent verification, chat with our prioritized support line.
                    </p>
                    <Button variant="default" className="w-full sm:w-auto h-12 px-6 rounded-xl" asChild>
                      <a href="https://wa.me/1234567890">
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Priority Chat
                      </a>
                    </Button>
                  </div>
                </motion.div>
              </motion.div>

              {/* Form Column */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-2xl p-8 md:p-10"
              >
                <div className="mb-8">
                  <h2 className="text-3xl font-extrabold text-foreground mb-2">
                    Send a message
                  </h2>
                  <p className="text-muted-foreground">Use the form below and we'll reply to your email.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-sm font-bold ml-1 text-muted-foreground/80">Full Name</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        className="h-14 bg-background/50 border-border/40 focus:border-primary rounded-2xl px-6 font-medium transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-bold ml-1 text-muted-foreground/80">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="h-14 bg-background/50 border-border/40 focus:border-primary rounded-2xl px-6 font-medium transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-sm font-bold ml-1 text-muted-foreground/80">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="About my Search Request..."
                      value={formData.subject}
                      onChange={handleChange}
                      className="h-14 bg-background/50 border-border/40 focus:border-primary rounded-2xl px-6 font-medium transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-bold ml-1 text-muted-foreground/80">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell us everything..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="bg-background/50 border-border/40 focus:border-primary rounded-2xl p-6 font-medium transition-all resize-none"
                    />
                  </div>
                  <Button type="submit" size="lg" className="w-full rounded-xl h-14 font-semibold text-base transition-all" disabled={loading}>
                    {loading ? (
                      <>
                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                        Transmitting...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Inquiry
                      </>
                    )}
                  </Button>
                </form>
              </motion.div>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
