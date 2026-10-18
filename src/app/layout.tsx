import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://nk-wedding.vercel.app"
  ),
  title: "Kevin + Nica | January 9, 2027 * Villa Elisa Botolan, Zambales",
  description:
    "You are invited to celebrate Kevin and Nica's beachfront wedding on Saturday, January 9, 2027 at Villa Elisa Botolan, Zambales. Explore the Save the Date calendar, Resort Chic dress code, The Game Plan timeline, travel routes, nearby stays, and RSVP.",
  openGraph: {
    title: "Kevin + Nica Wedding Invitation | January 9, 2027",
    description:
      "Meet us in Zambales! Saturday, January 9, 2027 at Villa Elisa Botolan, Zambales.",
    images: ["/assets/pages/page_1.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased scroll-smooth"
    >
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col bg-[#122017] text-stone-100"
      >
        {children}
      </body>
    </html>
  );
}
