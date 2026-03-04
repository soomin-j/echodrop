"use client";

import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (user === null) {
      router.replace("/onboarding");
    }
  }, [user, router]);

  if (!user) return null;

  return (
    <div className="flex min-h-screen">
      <div className="flex min-w-0 flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto py-14 px-10 lg:py-16 lg:px-14">{children}</main>
      </div>
    </div>
  );
}
