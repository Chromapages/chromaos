"use client";

import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/login";

  return (
    <>
      {!isLoginPage && <Sidebar />}
      <main className={`flex-1 overflow-y-auto min-h-screen ${isLoginPage ? '' : 'bg-muted/20'}`}>
        {children}
      </main>
    </>
  );
}
