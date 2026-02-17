"use client";

import Link from "next/link";
import {
  ArrowRight,
  Camera,
  CheckCircle2,
  Clock,
  FileText,
  Headphones,
  Lock,
  MonitorSmartphone,
  Shield,
  Sparkles,
  UserX,
  Zap,
} from "lucide-react";

/* ------------------------------------------------------------------ */
/*  DATA                                                               */
/* ------------------------------------------------------------------ */

const HERO_FEATURES = [
  { icon: UserX, label: "Nessuna registrazione" },
  { icon: Camera, label: "Foto obbligatoria" },
  { icon: Lock, label: "Dati protetti" },
];

const HERO_CARDS = [
  { icon: FileText, title: "Semplice", desc: "Compila il modulo online" },
  { icon: Zap, title: "Veloce", desc: "Inserisci i dati e la foto" },
  { icon: Shield, title: "Sicuro", desc: "Dati crittografati GDPR" },
  { icon: CheckCircle2, title: "Immediato", desc: "Ricevi conferma subito" },
];

const STEPS = [
  { n: 1, title: "Compila il Modulo", desc: "Inserisci i dati del contatore, l'indirizzo e le letture attuale e precedente." },
  { n: 2, title: "Allega la Foto", desc: "Carica una foto chiara del contatore e conferma la veridicità dei dati." },
  { n: 3, title: "Ricevi Conferma", desc: "Ottieni subito il codice pratica e la conferma della tua autolettura." },
];

const STEP_PILLS = [
  { icon: Clock, label: "Risparmia Tempo" },
  { icon: Shield, label: "Sicurezza Garantita" },
  { icon: MonitorSmartphone, label: "Disponibile 24/7" },
];

const BENEFITS = [
  { icon: Clock, title: "Risparmia Tempo", desc: "Invia la lettura in pochi minuti senza recarti presso gli uffici comunali." },
  { icon: Shield, title: "Sicurezza Garantita", desc: "I tuoi dati personali sono protetti con crittografia e trattati secondo il GDPR." },
  { icon: MonitorSmartphone, title: "Disponibile 24/7", desc: "Accedi al servizio quando vuoi, da qualsiasi dispositivo connesso a internet." },
  { icon: CheckCircle2, title: "Conferma Immediata", desc: "Ricevi subito il codice pratica per tracciare la tua autolettura." },
  { icon: Headphones, title: "Supporto Utenti", desc: "Assistenza dedicata per qualsiasi domanda o problema tecnico." },
  { icon: Sparkles, title: "Validazione Ufficiale", desc: "Le letture sono validate e registrate ufficialmente dal Comune." },
];

/* ------------------------------------------------------------------ */
/*  PAGE                                                               */
/* ------------------------------------------------------------------ */

export default function HomePage() {
  return (
    <div className="animate-fade-in">

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  HERO — min-height 90 vh                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        id="servizio"
        style={{ minHeight: "90vh", background: "#fff" }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            padding: "8vh 32px 8vh",
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: "6vh 64px",
            alignItems: "center",
          }}
          className="lg:!grid-cols-2"
        >
          {/* ── Left column ── */}
          <div className="animate-fade-in-up" style={{ display: "flex", flexDirection: "column", gap: 28 }}>
            <span
              style={{
                display: "inline-block",
                fontSize: 11,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "#2563eb",
                background: "#eff6ff",
                padding: "6px 16px",
                borderRadius: 999,
                width: "fit-content",
              }}
            >
              Servizio Ufficiale Comune di Davoli
            </span>

            <h2
              style={{
                fontSize: "clamp(2.4rem, 5vw, 3.5rem)",
                fontWeight: 800,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                color: "#1e293b",
              }}
            >
              Autolettura<br />
              <span style={{ color: "#2563eb" }}>Contatore Acqua</span>
            </h2>

            <p
              style={{
                fontSize: "1.125rem",
                lineHeight: 1.7,
                color: "#64748b",
                maxWidth: 520,
              }}
            >
              Comunica la lettura del tuo contatore in modo semplice, veloce e
              sicuro. Nessuna registrazione richiesta, pochi minuti e ricevi
              subito conferma.
            </p>

            {/* CTAs */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
              <Link
                href="/submit"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
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
                }}
              >
                Invia Autolettura Ora
                <ArrowRight style={{ width: 18, height: 18 }} />
              </Link>
              <a
                href="#come-funziona"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#2563eb",
                  fontWeight: 600,
                  padding: "16px 28px",
                  borderRadius: 14,
                  fontSize: 16,
                  textDecoration: "none",
                  border: "1.5px solid rgba(37,99,235,0.2)",
                  transition: "all 0.2s",
                }}
              >
                Come Funziona
              </a>
            </div>

            {/* Micro-benefits */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 24, marginTop: 8 }}>
              {HERO_FEATURES.map((f, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#64748b" }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 10,
                      background: "#eff6ff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <f.icon style={{ width: 18, height: 18, color: "#2563eb" }} />
                  </div>
                  {f.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Right column — feature grid ── */}
          <div
            className="animate-fade-in-up"
            style={{ animationDelay: "200ms", position: "relative" }}
          >
            <div
              style={{
                background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                borderRadius: 28,
                padding: "clamp(28px, 4vw, 48px)",
                position: "relative",
              }}
            >
              {/* Badge 24/7 */}
              <div
                style={{
                  position: "absolute",
                  top: -14,
                  right: -14,
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: 13,
                  fontWeight: 800,
                  padding: "8px 16px",
                  borderRadius: 999,
                  boxShadow: "0 4px 12px rgba(37,99,235,0.35)",
                }}
              >
                24/7
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "clamp(14px, 2vw, 20px)",
                }}
              >
                {HERO_CARDS.map((c, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fff",
                      borderRadius: 18,
                      padding: "clamp(20px, 2.5vw, 28px)",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                      border: "1px solid #f1f5f9",
                      transition: "box-shadow 0.25s",
                    }}
                  >
                    <div
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        marginBottom: 16,
                      }}
                    >
                      <c.icon style={{ width: 22, height: 22, color: "#2563eb" }} />
                    </div>
                    <h4 style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{c.title}</h4>
                    <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.5 }}>{c.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  COME FUNZIONA — min-height 80 vh                              */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        id="come-funziona"
        style={{
          minHeight: "80vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1000,
            margin: "0 auto",
            padding: "10vh 32px",
            textAlign: "center",
            width: "100%",
          }}
        >
          <h3
            style={{
              fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
              fontWeight: 800,
              marginBottom: 16,
              color: "#1e293b",
            }}
          >
            Come Funziona il Servizio
          </h3>
          <p
            style={{
              fontSize: "1.1rem",
              color: "#64748b",
              maxWidth: 580,
              margin: "0 auto 8vh",
              lineHeight: 1.7,
            }}
          >
            Un processo semplice in 3 passaggi per comunicare la lettura del tuo
            contatore acqua
          </p>

          {/* Steps */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
              gap: 48,
              marginBottom: "8vh",
            }}
          >
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${s.n * 150}ms`,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 20,
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: "50%",
                    background: "#2563eb",
                    color: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                  }}
                >
                  {s.n}
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 18 }}>{s.title}</h4>
                <p
                  style={{
                    fontSize: 14,
                    color: "#64748b",
                    lineHeight: 1.7,
                    maxWidth: 300,
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>

          {/* Pills */}
          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 16 }}>
            {STEP_PILLS.map((p, i) => (
              <div
                key={i}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 10,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 999,
                  padding: "12px 24px",
                  fontSize: 14,
                  fontWeight: 500,
                  color: "#64748b",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.04)",
                }}
              >
                <p.icon style={{ width: 18, height: 18, color: "#2563eb" }} />
                {p.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  BENEFICI — min-height 85 vh                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "85vh",
          background: "#fff",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: "10vh 32px",
            width: "100%",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "7vh" }}>
            <h3
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)",
                fontWeight: 800,
                marginBottom: 16,
                color: "#1e293b",
              }}
            >
              Perché Scegliere il Servizio Online
            </h3>
            <p
              style={{
                fontSize: "1.1rem",
                color: "#64748b",
                maxWidth: 540,
                margin: "0 auto",
                lineHeight: 1.7,
              }}
            >
              Tutti i vantaggi dell&apos;autolettura digitale del Comune di Davoli
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
              gap: 24,
            }}
          >
            {BENEFITS.map((b, i) => (
              <div
                key={i}
                className="animate-fade-in-up"
                style={{
                  animationDelay: `${i * 100}ms`,
                  background: "#fff",
                  border: "1px solid #e2e8f0",
                  borderRadius: 20,
                  padding: "clamp(28px, 3vw, 36px)",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                  transition: "all 0.3s",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.08)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                  (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 14,
                    background: "#eff6ff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: 20,
                  }}
                >
                  <b.icon style={{ width: 26, height: 26, color: "#2563eb" }} />
                </div>
                <h4 style={{ fontWeight: 700, fontSize: 17, marginBottom: 10 }}>{b.title}</h4>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  CTA FINALE — 50 vh centrato                                   */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      <section
        style={{
          minHeight: "50vh",
          background: "#f8fafc",
          display: "flex",
          alignItems: "center",
        }}
      >
        <div
          style={{
            maxWidth: 860,
            margin: "0 auto",
            padding: "8vh 32px",
            width: "100%",
          }}
        >
          <div
            style={{
              background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
              borderRadius: 28,
              padding: "clamp(48px, 6vw, 80px) clamp(32px, 5vw, 64px)",
              textAlign: "center",
              border: "1px solid rgba(37,99,235,0.08)",
            }}
          >
            <h3
              style={{
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                fontWeight: 800,
                marginBottom: 20,
                color: "#1e293b",
              }}
            >
              Pronto a Inviare la Tua Autolettura?
            </h3>
            <p
              style={{
                fontSize: "1.05rem",
                color: "#64748b",
                maxWidth: 520,
                margin: "0 auto 36px",
                lineHeight: 1.7,
              }}
            >
              Il processo richiede solo pochi minuti. Assicurati di avere a
              portata di mano i dati del contatore e una foto chiara dello
              stesso.
            </p>
            <Link
              href="/submit"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 10,
                background: "#2563eb",
                color: "#fff",
                fontWeight: 600,
                padding: "16px 36px",
                borderRadius: 14,
                fontSize: 16,
                textDecoration: "none",
                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                transition: "all 0.2s",
              }}
            >
              Inizia Ora
              <ArrowRight style={{ width: 18, height: 18 }} />
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/*  PRIVACY                                                       */}
      {/* ═══════════════════════════════════════════════════════════════ */}

    </div>
  );
}
