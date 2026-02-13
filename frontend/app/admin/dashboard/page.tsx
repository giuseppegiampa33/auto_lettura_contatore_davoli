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
            "ID",
            "Matricola",
            "Utente",
            "Indirizzo",
            "Uso",
            "Data Lettura",
            "Lettura Annuale (mc)",
            "Lettura Precedente (mc)",
            "N. Utenza",
            "N. Fattura",
            "Data Ultima Fattura",
            "Data Invio",
        ];
        const rows = submissions.map((s) => [
            s.id,
            s.matricola,
            s.utente,
            s.indirizzo,
            s.uso,
            s.data_lettura,
            s.lettura_annuale,
            s.lettura_precedente ?? "",
            s.numero_utenza ?? "",
            s.numero_fattura ?? "",
            s.data_ultima_fattura ?? "",
            new Date(s.created_at).toLocaleString("it-IT"),
        ]);
        const csv =
            "\uFEFF" +
            [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `autoletture_${new Date().toISOString().split("T")[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const paged = submissions.slice(page * perPage, (page + 1) * perPage);
    const totalPages = Math.ceil(submissions.length / perPage);

    return (
        <div className="max-w-7xl mx-auto px-4 py-[3vh] animate-fade-in">
            {/* Top Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-primary">
                        Dashboard Amministrativa
                    </h2>
                    <p className="text-sm text-text-muted">
                        {submissions.length} autoletture totali
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={fetchSubmissions}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
                        Aggiorna
                    </button>
                    <button
                        onClick={downloadCSV}
                        disabled={!submissions.length}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-success text-white rounded-xl text-sm font-semibold hover:bg-emerald-600 transition-colors disabled:opacity-50"
                    >
                        <Download className="w-4 h-4" />
                        Esporta CSV
                    </button>
                    <button
                        onClick={logout}
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-danger text-white rounded-xl text-sm font-semibold hover:bg-red-600 transition-colors"
                    >
                        <LogOut className="w-4 h-4" />
                        Esci
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-danger/30 rounded-xl p-4 mb-4 text-sm text-danger">
                    {error}
                </div>
            )}

            {/* Table */}
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-primary/5 border-b border-border">
                                <th className="text-left px-4 py-3 font-semibold text-primary">
                                    Data Invio
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-primary">
                                    Matricola
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-primary">
                                    Utente
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-primary">
                                    Indirizzo
                                </th>
                                <th className="text-left px-4 py-3 font-semibold text-primary">
                                    Uso
                                </th>
                                <th className="text-right px-4 py-3 font-semibold text-primary">
                                    Lettura (mc)
                                </th>
                                <th className="text-center px-4 py-3 font-semibold text-primary">
                                    Foto
                                </th>
                                <th className="text-center px-4 py-3 font-semibold text-primary">
                                    Dettagli
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-primary" />
                                    </td>
                                </tr>
                            ) : paged.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={8}
                                        className="text-center py-12 text-text-muted"
                                    >
                                        Nessuna autolettura presente.
                                    </td>
                                </tr>
                            ) : (
                                paged.map((s) => (
                                    <tr
                                        key={s.id}
                                        className="border-b border-border/50 hover:bg-accent/5 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-text-muted">
                                            {new Date(s.created_at).toLocaleDateString("it-IT")}
                                        </td>
                                        <td className="px-4 py-3 font-mono font-medium">
                                            {s.matricola}
                                        </td>
                                        <td className="px-4 py-3">{s.utente}</td>
                                        <td className="px-4 py-3 text-text-muted">{s.indirizzo}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-block bg-accent/10 text-accent text-xs font-semibold px-2 py-1 rounded-lg capitalize">
                                                {s.uso}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right font-mono">
                                            {s.lettura_annuale}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {s.foto_url ? (
                                                <a
                                                    href={s.foto_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-accent hover:underline text-xs"
                                                >
                                                    Vedi
                                                </a>
                                            ) : (
                                                <span className="text-text-muted text-xs">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <button
                                                onClick={() => setSelectedSub(s)}
                                                className="p-1.5 rounded-lg hover:bg-accent/10 transition-colors"
                                                title="Dettagli"
                                            >
                                                <Eye className="w-4 h-4 text-primary" />
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
                    <div className="flex items-center justify-between px-4 py-3 border-t border-border bg-gray-50/50">
                        <span className="text-xs text-text-muted">
                            Pagina {page + 1} di {totalPages}
                        </span>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setPage((p) => Math.max(0, p - 1))}
                                disabled={page === 0}
                                className="p-2 rounded-lg border border-border hover:bg-white transition disabled:opacity-30"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() =>
                                    setPage((p) => Math.min(totalPages - 1, p + 1))
                                }
                                disabled={page >= totalPages - 1}
                                className="p-2 rounded-lg border border-border hover:bg-white transition disabled:opacity-30"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Detail Modal */}
            {selectedSub && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
                    onClick={() => setSelectedSub(null)}
                >
                    <div
                        className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto p-8 animate-slide-down"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-primary mb-4">
                            Dettaglio Autolettura
                        </h3>
                        <div className="space-y-3 text-sm">
                            {[
                                ["Codice Pratica", selectedSub.id],
                                ["Matricola", selectedSub.matricola],
                                ["Utente", selectedSub.utente],
                                ["Indirizzo", selectedSub.indirizzo],
                                ["Uso", selectedSub.uso],
                                ["Data Lettura", selectedSub.data_lettura],
                                [
                                    "Lettura Annuale",
                                    `${selectedSub.lettura_annuale} mc`,
                                ],
                                [
                                    "Lettura Precedente",
                                    selectedSub.lettura_precedente != null
                                        ? `${selectedSub.lettura_precedente} mc`
                                        : "—",
                                ],
                                ["N. Utenza", selectedSub.numero_utenza || "—"],
                                ["N. Fattura", selectedSub.numero_fattura || "—"],
                                [
                                    "Data Ultima Fattura",
                                    selectedSub.data_ultima_fattura || "—",
                                ],
                                [
                                    "Data Invio",
                                    new Date(selectedSub.created_at).toLocaleString("it-IT"),
                                ],
                            ].map(([label, value]) => (
                                <div
                                    key={label}
                                    className="flex justify-between border-b border-border/50 pb-2"
                                >
                                    <span className="text-text-muted font-medium">{label}</span>
                                    <span className="font-semibold text-right break-all max-w-[50%]">
                                        {value}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {selectedSub.foto_url && (
                            <div className="mt-4">
                                <p className="text-sm font-semibold text-text-muted mb-2">
                                    Foto Contatore
                                </p>
                                <img
                                    src={selectedSub.foto_url}
                                    alt="Foto contatore"
                                    className="w-full rounded-xl border border-border max-h-[30vh] object-contain bg-gray-50"
                                />
                            </div>
                        )}

                        <button
                            onClick={() => setSelectedSub(null)}
                            className="mt-6 w-full bg-primary text-white font-semibold py-3 rounded-xl hover:bg-primary-light transition-colors"
                        >
                            Chiudi
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
