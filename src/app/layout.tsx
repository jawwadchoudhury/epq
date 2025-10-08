import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Steganography EPQ",
  description: "Created entirely by Jawwad Choudhury, find me on GitHub at jawwadchoudhury/epq",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
