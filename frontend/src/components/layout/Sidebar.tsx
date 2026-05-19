"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, Compass, Map, Activity, Database, BarChart3, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { useActiveUser } from "@/context/ActiveUserContext";

const navItems = [
  { name: "Overview", href: "/dashboard", icon: Home },
  { name: "Recommendations", href: "/dashboard/recommendations", icon: Compass },
  { name: "Taste Map", href: "/dashboard/taste-map", icon: Map },
  { name: "Swarm Intelligence", href: "/dashboard/swarm", icon: Activity },
  { name: "Dream Memory", href: "/dashboard/dream-memory", icon: Database },
  { name: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
];

export function Sidebar() {
  const pathname = usePathname();
  const { activeUserId } = useActiveUser();
  const userName = activeUserId === 943 ? "Rahul L." : `User ${activeUserId}`;
  const userInitials = activeUserId === 943 ? "RL" : `U${activeUserId}`;

  return (
    <div className="w-64 border-r border-border bg-bg-base/50 backdrop-blur-xl h-screen flex flex-col fixed left-0 top-0 z-40">
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-accent-blue via-accent-violet to-accent-teal flex items-center justify-center font-display font-bold text-white">

            A
          </div>
          <span className="font-display font-bold text-xl tracking-wider">ARIA</span>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1">
        <div className="text-xs font-semibold text-text-muted mb-4 px-2 uppercase tracking-wider">
          Intelligence Core
        </div>
        
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative",
                isActive ? "text-white" : "text-text-muted hover:text-white hover:bg-bg-card"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-bg-card border border-border rounded-lg"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              
              <item.icon className={cn("w-5 h-5 relative z-10", isActive && "text-accent-blue")} />
              <span className="font-medium text-sm relative z-10">{item.name}</span>
              
              {isActive && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-accent-blue rounded-r-full"
                  initial={false}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
            </Link>
          );
        })}
      </div>

      <div className="p-4 border-t border-border mt-auto">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-muted hover:text-white hover:bg-bg-card transition-colors"
        >
          <Settings className="w-5 h-5" />
          <span className="font-medium text-sm">Settings</span>
        </Link>
        <div className="mt-4 pt-4 border-t border-border flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-bg-surface border border-border flex items-center justify-center text-xs font-medium uppercase">
            {userInitials}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-[120px]">{userName}</span>
            <span className="text-xs text-text-muted">ID: {activeUserId}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
