import "~/styles/globals.css";

import { Inter } from "next/font/google";
import { StyledEngineProvider } from "@mui/material";
import { TRPCReactProvider } from "~/trpc/react";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "lacan: dream journal",
  description: "enhance your dreams with ai",
  icons: [{ rel: "icon", url: "/icon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`font-sans ${inter.variable}`}>
        <TRPCReactProvider>
          <StyledEngineProvider injectFirst>{children}</StyledEngineProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
