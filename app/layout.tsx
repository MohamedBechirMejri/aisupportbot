import "./globals.css";

import { Nunito } from "next/font/google";

const nunito = Nunito({ subsets: ["latin"] });

export const metadata = {
  title: "AI Support Chatbot",
  description: "Customer support chatbot powered by AI.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div
          className="h-[100svh] overflow-hidden bg-white bg-opacity-50 pt-8 backdrop-blur"
          style={nunito.style}
        >
          {children}
        </div>
      </body>
    </html>
  );
}
