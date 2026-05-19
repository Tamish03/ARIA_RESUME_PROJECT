"use client";

import React, { createContext, useContext, useState } from "react";

interface ActiveUserContextType {
  activeUserId: number;
  setActiveUserId: (id: number) => void;
}

const ActiveUserContext = createContext<ActiveUserContextType>({
  activeUserId: 943,
  setActiveUserId: () => {},
});

export function ActiveUserProvider({ children }: { children: React.ReactNode }) {
  const [activeUserId, setActiveUserIdState] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("aria_active_user_id");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed)) {
          return parsed;
        }
      }
    }
    return 943;
  });

  const setActiveUserId = (id: number) => {
    window.localStorage.setItem("aria_active_user_id", id.toString());
    setActiveUserIdState(id);
    // Dispatch a custom event to notify other components/hooks
    window.dispatchEvent(new Event("active_user_changed"));
  };

  return (
    <ActiveUserContext.Provider value={{ activeUserId, setActiveUserId }}>
      {children}
    </ActiveUserContext.Provider>
  );
}

export function useActiveUser() {
  return useContext(ActiveUserContext);
}
