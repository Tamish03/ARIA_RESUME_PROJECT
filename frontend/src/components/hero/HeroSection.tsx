"use client";

import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Button } from "../ui/Button";
import Link from "next/link";
import { NeuralParticles } from "../visualizations/NeuralParticles";

export function HeroSection() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      <NeuralParticles />
      
      <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-4xl mx-auto mt-[-10vh]">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 text-accent-blue text-sm font-semibold mb-6">
            <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse-glow" />
            V1.0 System Online
          </div>
          
          <h1 className="font-display font-extrabold text-7xl md:text-9xl tracking-tight mb-4 text-gradient-blue">
            ARIA
          </h1>
          
          <p className="text-xl md:text-2xl text-text-muted font-light max-w-2xl mx-auto leading-relaxed">
            Adaptive Recommendation Intelligence Architecture
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="flex flex-wrap justify-center gap-8 my-12"
        >
          <div className="flex flex-col items-center">
            <span className="font-mono text-3xl font-bold text-white">568</span>
            <span className="text-sm text-text-muted uppercase tracking-wider mt-1">Users</span>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-mono text-3xl font-bold text-white">1,682</span>
            <span className="text-sm text-text-muted uppercase tracking-wider mt-1">Movies</span>
          </div>
          <div className="w-px h-12 bg-border hidden sm:block" />
          <div className="flex flex-col items-center">
            <span className="font-mono text-3xl font-bold text-accent-amber">0.9345</span>
            <span className="text-sm text-text-muted uppercase tracking-wider mt-1">Swarm AUC</span>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Link href="/dashboard">
            <Button size="lg" glow className="px-10 py-6 text-lg rounded-xl">
              Enter the System
            </Button>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-text-muted"
      >
        <ChevronDown className="w-8 h-8 opacity-50" />
      </motion.div>
    </div>
  );
}
