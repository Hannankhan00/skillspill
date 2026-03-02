"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Sparkles, Trophy, Target, Zap, Gem, CheckCircle, Github, Linkedin, Briefcase, FileText, Loader2, Link as LinkIcon, Phone, Mail, MessageSquare, Heart, Eye, Share2 } from "lucide-react";

const accent = "#3CF91A"; // Talent primary accent

export default function TalentProfileViewPage() {
    const params = useParams();
    const id = params?.id as string;
    const [talentData, setTalentData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Overview");
    const tabs = ["Overview", "Experience", "Projects", "Skills", "Spills"];

    useEffect(() => {
        if (!id) return;

        fetch(`/api/talents/${id}`)
            .then(res => res.json())
            .then(data => {
                if (data.talent) {
                    setTalentData(data.talent);
                }
                setIsLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch talent", err);
                setIsLoading(false);
            });
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <Loader2 className="w-10 h-10 text-[#3CF91A] animate-spin mb-4" />
                <p className="text-[13px] text-[var(--theme-text-muted)] font-medium">Loading talent profile...</p>
            </div>
        );
    }

    if (!talentData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-full p-20">
                <h3 className="text-lg font-bold text-red-400 mb-2">Talent Not Found</h3>
                <p className="text-[13px] text-[var(--theme-text-muted)]">We couldn't locate this talent's profile.</p>
            </div>
        );
    }

    const { fullName, username, talentProfile } = talentData;
    const { bio, experienceLevel, skills, projectLinks, githubUsername, githubConnected, githubRepos, linkedinUrl, portfolioUrl, resumeUrl, isAvailable, contactEmail, contactPhone, showEmail, showPhone, showSocials, workExperience } = talentProfile || {};
    const { spills } = talentData;

    const fmtDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", year: "numeric" });

    const initials = fullName ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) : "??";
    const role = experienceLevel ? `${experienceLevel} Developer` : "Developer";

    return (
        <div style={{ background: "var(--theme-bg)" }} className="min-h-full">

            {/* ── COVER / BANNER ── */}
            <div className="relative">
                <div className="h-32 sm:h-44 lg:h-52 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 relative overflow-hidden">
                    {/* Pattern overlay */}
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23fff' fill-opacity='0.3'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")" }}
                    />
                    {/* Decoration */}
                    <div className="absolute right-4 sm:right-8 top-4 sm:top-6 text-white/20 font-mono text-[10px] sm:text-xs hidden sm:block text-right">
                        <p>{"// talent.profile"}</p>
                        <p>{`const username = "${username}";`}</p>
                        <p>{`const isAvailable = ${isAvailable || true};`}</p>
                    </div>
                </div>

                {/* Avatar */}
                <div className="max-w-[900px] mx-auto px-4 sm:px-6">
                    <div className="relative -mt-12 sm:-mt-16 flex items-end gap-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[var(--theme-bg)] text-2xl sm:text-3xl font-bold border-4 border-[var(--theme-bg)] shadow-xl shrink-0">
                            {initials}
                        </div>
                        <div className="pb-1 sm:pb-2 min-w-0 hidden sm:block">
                            <div className="flex items-center gap-2">
                                <h1 className="text-xl sm:text-2xl font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                                <span className="text-[12px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                                {isAvailable !== false && (
                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 ml-2">Open to Work</span>
                                )}
                            </div>
                            <p className="text-[13px] text-[var(--theme-text-muted)] mt-0.5">{role}</p>
                            <p className="text-[11px] text-[#3CF91A] font-medium flex items-center gap-1 mt-1">
                                <Sparkles className="w-3 h-3" /> Talent Profile
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile name */}
            <div className="sm:hidden px-4 mt-3">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h1 className="text-lg font-bold text-[var(--theme-text-primary)]">{fullName}</h1>
                    <span className="text-[11px] font-medium text-[var(--theme-text-muted)]">@{username}</span>
                </div>
                <div className="flex items-center gap-2 mt-0.5">
                    <p className="text-[12px] text-[var(--theme-text-muted)]">{role}</p>
                    {isAvailable !== false && (
                        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-500 uppercase tracking-widest border border-green-500/20 ml-2">Open</span>
                    )}
                </div>
            </div>

            {/* ── MAIN CONTENT ── */}
            <div className="max-w-[900px] mx-auto px-4 sm:px-6 pb-24 lg:pb-8">

                {/* ── Stats / Actions row ── */}
                <div className="flex items-center gap-3 sm:gap-6 mt-4 sm:mt-5 pb-4 border-b border-[var(--theme-border)]">
                    <div className="text-center">
                        <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{skills?.length || 0}</p>
                        <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Skills</p>
                    </div>
                    {githubConnected && (
                        <div className="text-center">
                            <p className="text-sm sm:text-lg font-bold text-[var(--theme-text-primary)]">{githubRepos || 0}</p>
                            <p className="text-[9px] sm:text-[10px] text-[var(--theme-text-muted)] uppercase tracking-wider">Repos</p>
                        </div>
                    )}
                    <div className="ml-auto flex gap-2">
                        <Link href={`/recruiter/messages?with=${talentData?.id}`}
                            className="px-4 sm:px-5 py-2 rounded-xl text-[11px] sm:text-[12px] font-bold text-black border-none cursor-pointer transition-all hover:scale-105 shadow-lg shadow-[#3CF91A]/20 no-underline"
                            style={{ background: `linear-gradient(135deg, ${accent}, #10B981)` }}>
                            Message Talent
                        </Link>
                    </div>
                </div>

                {/* ── Tabs ── */}
                <div className="flex gap-0 mt-0 border-b border-[var(--theme-border)] overflow-x-auto scrollbar-none">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 sm:px-6 py-3 text-[12px] sm:text-[13px] font-semibold border-b-2 transition-all cursor-pointer bg-transparent whitespace-nowrap
                                ${activeTab === tab ? "border-[#3CF91A] text-[#3CF91A]" : "border-transparent text-[var(--theme-text-muted)] hover:text-[var(--theme-text-tertiary)]"}`}>
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
                                    <div key={exp.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] p-4 sm:p-5 flex gap-4 hover:border-[#3CF91A]/30 transition-all">
                                        <div className="w-10 h-10 shrink-0 rounded-xl bg-gradient-to-br from-[#3CF91A] to-[#10B981] flex items-center justify-center text-[13px] font-bold" style={{ color: '#000' }}>
                                            {exp.companyName[0].toUpperCase()}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start gap-2 justify-between flex-wrap">
                                                <div>
                                                    <p className="text-[13px] font-bold text-[var(--theme-text-primary)]">{exp.role}</p>
                                                    <p className="text-[12px] font-medium" style={{ color: '#3CF91A' }}>{exp.companyName}</p>
                                                    <p className="text-[10px] mt-0.5 text-[var(--theme-text-muted)]">
                                                        {fmtDate(exp.startDate)} – {exp.isCurrent ? "Present" : exp.endDate ? fmtDate(exp.endDate) : ""}
                                                    </p>
                                                </div>
                                                {exp.isCurrent && (
                                                    <span className="text-[9px] font-bold px-2 py-0.5 rounded-full shrink-0" style={{ background: '#3CF91A15', color: '#3CF91A', border: '1px solid #3CF91A30' }}>Current</span>
                                                )}
                                            </div>
                                            {exp.description && (
                                                <p className="text-[12px] text-[var(--theme-text-muted)] mt-2 leading-relaxed">{exp.description}</p>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-[var(--theme-text-muted)]" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Work Experience</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">This talent hasn't added their work history yet.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Overview" && (
                        <>
                            {/* About */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-2">About</h2>
                                <p className="text-[13px] text-[var(--theme-text-tertiary)] leading-relaxed whitespace-pre-wrap">{bio || "This user hasn't added a bio yet."}</p>
                                <div className="flex flex-wrap gap-3 mt-4 text-[11px] text-[var(--theme-text-muted)] pt-3 border-t border-[var(--theme-border-light)]">
                                    <span className="flex items-center gap-1.5 text-[#3CF91A] font-medium">
                                        <Briefcase className="w-3.5 h-3.5" />
                                        {role}
                                    </span>
                                </div>
                            </div>

                            {/* Links & Socials & Contact */}
                            <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                                <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">
                                    <LinkIcon className="w-4 h-4" /> Contact & Socials
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {showEmail && contactEmail && (
                                        <a href={`mailto:${contactEmail}`} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <Mail className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Email</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{contactEmail}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showPhone && contactPhone && (
                                        <a href={`tel:${contactPhone}`} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <Phone className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Phone</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{contactPhone}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showSocials && githubUsername && (
                                        <a href={`https://github./${githubUsername}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <Github className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">GitHub</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">@{githubUsername}</p>
                                            </div>
                                        </a>
                                    )}
                                    {linkedinUrl && (
                                        <a href={linkedinUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <Linkedin className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">LinkedIn</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">View Profile</p>
                                            </div>
                                        </a>
                                    )}
                                    {portfolioUrl && (
                                        <a href={portfolioUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <Briefcase className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Portfolio</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">{portfolioUrl.replace(/^https?:\/\//, '')}</p>
                                            </div>
                                        </a>
                                    )}
                                    {showSocials && resumeUrl && (
                                        <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 rounded-xl bg-[var(--theme-bg-secondary)] hover:bg-[#3CF91A]/10 transition-colors border border-[var(--theme-border-light)] hover:border-[#3CF91A]/30 group">
                                            <FileText className="w-5 h-5 text-[var(--theme-text-secondary)] group-hover:text-[#3CF91A]" />
                                            <div>
                                                <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">Resume</p>
                                                <p className="text-[10px] text-[var(--theme-text-muted)]">View Document</p>
                                            </div>
                                        </a>
                                    )}
                                    {(!showSocials && !showEmail && !showPhone) && (
                                        <p className="text-[12px] text-[var(--theme-text-muted)] col-span-2">This talent has chosen to keep their contact info private.</p>
                                    )}
                                    {(showSocials && !githubUsername && !linkedinUrl && !portfolioUrl && !resumeUrl) && (!showEmail && !showPhone) && (
                                        <p className="text-[12px] text-[var(--theme-text-muted)] col-span-2">This talent hasn't added any public links or contact info yet.</p>
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {activeTab === "Skills" && (
                        <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5">
                            <h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-4 flex items-center gap-2">
                                <Zap className="w-4 h-4 text-[#3CF91A]" /> Professional Skills
                            </h2>
                            {skills && skills.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {skills.map((skill: any) => (
                                        <span key={skill.skillName} className="px-3 py-1.5 rounded-lg text-[11px] sm:text-[12px] font-medium bg-[var(--theme-input-bg)] text-[var(--theme-text-secondary)] border border-[var(--theme-border-light)] shadow-sm flex items-center gap-1.5 hover:border-[#3CF91A]/30 transition-colors">
                                            {skill.isVerified && <CheckCircle className="w-3 h-3 text-[#3CF91A]" />}
                                            {skill.skillName}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-[12px] text-[var(--theme-text-muted)]">No skills added yet.</p>
                            )}
                        </div>
                    )}

                    {activeTab === "Projects" && (
                        <div className="space-y-4">
                            {projectLinks && projectLinks.length > 0 ? (
                                projectLinks.map((project: any, i: number) => (
                                    <div key={i} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-4 sm:p-5 hover:border-[#3CF91A]/30 transition-all">
                                        <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">{project.title || "Project Link"}</h3>
                                        {project.description && (
                                            <p className="text-[12px] text-[var(--theme-text-secondary)] mb-3 leading-relaxed">{project.description}</p>
                                        )}
                                        <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-[11px] font-medium text-[#3CF91A] hover:underline flex items-center gap-1">
                                            <LinkIcon className="w-3 h-3" /> View Project Source
                                        </a>
                                    </div>
                                ))
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-3">
                                        <Briefcase className="w-5 h-5 text-[var(--theme-text-muted)]" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Projects Found</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">This talent hasn't added any spotlight projects.</p>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === "Spills" && (
                        <div className="space-y-4">
                            {spills && spills.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {spills.map((spill: any) => (
                                        <div key={spill.id} className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm overflow-hidden hover:border-[#3CF91A]/30 transition-all flex flex-col h-full">
                                            <div className="p-4 sm:p-5 flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-teal-600 flex items-center justify-center text-[var(--theme-bg)] text-[9px] font-bold shrink-0">
                                                        {initials}
                                                    </div>
                                                    <div>
                                                        <p className="text-[12px] font-bold text-[var(--theme-text-primary)]">@{username}</p>
                                                        <p className="text-[9px] text-[var(--theme-text-muted)]">{new Date(spill.createdAt).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                <p className="text-[12px] text-[var(--theme-text-secondary)] leading-relaxed mb-3 line-clamp-4">{spill.content}</p>
                                                {spill.code && (
                                                    <div className="rounded-xl bg-[#0D1117] border border-[var(--theme-code-border)] overflow-hidden mb-3">
                                                        <pre className="px-3 py-3 text-[10px] text-green-400 font-mono overflow-hidden h-20 relative cursor-pointer" style={{ margin: 0 }}>
                                                            <code>{spill.code}</code>
                                                            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-[#0D1117] to-transparent pointer-events-none"></div>
                                                        </pre>
                                                    </div>
                                                )}
                                                {spill.tags && (
                                                    <div className="flex flex-wrap gap-1.5 mt-auto">
                                                        {spill.tags.split(',').slice(0, 3).map((tag: string) => (
                                                            <span key={tag} className="text-[9px] px-2 py-0.5 rounded-full bg-[#3CF91A]/10 text-[#3CF91A] font-medium">#{tag.trim()}</span>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-3 border-t border-[var(--theme-border-light)] bg-[var(--theme-bg-secondary)] flex flex-wrap items-center gap-4 text-[11px] text-[var(--theme-text-muted)]">
                                                <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5" /> {spill.likes}</span>
                                                <span className="flex items-center gap-1"><MessageSquare className="w-3.5 h-3.5" /> {spill.comments}</span>
                                                <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {spill.shares}</span>
                                                <span className="flex items-center gap-1 ml-auto"><Eye className="w-3.5 h-3.5" /> {spill.views}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="rounded-2xl border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-sm p-8 text-center flex flex-col items-center justify-center">
                                    <div className="w-12 h-12 rounded-full bg-[var(--theme-bg-secondary)] flex items-center justify-center mb-3">
                                        <MessageSquare className="w-5 h-5 text-[var(--theme-text-muted)]" />
                                    </div>
                                    <h3 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-1">No Spills Yet</h3>
                                    <p className="text-[12px] text-[var(--theme-text-muted)]">This talent hasn't posted any spills.</p>
                                </div>
                            )}
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
