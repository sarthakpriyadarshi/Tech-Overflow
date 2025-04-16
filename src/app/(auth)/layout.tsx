import type React from "react";
import ClientLayout from "./ClientLayout";

export const metadata = {
  title: "Login or Register | Tech Overflow",
  description:
    "Tech Overflow is a platform for developers to ask and answer questions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <ClientLayout>{children}</ClientLayout>;
}
