import type { Metadata } from "next";
import { Manrope, Inter, Special_Elite, Caveat } from "next/font/google";
import { UserProvider } from "@/contexts/UserContext";
import { AmbientLightOverlay } from "@/components/AmbientLightOverlay";
import "./globals.css";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const specialElite = Special_Elite({
  variable: "--font-typewriter",
  subsets: ["latin"],
  weight: ["400"],
});

const caveat = Caveat({
  variable: "--font-handwriting",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "EchoDrop | Sensory Digital Postcards",
  description:
    "Archive your wandering experiences and send them as anonymous digital postcards to strangers in your city.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${manrope.variable} ${inter.variable} ${specialElite.variable} ${caveat.variable} font-sans antialiased`}>
        <div className="app-background relative z-[1]">
          <AmbientLightOverlay />
          <div className="relative z-[2]">
            <UserProvider>{children}</UserProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
