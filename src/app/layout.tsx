import type { Metadata } from "next";
import { Heebo } from "next/font/google";
import "./globals.css";
import ConditionalLayout from "@/components/ConditionalLayout";

const heebo = Heebo({
  subsets: ["latin"],
  variable: "--font-heebo",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "MedTech Virtual Laboratory - SMU",
  description:
    "Interactive virtual laboratory platform for STEM education at SMU (Mediterranean Institution of Technology). Explore physics simulations and enhance your learning experience.",
  keywords: "virtual laboratory, physics, education, SMU, STEM, simulations",
  authors: [{ name: "SMU MedTech Team" }],
  openGraph: {
    title: "MedTech Virtual Laboratory - SMU",
    description: "Interactive virtual laboratory platform for STEM education",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white text-gray-900">
      <body
        className={`${heebo.variable} font-sans antialiased min-h-screen flex flex-col bg-white text-gray-900`}
      >
        <ConditionalLayout>{children}</ConditionalLayout>
      </body>
    </html>
  );
}
