import { Inter, JetBrains_Mono, Noto_Sans_Bengali } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";


const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const bangla = Noto_Sans_Bengali({ subsets: ["bengali"], variable: "--font-bangla", display: "swap" });

export const metadata = {
  title: "BornoCode - Programming, in a language that feels closer to home",
  description:
    "BornoCode is a Bangla-inspired programming language. Learn the basics, write your first program and experiment in the online playground.",
};

const themeScript = `
try {
  var t = localStorage.getItem("theme");
  var dark = t ? t === "dark" : true;
  if (dark) document.documentElement.classList.add("dark");
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${jetbrains.variable} ${bangla.variable} bg-slate-50 dark:bg-[#05050f]`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-dvh font-sans text-slate-900 antialiased dark:text-slate-100">
        <Navbar />

        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}