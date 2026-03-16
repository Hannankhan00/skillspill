"use client";
import React, { useState, useRef, useEffect } from "react";

const POST_TYPES = [
    { key: "text", icon: "💬", label: "Text" },
    { key: "image", icon: "🖼️", label: "Image" },
    { key: "video", icon: "🎥", label: "Video" },
    { key: "code", icon: "💻", label: "Code" },
    { key: "github", icon: "🐙", label: "GitHub" },
    { key: "hiring", icon: "💼", label: "Hiring" },
];

const LANGUAGES = ["javascript", "typescript", "python", "rust", "go", "java", "c", "cpp", "csharp", "ruby", "php", "swift", "kotlin", "html", "css", "sql", "bash", "json", "yaml", "markdown"];

const SEED_TAGS = ["opentowork", "hiring", "webdev", "reactjs", "nodejs", "python", "javascript", "remotejobs", "skillspill", "techcareers", "freelance", "coding", "github", "ai", "css"];

export default function PostComposer({ userData, onClose, onPostCreated }: { userData: any; onClose: () => void; onPostCreated: (post: any) => void }) {
    const [postType, setPostType] = useState("text");
    const [caption, setCaption] = useState("");
    const [hashtags, setHashtags] = useState<string[]>([]);
    const [hashtagInput, setHashtagInput] = useState("");
    const [showTagSuggestions, setShowTagSuggestions] = useState(false);
    const [visibility, setVisibility] = useState("public");
    const [code, setCode] = useState("");
    const [codeLang, setCodeLang] = useState("javascript");
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState("");
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    // GitHub
    const [githubRepoName, setGithubRepoName] = useState("");
    const [githubRepoDesc, setGithubRepoDesc] = useState("");
    const [githubRepoLang, setGithubRepoLang] = useState("");
    const [githubRepoStars, setGithubRepoStars] = useState(0);
    const [githubRepoForks, setGithubRepoForks] = useState(0);
    const [githubRepoUrl, setGithubRepoUrl] = useState("");
    // Hiring
    const [hiringTitle, setHiringTitle] = useState("");
    const [hiringSkills, setHiringSkills] = useState<string[]>([]);
    const [hiringSkillInput, setHiringSkillInput] = useState("");
    const [hiringLocationType, setHiringLocationType] = useState("remote");
    const [hiringCompType, setHiringCompType] = useState("paid");
    const [hiringDeadline, setHiringDeadline] = useState("");

    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);
    const isRecruiter = userData?.role === "RECRUITER";

    const filteredTypes = POST_TYPES.filter(t => {
        if (t.key === "hiring" && !isRecruiter) return false;
        if (t.key === "github" && isRecruiter) return false;
        return true;
    });

    const initials = userData?.fullName?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) || "??";

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const valid = files.filter(f => ["image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 10 * 1024 * 1024);
        const maxNew = 10 - images.length;
        const toAdd = valid.slice(0, maxNew);
        setImages(prev => [...prev, ...toAdd]);
        setImagePreviewUrls(prev => [...prev, ...toAdd.map(f => URL.createObjectURL(f))]);
    };

    const removeImage = (idx: number) => {
        setImages(prev => prev.filter((_, i) => i !== idx));
        setImagePreviewUrls(prev => prev.filter((_, i) => i !== idx));
    };

    const handleVideoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!["video/mp4", "video/quicktime", "video/webm"].includes(file.type) || file.size > 100 * 1024 * 1024) {
            alert("Invalid video. Max 100MB, MP4/MOV/WEBM only."); return;
        }
        setVideoFile(file);
        setVideoPreviewUrl(URL.createObjectURL(file));
    };

    const addHashtag = (tag: string) => {
        const clean = tag.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
        if (clean && hashtags.length < 5 && !hashtags.includes(clean) && clean.length <= 30) {
            setHashtags(prev => [...prev, clean]);
        }
        setHashtagInput("");
        setShowTagSuggestions(false);
    };

    const addHiringSkill = () => {
        const s = hiringSkillInput.trim();
        if (s && hiringSkills.length < 10 && !hiringSkills.includes(s)) {
            setHiringSkills(prev => [...prev, s]);
        }
        setHiringSkillInput("");
    };

    const canSubmit = () => {
        if (submitting || uploading) return false;
        if (postType === "text" && !caption.trim()) return false;
        if (postType === "image" && images.length === 0) return false;
        if (postType === "video" && !videoFile) return false;
        if (postType === "code" && !code.trim()) return false;
        if (postType === "github" && !githubRepoName.trim()) return false;
        if (postType === "hiring" && !hiringTitle.trim()) return false;
        return true;
    };

    const handleSubmit = async () => {
        if (!canSubmit()) return;
        setSubmitting(true);

        try {
            let mediaUrls: string[] = [];
            let videoUrl = "";

            // Upload images
            if (postType === "image" && images.length > 0) {
                setUploading(true);
                const formData = new FormData();
                images.forEach(f => formData.append("files", f));
                const uploadRes = await fetch("/api/spill/media/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                if (uploadData.urls) mediaUrls = uploadData.urls;
                setUploading(false);
            }

            // Upload video (simplified - direct upload via API)
            if (postType === "video" && videoFile) {
                setUploading(true);
                setUploadProgress(30);
                const formData = new FormData();
                formData.append("files", videoFile);
                const uploadRes = await fetch("/api/spill/media/upload", { method: "POST", body: formData });
                const uploadData = await uploadRes.json();
                if (uploadData.urls?.[0]) videoUrl = uploadData.urls[0];
                setUploadProgress(100);
                setUploading(false);
            }

            const body: any = {
                postType, caption, hashtags, visibility,
                ...(postType === "code" && { code, codeLang }),
                ...(postType === "image" && { mediaUrls }),
                ...(postType === "video" && { videoUrl }),
                ...(postType === "github" && { githubRepoName, githubRepoDesc, githubRepoLang, githubRepoStars, githubRepoForks, githubRepoUrl }),
                ...(postType === "hiring" && { hiringTitle, hiringSkills, hiringLocationType, hiringCompType, hiringDeadline: hiringDeadline || undefined }),
            };

            const res = await fetch("/api/spill/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.post) onPostCreated(data.post);
            else alert(data.error || "Failed to create post");
        } catch (e) { console.error(e); alert("Failed to create post"); }
        setSubmitting(false);
    };

    const tagSuggestions = SEED_TAGS.filter(t => t.includes(hashtagInput.toLowerCase()) && !hashtags.includes(t));

    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl shadow-2xl" style={{ background: "var(--theme-card)", border: "1px solid var(--theme-border)" }}>
                {/* Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between px-5 py-3 backdrop-blur-xl" style={{ background: "var(--theme-header-bg)", borderBottom: "1px solid var(--theme-border)" }}>
                    <button onClick={onClose} className="text-[13px] font-medium bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-muted)" }}>Cancel</button>
                    <span className="text-[14px] font-bold" style={{ color: "var(--theme-text-primary)" }}>Create Spill</span>
                    <button onClick={handleSubmit} disabled={!canSubmit()} className="px-4 py-1.5 rounded-lg text-[12px] font-bold border-none cursor-pointer text-black disabled:opacity-40 transition-all"
                        style={{ background: "#3CF91A" }}>
                        {submitting ? "Posting..." : "Spill It"}
                    </button>
                </div>

                <div className="p-5">
                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-[#2edb13] flex items-center justify-center text-white text-[11px] font-bold shrink-0">{initials}</div>
                        <div>
                            <p className="text-[13px] font-bold" style={{ color: "var(--theme-text-primary)" }}>{userData?.fullName || "User"}</p>
                            <div className="flex items-center gap-2">
                                <select value={visibility} onChange={e => setVisibility(e.target.value)}
                                    className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none cursor-pointer" style={{ color: "var(--theme-text-muted)" }}>
                                    <option value="public">🌐 Public</option>
                                    <option value="followers">👥 Followers only</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Caption */}
                    <textarea value={caption} onChange={e => setCaption(e.target.value)} maxLength={500}
                        placeholder="What's on your mind? Share your thoughts, code, or wins..."
                        className="w-full min-h-[100px] p-0 bg-transparent border-none text-[14px] placeholder:text-[var(--theme-text-muted)] resize-none outline-none"
                        style={{ color: "var(--theme-text-primary)" }} />
                    <div className="text-right text-[10px] mb-3" style={{ color: caption.length > 450 ? "#ef4444" : "var(--theme-text-muted)" }}>{caption.length}/500</div>

                    {/* Hashtag input */}
                    <div className="mb-4 relative">
                        <div className="flex flex-wrap gap-1.5 mb-2">
                            {hashtags.map(tag => (
                                <span key={tag} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400 font-medium">
                                    #{tag}
                                    <button onClick={() => setHashtags(prev => prev.filter(t => t !== tag))} className="text-[8px] bg-transparent border-none cursor-pointer text-purple-400 hover:text-red-500">✕</button>
                                </span>
                            ))}
                        </div>
                        {hashtags.length < 5 && (
                            <input value={hashtagInput} onChange={e => { setHashtagInput(e.target.value.replace("#", "")); setShowTagSuggestions(true); }}
                                onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addHashtag(hashtagInput); } }}
                                placeholder="#add hashtags (max 5)"
                                className="w-full px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]"
                                style={{ color: "var(--theme-text-primary)" }} />
                        )}
                        {showTagSuggestions && hashtagInput && tagSuggestions.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-lg py-1 z-10 max-h-32 overflow-y-auto" style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}>
                                {tagSuggestions.slice(0, 8).map(t => (
                                    <button key={t} onClick={() => addHashtag(t)} className="w-full px-3 py-1.5 text-left text-[11px] hover:bg-[var(--theme-input-bg)] bg-transparent border-none cursor-pointer" style={{ color: "var(--theme-text-tertiary)" }}>#{t}</button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Post type tabs */}
                    <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
                        {filteredTypes.map(t => (
                            <button key={t.key} onClick={() => setPostType(t.key)}
                                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap border cursor-pointer transition-all shrink-0
                                    ${postType === t.key ? "bg-[#3CF91A]/10 border-[#3CF91A]/30 text-[#2edb13]" : "bg-transparent border-[var(--theme-border)] hover:bg-[var(--theme-input-bg)]"}`}
                                style={postType === t.key ? {} : { color: "var(--theme-text-muted)" }}>
                                <span>{t.icon}</span> {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Conditional attachment zones */}
                    {postType === "image" && (
                        <div className="mb-4">
                            <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImageSelect} className="hidden" />
                            {imagePreviewUrls.length > 0 && (
                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {imagePreviewUrls.map((url, i) => (
                                        <div key={i} className="relative rounded-xl overflow-hidden aspect-square">
                                            <img src={url} alt="" className="w-full h-full object-cover" />
                                            <button onClick={() => removeImage(i)} className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white text-[10px] flex items-center justify-center border-none cursor-pointer">✕</button>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {images.length < 10 && (
                                <button onClick={() => fileInputRef.current?.click()}
                                    className="w-full py-6 rounded-xl border-2 border-dashed text-[12px] font-medium cursor-pointer bg-transparent transition-all hover:border-[#3CF91A]"
                                    style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                                    📷 Click to upload images ({images.length}/10)
                                </button>
                            )}
                        </div>
                    )}

                    {postType === "video" && (
                        <div className="mb-4">
                            <input ref={videoInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideoSelect} className="hidden" />
                            {videoPreviewUrl ? (
                                <div className="relative mb-2">
                                    <video src={videoPreviewUrl} controls className="w-full rounded-xl max-h-[300px]" />
                                    <button onClick={() => { setVideoFile(null); setVideoPreviewUrl(""); }} className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-[11px] flex items-center justify-center border-none cursor-pointer">✕</button>
                                </div>
                            ) : (
                                <button onClick={() => videoInputRef.current?.click()}
                                    className="w-full py-8 rounded-xl border-2 border-dashed text-[12px] font-medium cursor-pointer bg-transparent transition-all hover:border-[#3CF91A]"
                                    style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                                    🎥 Click to upload video (max 100MB)
                                </button>
                            )}
                            {uploading && (
                                <div className="mt-2 h-2 rounded-full bg-[var(--theme-input-bg)] overflow-hidden">
                                    <div className="h-full rounded-full bg-[#3CF91A] transition-all" style={{ width: `${uploadProgress}%` }} />
                                </div>
                            )}
                        </div>
                    )}

                    {postType === "code" && (
                        <div className="mb-4">
                            <select value={codeLang} onChange={e => setCodeLang(e.target.value)}
                                className="mb-2 px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none cursor-pointer w-full"
                                style={{ color: "var(--theme-text-primary)" }}>
                                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
                            </select>
                            <textarea value={code} onChange={e => setCode(e.target.value)} maxLength={5000}
                                placeholder="Paste your code here..."
                                className="w-full min-h-[150px] p-3 rounded-xl bg-[#0D1117] border border-[#21262D] text-[12px] text-green-400 placeholder:text-zinc-600 font-mono resize-none outline-none focus:border-[#3CF91A]" />
                            <p className="text-right text-[9px] mt-1" style={{ color: "var(--theme-text-muted)" }}>{code.length}/5000</p>
                        </div>
                    )}

                    {postType === "github" && (
                        <div className="mb-4 space-y-2">
                            <input value={githubRepoName} onChange={e => setGithubRepoName(e.target.value)} placeholder="Repository name *"
                                className="w-full px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                            <textarea value={githubRepoDesc} onChange={e => setGithubRepoDesc(e.target.value)} placeholder="Description"
                                className="w-full min-h-[60px] px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none resize-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                            <div className="grid grid-cols-3 gap-2">
                                <input value={githubRepoLang} onChange={e => setGithubRepoLang(e.target.value)} placeholder="Language"
                                    className="px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                                <input type="number" value={githubRepoStars} onChange={e => setGithubRepoStars(+e.target.value)} placeholder="Stars"
                                    className="px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                                <input type="number" value={githubRepoForks} onChange={e => setGithubRepoForks(+e.target.value)} placeholder="Forks"
                                    className="px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                            </div>
                            <input value={githubRepoUrl} onChange={e => setGithubRepoUrl(e.target.value)} placeholder="https://github.com/user/repo"
                                className="w-full px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                        </div>
                    )}

                    {postType === "hiring" && (
                        <div className="mb-4 space-y-2">
                            <input value={hiringTitle} onChange={e => setHiringTitle(e.target.value)} maxLength={100} placeholder="Job Title *"
                                className="w-full px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                            <div>
                                <div className="flex flex-wrap gap-1.5 mb-2">
                                    {hiringSkills.map(s => (
                                        <span key={s} className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400 font-medium">
                                            {s} <button onClick={() => setHiringSkills(prev => prev.filter(x => x !== s))} className="text-[8px] bg-transparent border-none cursor-pointer">✕</button>
                                        </span>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={hiringSkillInput} onChange={e => setHiringSkillInput(e.target.value)}
                                        onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addHiringSkill(); } }}
                                        placeholder="Add skill (max 10)"
                                        className="flex-1 px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none focus:border-[#3CF91A]" style={{ color: "var(--theme-text-primary)" }} />
                                    <button onClick={addHiringSkill} className="px-3 py-2 rounded-xl text-[11px] font-medium border border-[var(--theme-border)] bg-transparent cursor-pointer" style={{ color: "var(--theme-text-muted)" }}>Add</button>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <select value={hiringLocationType} onChange={e => setHiringLocationType(e.target.value)}
                                    className="px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none cursor-pointer" style={{ color: "var(--theme-text-primary)" }}>
                                    <option value="remote">📍 Remote</option>
                                    <option value="onsite">🏢 Onsite</option>
                                    <option value="hybrid">🔄 Hybrid</option>
                                </select>
                                <select value={hiringCompType} onChange={e => setHiringCompType(e.target.value)}
                                    className="px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none cursor-pointer" style={{ color: "var(--theme-text-primary)" }}>
                                    <option value="paid">💰 Paid</option>
                                    <option value="unpaid">🤝 Unpaid</option>
                                    <option value="equity">📈 Equity</option>
                                    <option value="negotiable">🤔 Negotiable</option>
                                </select>
                            </div>
                            <input type="date" value={hiringDeadline} onChange={e => setHiringDeadline(e.target.value)}
                                className="w-full px-3 py-2 rounded-xl text-[12px] bg-[var(--theme-input-bg)] border border-[var(--theme-border)] outline-none cursor-pointer" style={{ color: "var(--theme-text-primary)" }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
