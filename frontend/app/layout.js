import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

// Body font - Clean & Readable
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

// Heading font - Sophisticated & Expensive
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata = {
  title: "Sunset Plaza | Premium Office Spaces",
  description: "Modern professional workspaces designed for success.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans bg-[#f7f3ef] text-slate-900 antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
