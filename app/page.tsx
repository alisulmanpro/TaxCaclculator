import HeroSection from "@/app/components/home/HeroSection";
import QuoteSection from "@/app/components/home/QuoteSection";
import ArticlesSection from "@/app/components/home/ArticlesSection";
import FAQSection from "@/app/components/home/FAQSection";
import ResourcesSection from "@/app/components/home/ResourcesSection";
import BottomCTA from "@/app/components/home/BottomCTA";
import ScrollReveal from "@/app/components/layout/ScrollReveal";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center w-screen">
      <HeroSection />
      <ScrollReveal><QuoteSection /></ScrollReveal>
      <ScrollReveal delay={60}><ArticlesSection /></ScrollReveal>
      <ScrollReveal delay={60}><FAQSection /></ScrollReveal>
      <ScrollReveal delay={60}><ResourcesSection /></ScrollReveal>
      <ScrollReveal delay={60}><BottomCTA /></ScrollReveal>
    </main>
  );
}
