import { Inter } from "next/font/google";
import "./globals.css";

// 🔥 Font setup (better performance)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className={`${inter.className} min-h-full flex flex-col bg-gray-50 text-gray-800`}>
        {children}
      </body>
    </html>
  );
}