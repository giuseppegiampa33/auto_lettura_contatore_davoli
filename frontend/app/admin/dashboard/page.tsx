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

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

interface Submission {
    id: string;
    matricola: string;
    utente: string;
    indirizzo: string;
    uso: string;
    data_lettura: string;
    lettura_annuale: number;
    lettura_precedente: number | null;
    numero_utenza: string | null;
    numero_fattura: string | null;
    data_ultima_fattura: string | null;
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
        if (!submissions.length) return;
        const headers = [
            "ID", "Matricola", "Utente", "Indirizzo", "Uso",
            "Data Lettura", "Lettura Annuale (mc)", "Lettura Precedente (mc)",
            "N. Utenza", "N. Fattura", "Data Ultima Fattura", "Data Invio",
        ];
        const rows = submissions.map((s) => [
            s.id, s.matricola, s.utente, s.indirizzo, s.uso,
            s.data_lettura, s.lettura_annuale, s.lettura_precedente ?? "",
            s.numero_utenza ?? "", s.numero_fattura ?? "",
            s.data_ultima_fattura ?? "",
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
    const filtered = submissions.filter(s =>
        s.utente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.matricola.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.indirizzo.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paged = filtered.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(filtered.length / perPage);

    // Stats
    const stats = [
        { label: "Autoletture Totali", value: submissions.length, icon: FileText },
        { label: "Utenti Unici", value: new Set(submissions.map(s => s.utente)).size, icon: Users },
        { label: "Letture Oggi", value: submissions.filter(s => new Date(s.created_at).toDateString() === new Date().toDateString()).length, icon: Calendar },
    ];

    return (
        <div className="min-h-screen bg-[#f8fafc] animate-fade-in pb-20">
            {/* Header Background */}
            <div className="bg-white border-b border-slate-200">
                <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Dashboard Amministrativa</h1>
                        <p className="text-slate-500 text-sm mt-1">Gestione e monitoraggio delle autoletture</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchSubmissions}
                            disabled={loading}
                            className="h-10 px-4 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center gap-2"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                            <span className="hidden sm:inline">Aggiorna</span>
                        </button>
                        <button
                            onClick={logout}
                            className="h-10 px-4 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-semibold hover:bg-red-100 transition-all flex items-center gap-2"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Esci</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {stats.map((stat, i) => (
                        <div key={i} className="bg-white rounded-[20px] p-6 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.04)] flex items-center gap-5 hover:-translate-y-1 transition-transform duration-300">
                            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-slate-500 text-sm font-medium">{stat.label}</p>
                                <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Main Content Card */}
                <div className="bg-white rounded-[24px] border border-slate-200 shadow-sm overflow-hidden">

                    {/* Toolbar */}
                    <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
                        <div className="relative max-w-sm w-full">
                            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Cerca per matricola, utente..."
                                value={searchTerm}
                                onChange={(e) => { setSearchTerm(e.target.value); setPage(0); }}
                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                            />
                        </div>

                        <button
                            onClick={downloadCSV}
                            disabled={!submissions.length}
                            className="h-10 px-5 bg-[#2563eb] text-white rounded-xl text-sm font-semibold hover:bg-blue-700 shadow-[0_2px_10px_rgba(37,99,235,0.2)] hover:shadow-[0_4px_14px_rgba(37,99,235,0.3)] transition-all flex items-center gap-2 disabled:opacity-50 disabled:shadow-none"
                        >
                            <Download className="w-4 h-4" />
                            Esporta CSV
                        </button>
                    </div>

                    {error && (
                        <div className="m-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 flex items-center gap-2">
                            <span className="font-bold">Errore:</span> {error}
                        </div>
                    )}

                    {/* Table */}
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 bg-slate-50/50 text-xs uppercase tracking-wider text-slate-500 font-semibold">
                                    <th className="px-6 py-4">Data Invio</th>
                                    <th className="px-6 py-4">Matricola</th>
                                    <th className="px-6 py-4">Utente</th>
                                    <th className="px-6 py-4">Indirizzo</th>
                                    <th className="px-6 py-4">Uso</th>
                                    <th className="px-6 py-4 text-right">Lettura (mc)</th>
                                    <th className="px-6 py-4 text-center">Azioni</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center">
                                            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-2" />
                                            <p className="text-slate-500">Caricamento dati...</p>
                                        </td>
                                    </tr>
                                ) : paged.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-slate-500">
                                            Nessuna autolettura trovata.
                                        </td>
                                    </tr>
                                ) : (
                                    paged.map((s) => (
                                        <tr key={s.id} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                                            <td className="px-6 py-4 text-slate-500">
                                                {new Date(s.created_at).toLocaleDateString("it-IT", { day: '2-digit', month: 'short', year: 'numeric' })}
                                            </td>
                                            <td className="px-6 py-4 font-mono font-medium text-slate-700">
                                                {s.matricola}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-900">
                                                {s.utente}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 max-w-[200px] truncate" title={s.indirizzo}>
                                                {s.indirizzo}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-50 text-blue-700 capitalize border border-blue-100">
                                                    {s.uso}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono text-slate-700">
                                                {s.lettura_annuale}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <button
                                                    onClick={() => setSelectedSub(s)}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                                    title="Vedi Dettagli"
                                                >
                                                    <Eye className="w-4 h-4" />
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
                        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/30">
                            <span className="text-xs font-medium text-slate-500">
                                Pagina {page + 1} di {totalPages}
                            </span>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setPage(p => Math.max(0, p - 1))}
                                    disabled={page === 0}
                                    className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronLeft className="w-4 h-4 text-slate-600" />
                                </button>
                                <button
                                    onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
                                    disabled={page >= totalPages - 1}
                                    className="p-2 bg-white border border-slate-200 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                                >
                                    <ChevronRight className="w-4 h-4 text-slate-600" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal - Detail */}
            {selectedSub && (
                <div
                    className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedSub(null)}
                >
                    <div
                        className="bg-white rounded-[28px] shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slide-down border border-white/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between sticky top-0 bg-white z-10">
                            <div>
                                <h3 className="text-xl font-bold text-slate-900">Dettaglio Pratica</h3>
                                <p className="text-sm text-slate-400 font-mono mt-1">ID: {selectedSub.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-8 space-y-8">

                            {/* Grid Data */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <DetailItem label="Matricola Contatore" value={selectedSub.matricola} />
                                <DetailItem label="Utente" value={selectedSub.utente} />
                                <DetailItem label="Indirizzo" value={selectedSub.indirizzo} fullWidth />
                                <DetailItem label="Uso" value={selectedSub.uso} />
                                <DetailItem label="Data Lettura" value={selectedSub.data_lettura} />
                                <DetailItem label="Lettura Attuale" value={`${selectedSub.lettura_annuale} mc`} highlight />
                                <DetailItem label="Lettura Precedente" value={selectedSub.lettura_precedente ? `${selectedSub.lettura_precedente} mc` : "—"} />
                                <DetailItem label="N. Utenza" value={selectedSub.numero_utenza || "—"} />
                                <DetailItem label="N. Fattura" value={selectedSub.numero_fattura || "—"} />
                            </div>

                            {/* Photo */}
                            {selectedSub.foto_url && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                        Prova Fotografica
                                    </h4>
                                    <div className="bg-slate-50 p-2 rounded-2xl border border-slate-100">
                                        <img
                                            src={selectedSub.foto_url}
                                            alt="Foto contatore"
                                            className="w-full rounded-xl object-contain max-h-[400px]"
                                        />
                                    </div>
                                    <a
                                        href={selectedSub.foto_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
                                    >
                                        <Eye className="w-4 h-4" />
                                        Apri originale
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="px-8 py-5 border-t border-slate-100 bg-slate-50 rounded-b-[28px] flex justify-end">
                            <button
                                onClick={() => setSelectedSub(null)}
                                className="px-6 py-2.5 bg-white border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
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
        <div className={`${fullWidth ? "col-span-1 md:col-span-2" : "col-span-1"}`}>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1.5">{label}</p>
            <p className={`font-medium ${highlight ? "text-blue-600 font-bold text-lg" : "text-slate-800"}`}>
                {value}
            </p>
        </div>
    );
}
