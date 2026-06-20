import { Layout } from "@/components/layout/Layout";
import { HeroSection } from "@/components/home/HeroSection";
import { ListingsBrowseSection } from "@/components/home/ListingsBrowseSection";
import { CTASection } from "@/components/home/CTASection";

export default function Index() {
  return (
    <Layout>
      <HeroSection />
      <ListingsBrowseSection />
      <CTASection />
    </Layout>
  );
}
