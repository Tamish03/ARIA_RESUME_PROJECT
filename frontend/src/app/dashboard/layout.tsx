"use client";

import { ReactNode } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { TopBar } from "@/components/layout/TopBar";
import { ActiveUserProvider } from "@/context/ActiveUserContext";
import { NeuralFlowBackground } from "@/components/visualizations/NeuralFlowBackground";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ActiveUserProvider>
      <div className="flex min-h-screen bg-bg-base text-text">
        {/* Cinematic Three.js background behind all dashboard content */}
        <div className="fixed inset-0 z-0">
          <NeuralFlowBackground />
        </div>

        <Sidebar />
        <div className="flex-1 ml-64 flex flex-col min-h-screen relative z-10">
          <TopBar />
          <main className="flex-1 p-8 overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </div>
    </ActiveUserProvider>
  );
}

