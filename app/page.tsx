import HeroSection from "@/app/components/home/HeroSection";
import FAQSection from "@/app/components/home/FAQSection";
import ResourcesSection from "@/app/components/home/ResourcesSection";
import ScrollReveal from "@/app/components/layout/ScrollReveal";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-screen">
      <HeroSection />
      <ScrollReveal delay={60}><FAQSection /></ScrollReveal>
      <ScrollReveal delay={60}><ResourcesSection /></ScrollReveal>
    </main>
  );
}
