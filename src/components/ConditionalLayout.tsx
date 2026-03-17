"use client";

import { usePathname } from "next/navigation";
import Navigation from "./Navigation";
import Footer from "./Footer";

export default function ConditionalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  // Check if current route is an auth page
  const isAuthPage = pathname?.startsWith("/auth");

  if (isAuthPage) {
    // Auth pages: no navigation or footer, full screen layout
    return <>{children}</>;
  }

  // Regular pages: include navigation and footer
  return (
    <>
      <Navigation />
      <main className="flex-1 bg-white text-gray-900">{children}</main>
      <Footer />
    </>
  );
}
