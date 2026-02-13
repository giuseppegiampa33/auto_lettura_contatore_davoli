"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Copy, Home, FileText } from "lucide-react";
import { useState, Suspense } from "react";

function ConfirmContent() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id") || "N/D";
    const [copied, setCopied] = useState(false);

    const copyId = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-xl mx-auto px-4 py-[10vh] text-center animate-fade-in-up">
            <div className="bg-bg-card border border-border rounded-2xl shadow-sm p-10">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-success-light rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 className="w-10 h-10 text-success" />
                </div>

                <h2 className="text-3xl font-extrabold text-primary mb-2">
                    Autolettura Inviata!
                </h2>
                <p className="text-text-muted mb-8">
                    La tua autolettura è stata registrata con successo. Conserva il codice
                    pratica riportato qui sotto.
                </p>

                {/* Code */}
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 mb-8">
                    <p className="text-xs text-text-muted uppercase tracking-widest font-semibold mb-2">
                        Codice Pratica
                    </p>
                    <div className="flex items-center justify-center gap-3">
                        <code className="text-xl md:text-2xl font-mono font-bold text-primary tracking-wider break-all">
                            {id}
                        </code>
                        <button
                            onClick={copyId}
                            title="Copia codice"
                            className="p-2 rounded-lg bg-white border border-border hover:bg-accent/10 hover:border-accent transition-all"
                        >
                            {copied ? (
                                <CheckCircle2 className="w-5 h-5 text-success" />
                            ) : (
                                <Copy className="w-5 h-5 text-primary" />
                            )}
                        </button>
                    </div>
                    {copied && (
                        <p className="text-xs text-success mt-2 animate-fade-in">
                            Copiato negli appunti!
                        </p>
                    )}
                </div>

                <p className="text-sm text-text-muted mb-8 leading-relaxed">
                    L&apos;ufficio competente provvederà alla verifica della lettura
                    trasmessa. In caso di anomalie, sarai contattato ai recapiti
                    eventualmente indicati.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:bg-primary-light transition-colors"
                    >
                        <Home className="w-4 h-4" />
                        Torna alla Home
                    </Link>
                    <Link
                        href="/submit"
                        className="inline-flex items-center justify-center gap-2 bg-white text-primary border border-primary/30 font-semibold px-6 py-3 rounded-xl hover:bg-primary/5 transition-colors"
                    >
                        <FileText className="w-4 h-4" />
                        Nuova Autolettura
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function ConfirmPage() {
    return (
        <Suspense
            fallback={
                <div className="max-w-xl mx-auto px-4 py-[10vh] text-center">
                    <p className="text-text-muted">Caricamento...</p>
                </div>
            }
        >
            <ConfirmContent />
        </Suspense>
    );
}
