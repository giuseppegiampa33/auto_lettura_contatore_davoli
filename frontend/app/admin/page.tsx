"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";
import "./admin-login.css";

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
        <div className="admin-login-body">
            {/* Background Decor */}
            <div className="admin-login-decor-1" />
            <div className="admin-login-decor-2" />

            <div className="admin-login-card">

                {/* 1. Pill Badge */}
                <div className="admin-login-badge">
                    <Lock className="w-3.5 h-3.5" />
                    Area Riservata
                </div>

                {/* 2. Header */}
                <div className="admin-login-header">
                    <h1 className="admin-login-title">
                        Bentornato
                    </h1>
                    <p className="admin-login-subtitle">
                        Accedi al pannello per gestire le autoletture comunali.
                    </p>
                </div>

                {/* 3. Form Section */}
                <form onSubmit={handleLogin} className="admin-login-form">
                    {error && (
                        <div className="admin-login-error">
                            <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                            <p className="admin-login-error-text">{error}</p>
                        </div>
                    )}

                    <div className="admin-input-group">
                        <label htmlFor="username" className="admin-input-label">
                            Nome utente
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="admin-input-field"
                            placeholder="admin"
                        />
                    </div>

                    <div className="admin-input-group">
                        <label htmlFor="password" className="admin-input-label">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="admin-input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    {/* 4. Action Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="admin-submit-btn"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Caricamento...
                            </>
                        ) : (
                            <>
                                Accedi al Pannello
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </form>

                {/* 5. Footer Security */}
                <div className="admin-footer-security">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Connessione protetta RSA 2048-bit</span>
                </div>
            </div>
        </div>
    );
}
