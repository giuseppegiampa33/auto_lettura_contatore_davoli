"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    LogOut,
    Download,
    RefreshCw,
    Loader2,
    Eye,
    ChevronLeft,
    ChevronRight,
    FileText,
    Users,
    Calendar,
    Search,
    X,
    CheckCircle2
} from "lucide-react";

import "./admin-dashboard.css";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://autolettura.corapi.it";

interface Submission {
    id: string;
    matricola: string;
    nome: string;
    cognome: string;
    codice_fiscale: string;
    telefono: string;
    email: string | null;
    indirizzo: string;
    uso: string;
    data_lettura: string;
    lettura_annuale: number;
    lettura_precedente: number | null;
    numero_utenza?: string | null;
    numero_fattura?: string | null;
    data_ultima_fattura?: string | null;
    foto_url: string | null;
    created_at: string;
}

export default function AdminDashboard() {
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [selectedSub, setSelectedSub] = useState<Submission | null>(null);
    const [page, setPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");
    const [dateFilter, setDateFilter] = useState("");
    const perPage = 15;

    const getToken = () => localStorage.getItem("admin_token") || "";

    const fetchSubmissions = useCallback(async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch(`${API_URL}/admin/submissions`, {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            if (res.status === 401) {
                localStorage.removeItem("admin_token");
                router.push("/admin");
                return;
            }
            if (!res.ok) throw new Error("Errore nel caricamento.");
            const data = await res.json();
            setSubmissions(data);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : "Errore sconosciuto.");
        } finally {
            setLoading(false);
        }
    }, [router]);

    useEffect(() => {
        if (!getToken()) {
            router.push("/admin");
            return;
        }
        fetchSubmissions();
    }, [fetchSubmissions, router]);

    const logout = () => {
        localStorage.removeItem("admin_token");
        router.push("/admin");
    };

    const downloadCSV = () => {
        if (!filtered.length) return;
        const headers = [
            "ID", "Matricola", "Cognome", "Nome", "Codice Fiscale", "Telefono", "Email", "Indirizzo", "Uso",
            "Data Lettura", "Lettura Annuale (mc)", "Lettura Precedente (mc)",
            "Data Invio",
        ];
        const rows = filtered.map((s) => [
            s.id, s.matricola, s.cognome, s.nome, s.codice_fiscale, s.telefono, s.email ?? "", s.indirizzo, s.uso,
            s.data_lettura, s.lettura_annuale, s.lettura_precedente ?? "",
            new Date(s.created_at).toLocaleString("it-IT"),
        ]);
        const csv = "\uFEFF" + [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `autoletture_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    // Filter logic
    const filtered = submissions.filter(s => {
        const matchesSearch =
            (s.nome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (s.cognome?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (s.matricola?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
            (s.indirizzo?.toLowerCase() || "").includes(searchTerm.toLowerCase());

        const matchesDate = !dateFilter || new Date(s.created_at).toISOString().split('T')[0] === dateFilter;

        return matchesSearch && matchesDate;
    });

    const paged = filtered.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    // Stats
    const stats = [
        { label: "Autoletture Totali", value: submissions.length, icon: FileText },
        { label: "Utenti Unici", value: new Set(submissions.map(s => `${s.cognome} ${s.nome}`)).size, icon: Users },
        { label: "Letture Oggi", value: submissions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length, icon: Calendar },
    ];

    return (
        <div className="admin-dashboard-root">
            {/* Header */}
            <div className="dashboard-header">
                <div className="header-container">
                    <div className="header-title">
                        <h1>Dashboard Amministrativa</h1>
                        <p>Gestione e monitoraggio delle autoletture</p>
                    </div>

                    <div className="header-actions">
                        <button
                            onClick={fetchSubmissions}
                            disabled={loading}
                            className="btn-secondary"
                        >
                            <RefreshCw className={loading ? "animate-spin" : ""} size={16} />
                            <span>Aggiorna</span>
                        </button>
                        <button
                            onClick={logout}
                            className="btn-danger"
                        >
                            <LogOut size={16} />
                            <span>Esci</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="dashboard-content">

                {/* Stats Cards */}
                <div className="stats-grid">
                    {stats.map((stat, i) => (
                        <div key={i} className="stats-card">
                            <div className="stats-icon">
                                <stat.icon size={24} />
                            </div>
                            <div className="stats-info">
                                <p>{stat.label}</p>
                                <p>{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Card (Table) */}
                <div className="main-card">

                    {/* Toolbar */}
                    <div className="toolbar">
                        <div className="filter-group">
                            <label className="filter-label">Ricerca Libera</label>
                            <div className="search-wrapper">
                                <Search className="search-icon" />
                                <input
                                    type="text"
                                    placeholder="Cerca per matricola, cognome, nome..."
                                    value={searchTerm}
                                    onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                                    className="search-input"
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label className="filter-label">Filtra per Data</label>
                            <div className="date-filter-wrapper">
                                <Calendar className="date-icon" />
                                <input
                                    type="date"
                                    value={dateFilter}
                                    onChange={(e) => { setDateFilter(e.target.value); setPage(0); }}
                                    className="date-input"
                                    title="Mostra solo le autoletture inviate in questa data"
                                />
                                {dateFilter && (
                                    <button
                                        onClick={() => setDateFilter("")}
                                        className="clear-date"
                                        title="Rimuovi filtro data"
                                    >
                                        <X size={14} />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="filter-group" style={{ alignItems: 'flex-start' }}>
                            <label className="filter-label" style={{ opacity: 0 }}>Esporta</label>
                            <button
                                onClick={downloadCSV}
                                disabled={!filtered.length}
                                className={`btn-primary ${(searchTerm || dateFilter) ? 'is-filtered' : ''}`}
                            >
                                <Download size={16} />
                                {(searchTerm || dateFilter) ? 'Esporta Risultati Filtrati' : 'Esporta Tutto (CSV)'}
                            </button>
                            {(searchTerm || dateFilter) && (
                                <p className="filter-helper">
                                    <CheckCircle2 size={12} color="#10b981" />
                                    Il file conterrà solo i dati filtrati
                                </p>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div style={{ margin: 24, padding: 16, background: '#fef2f2', color: '#dc2626', borderRadius: 12, fontSize: 14, border: '1px solid #fee2e2' }}>
                            <span style={{ fontWeight: 800 }}>Errore:</span> {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="table-responsive">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Data Invio</th>
                                    <th>Matricola</th>
                                    <th>Utente (Cognome Nome)</th>
                                    <th>Indirizzo</th>
                                    <th>Uso</th>
                                    <th style={{ textAlign: 'right' }}>Lettura (mc)</th>
                                    <th style={{ textAlign: 'center' }}>Azioni</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '48px 0', textAlign: 'center' }}>
                                            <Loader2 className="animate-spin" size={32} style={{ color: '#2563eb', margin: '0 auto 8px' }} />
                                            <p style={{ color: '#64748b' }}>Caricamento dati...</p>
                                        </td>
                                    </tr>
                                ) : paged.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} style={{ padding: '48px 0', textAlign: 'center', color: '#64748b' }}>
                                            Nessuna autolettura trovata.
                                        </td>
                                    </tr>
                                ) : (
                                    paged.map((s) => (
                                        <tr key={s.id}>
                                            <td style={{ color: '#64748b' }}>
                                                {new Date(s.created_at).toLocaleDateString("it-IT", { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td style={{ fontFamily: 'monospace', fontWeight: 600 }}>
                                                {s.matricola}
                                            </td>
                                            <td style={{ fontWeight: 500, color: '#0f172a' }}>
                                                {s.cognome} {s.nome}
                                            </td>
                                            <td style={{ color: '#64748b', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={s.indirizzo}>
                                                {s.indirizzo}
                                            </td>
                                            <td>
                                                <span className="status-badge">
                                                    {s.uso}
                                                </span>
                                            </td>
                                            <td style={{ textAlign: 'right', fontFamily: 'monospace' }}>
                                                {s.lettura_annuale}
                                            </td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    onClick={() => setSelectedSub(s)}
                                                    className="btn-icon"
                                                    title="Vedi Dettagli"
                                                >
                                                    <Eye size={16} color="#94a3b8" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            <span className="pagination-info">
                                Pagina {page + 1} di {totalPages}
                            </span>
                            <div className="pagination-controls">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="btn-icon"
                                >
                                    <ChevronLeft size={16} />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="btn-icon"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Detail */}
            {selectedSub && (
                <div
                    className="modal-backdrop"
                    onClick={() => setSelectedSub(null)}
                >
                    <div
                        className="modal-content"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="modal-header">
                            <div>
                                <h3>Dettaglio Pratica</h3>
                                <p>ID: {selectedSub.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="btn-close"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <div className="modal-body">
                            {/* Grid Data */}
                            <div className="detail-grid">
                                <DetailItem label="Matricola Contatore" value={selectedSub.matricola} />
                                <DetailItem label="Codice Fiscale" value={selectedSub.codice_fiscale} />
                                <DetailItem label="Cognome" value={selectedSub.cognome} />
                                <DetailItem label="Nome" value={selectedSub.nome} />
                                <DetailItem label="Telefono" value={selectedSub.telefono} />
                                <DetailItem label="Email" value={selectedSub.email || "—"} />
                                <DetailItem label="Indirizzo" value={selectedSub.indirizzo} fullWidth />
                                <DetailItem label="Uso" value={selectedSub.uso} />
                                <DetailItem label="Data Lettura" value={selectedSub.data_lettura} />
                                <DetailItem label="Lettura Attuale" value={`${selectedSub.lettura_annuale} mc`} highlight />
                                <DetailItem label="Lettura Precedente" value={selectedSub.lettura_precedente ? `${selectedSub.lettura_precedente} mc` : "—"} />
                            </div>

                            {/* Photo */}
                            {selectedSub.foto_url && (
                                <div className="photo-section">
                                    <h4 className="photo-title">
                                        <CheckCircle2 size={16} color="#22c55e" />
                                        Prova Fotografica
                                    </h4>
                                    <div className="photo-container">
                                        <img
                                            src={selectedSub.foto_url}
                                            alt="Foto contatore"
                                            className="photo-img"
                                        />
                                    </div>
                                    <a
                                        href={selectedSub.foto_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="photo-link"
                                    >
                                        <Eye size={16} />
                                        Apri originale
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="modal-footer">
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="btn-secondary"
                            >
                                Chiudi
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}


function DetailItem({ label, value, fullWidth, highlight }: { label: string, value: string, fullWidth?: boolean, highlight?: boolean }) {
    return (
        <div className={`detail-item ${fullWidth ? "full-width" : ""}`}>
            <p className="detail-label">{label}</p>
            <p className={`detail-value ${highlight ? "highlight" : ""}`}>
                {value}
            </p>
        </div>
    );
}
