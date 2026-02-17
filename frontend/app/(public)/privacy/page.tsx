"use client";

import Link from "next/link";
import { ArrowLeft, Shield, FileText, Scale, Database, Server, Clock, UserCheck } from "lucide-react";

const SECTIONS = [
    {
        icon: FileText,
        title: "1. Titolare del Trattamento",
        content:
            "Il titolare del trattamento è il **Comune di Davoli**, con sede in Piazza Municipio 1, 88040 Davoli (CZ).",
    },
    {
        icon: Shield,
        title: "2. Finalità del Trattamento",
        content:
            "I dati personali forniti saranno trattati unicamente per la gestione del servizio di autolettura dei contatori idrici, al fine di garantire la corretta contabilizzazione dei consumi e la relativa fatturazione.",
    },
    {
        icon: Scale,
        title: "3. Base Giuridica",
        content:
            "Il trattamento è necessario per l'esecuzione di un compito di interesse pubblico o connesso all'esercizio di pubblici poteri di cui è investito il titolare del trattamento (Art. 6, par. 1, lett. e, GDPR).",
    },
    {
        icon: Database,
        title: "4. Tipologia di Dati Trattati",
        list: [
            "Dati anagrafici e di contatto dell'utente;",
            "Dati relativi all'utenza idrica e al contatore (matricola, indirizzo, ecc.);",
            "Dati di consumo (lettura attuale e precedente);",
            "Documentazione fotografica del contatore.",
        ],
    },
    {
        icon: Server,
        title: "5. Modalità del Trattamento",
        content:
            "Il trattamento sarà svolto in forma automatizzata e/o manuale, nel rispetto di quanto previsto dall'art. 32 del GDPR in materia di misure di sicurezza, ad opera di soggetti appositamente incaricati e in ottemperanza a quanto previsto dagli art. 29 GDPR.",
    },
    {
        icon: Clock,
        title: "6. Conservazione dei Dati",
        content:
            "I dati saranno conservati per il periodo strettamente necessario al conseguimento delle finalità per le quali sono stati raccolti e comunque nel rispetto dei termini di legge previsti per la conservazione degli atti amministrativi.",
    },
    {
        icon: UserCheck,
        title: "7. Diritti dell'Interessato",
        content:
            "In ogni momento, l'interessato potrà esercitare, ai sensi degli articoli dal 15 al 22 del Regolamento UE n. 2016/679, i seguenti diritti:",
        list: [
            "Chiedere la conferma dell'esistenza o meno di propri dati personali;",
            "Ottenere le indicazioni circa le finalità del trattamento, le categorie dei dati, i destinatari e il periodo di conservazione;",
            "Ottenere la rettifica e la cancellazione dei dati;",
            "Ottenere la limitazione del trattamento;",
            "Ottenere la portabilità dei dati;",
            "Opporsi al trattamento in qualsiasi momento;",
            "Opporsi ad un processo decisionale automatizzato relativo alle persone fisiche, compresa la profilazione.",
        ],
    },
];

function renderText(text: string) {
    // Simple bold renderer for **text**
    const parts = text.split(/\*\*(.*?)\*\*/g);
    return parts.map((part, i) =>
        i % 2 === 1 ? (
            <strong key={i} style={{ color: "#1e293b", fontWeight: 600 }}>
                {part}
            </strong>
        ) : (
            <span key={i}>{part}</span>
        )
    );
}

export default function PrivacyPage() {
    return (
        <div className="animate-fade-in">
            {/* ── Hero header ── */}
            <section
                style={{
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    padding: "6vh 32px 5vh",
                }}
            >
                <div style={{ maxWidth: 1200, margin: "0 auto" }}>
                    <Link
                        href="/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 8,
                            fontSize: 14,
                            fontWeight: 500,
                            color: "#2563eb",
                            textDecoration: "none",
                            marginBottom: 28,
                            transition: "gap 0.2s",
                        }}
                    >
                        <ArrowLeft style={{ width: 16, height: 16 }} />
                        Torna alla Home
                    </Link>

                    <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
                        <div
                            style={{
                                width: 56,
                                height: 56,
                                borderRadius: 16,
                                background: "#2563eb",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                            }}
                        >
                            <Shield style={{ width: 28, height: 28, color: "#fff" }} />
                        </div>
                        <div>
                            <h1
                                style={{
                                    fontSize: "clamp(1.6rem, 4vw, 2.4rem)",
                                    fontWeight: 800,
                                    color: "#1e293b",
                                    lineHeight: 1.15,
                                }}
                            >
                                Informativa sulla Privacy
                            </h1>
                        </div>
                    </div>

                    <p
                        style={{
                            fontSize: "1.05rem",
                            color: "#64748b",
                            maxWidth: 680,
                            lineHeight: 1.7,
                        }}
                    >
                        In osservanza di quanto previsto dal Regolamento UE 2016/679 (GDPR),
                        le forniamo le dovute informazioni in ordine al trattamento dei dati
                        personali forniti.
                    </p>
                </div>
            </section>

            {/* ── Content cards ── */}
            <section style={{ background: "#fff", padding: "6vh 32px 8vh" }}>
                <div
                    style={{
                        maxWidth: 1200,
                        margin: "0 auto",
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 500px), 1fr))",
                        gap: 24,
                    }}
                >
                    {SECTIONS.map((s, i) => (
                        <div
                            key={i}
                            className="animate-fade-in-up"
                            style={{
                                animationDelay: `${i * 80}ms`,
                                background: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: 20,
                                padding: "clamp(24px, 3vw, 36px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                transition: "all 0.3s",
                            }}
                            onMouseEnter={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow =
                                    "0 8px 24px rgba(0,0,0,0.08)";
                                (e.currentTarget as HTMLDivElement).style.transform =
                                    "translateY(-4px)";
                            }}
                            onMouseLeave={(e) => {
                                (e.currentTarget as HTMLDivElement).style.boxShadow =
                                    "0 2px 8px rgba(0,0,0,0.04)";
                                (e.currentTarget as HTMLDivElement).style.transform =
                                    "translateY(0)";
                            }}
                        >
                            <div
                                style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: 14,
                                    background: "#eff6ff",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    marginBottom: 20,
                                }}
                            >
                                <s.icon style={{ width: 24, height: 24, color: "#2563eb" }} />
                            </div>

                            <h3
                                style={{
                                    fontSize: 17,
                                    fontWeight: 700,
                                    color: "#1e293b",
                                    marginBottom: 12,
                                }}
                            >
                                {s.title}
                            </h3>

                            {s.content && (
                                <p
                                    style={{
                                        fontSize: 14,
                                        color: "#64748b",
                                        lineHeight: 1.7,
                                        marginBottom: s.list ? 14 : 0,
                                    }}
                                >
                                    {renderText(s.content)}
                                </p>
                            )}

                            {s.list && (
                                <ul
                                    style={{
                                        listStyle: "none",
                                        padding: 0,
                                        margin: 0,
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: 8,
                                    }}
                                >
                                    {s.list.map((item, j) => (
                                        <li
                                            key={j}
                                            style={{
                                                fontSize: 14,
                                                color: "#64748b",
                                                lineHeight: 1.6,
                                                paddingLeft: 20,
                                                position: "relative",
                                            }}
                                        >
                                            <span
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    top: 8,
                                                    width: 6,
                                                    height: 6,
                                                    borderRadius: "50%",
                                                    background: "#2563eb",
                                                }}
                                            />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Contact CTA ── */}
            <section
                style={{
                    background: "#f8fafc",
                    padding: "6vh 32px",
                }}
            >
                <div
                    style={{
                        maxWidth: 860,
                        margin: "0 auto",
                    }}
                >
                    <div
                        style={{
                            background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                            borderRadius: 28,
                            padding: "clamp(36px, 5vw, 64px) clamp(28px, 4vw, 56px)",
                            textAlign: "center",
                            border: "1px solid rgba(37,99,235,0.08)",
                        }}
                    >
                        <h3
                            style={{
                                fontSize: "clamp(1.3rem, 2.5vw, 1.8rem)",
                                fontWeight: 800,
                                marginBottom: 16,
                                color: "#1e293b",
                            }}
                        >
                            Hai domande sul trattamento dei tuoi dati?
                        </h3>
                        <p
                            style={{
                                fontSize: "1rem",
                                color: "#64748b",
                                maxWidth: 520,
                                margin: "0 auto 28px",
                                lineHeight: 1.7,
                            }}
                        >
                            Per esercitare i tuoi diritti o per qualsiasi chiarimento, contatta
                            il Comune di Davoli all&apos;indirizzo email indicato sul sito
                            istituzionale.
                        </p>
                        <Link
                            href="/"
                            style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 10,
                                background: "#2563eb",
                                color: "#fff",
                                fontWeight: 600,
                                padding: "14px 32px",
                                borderRadius: 14,
                                fontSize: 15,
                                textDecoration: "none",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                transition: "all 0.2s",
                            }}
                        >
                            Torna alla Home
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
