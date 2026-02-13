"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Upload, Home, Shield, Info, Settings } from "lucide-react";

const NAV_LINKS = [
    { label: "Il Servizio", href: "/#servizio", icon: Info },
    { label: "Come Funziona", href: "/#come-funziona", icon: Settings },
    { label: "Privacy", href: "/privacy", icon: Shield },
];

const BREAKPOINT = 768;

export default function Header() {
    const [open, setOpen] = useState(false);
    const pathname = usePathname();

    /* Close on route change */
    useEffect(() => { setOpen(false); }, [pathname]);

    /* Close on resize to desktop */
    useEffect(() => {
        const onResize = () => { if (window.innerWidth >= BREAKPOINT) setOpen(false); };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, []);

    /* Lock body scroll when drawer is open */
    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => { document.body.style.overflow = ""; };
    }, [open]);

    /* Detect mobile via matchMedia for consistent hiding */
    const [isMobile, setIsMobile] = useState(false);
    useEffect(() => {
        const mq = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
        setIsMobile(mq.matches);
        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        mq.addEventListener("change", handler);
        return () => mq.removeEventListener("change", handler);
    }, []);

    return (
        <>
            <header
                style={{
                    position: "sticky",
                    top: 0,
                    zIndex: 100,
                    background: "rgba(255,255,255,0.97)",
                    backdropFilter: "blur(12px)",
                    WebkitBackdropFilter: "blur(12px)",
                    borderBottom: "1px solid #e2e8f0",
                }}
            >
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        padding: "0 24px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        height: 68,
                    }}
                >
                    {/* ── Logo ── */}
                    <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none" }}>
                        <img
                            src="/stemma-davoli.png"
                            alt="Stemma del Comune di Davoli"
                            style={{ height: 40, width: "auto", objectFit: "contain" }}
                            onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                        <div style={{ lineHeight: 1.3 }}>
                            <span style={{ display: "block", fontSize: 15, fontWeight: 700, color: "#1e3a5f", letterSpacing: "-0.01em" }}>
                                Comune di Davoli
                            </span>
                            <span style={{ display: "block", fontSize: 11, color: "#64748b", fontWeight: 500 }}>
                                Servizio Autolettura Contatore
                            </span>
                        </div>
                    </Link>

                    {/* ── Desktop nav ── */}
                    {!isMobile && (
                        <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
                            {NAV_LINKS.map((l) => (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    style={{
                                        fontSize: 14,
                                        fontWeight: pathname === l.href ? 600 : 500,
                                        color: pathname === l.href ? "#2563eb" : "#64748b",
                                        textDecoration: "none",
                                        transition: "color 0.2s",
                                    }}
                                    onMouseEnter={(e) => ((e.target as HTMLElement).style.color = "#2563eb")}
                                    onMouseLeave={(e) => {
                                        (e.target as HTMLElement).style.color = pathname === l.href ? "#2563eb" : "#64748b";
                                    }}
                                >
                                    {l.label}
                                </Link>
                            ))}
                            <Link
                                href="/submit"
                                style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 8,
                                    background: "#2563eb",
                                    color: "#fff",
                                    fontSize: 14,
                                    fontWeight: 600,
                                    padding: "12px 28px",
                                    borderRadius: 12,
                                    textDecoration: "none",
                                    boxShadow: "0 4px 14px rgba(37,99,235,0.25)",
                                    transition: "all 0.2s",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                Invia Autolettura
                            </Link>
                        </nav>
                    )}

                    {/* ── Mobile burger button ── */}
                    {isMobile && (
                        <button
                            onClick={() => setOpen(!open)}
                            aria-label="Menu"
                            style={{
                                width: 44,
                                height: 44,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: open ? "#eff6ff" : "transparent",
                                border: "none",
                                borderRadius: 12,
                                cursor: "pointer",
                                transition: "background 0.2s",
                                position: "relative",
                                flexShrink: 0,
                            }}
                        >
                            <div style={{ width: 22, height: 16, position: "relative" }}>
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        width: 22,
                                        height: 2,
                                        borderRadius: 2,
                                        background: open ? "#2563eb" : "#374151",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        top: open ? 7 : 0,
                                        transform: open ? "rotate(45deg)" : "rotate(0)",
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        top: 7,
                                        width: 22,
                                        height: 2,
                                        borderRadius: 2,
                                        background: "#374151",
                                        transition: "all 0.2s",
                                        opacity: open ? 0 : 1,
                                    }}
                                />
                                <span
                                    style={{
                                        position: "absolute",
                                        left: 0,
                                        width: 22,
                                        height: 2,
                                        borderRadius: 2,
                                        background: open ? "#2563eb" : "#374151",
                                        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                        top: open ? 7 : 14,
                                        transform: open ? "rotate(-45deg)" : "rotate(0)",
                                    }}
                                />
                            </div>
                        </button>
                    )}
                </div>
            </header>

            {/* ── Overlay ── */}
            {isMobile && (
                <div
                    onClick={() => setOpen(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.35)",
                        backdropFilter: "blur(4px)",
                        WebkitBackdropFilter: "blur(4px)",
                        zIndex: 998,
                        opacity: open ? 1 : 0,
                        visibility: open ? "visible" : "hidden",
                        transition: "opacity 0.35s ease, visibility 0.35s ease",
                        pointerEvents: open ? "auto" : "none",
                    }}
                />
            )}

            {/* ── Right‐side drawer ── */}
            {isMobile && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: "min(320px, 85vw)",
                        zIndex: 999,
                        background: "#fff",
                        boxShadow: open ? "-8px 0 40px rgba(0,0,0,0.12)" : "none",
                        transform: open ? "translateX(0)" : "translateX(100%)",
                        transition: "transform 0.35s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.35s",
                        display: "flex",
                        flexDirection: "column",
                        overflowY: "auto",
                    }}
                >
                    {/* Drawer header */}
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            padding: "20px 24px",
                            borderBottom: "1px solid #f1f5f9",
                        }}
                    >
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#1e293b" }}>Menu</span>
                        <button
                            onClick={() => setOpen(false)}
                            aria-label="Chiudi menu"
                            style={{
                                width: 36,
                                height: 36,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                background: "#f1f5f9",
                                border: "none",
                                borderRadius: 10,
                                cursor: "pointer",
                                transition: "background 0.2s",
                                fontSize: 18,
                                color: "#64748b",
                                fontWeight: 600,
                            }}
                        >
                            ✕
                        </button>
                    </div>

                    {/* Nav links */}
                    <nav style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
                        <Link
                            href="/"
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 14,
                                padding: "14px 16px",
                                borderRadius: 14,
                                textDecoration: "none",
                                fontSize: 15,
                                fontWeight: pathname === "/" ? 600 : 500,
                                color: pathname === "/" ? "#2563eb" : "#374151",
                                background: pathname === "/" ? "#eff6ff" : "transparent",
                                transition: "all 0.2s",
                            }}
                        >
                            <div
                                style={{
                                    width: 38,
                                    height: 38,
                                    borderRadius: 10,
                                    background: pathname === "/" ? "#dbeafe" : "#f1f5f9",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    flexShrink: 0,
                                }}
                            >
                                <Home style={{ width: 18, height: 18, color: pathname === "/" ? "#2563eb" : "#64748b" }} />
                            </div>
                            Home
                        </Link>

                        {NAV_LINKS.map((l) => {
                            const isActive = pathname === l.href;
                            const IconComp = l.icon;
                            return (
                                <Link
                                    key={l.href}
                                    href={l.href}
                                    onClick={() => setOpen(false)}
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 14,
                                        padding: "14px 16px",
                                        borderRadius: 14,
                                        textDecoration: "none",
                                        fontSize: 15,
                                        fontWeight: isActive ? 600 : 500,
                                        color: isActive ? "#2563eb" : "#374151",
                                        background: isActive ? "#eff6ff" : "transparent",
                                        transition: "all 0.2s",
                                    }}
                                >
                                    <div
                                        style={{
                                            width: 38,
                                            height: 38,
                                            borderRadius: 10,
                                            background: isActive ? "#dbeafe" : "#f1f5f9",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <IconComp style={{ width: 18, height: 18, color: isActive ? "#2563eb" : "#64748b" }} />
                                    </div>
                                    {l.label}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* CTA at bottom */}
                    <div style={{ padding: "16px 16px 28px", borderTop: "1px solid #f1f5f9" }}>
                        <Link
                            href="/submit"
                            onClick={() => setOpen(false)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                background: "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                                color: "#fff",
                                fontSize: 15,
                                fontWeight: 600,
                                padding: "16px 24px",
                                borderRadius: 14,
                                textDecoration: "none",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                transition: "all 0.2s",
                            }}
                        >
                            <Upload style={{ width: 18, height: 18 }} />
                            Invia Autolettura
                        </Link>
                    </div>
                </div>
            )}
        </>
    );
}
