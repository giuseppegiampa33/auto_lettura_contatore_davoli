"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Check, Download, FileText, ArrowLeft, User, Calendar, Hash, ArrowRight, Home } from "lucide-react";
import { useState, Suspense, useEffect } from "react";

function ConfirmContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "N/D";
    const utente = searchParams.get("utente") || "Utente";
    const dateParam = searchParams.get("date");

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Format date
    const dateObj = dateParam ? new Date(dateParam) : new Date();
    const dateFormatted = new Intl.DateTimeFormat("it-IT", {
        day: "2-digit",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dateObj);

    return (
        <div className="animate-fade-in">

            {/* ── Hero header (Same as submit page) ── */}
            <section
                style={{
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    padding: "8vh 32px 6vh",
                    textAlign: "center",
                }}
            >
                <div style={{ maxWidth: 1000, margin: "0 auto" }}>
                    <div
                        style={{
                            width: 80,
                            height: 80,
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 24px",
                            boxShadow: "0 8px 24px rgba(37,99,235,0.15)",
                            position: "relative"
                        }}
                    >
                        <div style={{ position: "absolute", inset: -4, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.5)" }}></div>
                        <Check style={{ width: 40, height: 40, color: "#2563eb" }} strokeWidth={3} className="animate-fade-in-up" />
                    </div>

                    <h1
                        style={{
                            fontSize: "clamp(2rem, 5vw, 3rem)",
                            fontWeight: 800,
                            color: "#1e293b",
                            lineHeight: 1.1,
                            marginBottom: 16,
                            letterSpacing: "-0.02em"
                        }}
                    >
                        Autolettura Inviata!
                    </h1>

                    <p
                        style={{
                            fontSize: "1.2rem",
                            color: "#64748b",
                            maxWidth: 600,
                            margin: "0 auto",
                            lineHeight: 1.6,
                        }}
                    >
                        La tua pratica è stata registrata con successo. <br className="hidden md:block" />
                        Riceverai a breve un’email di conferma.
                    </p>
                </div>
            </section>

            {/* ── Content body ── */}
            <section style={{ background: "#f8fafc", padding: "6vh 32px 10vh" }}>
                <div style={{ maxWidth: 720, margin: "0 auto" }}>

                    {/* ── Summary Card ── */}
                    <div
                        className="animate-slide-down"
                        style={{
                            background: "#fff",
                            borderRadius: 24,
                            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                            padding: "clamp(32px, 5vw, 48px)",
                            marginBottom: 40,
                            border: "1px solid #fff",
                        }}
                    >
                        {/* Codice Pratica */}
                        <div style={{ textAlign: "center", marginBottom: 32, paddingBottom: 24, borderBottom: "1px solid #f1f5f9" }}>
                            <span style={{
                                display: "inline-block",
                                fontSize: 12,
                                fontWeight: 700,
                                textTransform: "uppercase",
                                letterSpacing: "0.1em",
                                color: "#94a3b8",
                                marginBottom: 8
                            }}>
                                Codice Pratica
                            </span>
                            <div style={{
                                fontSize: "clamp(1.8rem, 4vw, 2.4rem)",
                                fontWeight: 700,
                                fontFamily: "monospace",
                                color: "#2563eb",
                                letterSpacing: "0.05em"
                            }}>
                                {id}
                            </div>
                        </div>

                        {/* Dati Griglia */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 24, marginBottom: 40 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <User style={{ width: 20, height: 20, color: "#64748b" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8" }}>Utente</div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>{utente}</div>
                                </div>
                            </div>
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: 12, background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                    <Calendar style={{ width: 20, height: 20, color: "#64748b" }} />
                                </div>
                                <div>
                                    <div style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", color: "#94a3b8" }}>Data Invio</div>
                                    <div style={{ fontSize: 15, fontWeight: 600, color: "#334155" }}>{dateFormatted}</div>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div style={{ position: "relative", padding: "0 10px", marginBottom: 40 }}>
                            {/* Linea base */}
                            <div style={{ position: "absolute", top: 14, left: 0, right: 0, height: 4, background: "#f1f5f9", borderRadius: 4, zIndex: 0 }}></div>
                            {/* Linea progresso */}
                            <div style={{ position: "absolute", top: 14, left: 0, width: "33%", height: 4, background: "#2563eb", borderRadius: 4, zIndex: 0 }}></div>

                            <div style={{ display: "flex", justifyContent: "space-between", position: "relative", zIndex: 1 }}>
                                {/* Step 1 */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, boxShadow: "0 0 0 4px #fff" }}>1</div>
                                    <span style={{ fontSize: 12, fontWeight: 700, color: "#2563eb" }}>Inviato</span>
                                </div>
                                {/* Step 2 */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, boxShadow: "0 0 0 4px #fff" }}>2</div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>In Lavorazione</span>
                                </div>
                                {/* Step 3 */}
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                                    <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#e2e8f0", color: "#94a3b8", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 14, boxShadow: "0 0 0 4px #fff" }}>3</div>
                                    <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8" }}>Validato</span>
                                </div>
                            </div>
                        </div>

                        {/* Ricevuta */}
                        <div style={{
                            background: "#f8fafc",
                            borderRadius: 16,
                            padding: 20,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            border: "1px solid #e2e8f0",
                            cursor: "pointer",
                            transition: "all 0.2s"
                        }}
                            className="hover:border-blue-300 hover:bg-blue-50/30 group"
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                                <div style={{ width: 40, height: 40, borderRadius: 10, background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", border: "1px solid #e2e8f0" }} className="group-hover:text-red-500 group-hover:border-red-100">
                                    <FileText style={{ width: 20, height: 20 }} />
                                </div>
                                <div style={{ textAlign: "left" }}>
                                    <div style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Ricevuta di Invio</div>
                                    <div style={{ fontSize: 12, color: "#94a3b8" }}>Scarica riepilogo PDF</div>
                                </div>
                            </div>
                            <button style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 16px",
                                background: "#fff",
                                border: "1px solid #cbd5e1",
                                borderRadius: 8,
                                fontSize: 13,
                                fontWeight: 600,
                                color: "#475569"
                            }}
                                className="group-hover:border-blue-500 group-hover:text-blue-600"
                            >
                                <Download style={{ width: 14, height: 14 }} />
                                Scarica
                            </button>
                        </div>
                    </div>

                    {/* ── Actions ── */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 480, margin: "0 auto" }}>
                        <Link
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: "#2563eb",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "16px 32px",
                                borderRadius: 14,
                                fontSize: 16,
                                textDecoration: "none",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                transition: "all 0.2s",
                                width: "100%"
                            }}
                        >
                            <Home style={{ width: 18, height: 18 }} />
                            Torna alla Home
                        </Link>
                        <Link
                            href="/submit"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: "#fff",
                                color: "#2563eb",
                                fontWeight: 600,
                                padding: "16px 32px",
                                borderRadius: 14,
                                fontSize: 16,
                                textDecoration: "none",
                                border: "2px solid rgba(37,99,235,0.15)",
                                transition: "all 0.2s",
                                width: "100%"
                            }}
                            className="hover:bg-blue-50 hover:border-blue-200"
                        >
                            Invia Nuova Autolettura
                            <ArrowRight style={{ width: 18, height: 18 }} />
                        </Link>

                        <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginTop: 12, lineHeight: 1.5 }}>
                            Hai bisogno di aiuto? Contatta l’assistenza comunale.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense
            fallback={
                <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#f8fafc" }}>
                    Un attimo...
                </div>
            }
        >
            <ConfirmContent />
        </Suspense>
    );
}
