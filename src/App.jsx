import { useState } from "react";
import Nav from "./components/Nav";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Experience from "./components/Experience";
import Projects from "./components/Projects";
import Skills from "./components/Skills";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import BusinessCard from "./components/BusinessCard";
import { useLenis } from "./lib/useLenis";

export default function App() {
  useLenis();
  const [cardOpen, setCardOpen] = useState(false);

  return (
    <div className="relative min-h-screen bg-[#0a0a0c] text-zinc-100">
      <Nav onOpenCard={() => setCardOpen(true)} />
      <main>
        <Hero />
        <Marquee />
        <About />
        <Experience />
        <Projects />
        <Skills />
        <Contact />
      </main>
      <Footer />
      <BusinessCard open={cardOpen} onClose={() => setCardOpen(false)} />
    </div>
  );
}
