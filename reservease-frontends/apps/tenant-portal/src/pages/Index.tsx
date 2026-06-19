import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ValueSection } from "@/components/home/ValueSection";
import { HowItWorksSection } from "@/components/home/HowItWorksSection";
import { CTASection } from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <ValueSection />
      <HowItWorksSection />
      <CTASection />
    </Layout>
  );
}
