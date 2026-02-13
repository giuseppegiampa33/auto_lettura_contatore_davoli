"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, AlertTriangle } from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function AdminLoginPage() {
    const router = useRouter();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/admin/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, password }),
            });

            if (!res.ok) {
                throw new Error("Credenziali non valide.");
            }

            const data = await res.json();
            localStorage.setItem("admin_token", data.access_token);
            router.push("/admin/dashboard");
        } catch (err: unknown) {
            setError(
                err instanceof Error ? err.message : "Errore durante l'accesso."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[80vh] flex items-center justify-center px-4 animate-fade-in">
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm max-w-md w-full overflow-hidden">
                <div className="bg-gradient-to-r from-primary-dark to-primary text-white px-8 py-8 text-center">
                    <div className="w-16 h-16 bg-white/15 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8" />
                    </div>
                    <h2 className="text-2xl font-bold">Area Riservata</h2>
                    <p className="text-sm text-blue-200 mt-1">
                        Accesso per il personale del Comune
                    </p>
                </div>

                <form onSubmit={handleLogin} className="p-8 space-y-5">
                    {error && (
                        <div className="bg-red-50 border border-danger/30 rounded-xl p-3 flex items-center gap-2 text-sm text-danger animate-slide-down">
                            <AlertTriangle className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div>
                        <label
                            htmlFor="username"
                            className="block text-sm font-semibold text-text mb-1.5"
                        >
                            Nome utente
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none text-sm"
                            placeholder="admin"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-text mb-1.5"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-3 rounded-xl border border-border bg-white text-text focus:ring-2 focus:ring-accent focus:border-accent transition-all outline-none text-sm"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-xl hover:bg-primary-light transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Accesso...
                            </>
                        ) : (
                            "Accedi"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
