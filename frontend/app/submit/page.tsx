"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
    Camera,
    Upload,
    X,
    Loader2,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    Droplets,
    User,
    BookOpen,
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const USO_OPTIONS = [
    { value: "domestico", label: "Domestico" },
    { value: "industriale", label: "Industriale" },
    { value: "commerciale", label: "Commerciale" },
    { value: "agricolo", label: "Agricolo" },
    { value: "altro", label: "Altro" },
];

interface FormErrors {
    [key: string]: string;
}

/* ── Shared styles ── */
const inputBase: React.CSSProperties = {
    width: "100%",
    padding: "14px 18px",
    borderRadius: 14,
    border: "1px solid #e2e8f0",
    background: "#fff",
    color: "#1e293b",
    fontSize: 14,
    outline: "none",
    transition: "all 0.2s",
    boxSizing: "border-box",
};

const inputError: React.CSSProperties = {
    ...inputBase,
    border: "1px solid #ef4444",
    background: "#fef2f2",
};

const labelStyle: React.CSSProperties = {
    display: "block",
    fontSize: 13,
    fontWeight: 600,
    color: "#1e293b",
    marginBottom: 8,
};

/* ── Reusable input field (module-level to avoid remount on re-render) ── */
function InputField({
    label, name, value, onChange, type = "text", required = false, placeholder = "", error,
}: {
    label: string; name: string; value: string; onChange: (v: string) => void;
    type?: string; required?: boolean; placeholder?: string; error?: string;
}) {
    return (
        <div>
            <label htmlFor={name} style={labelStyle}>
                {label}
                {required && <span style={{ color: "#2563eb", marginLeft: 4 }}>*</span>}
            </label>
            <input
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                style={error ? inputError : inputBase}
                onFocus={(e) => {
                    e.currentTarget.style.borderColor = "#2563eb";
                    e.currentTarget.style.boxShadow = "0 0 0 3px rgba(37,99,235,0.1)";
                }}
                onBlur={(e) => {
                    e.currentTarget.style.borderColor = error ? "#ef4444" : "#e2e8f0";
                    e.currentTarget.style.boxShadow = "none";
                }}
            />
            {error && (
                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}>
                    <AlertTriangle style={{ width: 12, height: 12 }} /> {error}
                </p>
            )}
        </div>
    );
}

/* ── Section Card (module-level) ── */
function SectionCard({
    icon: Icon, title, children,
}: {
    icon: React.ElementType; title: string; children: React.ReactNode;
}) {
    return (
        <div
            style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 20,
                padding: "clamp(24px, 3vw, 36px)",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 24 }}>
                <div
                    style={{
                        width: 44,
                        height: 44,
                        borderRadius: 12,
                        background: "#eff6ff",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                    }}
                >
                    <Icon style={{ width: 22, height: 22, color: "#2563eb" }} />
                </div>
                <h3 style={{ fontSize: 17, fontWeight: 700, color: "#1e293b" }}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

export default function SubmitPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Form state
    const [matricola, setMatricola] = useState("");
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [indirizzo, setIndirizzo] = useState("");
    const [uso, setUso] = useState("domestico");
    const [dataLettura, setDataLettura] = useState(
        new Date().toISOString().split("T")[0]
    );
    const [letturaAnnuale, setLetturaAnnuale] = useState("");
    const [letturaPrecedente, setLetturaPrecedente] = useState("");
    const [codiceFiscale, setCodiceFiscale] = useState("");
    const [telefono, setTelefono] = useState("");
    const [email, setEmail] = useState("");
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [privacyAccepted, setPrivacyAccepted] = useState(false);
    const [veridicitaAccepted, setVeridicitaAccepted] = useState(false);

    // UI state
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const selected = e.target.files?.[0];
            if (!selected) return;

            const allowed = ["image/jpeg", "image/png", "image/webp"];
            if (!allowed.includes(selected.type)) {
                setErrors((prev) => ({
                    ...prev,
                    file: "Formato non valido. Sono accettati: JPG, PNG, WebP.",
                }));
                return;
            }

            if (selected.size > 10 * 1024 * 1024) {
                setErrors((prev) => ({
                    ...prev,
                    file: "Il file è troppo grande. Dimensione massima: 10 MB.",
                }));
                return;
            }

            setFile(selected);
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors.file;
                return newErrors;
            });

            const reader = new FileReader();
            reader.onload = (ev) => setPreview(ev.target?.result as string);
            reader.readAsDataURL(selected);
        },
        []
    );

    const removeFile = useCallback(() => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    }, []);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!matricola.trim()) newErrors.matricola = "La matricola è obbligatoria.";
        if (!nome.trim()) newErrors.nome = "Il nome è obbligatorio.";
        if (!cognome.trim()) newErrors.cognome = "Il cognome è obbligatorio.";
        if (!indirizzo.trim()) newErrors.indirizzo = "L'indirizzo è obbligatorio.";
        if (!codiceFiscale.trim()) newErrors.codiceFiscale = "Il codice fiscale è obbligatorio.";
        if (!telefono.trim()) newErrors.telefono = "Il recapito telefonico è obbligatorio.";
        if (!dataLettura) newErrors.dataLettura = "La data di lettura è obbligatoria.";
        if (!letturaAnnuale || isNaN(Number(letturaAnnuale)) || Number(letturaAnnuale) < 0)
            newErrors.letturaAnnuale = "Inserire un valore valido per la lettura annuale (mc).";
        if (!file) newErrors.file = "La foto del contatore è obbligatoria.";
        if (!privacyAccepted) newErrors.privacy = "Devi accettare l'informativa sulla privacy.";
        if (!veridicitaAccepted) newErrors.veridicita = "Devi dichiarare la veridicità dei dati inseriti.";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitError("");
        if (!validate()) return;
        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("matricola", matricola.trim());
            formData.append("nome", nome.trim());
            formData.append("cognome", cognome.trim());
            formData.append("indirizzo", indirizzo.trim());
            formData.append("uso", uso);
            formData.append("data_lettura", dataLettura);
            formData.append("lettura_annuale", letturaAnnuale);
            if (letturaPrecedente) formData.append("lettura_precedente", letturaPrecedente);
            formData.append("codice_fiscale", codiceFiscale.trim());
            formData.append("telefono", telefono.trim());
            if (email.trim()) formData.append("email", email.trim());
            if (file) formData.append("file", file);

            const response = await fetch(`${API_URL}/submissions`, {
                method: "POST",
                body: formData,
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.message || `Errore del server (${response.status})`);
            }

            const result = await response.json();
            const dateStr = new Date().toISOString();
            // Pass minimal data to confirm page
            const params = new URLSearchParams({
                id: result.id,
                nome: nome.trim(),
                cognome: cognome.trim(),
                date: dateStr,
            });
            router.push(`/confirm?${params.toString()}`);
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : "Errore durante l'invio.";
            setSubmitError(message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="animate-fade-in">
            {/* ── Hero header ── */}
            <section
                style={{
                    background: "linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)",
                    padding: "5vh 32px 4vh",
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
                            <Upload style={{ width: 28, height: 28, color: "#fff" }} />
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
                                Invio Autolettura
                            </h1>
                        </div>
                    </div>

                    <p
                        style={{
                            fontSize: "1.05rem",
                            color: "#64748b",
                            maxWidth: 620,
                            lineHeight: 1.7,
                        }}
                    >
                        Compila tutti i campi obbligatori (*) e allega una foto del contatore.
                        I tuoi dati saranno trattati nel rispetto della normativa sulla privacy.
                    </p>
                </div>
            </section>

            {/* ── Form body ── */}
            <section style={{ background: "#f8fafc", padding: "5vh 32px 8vh" }}>
                <div style={{ maxWidth: 860, margin: "0 auto" }}>
                    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 28 }}>

                        {/* Submit Error */}
                        {submitError && (
                            <div
                                className="animate-fade-in-up"
                                style={{
                                    background: "#fef2f2",
                                    border: "1px solid rgba(239,68,68,0.3)",
                                    borderRadius: 16,
                                    padding: "18px 22px",
                                    display: "flex",
                                    alignItems: "flex-start",
                                    gap: 14,
                                }}
                            >
                                <AlertTriangle style={{ width: 20, height: 20, color: "#ef4444", marginTop: 2, flexShrink: 0 }} />
                                <div>
                                    <p style={{ fontWeight: 600, color: "#ef4444", fontSize: 14 }}>Errore nell&apos;invio</p>
                                    <p style={{ fontSize: 14, color: "#dc2626", marginTop: 4 }}>{submitError}</p>
                                </div>
                            </div>
                        )}

                        {/* ── Section: Dati Contatore ── */}
                        <SectionCard icon={Droplets} title="Dati del Contatore">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                                    gap: 20,
                                }}
                            >
                                <InputField label="Matricola" name="matricola" value={matricola} onChange={setMatricola} required placeholder="es. 12345678" error={errors.matricola} />
                                <div>
                                    <label htmlFor="uso" style={labelStyle}>
                                        Uso <span style={{ color: "#2563eb" }}>*</span>
                                    </label>
                                    <select
                                        id="uso"
                                        name="uso"
                                        value={uso}
                                        onChange={(e) => setUso(e.target.value)}
                                        style={inputBase}
                                    >
                                        {USO_OPTIONS.map((o) => (
                                            <option key={o.value} value={o.value}>{o.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </SectionCard>

                        {/* ── Section: Dati Utente ── */}
                        <SectionCard icon={User} title="Dati dell'Utente">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 280px), 1fr))",
                                    gap: 20,
                                }}
                            >
                                <InputField label="Nome" name="nome" value={nome} onChange={setNome} required placeholder="es. Mario" error={errors.nome} />
                                <InputField label="Cognome" name="cognome" value={cognome} onChange={setCognome} required placeholder="es. Rossi" error={errors.cognome} />
                                <InputField label="Via e Numero Civico" name="indirizzo" value={indirizzo} onChange={setIndirizzo} required placeholder="es. Via Roma, 1" error={errors.indirizzo} />
                                <InputField label="Codice Fiscale" name="codiceFiscale" value={codiceFiscale} onChange={setCodiceFiscale} required placeholder="RSSMRA80A01H501Z" error={errors.codiceFiscale} />
                                <InputField label="Recapito Telefonico" name="telefono" value={telefono} onChange={setTelefono} required placeholder="333 1234567" error={errors.telefono} />
                                <InputField label="Email" name="email" value={email} onChange={setEmail} placeholder="nome@email.it" error={errors.email} />
                            </div>
                        </SectionCard>

                        {/* ── Section: Letture ── */}
                        <SectionCard icon={BookOpen} title="Letture">
                            <div
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
                                    gap: 20,
                                }}
                            >
                                <InputField label="Data della Lettura" name="dataLettura" value={dataLettura} onChange={setDataLettura} type="date" required error={errors.dataLettura} />
                                <InputField label="Lettura Annuale (mc)" name="letturaAnnuale" value={letturaAnnuale} onChange={setLetturaAnnuale} type="number" required placeholder="es. 150" error={errors.letturaAnnuale} />
                                <InputField label="Lettura Precedente (mc)" name="letturaPrecedente" value={letturaPrecedente} onChange={setLetturaPrecedente} type="number" placeholder="Opzionale" error={errors.letturaPrecedente} />
                            </div>
                        </SectionCard>

                        {/* ── Section: Foto ── */}
                        <SectionCard icon={Camera} title="Foto del Contatore *">
                            {!preview ? (
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    style={{
                                        border: `2px dashed ${errors.file ? "#ef4444" : "#cbd5e1"}`,
                                        borderRadius: 16,
                                        padding: "clamp(28px, 4vw, 48px) 24px",
                                        textAlign: "center",
                                        cursor: "pointer",
                                        transition: "all 0.3s",
                                        background: errors.file ? "#fef2f2" : "#f8fafc",
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!errors.file) {
                                            e.currentTarget.style.borderColor = "#2563eb";
                                            e.currentTarget.style.background = "#eff6ff";
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!errors.file) {
                                            e.currentTarget.style.borderColor = "#cbd5e1";
                                            e.currentTarget.style.background = "#f8fafc";
                                        }
                                    }}
                                >
                                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14 }}>
                                        <div
                                            style={{
                                                width: 64,
                                                height: 64,
                                                borderRadius: "50%",
                                                background: "rgba(37,99,235,0.1)",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <Camera style={{ width: 30, height: 30, color: "#2563eb" }} />
                                        </div>
                                        <div>
                                            <p style={{ fontWeight: 600, color: "#1e293b", fontSize: 15, marginBottom: 4 }}>
                                                Clicca per scattare o caricare una foto
                                            </p>
                                            <p style={{ fontSize: 12, color: "#94a3b8" }}>
                                                JPG, PNG o WebP — Max 10 MB
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ position: "relative", borderRadius: 16, overflow: "hidden", border: "1px solid #e2e8f0" }}>
                                    <img
                                        src={preview}
                                        alt="Anteprima foto contatore"
                                        style={{ width: "100%", maxHeight: "40vh", objectFit: "contain", background: "#f8fafc" }}
                                    />
                                    <button
                                        type="button"
                                        onClick={removeFile}
                                        style={{
                                            position: "absolute",
                                            top: 12,
                                            right: 12,
                                            background: "#ef4444",
                                            color: "#fff",
                                            border: "none",
                                            borderRadius: "50%",
                                            width: 36,
                                            height: 36,
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            cursor: "pointer",
                                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                                        }}
                                    >
                                        <X style={{ width: 16, height: 16 }} />
                                    </button>
                                    <div
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            left: 0,
                                            right: 0,
                                            background: "linear-gradient(transparent, rgba(0,0,0,0.6))",
                                            padding: "16px 20px",
                                        }}
                                    >
                                        <p style={{ color: "#fff", fontSize: 13, fontWeight: 500, display: "flex", alignItems: "center", gap: 8 }}>
                                            <CheckCircle2 style={{ width: 16, height: 16, color: "#22c55e" }} />
                                            {file?.name}
                                        </p>
                                    </div>
                                </div>
                            )}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp"
                                capture="environment"
                                onChange={handleFileChange}
                                style={{ display: "none" }}
                            />
                            {errors.file && (
                                <p style={{ color: "#ef4444", fontSize: 12, marginTop: 8, display: "flex", alignItems: "center", gap: 4 }}>
                                    <AlertTriangle style={{ width: 12, height: 12 }} /> {errors.file}
                                </p>
                            )}
                        </SectionCard>

                        {/* ── Checkboxes ── */}
                        <div
                            style={{
                                background: "#fff",
                                border: "1px solid #e2e8f0",
                                borderRadius: 20,
                                padding: "clamp(24px, 3vw, 36px)",
                                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 18,
                            }}
                        >
                            <label style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={privacyAccepted}
                                    onChange={(e) => setPrivacyAccepted(e.target.checked)}
                                    style={{
                                        marginTop: 2,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 6,
                                        accentColor: "#2563eb",
                                        cursor: "pointer",
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                                    Ho letto e accetto l&apos;
                                    <a
                                        href="/privacy"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{ color: "#2563eb", textDecoration: "underline" }}
                                    >
                                        informativa sulla privacy
                                    </a>{" "}
                                    ai sensi del GDPR.{" "}
                                    <span style={{ color: "#2563eb", fontWeight: 700 }}>*</span>
                                </span>
                            </label>
                            {errors.privacy && (
                                <p style={{ color: "#ef4444", fontSize: 12, marginLeft: 34, display: "flex", alignItems: "center", gap: 4 }}>
                                    <AlertTriangle style={{ width: 12, height: 12 }} /> {errors.privacy}
                                </p>
                            )}

                            <label style={{ display: "flex", alignItems: "flex-start", gap: 14, cursor: "pointer" }}>
                                <input
                                    type="checkbox"
                                    checked={veridicitaAccepted}
                                    onChange={(e) => setVeridicitaAccepted(e.target.checked)}
                                    style={{
                                        marginTop: 2,
                                        width: 20,
                                        height: 20,
                                        borderRadius: 6,
                                        accentColor: "#2563eb",
                                        cursor: "pointer",
                                        flexShrink: 0,
                                    }}
                                />
                                <span style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>
                                    Dichiaro che i dati inseriti e la foto allegata corrispondono
                                    alla reale lettura del contatore.{" "}
                                    <span style={{ color: "#ef4444", fontWeight: 700 }}>*</span>
                                </span>
                            </label>
                            {errors.veridicita && (
                                <p style={{ color: "#ef4444", fontSize: 12, marginLeft: 34, display: "flex", alignItems: "center", gap: 4 }}>
                                    <AlertTriangle style={{ width: 12, height: 12 }} /> {errors.veridicita}
                                </p>
                            )}
                        </div>

                        {/* ── Submit button ── */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            style={{
                                width: "100%",
                                background: isSubmitting
                                    ? "#93c5fd"
                                    : "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)",
                                color: "#fff",
                                fontWeight: 700,
                                padding: "18px 32px",
                                borderRadius: 16,
                                fontSize: 17,
                                border: "none",
                                cursor: isSubmitting ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 14px rgba(37,99,235,0.3)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: 10,
                                transition: "all 0.3s",
                                opacity: isSubmitting ? 0.7 : 1,
                            }}
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 style={{ width: 22, height: 22, animation: "spin 1s linear infinite" }} />
                                    Invio in corso...
                                </>
                            ) : (
                                <>
                                    <Upload style={{ width: 22, height: 22 }} />
                                    Invia Autolettura
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    );
}
