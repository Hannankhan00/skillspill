"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Zap, CheckCircle, Github, Linkedin, Briefcase, FileText, Loader2, Link as LinkIcon, Phone, Mail, MessageSquare, Heart, Eye, Share2 } from "lucide-react";
import FollowButton from "@/app/components/FollowButton";
import { CoverBanner } from "@/app/components/CoverBanners";

const accent = "#3CF91A";

/* ── Language colours (same as talent github page) ── */
const langColors: Record<string, string> = {
    TypeScript: "#3178C6", JavaScript: "#F1E05A", Python: "#3572A5", Rust: "#DEA584",
    Go: "#00ADD8", Java: "#B07219", "C++": "#f34b7d", C: "#555555", "C#": "#178600",
    Ruby: "#701516", PHP: "#4F5D95", Shell: "#89e051", HTML: "#e34c26", CSS: "#563d7c",
    Swift: "#F05138", Kotlin: "#A97BFF", Dart: "#00B4AB", Vue: "#41b883", SCSS: "#c6538c",
};

function ActivityIcon({ type }: { type: string }) {
    const icons: Record<string, React.ReactNode> = {
        PushEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="16 3 21 3 21 8" /><line x1="4" y1="20" x2="21" y2="3" /></svg>,
        PullRequestEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="18" r="3" /><circle cx="6" cy="6" r="3" /><path d="M6 21V9a9 9 0 0 0 9 9" /></svg>,
        IssuesEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>,
        CreateEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>,
        ForkEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="6" y1="3" x2="6" y2="15" /><circle cx="18" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M18 9a9 9 0 0 1-9 9" /></svg>,
        WatchEvent: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>,
    };
    const colors: Record<string, string> = { PushEvent: accent, PullRequestEvent: "#A855F7", IssuesEvent: "#EF4444", CreateEvent: "#22C55E", ForkEvent: "#3B82F6", WatchEvent: "#EAB308" };
    return (
        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: `${colors[type] || "#737373"}15`, color: colors[type] || "#737373" }}>
            {icons[type] || <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /></svg>}
        </div>
    );
}

function activityLabel(type: string) {
    const map: Record<string, string> = { PushEvent: "Pushed to", PullRequestEvent: "PR on", CreateEvent: "Created", IssuesEvent: "Issue on", IssueCommentEvent: "Commented on", ForkEvent: "Forked", WatchEvent: "Starred" };
    return map[type] || type.replace("Event", "");
}

function timeAgoGh(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return days < 7 ? `${days}d ago` : `${Math.floor(days / 7)}w ago`;
}

export default function TalentProfileViewPage() {
    const params = useParams();
    const id = params?.id as string;
    const [talentData, setTalentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");

    // GitHub tab state
    const [ghData, setGhData] = useState<any>(null);
    const [ghScore, setGhScore] = useState<any>(null);
    const [ghLoading, setGhLoading] = useState(false);
    const [ghError, setGhError] = useState<string | null>(null);
    const [ghSearch, setGhSearch] = useState("");
    const [showContrib, setShowContrib] = useState(true);

    useEffect(() => {
        if (!id) return;
        fetch(`/api/talents/${id}`)
            .then(res => res.json())
            .then(data => { if (data.talent) setTalentData(data.talent); setIsLoading(false); })
            .catch(() => setIsLoading(false));
    }, [id]);

    // Fetch GitHub data lazily when the tab is opened
    useEffect(() => {
        if (activeTab !== "GitHub" || ghData || ghLoading || !id) return;
        setGhLoading(true);
        setGhError(null);
        Promise.all([
            fetch(`/api/talents/${id}/github`).then(r => r.json()),
            fetch(`/api/github/scorecard?userId=${id}`).then(r => r.json()),
        ]).then(([live, score]) => {
            if (live.error) setGhError(live.error);
            else setGhData(live);
            setGhScore(score);
        }).catch(() => setGhError("Failed to load GitHub data"))
          .finally(() => setGhLoading(false));
    }, [activeTab, id, ghData, ghLoading]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
                <p className="text-[13px] text-(--theme-text-muted) font-medium">Loading talent profile...</p>
            </div>
        );
    }

    if (!talentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <h3 className="text-lg font-bold text-red-400 mb-2">Talent Not Found</h3>
                <p className="text-[13px] text-(--theme-text-muted)">We couldn&apos;t locate this talent&apos;s profile.</p>
            </div>
        );
    }

    const { fullName, username, talentProfile, avatarUrl, coverUrl, _count } = talentData;
    const { bio, experienceLevel, skills, projectLinks, githubUsername, githubConnected, githubRepos, githubStars, linkedinUrl, portfolioUrl, resumeUrl, isAvailable, contactEmail, contactPhone, showEmail, showPhone, showSocials, workExperience } = talentProfile || {};
    const spills = talentData.spillPosts;
    const followersCount: number = _count?.followers ?? 0;
    const followingCount: number = _count?.following ?? 0;

    const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const initials = fullName ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
    const role = experienceLevel ? `${experienceLevel} Developer` : "Developer";
    const tabs = ["Overview", "Experience", "Projects", "Skills", "Spills", ...(githubConnected ? ["GitHub"] : [])];

    // Derived GitHub data
    const ghRepos = ghData?.repos || [];
    const ghProfile = ghData?.githubProfile || null;
    const ghContribs = ghData?.contributionData || null;
    const ghActivity = ghData?.recentActivity || [];
    const ghTotalStars = ghData?.totalStars || 0;
    const ghTotalRepos = ghData?.totalRepos || ghRepos.length;
    const ghLangStats = ghData?.languageStats || {};
    const totalLangRepos = Object.values(ghLangStats).reduce((s: number, c) => s + (c as number), 0) as number;
    const langChartData = Object.entries(ghLangStats)
        .sort(([, a], [, b]) => (b as number) - (a as number))
        .map(([name, count]) => ({ name, count: count as number, pct: totalLangRepos > 0 ? Math.round(((count as number) / totalLangRepos) * 100) : 0, color: langColors[name] || "#737373" }));
    const filteredRepos = ghRepos.filter((r: any) =>
        r.name.toLowerCase().includes(ghSearch.toLowerCase()) ||
        (r.description || "").toLowerCase().includes(ghSearch.toLowerCase())
    );

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ── COVER / BANNER ── */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full relative overflow-hidden">
                    <CoverBanner coverId={coverUrl || "1"}>
                        {/* Decoration */}
                        <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                            <p>{"// talent.profile"}</p>
                            <p>{`const username = "${username}";`}</p>
                            <p>{`const isAvailable = ${isAvailable ?? true};`}</p>
                        </div>
                    </CoverBanner>
                </div>

                {/* Avatar */}
                <div className="max-w-225 mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-(--theme-bg) text-2xl sm:text-3xl font-bold border-4 border-(--theme-bg) shadow-xl shrink-0">
                            {avatarUrl ? (
                                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                            ) : (
                                initials
                            )}
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-(--theme-text-primary)">{fullName}</h1>
                                <span className="text-[12px] font-medium text-(--theme-text-muted)">@{username}</span>
                                {isAvailable !== false && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 ml-2">Open to Work</span>
                                )}
                            </div>
                            <p className="text-[13px] text-(--theme-text-muted) mt-0.5">{role}</p>
                            <p className="text-[11px] text-primary font-medium flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3" /> Talent Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg font-bold text-(--theme-text-primary)">{fullName}</h1>
                    <span className="text-[11px] font-medium text-(--theme-text-muted)">@{username}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[12px] text-(--theme-text-muted)">{role}</p>
                    {isAvailable !== false && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 ml-2">Open</span>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-225 mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* ── Stats / Actions row ── */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-(--theme-border)">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-(--theme-text-primary)">{skills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Skills</p>
                    </div>
                    {githubConnected && (
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-(--theme-text-primary)">{githubRepos || 0}</p>
                            <p className="text-[9px] sm:text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Repos</p>
                        </div>
                    )}
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-(--theme-text-primary)">{followersCount}</p>
                        <p className="text-[9px] sm:text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Followers</p>
                    </div>
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-(--theme-text-primary)">{followingCount}</p>
                        <p className="text-[9px] sm:text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Following</p>
                    </div>
                    <div className="ml-auto flex gap-2">
                        {talentData?.id && (
                            <FollowButton targetUserId={talentData.id} initialIsFollowing={talentData.isFollowing} />
                        )}
                        <Link href={`/recruiter/messages?with=${talentData?.id}`}
                            className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 shadow-lg shadow-[#3CF91A]/20 no-underline"
                            style={{ background: `linear-gradient(135deg, ${accent}, #10B981)` }}>
                            Message Talent
                        </Link>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-0 mt-0 border-b border-(--theme-border) overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-primary text-primary" : "border-transparent text-(--theme-text-muted) hover:text-(--theme-text-tertiary)"}`}>
                            {tab}
                        </button>
                    ))}
                </div>

                {/* ── Tab Content ── */}
                <div className="mt-5 space-y-5">
                    {activeTab === "Experience" && (
                        <div className="space-y-3">
                            {workExperience && workExperience.length > 0 ? (
                                workExperience.map((exp: any) => (
                                    <div key={exp.id} className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-4 sm:p-5 flex gap-4 hover:border-primary/30 transition-all">
                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-linear-to-br from-primary to-[#10B981] flex items-center justify-center text-[13px] font-bold" style={{ color: '#000' }}>
                                            {exp.companyName[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 justify-between flex-wrap">
                                                <div>
                                                    <p className="text-[13px] font-bold text-(--theme-text-primary)">{exp.role}</p>
                                                    <p className="text-[12px] font-medium" style={{ color: '#3CF91A' }}>{exp.companyName}</p>
                                                    <p className="text-[10px] mt-0.5 text-(--theme-text-muted)">
                                                        {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? fmtDate(exp.endDate) : ""}
                                                    </p>
                                                </div>
                                                {exp.isCurrent && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#3CF91A15', color: '#3CF91A', border: '1px solid #3CF91A30' }}>Current</span>
                                                )}
                                            </div>
                                            {exp.description && (
                                                <p className="text-[12px] text-(--theme-text-muted) mt-2 leading-relaxed">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-(--theme-bg-secondary) flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-(--theme-text-muted)" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-(--theme-text-primary) mb-1">No Work Experience</h3>
                                    <p className="text-[12px] text-(--theme-text-muted)">This talent hasn&apos;t added their work history yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-2">About</h2>
                                <p className="text-[13px] text-(--theme-text-tertiary) leading-relaxed whitespace-pre-wrap">{bio || "This user hasn't added a bio yet."}</p>
                                <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-(--theme-text-muted) pt-3 border-t border-(--theme-border-light)">
                                    <span className="flex items-center gap-1.5 text-primary font-medium">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {role}
                                    </span>
                                </div>
                            </div>

                            {/* GitHub Stats */}
                            {githubConnected && githubUsername && (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5">
                                    <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-3 flex items-center gap-2">
                                        <Github className="w-4 h-4" /> GitHub Activity
                                    </h2>
                                    <div className="flex flex-wrap gap-4 mb-4">
                                        {githubRepos != null && (
                                            <div className="text-center px-3 py-2 rounded-xl bg-(--theme-bg-secondary) border border-(--theme-border-light)">
                                                <p className="text-[16px] font-bold text-(--theme-text-primary)">{githubRepos}</p>
                                                <p className="text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Repos</p>
                                            </div>
                                        )}
                                        {githubStars != null && (
                                            <div className="text-center px-3 py-2 rounded-xl bg-(--theme-bg-secondary) border border-(--theme-border-light)">
                                                <p className="text-[16px] font-bold text-(--theme-text-primary)">{githubStars}</p>
                                                <p className="text-[10px] text-(--theme-text-muted) uppercase tracking-wider">Stars</p>
                                            </div>
                                        )}
                                    </div>
                                    <a
                                        href={`https://github.com/${githubUsername}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-semibold border border-(--theme-border) bg-(--theme-bg-secondary) text-(--theme-text-secondary) hover:text-primary hover:border-primary/40 transition-all no-underline"
                                    >
                                        <Github className="w-3.5 h-3.5" /> View @{githubUsername} on GitHub →
                                    </a>
                                </div>
                            )}

                            {/* Links & Socials & Contact */}
                            <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-3 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> Contact & Socials
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {showEmail && contactEmail && (
                                        <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <Mail className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">Email</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">{contactEmail}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showPhone && contactPhone && (
                                        <a href={`tel:${contactPhone}`} className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <Phone className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">Phone</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">{contactPhone}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showSocials && githubUsername && (
                                        <a href={`https://github.com/${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <Github className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">GitHub</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">@{githubUsername}</p>
                                            </div>
                                        </a>
                                    )}
                                    {linkedinUrl && (
                                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <Linkedin className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">LinkedIn</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">View Profile</p>
                                            </div>
                                        </a>
                                    )}
                                    {portfolioUrl && (
                                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <Briefcase className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">Portfolio</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">{portfolioUrl.replace(/^https?:\/\//, '')}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showSocials && resumeUrl && (
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-(--theme-bg-secondary) hover:bg-primary/10 transition-colors border border-(--theme-border-light) hover:border-primary/30 group">
                                            <FileText className="w-5 h-5 text-(--theme-text-secondary) group-hover:text-primary" />
                                            <div>
                                                <p className="text-[12px] font-bold text-(--theme-text-primary)">Resume</p>
                                                <p className="text-[10px] text-(--theme-text-muted)">View Document</p>
                                            </div>
                                        </a>
                                    )}
                                    {(!showSocials && !showEmail && !showPhone) && (
                                        <p className="text-[12px] text-(--theme-text-muted) col-span-2">This talent has chosen to keep their contact info private.</p>
                                    )}
                                    {(showSocials && !githubUsername && !linkedinUrl && !portfolioUrl && !resumeUrl) && (!showEmail && !showPhone) && (
                                        <p className="text-[12px] text-(--theme-text-muted) col-span-2">This talent hasn&apos;t added any public links or contact info yet.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Skills" && (
                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5">
                            <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-primary" /> Professional Skills
                            </h2>
                            {skills && skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: any) => (
                                        <span key={skill.skillName} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-(--theme-input-bg) text-(--theme-text-secondary) border border-(--theme-border-light) shadow-sm flex items-center gap-1.5 hover:border-[#3CF91A]/30 transition-colors">
                                            {skill.isVerified && <CheckCircle className="w-3 h-3 text-primary" />}
                                            {skill.skillName}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[12px] text-(--theme-text-muted)">No skills added yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "Projects" && (
                        <div className="space-y-4">
                            {projectLinks && projectLinks.length > 0 ? (
                                projectLinks.map((project: any, i: number) => (
                                    <div key={i} className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-4 sm:p-5 hover:border-[#3CF91A]/30 transition-all">
                                        <h3 className="text-[14px] font-bold text-(--theme-text-primary) mb-1">{project.title || "Project Link"}</h3>
                                        {project.description && (
                                            <p className="text-[12px] text-(--theme-text-secondary) mb-3 leading-relaxed">{project.description}</p>
                                        )}
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-primary hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3" /> View Project Source
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-8 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-(--theme-bg-secondary) flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-(--theme-text-muted)" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-(--theme-text-primary) mb-1">No Projects Found</h3>
                                    <p className="text-[12px] text-(--theme-text-muted)">This talent hasn&apos;t added any spotlight projects.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {spills && spills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {spills.map((spill: any) => (
                                        <div key={spill.id} className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm overflow-hidden hover:border-primary/30 transition-all flex flex-col h-full">
                                            <div className="p-4 sm:p-5 flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    {avatarUrl ? (
                                                        <img src={avatarUrl} alt={fullName} className="w-8 h-8 rounded-full object-cover shrink-0" />
                                                    ) : (
                                                        <div className="w-8 h-8 rounded-full bg-linear-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-(--theme-bg) text-[9px] font-bold shrink-0">
                                                            {initials}
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-[12px] font-bold text-(--theme-text-primary)">@{username}</p>
                                                        <p className="text-[9px] text-(--theme-text-muted)">{new Date(spill.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-(--theme-text-secondary) leading-relaxed mb-3 line-clamp-4">{spill.caption}</p>
                                                {spill.code && (
                                                    <div className="rounded-xl bg-[#0D1117] border border-(--theme-code-border) overflow-hidden mb-3">
                                                        <pre className="px-3 py-3 text-[10px] text-green-400 font-mono overflow-hidden h-20 relative cursor-pointer" style={{ margin: 0 }}>
                                                            <code>{spill.code}</code>
                                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-linear-to-t from-[#0D1117] to-transparent pointer-events-none"></div>
                                                        </pre>
                                                    </div>
                                                )}
                                                {spill.hashtags && spill.hashtags.length > 0 && (
                                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                                        {spill.hashtags.slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-primary/10 text-primary font-medium">#{tag}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-3 border-t border-(--theme-border-light) bg-(--theme-bg-secondary) flex flex-wrap items-center gap-4 text-[11px] text-(--theme-text-muted)">
                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {spill.likesCount ?? 0}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {spill.commentsCount ?? 0}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {spill.repostsCount ?? 0}</span>
                                                <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {spill.viewsCount ?? 0}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) shadow-sm p-8 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-(--theme-bg-secondary) flex items-center justify-center mb-3">
                                        <MessageSquare className="w-5 h-5 text-(--theme-text-muted)" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-(--theme-text-primary) mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-(--theme-text-muted)">This talent hasn&apos;t posted any spills.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "GitHub" && (
                        <div>
                            {ghLoading && (
                                <div className="flex flex-col items-center justify-center py-20 gap-3">
                                    <Loader2 className="w-8 h-8 animate-spin" style={{ color: accent }} />
                                    <p className="text-[13px] text-(--theme-text-muted)">Loading GitHub profile...</p>
                                </div>
                            )}
                            {!ghLoading && ghError && (
                                <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-10 text-center">
                                    <Github className="w-10 h-10 mx-auto mb-3 text-(--theme-text-muted) opacity-40" />
                                    <p className="text-[14px] font-bold text-(--theme-text-primary) mb-1">GitHub Not Available</p>
                                    <p className="text-[12px] text-(--theme-text-muted)">{ghError}</p>
                                </div>
                            )}
                            {!ghLoading && !ghError && ghData && (
                                <div className="space-y-5">
                                    {/* Score card */}
                                    {ghScore && ghScore.githubScore > 0 && (
                                        <div className="rounded-2xl border border-(--theme-border) bg-(--theme-card) p-4 sm:p-5">
                                            <h2 className="text-[14px] font-bold text-(--theme-text-primary) mb-4 flex items-center gap-2">
                                                <Github className="w-4 h-4" /> GitHub Score
                                            </h2>
                                            <div className="flex items-center gap-6 mb-4">
                                                <div className="text-center">
                                                    <p className="text-4xl font-bold" style={{ color: accent, fontFamily: "var(--font-jetbrains-mono)" }}>{ghScore.githubScore}</p>
                                                    <p className="text-[10px] text-(--theme-text-muted) uppercase tracking-wider mt-1">/ 100</p>
                                                </div>
                                                {ghScore.topRepo && (
                                                    <div className="flex-1">
                                                        <p className="text-[11px] text-(--theme-text-muted) mb-1">Top Repository</p>
                                                        <a href={ghScore.topRepo.url} target="_blank" rel="noopener noreferrer"
                                                            className="text-[13px] font-bold no-underline hover:underline" style={{ color: accent }}>
                                                            {ghScore.topRepo.name}
                                                        </a>
                                                        <p className="text-[10px] text-(--theme-text-muted) mt-0.5">{ghScore.topRepo.language} · Score {ghScore.topRepo.scores?.final ?? "—"}</p>
                                                        {ghScore.topRepo.feedback && (
                                                            <p className="text-[11px] text-(--theme-text-secondary) mt-2 leading-relaxed line-clamp-3">{ghScore.topRepo.feedback}</p>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            {ghScore.otherRepos?.length > 0 && (
                                                <div>
                                                    <p className="text-[11px] text-(--theme-text-muted) mb-2">Other analysed repos</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ghScore.otherRepos.map((r: any) => (
                                                            <a key={r.name} href={r.url} target="_blank" rel="noopener noreferrer"
                                                                className="text-[10px] px-2 py-1 rounded-lg no-underline border border-(--theme-border) text-(--theme-text-secondary) hover:border-primary/40 hover:text-primary transition-colors">
                                                                {r.name} <span className="opacity-60">({r.finalScore})</span>
                                                            </a>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {[
                                            { label: "Contributions", value: ghContribs?.totalContributions?.toLocaleString() ?? "—", icon: "🔥", sub: "this year" },
                                            { label: "Commits", value: ghContribs?.totalCommits?.toLocaleString() ?? "—", icon: "⚡", sub: `${ghContribs?.totalPRs ?? 0} PRs · ${ghContribs?.totalIssues ?? 0} issues` },
                                            { label: "Total Stars", value: ghTotalStars.toLocaleString(), icon: "⭐", sub: `${ghTotalRepos} repos` },
                                            { label: "Followers", value: ghProfile?.followers?.toLocaleString() ?? "—", icon: "👥", sub: `following ${ghProfile?.following ?? 0}` },
                                        ].map(stat => (
                                            <div key={stat.label} className="rounded-2xl border p-4" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="text-lg">{stat.icon}</span>
                                                    <span className="text-[9px] uppercase tracking-widest font-semibold text-(--theme-text-muted)">{stat.label}</span>
                                                </div>
                                                <p className="text-xl font-bold text-(--theme-text-primary)" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{stat.value}</p>
                                                <p className="text-[10px] mt-0.5 text-(--theme-text-muted)">{stat.sub}</p>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex flex-col lg:flex-row gap-5">
                                        {/* Left — heatmap + repos */}
                                        <div className="flex-1 min-w-0 space-y-5">
                                            {/* Contribution heatmap */}
                                            <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                <div className="flex items-center justify-between mb-3">
                                                    <h2 className="text-[13px] font-bold text-(--theme-text-primary)">
                                                        Contribution Activity
                                                        {ghContribs && <span className="font-normal ml-2 text-[11px] text-(--theme-text-muted)">{ghContribs.totalContributions.toLocaleString()} in the last year</span>}
                                                    </h2>
                                                    <button onClick={() => setShowContrib(v => !v)} className="text-[10px] font-medium bg-transparent border-none cursor-pointer text-(--theme-text-muted)">{showContrib ? "Hide" : "Show"}</button>
                                                </div>
                                                {showContrib && ghContribs?.weeks ? (
                                                    <div>
                                                        <div className="flex gap-[2px]">
                                                            {ghContribs.weeks.map((week: any, wi: number) => (
                                                                <div key={wi} className="flex flex-col gap-[2px] flex-1">
                                                                    {week.days.map((day: any, di: number) => (
                                                                        <div key={di} className="w-full rounded-[2px]" title={`${day.date}: ${day.count}`}
                                                                            style={{ backgroundColor: day.count === 0 ? "var(--theme-input-bg)" : day.color, aspectRatio: "1/1" }} />
                                                                    ))}
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex items-center justify-between mt-2">
                                                            <span className="text-[9px] text-(--theme-text-muted)">Less</span>
                                                            <div className="flex gap-[3px]">
                                                                {["var(--theme-input-bg)", "#0e4429", "#006d32", "#26a641", "#39d353"].map((c, i) => (
                                                                    <div key={i} className="w-[11px] h-[11px] rounded-[2px]" style={{ backgroundColor: c }} />
                                                                ))}
                                                            </div>
                                                            <span className="text-[9px] text-(--theme-text-muted)">More</span>
                                                        </div>
                                                    </div>
                                                ) : showContrib && (
                                                    <p className="text-[11px] text-(--theme-text-muted)">No contribution data available.</p>
                                                )}
                                            </div>

                                            {/* Repos */}
                                            <div className="rounded-2xl border overflow-hidden" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                <div className="p-4 sm:p-5" style={{ borderBottom: "1px solid var(--theme-border)" }}>
                                                    <h2 className="text-[13px] font-bold text-(--theme-text-primary) mb-2">
                                                        Repositories <span className="font-normal text-(--theme-text-muted)">({ghRepos.length} public)</span>
                                                    </h2>
                                                    <div className="flex items-center gap-2 rounded-xl px-3 py-2" style={{ background: "var(--theme-input-bg)", border: "1px solid var(--theme-border)" }}>
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--theme-text-muted)" strokeWidth="2"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                                                        <input type="text" value={ghSearch} onChange={e => setGhSearch(e.target.value)} placeholder="Search repositories..."
                                                            className="flex-1 bg-transparent border-none outline-none text-[12px] text-(--theme-text-primary)" />
                                                    </div>
                                                </div>
                                                <div className="divide-y" style={{ borderColor: "var(--theme-border-light)" }}>
                                                    {filteredRepos.map((repo: any) => (
                                                        <div key={repo.id} className="p-4 sm:px-5">
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <a href={repo.html_url} target="_blank" rel="noopener noreferrer"
                                                                    className="text-[13px] font-bold no-underline hover:underline" style={{ color: accent }}>{repo.name}</a>
                                                            </div>
                                                            <p className="text-[11px] mb-2 leading-relaxed text-(--theme-text-muted)">{repo.description || "No description"}</p>
                                                            <div className="flex items-center gap-4 text-[10px] text-(--theme-text-muted)">
                                                                {repo.language && <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full" style={{ background: langColors[repo.language] || "#737373" }} />{repo.language}</span>}
                                                                <span className="flex items-center gap-1">⭐ {repo.stargazers_count}</span>
                                                                <span>Updated {new Date(repo.updated_at).toLocaleDateString()}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {filteredRepos.length === 0 && <p className="text-[13px] text-(--theme-text-muted) text-center py-10">No repositories found</p>}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right — profile card + languages + activity */}
                                        <div className="w-full lg:w-[300px] shrink-0 space-y-5">
                                            {/* Profile */}
                                            <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                <div className="flex items-center gap-3 mb-3">
                                                    {ghProfile?.avatarUrl ? (
                                                        <img src={ghProfile.avatarUrl} alt="GitHub" className="w-12 h-12 rounded-xl" style={{ border: `1px solid ${accent}30` }} />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: "var(--theme-input-bg)", color: "var(--theme-text-primary)" }}>
                                                            <Github className="w-6 h-6" />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <p className="text-[13px] font-bold text-(--theme-text-primary)">{ghData.githubUsername}</p>
                                                        <span className="text-[10px] font-medium" style={{ color: accent }}>● Connected</span>
                                                    </div>
                                                </div>
                                                {ghProfile?.bio && <p className="text-[11px] text-(--theme-text-muted) mb-3 leading-relaxed">{ghProfile.bio}</p>}
                                                <div className="grid grid-cols-3 gap-2 mb-3">
                                                    {[{ label: "Repos", value: ghTotalRepos }, { label: "Stars", value: ghTotalStars }, { label: "Followers", value: ghProfile?.followers ?? 0 }].map(s => (
                                                        <div key={s.label} className="text-center rounded-xl p-2" style={{ background: "var(--theme-bg-secondary)" }}>
                                                            <p className="text-[14px] font-bold text-(--theme-text-primary)" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{s.value}</p>
                                                            <p className="text-[9px] uppercase tracking-widest text-(--theme-text-muted)">{s.label}</p>
                                                        </div>
                                                    ))}
                                                </div>
                                                <a href={`https://github.com/${ghData.githubUsername}`} target="_blank" rel="noopener noreferrer"
                                                    className="flex items-center gap-2 justify-center px-3 py-2 rounded-xl text-[11px] font-semibold border border-(--theme-border) no-underline text-(--theme-text-secondary) hover:text-primary hover:border-primary/40 transition-all">
                                                    <Github className="w-3.5 h-3.5" /> View on GitHub →
                                                </a>
                                            </div>

                                            {/* Language breakdown */}
                                            {langChartData.length > 0 && (
                                                <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                    <h2 className="text-[13px] font-bold text-(--theme-text-primary) mb-3">Language Breakdown</h2>
                                                    <div className="h-3 rounded-full overflow-hidden flex mb-3" style={{ background: "var(--theme-input-bg)" }}>
                                                        {langChartData.map(l => <div key={l.name} className="h-full" style={{ width: `${l.pct}%`, background: l.color }} />)}
                                                    </div>
                                                    <div className="space-y-2">
                                                        {langChartData.map(l => (
                                                            <div key={l.name} className="flex items-center justify-between">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: l.color }} />
                                                                    <span className="text-[11px] font-medium text-(--theme-text-secondary)">{l.name}</span>
                                                                </div>
                                                                <span className="text-[11px] font-bold text-(--theme-text-primary)" style={{ fontFamily: "var(--font-jetbrains-mono)" }}>{l.pct}%</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Recent activity */}
                                            {ghActivity.length > 0 && (
                                                <div className="rounded-2xl border p-4 sm:p-5" style={{ background: "var(--theme-card)", borderColor: "var(--theme-border)" }}>
                                                    <h2 className="text-[13px] font-bold text-(--theme-text-primary) mb-3">Recent Activity</h2>
                                                    <div className="space-y-3">
                                                        {ghActivity.slice(0, 8).map((event: any, i: number) => (
                                                            <div key={i} className="flex items-start gap-2.5">
                                                                <ActivityIcon type={event.type} />
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="text-[11px] leading-snug text-(--theme-text-secondary)">
                                                                        <span className="font-medium text-(--theme-text-muted)">{activityLabel(event.type)}</span>{" "}
                                                                        <span className="font-bold" style={{ color: accent }}>{event.repo?.split("/").pop()}</span>
                                                                    </p>
                                                                    <span className="text-[9px] text-(--theme-text-muted)">{timeAgoGh(event.createdAt)}</span>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
