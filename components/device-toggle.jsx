"use client";

import { Monitor, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { useEffect, useState } from "react";

// Zustand store with persistence for device view
const useDeviceViewStore = create(
  persist(
    (set) => ({
      viewMode: "desktop",
      setViewMode: (mode) => set({ viewMode: mode }),
      toggleViewMode: () =>
        set((state) => ({
          viewMode: state.viewMode === "desktop" ? "mobile" : "desktop",
        })),
    }),
    {
      name: "deviceView", // Key for localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// Hook to wait for hydration
export function useDeviceView() {
  const [isHydrated, setIsHydrated] = useState(false);
  const store = useDeviceViewStore();

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return { ...store, isHydrated };
}

// Component to toggle between desktop and mobile view
export function DeviceViewToggle() {
  const { viewMode, toggleViewMode, isHydrated } = useDeviceView();

  // Render null or a fallback UI until hydration is complete
  if (!isHydrated) {
    return (
      <Button size="icon" variant="outline" disabled>
        <Monitor className="h-[1.2rem] w-[1.2rem] opacity-0" />
      </Button>
    );
  }

  return (
    <Button size="icon" variant="outline" onClick={toggleViewMode}>
      <Monitor
        className={`h-[1.2rem] w-[1.2rem] transition-all ${viewMode === "desktop" ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`}
      />
      <Smartphone
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${viewMode === "mobile" ? "rotate-0 scale-100" : "rotate-90 scale-0"}`}
      />
      <span className="sr-only">Toggle device view</span>
    </Button>
  );
}
