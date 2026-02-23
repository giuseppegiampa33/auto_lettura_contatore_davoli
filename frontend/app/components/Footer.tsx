"use client";

import Link from "next/link";
import { MapPin, Phone, Clock, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";

/* ── Data ── */
const SERVICES = [
    { label: "Autolettura Contatore", href: "/submit", active: true },
    { label: "Tutti i Servizi", href: "#", active: false },
    { label: "Pagamenti Online", href: "#", active: false },
];

const CONTACTS = [
    { icon: MapPin, text: "Luogo Comune" },
    { icon: Phone, text: "0967 12345", href: "tel:096712345" },
];

const HOURS = [
    { day: "Lun – Ven", time: "09:00 – 13:00 / 15:30 – 18:00" },
    { day: "Sabato", time: "08:30 – 12:00" },
];

const BREAKPOINT = 768;

/* ── Accordion section for mobile ── */
function AccordionSection({
    title,
    children,
    isMobile,
}: {
    title: string;
    children: React.ReactNode;
    isMobile: boolean;
}) {
    const [isOpen, setIsOpen] = useState(!isMobile);

    useEffect(() => {
        setIsOpen(!isMobile);
    }, [isMobile]);

    return (
        <div>
            <button
                onClick={() => isMobile && setIsOpen(!isOpen)}
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                    background: "none",
                    border: "none",
                    cursor: isMobile ? "pointer" : "default",
                    padding: 0,
                    marginBottom: isOpen ? 20 : 0,
                    transition: "margin-bottom 0.3s ease",
                }}
            >
                <h5
                    style={{
                        fontWeight: 700,
                        fontSize: 13,
                        textTransform: "uppercase",
                        letterSpacing: "0.1em",
                        color: "#93c5fd",
                        margin: 0,
                    }}
                >
                    {title}
                </h5>
                {isMobile && (
                    <ChevronDown
                        style={{
                            width: 18,
                            height: 18,
                            color: "#93c5fd",
                            transition: "transform 0.3s ease",
                            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                        }}
                    />
                )}
            </button>
            <div
                style={{
                    overflow: "hidden",
                    maxHeight: isOpen ? 300 : 0,
                    opacity: isOpen ? 1 : 0,
                    transition: "max-height 0.35s ease, opacity 0.25s ease",
                }}
            >
                {children}
            </div>
        </div>
    );
}

/* ── Footer ── */
const TABLET_BREAKPOINT = 1024;

export default function Footer() {
    const [isMobile, setIsMobile] = useState(false);
    const [isTablet, setIsTablet] = useState(false);

    useEffect(() => {
        const mqMobile = window.matchMedia(`(max-width: ${BREAKPOINT - 1}px)`);
        const mqTablet = window.matchMedia(
            `(min-width: ${BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`
        );
        setIsMobile(mqMobile.matches);
        setIsTablet(mqTablet.matches);
        const mobileHandler = (e: MediaQueryListEvent) => setIsMobile(e.matches);
        const tabletHandler = (e: MediaQueryListEvent) => setIsTablet(e.matches);
        mqMobile.addEventListener("change", mobileHandler);
        mqTablet.addEventListener("change", tabletHandler);
        return () => {
            mqMobile.removeEventListener("change", mobileHandler);
            mqTablet.removeEventListener("change", tabletHandler);
        };
    }, []);

    return (
        <footer
            style={{
                background: "linear-gradient(180deg, #1e3a5f 0%, #0f2847 100%)",
                color: "#fff",
                position: "relative",
            }}
        >
            {/* Soft shadow on top edge */}
            <div
                style={{
                    position: "absolute",
                    top: -1,
                    left: 0,
                    right: 0,
                    height: 1,
                    background:
                        "linear-gradient(90deg, transparent, rgba(37,99,235,0.15), transparent)",
                }}
            />

            {/* ── Main content ── */}
            <div
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    padding: isMobile ? "48px 24px 32px" : "72px 32px 48px",
                }}
            >
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: isMobile
                            ? "1fr"
                            : isTablet
                                ? "repeat(2, 1fr)"
                                : "1.4fr 1fr 1fr 1fr",
                        gap: isMobile ? 32 : isTablet ? "40px 48px" : 48,
                    }}
                >
                    {/* ── Col 1: Branding ── */}
                    <div
                        style={{
                            paddingBottom: isMobile ? 24 : 0,
                            borderBottom: isMobile
                                ? "1px solid rgba(147,197,253,0.12)"
                                : "none",
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginBottom: 18,
                            }}
                        >
                            <img
                                src="/stemma-davoli.png"
                                alt="Stemma del Comune di Davoli"
                                style={{
                                    height: 36,
                                    width: "auto",
                                    objectFit: "contain",
                                    filter: "brightness(0) invert(1)",
                                    opacity: 0.9,
                                }}
                                onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = "none";
                                }}
                            />
                            <h4
                                style={{
                                    fontWeight: 700,
                                    fontSize: 18,
                                    color: "#fff",
                                    margin: 0,
                                    letterSpacing: "-0.01em",
                                }}
                            >
                                Comune di Davoli
                            </h4>
                        </div>
                        <p
                            style={{
                                fontSize: 14,
                                color: "rgba(191,219,254,0.75)",
                                lineHeight: 1.75,
                                maxWidth: 280,
                            }}
                        >
                            Il portale servizi del Comune di Davoli per la gestione digitale
                            delle pratiche comunali.
                        </p>
                    </div>

                    {/* ── Col 2: Servizi ── */}
                    <AccordionSection title="Servizi" isMobile={isMobile}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                            }}
                        >
                            {SERVICES.map((s) => (
                                <li key={s.label}>
                                    {s.active ? (
                                        <Link
                                            href={s.href}
                                            style={{
                                                color: "rgba(255,255,255,0.8)",
                                                textDecoration: "none",
                                                fontSize: 14,
                                                transition: "color 0.2s ease",
                                            }}
                                            onMouseEnter={(e) =>
                                                ((e.target as HTMLElement).style.color = "#93c5fd")
                                            }
                                            onMouseLeave={(e) =>
                                            ((e.target as HTMLElement).style.color =
                                                "rgba(255,255,255,0.8)")
                                            }
                                        >
                                            {s.label}
                                        </Link>
                                    ) : (
                                        <span
                                            style={{
                                                color: "rgba(255,255,255,0.4)",
                                                fontSize: 14,
                                                cursor: "not-allowed",
                                            }}
                                        >
                                            {s.label}
                                        </span>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </AccordionSection>

                    {/* ── Col 3: Contatti ── */}
                    <AccordionSection title="Contatti" isMobile={isMobile}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 16,
                            }}
                        >
                            {CONTACTS.map((c, i) => {
                                const Icon = c.icon;
                                const content = (
                                    <div
                                        style={{
                                            display: "flex",
                                            alignItems: "flex-start",
                                            gap: 10,
                                        }}
                                    >
                                        <Icon
                                            style={{
                                                width: 16,
                                                height: 16,
                                                color: "#93c5fd",
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        />
                                        <span
                                            style={{
                                                fontSize: 14,
                                                color: "rgba(255,255,255,0.8)",
                                                lineHeight: 1.5,
                                            }}
                                        >
                                            {c.text}
                                        </span>
                                    </div>
                                );
                                return (
                                    <li key={i}>
                                        {c.href ? (
                                            <a
                                                href={c.href}
                                                style={{
                                                    textDecoration: "none",
                                                    transition: "opacity 0.2s",
                                                }}
                                                onMouseEnter={(e) =>
                                                ((e.currentTarget as HTMLElement).style.opacity =
                                                    "0.8")
                                                }
                                                onMouseLeave={(e) =>
                                                    ((e.currentTarget as HTMLElement).style.opacity = "1")
                                                }
                                            >
                                                {content}
                                            </a>
                                        ) : (
                                            content
                                        )}
                                    </li>
                                );
                            })}
                        </ul>
                    </AccordionSection>

                    {/* ── Col 4: Orari ── */}
                    <AccordionSection title="Orari Uffici" isMobile={isMobile}>
                        <ul
                            style={{
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: 14,
                            }}
                        >
                            {HOURS.map((h, i) => (
                                <li
                                    key={i}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-start",
                                        gap: 10,
                                    }}
                                >
                                    {i === 0 && (
                                        <Clock
                                            style={{
                                                width: 16,
                                                height: 16,
                                                color: "#93c5fd",
                                                flexShrink: 0,
                                                marginTop: 2,
                                            }}
                                        />
                                    )}
                                    {i !== 0 && <div style={{ width: 16, flexShrink: 0 }} />}
                                    <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                                        <span style={{ color: "rgba(255,255,255,0.9)", fontWeight: 500 }}>
                                            {h.day}:
                                        </span>{" "}
                                        <span style={{ color: "rgba(255,255,255,0.65)" }}>
                                            {h.time}
                                        </span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </AccordionSection>
                </div>

                {/* ── Bottom bar ── */}
                <div
                    style={{
                        borderTop: "1px solid rgba(147,197,253,0.12)",
                        marginTop: isMobile ? 32 : 56,
                        paddingTop: isMobile ? 24 : 32,
                        display: "flex",
                        flexDirection: isMobile ? "column" : "row",
                        alignItems: "center",
                        justifyContent: "space-between",
                        gap: isMobile ? 16 : 0,
                    }}
                >
                    <p
                        style={{
                            fontSize: 13,
                            color: "rgba(147,197,253,0.5)",
                            margin: 0,
                        }}
                    >
                        © {new Date().getFullYear()} Comune di Davoli — Tutti i diritti
                        riservati
                    </p>
                    <div
                        style={{
                            display: "flex",
                            gap: 24,
                            fontSize: 13,
                        }}
                    >
                        <Link
                            href="/privacy"
                            style={{
                                color: "rgba(147,197,253,0.5)",
                                textDecoration: "none",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = "#93c5fd")
                            }
                            onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color =
                                "rgba(147,197,253,0.5)")
                            }
                        >
                            Privacy Policy
                        </Link>
                        <span style={{ color: "rgba(147,197,253,0.25)" }}>|</span>
                        <Link
                            href="/privacy"
                            style={{
                                color: "rgba(147,197,253,0.5)",
                                textDecoration: "none",
                                transition: "color 0.2s ease",
                            }}
                            onMouseEnter={(e) =>
                                ((e.target as HTMLElement).style.color = "#93c5fd")
                            }
                            onMouseLeave={(e) =>
                            ((e.target as HTMLElement).style.color =
                                "rgba(147,197,253,0.5)")
                            }
                        >
                            Termini di Servizio
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
