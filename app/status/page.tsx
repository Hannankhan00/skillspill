"use client";

import { useState, useEffect } from "react";

/* ─── types ─── */
interface Service { id: string; name: string; status: string; uptime: number; latency: number; updatedAt: string; }
interface IncidentUpdate { id: string; message: string; status: string; createdAt: string; }
interface Incident { id: string; title: string; description: string; severity: string; status: string; affectedServices: string | null; resolvedAt: string | null; createdAt: string; updatedAt: string; updates: IncidentUpdate[]; }

/* ─── helpers ─── */
const STATUS_META: Record<string, { label: string; color: string; dot: string }> = {
    operational: { label: "Operational", color: "#39FF14", dot: "#39FF14" },
    degraded:    { label: "Degraded",    color: "#F59E0B", dot: "#F59E0B" },
    outage:      { label: "Outage",      color: "#E8294A", dot: "#E8294A" },
};

const SEVERITY_META: Record<string, { label: string; color: string }> = {
    minor:    { label: "Minor",    color: "#F59E0B" },
    major:    { label: "Major",    color: "#F97316" },
    critical: { label: "Critical", color: "#E8294A" },
};

const ISTATUS_META: Record<string, { label: string; color: string }> = {
    investigating: { label: "Investigating", color: "#F59E0B" },
    identified:    { label: "Identified",    color: "#F97316" },
    monitoring:    { label: "Monitoring",    color: "#0DD5E7" },
    resolved:      { label: "Resolved",      color: "#39FF14" },
};

function fmt(dateStr: string) {
    return new Date(dateStr).toLocaleString(undefined, { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

function relative(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

/* ─── icons ─── */
const IC = {
    check: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>,
    warn: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
    alert: () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>,
    clock: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
    bolt: () => <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    refresh: () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>,
    chevron: (open: boolean) => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform .2s" }}><polyline points="6 9 12 15 18 9"/></svg>,
};

function OverallBanner({ status }: { status: string }) {
    const meta = STATUS_META[status] || STATUS_META.operational;
    const Icon = status === "operational" ? IC.check : status === "degraded" ? IC.warn : IC.alert;
    return (
        <div className="rounded-2xl p-6 flex items-center gap-4 mb-8"
            style={{ background: `${meta.color}10`, border: `1px solid ${meta.color}30`, boxShadow: `0 0 40px ${meta.color}08` }}>
            <div className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0" style={{ background: `${meta.color}20`, color: meta.color }}>
                <Icon />
            </div>
            <div>
                <div className="text-xl font-bold" style={{ color: meta.color, fontFamily: "var(--font-jetbrains-mono, monospace)" }}>
                    {status === "operational" ? "All Systems Operational" : status === "degraded" ? "Partial Service Degradation" : "Service Outage Detected"}
                </div>
                <div className="text-sm mt-0.5" style={{ color: "#888" }}>
                    {status === "operational" ? "Everything is running smoothly." : status === "degraded" ? "Some services are experiencing issues." : "We are actively working to restore full service."}
                </div>
            </div>
            <div className="ml-auto shrink-0 flex items-center gap-2 text-xs" style={{ color: "#555", fontFamily: "monospace" }}>
                <span className="inline-block w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: meta.dot }} />
                <span>Live</span>
            </div>
        </div>
    );
}

function ServiceRow({ service }: { service: Service }) {
    const meta = STATUS_META[service.status] || STATUS_META.operational;
    return (
        <div className="flex items-center justify-between py-4 px-5 border-b last:border-b-0" style={{ borderColor: "#ffffff08" }}>
            <div className="flex items-center gap-3">
                <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: meta.dot, boxShadow: `0 0 6px ${meta.dot}80` }} />
                <span className="text-sm font-medium" style={{ color: "#e5e5e5", fontFamily: "var(--font-dm-sans, sans-serif)" }}>{service.name}</span>
            </div>
            <div className="flex items-center gap-6">
                <div className="hidden sm:flex flex-col items-end">
                    <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#555", fontFamily: "monospace" }}>Uptime</span>
                    <span className="text-xs font-bold" style={{ color: "#aaa", fontFamily: "monospace" }}>{service.uptime.toFixed(2)}%</span>
                </div>
                {service.latency > 0 && (
                    <div className="hidden sm:flex flex-col items-end">
                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#555", fontFamily: "monospace" }}>Latency</span>
                        <span className="text-xs font-bold" style={{ color: "#aaa", fontFamily: "monospace" }}>{service.latency}ms</span>
                    </div>
                )}
                <span className="px-2.5 py-1 rounded text-[10px] font-bold uppercase tracking-wider"
                    style={{ background: `${meta.color}15`, color: meta.color, border: `1px solid ${meta.color}25`, fontFamily: "monospace" }}>
                    {meta.label}
                </span>
            </div>
        </div>
    );
}

function IncidentCard({ incident, defaultOpen = false }: { incident: Incident; defaultOpen?: boolean }) {
    const [open, setOpen] = useState(defaultOpen);
    const sev = SEVERITY_META[incident.severity] || SEVERITY_META.minor;
    const ist = ISTATUS_META[incident.status] || ISTATUS_META.investigating;
    const affected = incident.affectedServices ? JSON.parse(incident.affectedServices) as string[] : [];

    return (
        <div className="rounded-xl overflow-hidden mb-3" style={{ background: "#0d0d0d", border: `1px solid ${sev.color}20` }}>
            <button onClick={() => setOpen(o => !o)} className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer" style={{ background: "transparent", border: "none" }}>
                <div className="flex items-center gap-3">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: sev.color, boxShadow: `0 0 6px ${sev.color}80` }} />
                    <div>
                        <div className="text-sm font-bold" style={{ color: "#e5e5e5" }}>{incident.title}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ background: `${sev.color}15`, color: sev.color, border: `1px solid ${sev.color}25`, fontFamily: "monospace" }}>{sev.label}</span>
                            <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider" style={{ background: `${ist.color}15`, color: ist.color, border: `1px solid ${ist.color}25`, fontFamily: "monospace" }}>{ist.label}</span>
                            {affected.length > 0 && (
                                <span className="text-[10px]" style={{ color: "#555" }}>{affected.join(", ")}</span>
                            )}
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                    <span className="text-[11px]" style={{ color: "#555", fontFamily: "monospace" }}>{relative(incident.createdAt)}</span>
                    <span style={{ color: "#555" }}>{IC.chevron(open)}</span>
                </div>
            </button>
            {open && (
                <div className="px-5 pb-5 border-t" style={{ borderColor: "#ffffff08" }}>
                    <div className="flex flex-col gap-3 pt-4">
                        {incident.updates.map((u) => (
                            <div key={u.id} className="flex gap-3">
                                <div className="flex flex-col items-center">
                                    <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ backgroundColor: (ISTATUS_META[u.status] || ISTATUS_META.investigating).color }} />
                                    <div className="w-px flex-1 mt-1" style={{ background: "#ffffff10" }} />
                                </div>
                                <div className="pb-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: (ISTATUS_META[u.status] || ISTATUS_META.investigating).color, fontFamily: "monospace" }}>
                                            {(ISTATUS_META[u.status] || ISTATUS_META.investigating).label}
                                        </span>
                                        <span className="text-[10px]" style={{ color: "#555", fontFamily: "monospace" }}>{fmt(u.createdAt)}</span>
                                    </div>
                                    <p className="text-sm leading-relaxed" style={{ color: "#aaa" }}>{u.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {incident.resolvedAt && (
                        <div className="mt-2 text-[11px]" style={{ color: "#555", fontFamily: "monospace" }}>
                            Resolved at {fmt(incident.resolvedAt)}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default function StatusPage() {
    const [data, setData] = useState<{ overallStatus: string; services: Service[]; activeIncidents: Incident[]; recentResolved: Incident[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    const load = async () => {
        try {
            const res = await fetch("/api/status");
            const d = await res.json();
            if (res.ok) { setData(d); setLastUpdated(new Date()); }
        } catch {}
        finally { setLoading(false); }
    };

    useEffect(() => { load(); const t = setInterval(load, 60000); return () => clearInterval(t); }, []);

    return (
        <div className="min-h-screen" style={{ background: "#050505", color: "#e5e5e5" }}>
            {/* Nav */}
            <nav className="border-b px-6 py-4 flex items-center justify-between sticky top-0 z-50" style={{ borderColor: "#ffffff0a", background: "#050505cc", backdropFilter: "blur(20px)" }}>
                <a href="/" className="flex items-center gap-2 no-underline">
                    <img src="/assets/logo 2.png" alt="SkillSpill" className="h-9" />
                </a>
                <div className="flex items-center gap-2 text-xs" style={{ color: "#555", fontFamily: "monospace" }}>
                    {lastUpdated && (
                        <span className="flex items-center gap-1">
                            {IC.refresh()} Updated {relative(lastUpdated.toISOString())}
                        </span>
                    )}
                    <button onClick={load} className="px-3 py-1.5 rounded-lg text-xs font-bold border cursor-pointer" style={{ background: "transparent", borderColor: "#ffffff15", color: "#888" }}>Refresh</button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto px-6 py-12">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold mb-2" style={{ fontFamily: "var(--font-jetbrains-mono, monospace)" }}>System Status</h1>
                    <p className="text-sm" style={{ color: "#666" }}>Real-time status of all SkillSpill services.</p>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-24">
                        <div className="w-8 h-8 rounded-full border-2 animate-spin" style={{ borderColor: "#39FF1430", borderTopColor: "#39FF14" }} />
                    </div>
                ) : data ? (
                    <>
                        <OverallBanner status={data.overallStatus} />

                        {/* Services */}
                        <div className="rounded-2xl overflow-hidden mb-8" style={{ background: "#0d0d0d", border: "1px solid #ffffff0a" }}>
                            <div className="px-5 py-4 border-b" style={{ borderColor: "#ffffff08" }}>
                                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "#666", fontFamily: "monospace" }}>Services</h2>
                            </div>
                            {data.services.map((s) => <ServiceRow key={s.id} service={s} />)}
                        </div>

                        {/* Active Incidents */}
                        {data.activeIncidents.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#E8294A", fontFamily: "monospace" }}>
                                    Active Incidents ({data.activeIncidents.length})
                                </h2>
                                {data.activeIncidents.map((i) => <IncidentCard key={i.id} incident={i} defaultOpen />)}
                            </div>
                        )}

                        {/* Recent Incidents */}
                        {data.recentResolved.length > 0 && (
                            <div className="mb-8">
                                <h2 className="text-sm font-bold uppercase tracking-wider mb-4" style={{ color: "#555", fontFamily: "monospace" }}>
                                    Past Incidents — Last 7 Days
                                </h2>
                                {data.recentResolved.map((i) => <IncidentCard key={i.id} incident={i} />)}
                            </div>
                        )}

                        {data.activeIncidents.length === 0 && data.recentResolved.length === 0 && (
                            <div className="text-center py-12" style={{ color: "#555" }}>
                                <div className="text-4xl mb-3">✓</div>
                                <div className="text-sm font-bold" style={{ fontFamily: "monospace" }}>No incidents in the past 7 days</div>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="text-center py-24" style={{ color: "#555" }}>Failed to load status.</div>
                )}
            </div>

            <footer className="border-t py-6 px-6 text-center" style={{ borderColor: "#ffffff08" }}>
                <p className="text-xs" style={{ color: "#444", fontFamily: "monospace" }}>
                    © 2026 SKILLSPILL INC. · <a href="/" className="no-underline hover:underline" style={{ color: "#555" }}>Back to Home</a>
                </p>
            </footer>
        </div>
    );
}
