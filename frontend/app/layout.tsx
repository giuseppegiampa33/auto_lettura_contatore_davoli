import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Autolettura Contatore | Comune di Davoli",
  description:
    "Servizio di autolettura del contatore idrico per i cittadini del Comune di Davoli. Invia la tua lettura in modo semplice e sicuro.",
  keywords: ["autolettura", "contatore", "Davoli", "acqua", "lettura"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
