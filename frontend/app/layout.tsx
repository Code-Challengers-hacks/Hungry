import type { Metadata } from "next";
import "./globals.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";
import { AuthContextProvider } from "./Context/authContext";
import { MenuContextProvider } from "./Context/menuContext";
import { FeedbackContextProvider } from "./Context/feedbackContext";
import { CartsContextProvider } from "./Context/cartContext";
import { OrderedContextProvider } from "./Context/orderedContext";
import { SellerOrdersContextProvider } from "./Context/sellerOrderContext";
import {ParticleBackground }from "../public/particleBg";
export const metadata: Metadata = {
  title: "Hungry",
  description: "Hungry : Food ordering app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <MantineProvider>
          <AuthContextProvider>
            <MenuContextProvider>
              <CartsContextProvider>
                <FeedbackContextProvider>
                  <OrderedContextProvider>
                    <SellerOrdersContextProvider>
                      <ParticleBackground />
                      {children}
                    </SellerOrdersContextProvider>
                  </OrderedContextProvider>
                </FeedbackContextProvider>
              </CartsContextProvider>
            </MenuContextProvider>
          </AuthContextProvider>
        </MantineProvider>
      </body>
    </html>
  );
}
