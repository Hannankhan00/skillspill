"use client";
import React, { useState, useRef } from "react";
import {
    X,
    Send,
    Globe,
    Users,
    Type,
    Image as ImageIcon,
    Code2,
    Github,
    Hash,
    Settings,
    Briefcase,
    Plus,
    Trash2,
    ChevronDown,
    Upload,
    Video,
    AlertCircle,
    Eye,
    EyeOff,
    MessageSquareOff,
    MessageSquare,
} from "lucide-react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
interface UserData {
    fullName?: string;
    username?: string;
    role?: "TALENT" | "RECRUITER";
    avatarUrl?: string;
}

interface PostComposerProps {
    userData: UserData | null;
    onClose: () => void;
    onPostCreated: (post: unknown) => void;
}

const LANGUAGES = [
    "javascript", "typescript", "python", "rust", "go", "java",
    "c", "cpp", "csharp", "ruby", "php", "swift", "kotlin",
    "html", "css", "sql", "bash", "json", "yaml", "markdown",
];

const SEED_TAGS = [
    "opentowork", "hiring", "webdev", "reactjs", "nodejs", "python",
    "javascript", "remotejobs", "skillspill", "techcareers", "freelance",
    "coding", "github", "ai", "css",
];

// ─────────────────────────────────────────────
// Tiny helper: initials from full name
// ─────────────────────────────────────────────
function getInitials(name?: string) {
    if (!name) return "??";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
}

// ─────────────────────────────────────────────
// Tab definitions — shared structure, filtered per role
// ─────────────────────────────────────────────
type TabKey = "text" | "media" | "code" | "github" | "hashtags" | "settings" | "hiring";

interface Tab {
    key: TabKey;
    label: string;
    Icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
    roles: ("TALENT" | "RECRUITER")[];
}

const ALL_TABS: Tab[] = [
    { key: "text",     label: "Text",     Icon: Type,       roles: ["TALENT", "RECRUITER"] },
    { key: "media",    label: "Media",    Icon: ImageIcon,  roles: ["TALENT", "RECRUITER"] },
    { key: "code",     label: "Code",     Icon: Code2,      roles: ["TALENT", "RECRUITER"] },
    { key: "github",   label: "GitHub",   Icon: Github,     roles: ["TALENT"] },
    { key: "hiring",   label: "Hiring",   Icon: Briefcase,  roles: ["RECRUITER"] },
    { key: "hashtags", label: "Hashtags", Icon: Hash,       roles: ["TALENT", "RECRUITER"] },
    { key: "settings", label: "Settings", Icon: Settings,   roles: ["TALENT", "RECRUITER"] },
];

// ─────────────────────────────────────────────
// Main Component
// ─────────────────────────────────────────────
export default function PostComposer({ userData, onClose, onPostCreated }: PostComposerProps) {
    const isRecruiter = userData?.role === "RECRUITER";

    // Accent colours driven by role
    const accent     = isRecruiter ? "#A855F7" : "#3CF91A";
    const accentDim  = isRecruiter ? "rgba(168,85,247,0.12)" : "rgba(60,249,26,0.12)";
    const accentGlow = isRecruiter
        ? "0 0 0 1px rgba(168,85,247,0.35), 0 8px 32px rgba(168,85,247,0.15)"
        : "0 0 0 1px rgba(60,249,26,0.35), 0 8px 32px rgba(60,249,26,0.15)";
    const avatarGradient = isRecruiter
        ? "linear-gradient(135deg, #A855F7, #00D2FF)"
        : "linear-gradient(135deg, #3CF91A, #16A34A)";

    const filteredTabs = ALL_TABS.filter((t) =>
        t.roles.includes(userData?.role ?? "TALENT")
    );

    // ── State ──
    const [activeTab, setActiveTab]           = useState<TabKey>("text");
    const [caption, setCaption]               = useState("");
    const [visibility, setVisibility]         = useState<"public" | "followers">("public");

    // Hashtags
    const [hashtags, setHashtags]             = useState<string[]>([]);
    const [hashInput, setHashInput]           = useState("");
    const [showTagSugg, setShowTagSugg]       = useState(false);

    // Media
    const [images, setImages]                 = useState<File[]>([]);
    const [imagePreviews, setImagePreviews]   = useState<string[]>([]);
    const [videoFile, setVideoFile]           = useState<File | null>(null);
    const [videoPreview, setVideoPreview]     = useState("");
    const [mediaError, setMediaError]         = useState("");

    // Code
    const [code, setCode]                     = useState("");
    const [codeLang, setCodeLang]             = useState("javascript");

    // GitHub
    const [ghName, setGhName]                 = useState("");
    const [ghDesc, setGhDesc]                 = useState("");
    const [ghLang, setGhLang]                 = useState("");
    const [ghStars, setGhStars]               = useState("");
    const [ghForks, setGhForks]               = useState("");
    const [ghUrl, setGhUrl]                   = useState("");

    // Hiring (recruiter)
    const [jobTitle, setJobTitle]             = useState("");
    const [skills, setSkills]                 = useState<string[]>([]);
    const [skillInput, setSkillInput]         = useState("");
    const [locationType, setLocationType]     = useState("remote");
    const [compType, setCompType]             = useState("paid");
    const [deadline, setDeadline]             = useState("");

    // Submission
    const [submitting, setSubmitting]         = useState(false);
    const [uploading, setUploading]           = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    // Settings
    const [hideLikes, setHideLikes]           = useState(false);
    const [commentsOff, setCommentsOff]       = useState(false);

    const imageInputRef = useRef<HTMLInputElement>(null);
    const videoInputRef = useRef<HTMLInputElement>(null);

    // ── Helpers ──
    const addHashtag = (tag: string) => {
        const clean = tag.replace(/[^a-zA-Z0-9_]/g, "").toLowerCase();
        if (clean && hashtags.length < 5 && !hashtags.includes(clean) && clean.length <= 30) {
            setHashtags((p) => [...p, clean]);
        }
        setHashInput("");
        setShowTagSugg(false);
    };

    const removeHashtag = (tag: string) => setHashtags((p) => p.filter((t) => t !== tag));

    const addSkill = () => {
        const s = skillInput.trim();
        if (s && skills.length < 10 && !skills.includes(s)) setSkills((p) => [...p, s]);
        setSkillInput("");
    };

    const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMediaError("");
        const files = Array.from(e.target.files ?? []);
        const valid = files.filter(
            (f) => ["image/jpeg", "image/png", "image/webp"].includes(f.type) && f.size <= 10 * 1024 * 1024
        );
        if (valid.length < files.length) setMediaError("Some files were skipped (JPEG/PNG/WEBP, max 10 MB each).");
        const room = 10 - images.length;
        const toAdd = valid.slice(0, room);
        setImages((p) => [...p, ...toAdd]);
        setImagePreviews((p) => [...p, ...toAdd.map((f) => URL.createObjectURL(f))]);
    };

    const handleVideo = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMediaError("");
        const file = e.target.files?.[0];
        if (!file) return;
        if (!["video/mp4", "video/quicktime", "video/webm"].includes(file.type) || file.size > 100 * 1024 * 1024) {
            setMediaError("Video must be MP4/MOV/WEBM and under 100 MB.");
            return;
        }
        setVideoFile(file);
        setVideoPreview(URL.createObjectURL(file));
    };

    const removeImage = (i: number) => {
        setImages((p) => p.filter((_, idx) => idx !== i));
        setImagePreviews((p) => p.filter((_, idx) => idx !== i));
    };

    const canSubmit = () => {
        if (submitting || uploading) return false;
        // at minimum a caption is always needed unless it's a media/code/github/hiring post
        if (activeTab === "text" && !caption.trim()) return false;
        if (activeTab === "media" && images.length === 0 && !videoFile) return false;
        if (activeTab === "code" && !code.trim()) return false;
        if (activeTab === "github" && !ghName.trim()) return false;
        if (activeTab === "hiring" && !jobTitle.trim()) return false;
        return true;
    };

    const handleSubmit = async () => {
        if (!canSubmit()) return;
        setSubmitting(true);
        try {
            let mediaUrls: string[] = [];
            let videoUrl = "";

            if (activeTab === "media" && images.length > 0) {
                setUploading(true);
                setUploadProgress(20);
                const fd = new FormData();
                images.forEach((f) => fd.append("files", f));
                const r = await fetch("/api/spill/media/upload", { method: "POST", body: fd });
                const d = await r.json();
                if (d.urls) mediaUrls = d.urls;
                setUploadProgress(100);
                setUploading(false);
            }

            if (activeTab === "media" && videoFile) {
                setUploading(true);
                setUploadProgress(30);
                const fd = new FormData();
                fd.append("files", videoFile);
                const r = await fetch("/api/spill/media/upload", { method: "POST", body: fd });
                const d = await r.json();
                if (d.urls?.[0]) videoUrl = d.urls[0];
                setUploadProgress(100);
                setUploading(false);
            }

            // Determine postType
            const postTypeMap: Record<TabKey, string> = {
                text: "text",
                media: images.length > 0 ? "image" : "video",
                code: "code",
                github: "github",
                hiring: "hiring",
                hashtags: "text",
                settings: "text",
            };

            const body: Record<string, unknown> = {
                postType: postTypeMap[activeTab],
                caption,
                hashtags,
                visibility,
                hideLikes,
                commentsOff,
                ...(activeTab === "code" && { code, codeLang }),
                ...(activeTab === "media" && images.length > 0 && { mediaUrls }),
                ...(activeTab === "media" && videoFile && { videoUrl }),
                ...(activeTab === "github" && {
                    githubRepoName: ghName,
                    githubRepoDesc: ghDesc,
                    githubRepoLang: ghLang,
                    githubRepoStars: Number(ghStars) || 0,
                    githubRepoForks: Number(ghForks) || 0,
                    githubRepoUrl: ghUrl,
                }),
                ...(activeTab === "hiring" && {
                    hiringTitle: jobTitle,
                    hiringSkills: skills,
                    hiringLocationType: locationType,
                    hiringCompType: compType,
                    hiringDeadline: deadline || undefined,
                }),
            };

            const res = await fetch("/api/spill/posts", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            const data = await res.json();
            if (data.post) onPostCreated(data.post);
            else alert(data.error ?? "Failed to create post.");
        } catch (e) {
            console.error(e);
            alert("Something went wrong.");
        }
        setSubmitting(false);
    };

    const tagSuggestions = SEED_TAGS.filter(
        (t) => t.includes(hashInput.toLowerCase()) && !hashtags.includes(t)
    );

    const initials = getInitials(userData?.fullName);

    // ─────────────────────────────────────────
    // Shared input style
    // ─────────────────────────────────────────
    const inputCls = "w-full px-3 py-2.5 rounded-xl text-[13px] bg-(--theme-input-bg) border border-(--theme-border) outline-none text-(--theme-text-primary) placeholder:text-(--theme-text-muted) transition-all";
    const inputFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        (e.target as HTMLElement).style.borderColor = accent;
        (e.target as HTMLElement).style.boxShadow = `0 0 0 2px ${accentDim}`;
    };
    const inputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        (e.target as HTMLElement).style.borderColor = "";
        (e.target as HTMLElement).style.boxShadow = "";
    };

    // ─────────────────────────────────────────
    // Render active tab content
    // ─────────────────────────────────────────
    const renderTabContent = () => {
        switch (activeTab) {

            case "text":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={500}
                            rows={5}
                            placeholder="What's on your mind? Share your thoughts, wins, or knowledge..."
                            className="w-full bg-transparent border-none outline-none text-[14px] leading-relaxed resize-none placeholder:text-(--theme-text-muted) text-(--theme-text-primary)"
                        />
                        <div className="flex justify-end">
                            <span className="text-[11px]" style={{ color: caption.length > 450 ? "#ef4444" : "var(--theme-text-muted)" }}>
                                {caption.length} / 500
                            </span>
                        </div>
                    </div>
                );

            case "media":
                return (
                    <div className="space-y-3">
                        {/* Caption for context */}
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={500}
                            rows={2}
                            placeholder="Add a caption..."
                            className="w-full bg-transparent border-none outline-none text-[13px] resize-none placeholder:text-(--theme-text-muted) text-(--theme-text-primary)"
                        />
                        <div className="h-px bg-(--theme-border)" />

                        {/* Image previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-3 gap-2">
                                {imagePreviews.map((url, i) => (
                                    <div key={i} className="relative rounded-xl overflow-hidden aspect-square group">
                                        <img src={url} alt="" className="w-full h-full object-cover" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                            <button
                                                onClick={() => removeImage(i)}
                                                className="w-7 h-7 rounded-full bg-red-500/90 flex items-center justify-center border-none cursor-pointer"
                                            >
                                                <Trash2 size={13} color="white" />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Video preview */}
                        {videoPreview && (
                            <div className="relative rounded-xl overflow-hidden">
                                <video src={videoPreview} controls className="w-full max-h-[250px] rounded-xl" />
                                <button
                                    onClick={() => { setVideoFile(null); setVideoPreview(""); }}
                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 flex items-center justify-center border-none cursor-pointer"
                                >
                                    <X size={13} color="white" />
                                </button>
                            </div>
                        )}

                        {/* Upload progress */}
                        {uploading && (
                            <div className="h-1.5 rounded-full bg-(--theme-input-bg) overflow-hidden">
                                <div
                                    className="h-full rounded-full transition-all duration-300"
                                    style={{ width: `${uploadProgress}%`, background: accent }}
                                />
                            </div>
                        )}

                        {/* Error */}
                        {mediaError && (
                            <div className="flex items-center gap-2 text-[11px] text-red-400">
                                <AlertCircle size={13} /> {mediaError}
                            </div>
                        )}

                        {/* Upload buttons */}
                        <div className="grid grid-cols-2 gap-2">
                            <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={handleImages} className="hidden" />
                            <button
                                onClick={() => imageInputRef.current?.click()}
                                disabled={images.length >= 10}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-[12px] font-medium cursor-pointer bg-transparent transition-all disabled:opacity-40"
                                style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--theme-border)")}
                            >
                                <ImageIcon size={15} /> Images ({images.length}/10)
                            </button>

                            <input ref={videoInputRef} type="file" accept="video/mp4,video/quicktime,video/webm" onChange={handleVideo} className="hidden" />
                            <button
                                onClick={() => videoInputRef.current?.click()}
                                disabled={!!videoFile}
                                className="flex items-center justify-center gap-2 py-3 rounded-xl border-2 border-dashed text-[12px] font-medium cursor-pointer bg-transparent transition-all disabled:opacity-40"
                                style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}
                                onMouseEnter={(e) => (e.currentTarget.style.borderColor = accent)}
                                onMouseLeave={(e) => (e.currentTarget.style.borderColor = "var(--theme-border)")}
                            >
                                <Video size={15} /> Video
                            </button>
                        </div>
                    </div>
                );

            case "code":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={300}
                            rows={2}
                            placeholder="Describe your code snippet..."
                            className="w-full bg-transparent border-none outline-none text-[13px] resize-none placeholder:text-(--theme-text-muted) text-(--theme-text-primary)"
                        />
                        <div className="h-px bg-(--theme-border)" />
                        <select
                            value={codeLang}
                            onChange={(e) => setCodeLang(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl text-[12px] bg-(--theme-input-bg) border border-(--theme-border) outline-none cursor-pointer text-(--theme-text-primary)"
                        >
                            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                        <div className="relative rounded-xl overflow-hidden border border-[#21262D]">
                            {/* Language badge */}
                            <div className="flex items-center gap-2 px-3 py-2 bg-[#161b22] border-b border-[#21262D]">
                                <Code2 size={12} color={accent} />
                                <span className="text-[11px] font-mono" style={{ color: accent }}>{codeLang}</span>
                            </div>
                            <textarea
                                value={code}
                                onChange={(e) => setCode(e.target.value)}
                                maxLength={5000}
                                rows={8}
                                placeholder={"// paste your code here..."}
                                className="w-full p-3 bg-[#0D1117] text-[12px] font-mono text-green-400 placeholder:text-zinc-600 resize-none outline-none"
                            />
                        </div>
                        <div className="flex justify-end">
                            <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>{code.length} / 5000</span>
                        </div>
                    </div>
                );

            case "github":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={300}
                            rows={2}
                            placeholder="Tell people about this repo..."
                            className="w-full bg-transparent border-none outline-none text-[13px] resize-none placeholder:text-(--theme-text-muted) text-(--theme-text-primary)"
                        />
                        <div className="h-px bg-(--theme-border)" />
                        {/* Repo card-style inputs */}
                        <div className="rounded-xl border border-(--theme-border) overflow-hidden">
                            <div className="px-3 py-2 bg-(--theme-input-bg) flex items-center gap-2 border-b border-(--theme-border)">
                                <Github size={13} color={accent} />
                                <span className="text-[11px]" style={{ color: accent }}>Repository details</span>
                            </div>
                            <div className="p-3 space-y-2.5">
                                <input value={ghName} onChange={(e) => setGhName(e.target.value)} placeholder="Repository name *" className={inputCls} onFocus={inputFocus} onBlur={inputBlur} />
                                <textarea
                                    value={ghDesc}
                                    onChange={(e) => setGhDesc(e.target.value)}
                                    placeholder="Short description"
                                    rows={2}
                                    className={`${inputCls} resize-none`}
                                    onFocus={inputFocus}
                                    onBlur={inputBlur}
                                />
                                <div className="grid grid-cols-3 gap-2">
                                    <input value={ghLang} onChange={(e) => setGhLang(e.target.value)} placeholder="Language" className={inputCls} onFocus={inputFocus} onBlur={inputBlur} />
                                    <input type="number" value={ghStars} onChange={(e) => setGhStars(e.target.value)} placeholder="Stars" className={inputCls} onFocus={inputFocus} onBlur={inputBlur} />
                                    <input type="number" value={ghForks} onChange={(e) => setGhForks(e.target.value)} placeholder="Forks" className={inputCls} onFocus={inputFocus} onBlur={inputBlur} />
                                </div>
                                <input value={ghUrl} onChange={(e) => setGhUrl(e.target.value)} placeholder="https://github.com/user/repo" className={inputCls} onFocus={inputFocus} onBlur={inputBlur} />
                            </div>
                        </div>
                    </div>
                );

            case "hiring":
                return (
                    <div className="space-y-3">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            maxLength={400}
                            rows={2}
                            placeholder="Write something about this role..."
                            className="w-full bg-transparent border-none outline-none text-[13px] resize-none placeholder:text-(--theme-text-muted) text-(--theme-text-primary)"
                        />
                        <div className="h-px bg-(--theme-border)" />
                        <div className="rounded-xl border border-(--theme-border) overflow-hidden">
                            <div className="px-3 py-2 bg-(--theme-input-bg) flex items-center gap-2 border-b border-(--theme-border)">
                                <Briefcase size={13} color={accent} />
                                <span className="text-[11px]" style={{ color: accent }}>Job details</span>
                            </div>
                            <div className="p-3 space-y-3">
                                {/* Job title */}
                                <input
                                    value={jobTitle}
                                    onChange={(e) => setJobTitle(e.target.value)}
                                    maxLength={100}
                                    placeholder="Job title *"
                                    className={inputCls}
                                    onFocus={inputFocus}
                                    onBlur={inputBlur}
                                />

                                {/* Skills */}
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--theme-text-muted)" }}>Required Skills</label>
                                    {skills.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mb-2">
                                            {skills.map((s) => (
                                                <span key={s} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: accentDim, color: accent }}>
                                                    {s}
                                                    <button onClick={() => setSkills((p) => p.filter((x) => x !== s))} className="bg-transparent border-none cursor-pointer ml-0.5 flex items-center" style={{ color: accent }}>
                                                        <X size={10} />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                    <div className="flex gap-2">
                                        <input
                                            value={skillInput}
                                            onChange={(e) => setSkillInput(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addSkill(); } }}
                                            placeholder="Add a skill (press Enter)"
                                            className={`${inputCls} flex-1`}
                                            onFocus={inputFocus}
                                            onBlur={inputBlur}
                                        />
                                        <button
                                            onClick={addSkill}
                                            className="px-3 rounded-xl text-[12px] font-semibold border-none cursor-pointer transition-all flex items-center gap-1"
                                            style={{ background: accentDim, color: accent }}
                                        >
                                            <Plus size={13} /> Add
                                        </button>
                                    </div>
                                </div>

                                {/* Location + Comp */}
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--theme-text-muted)" }}>Location</label>
                                        <div className="relative">
                                            <select
                                                value={locationType}
                                                onChange={(e) => setLocationType(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl text-[12px] bg-(--theme-input-bg) border border-(--theme-border) outline-none cursor-pointer appearance-none text-(--theme-text-primary)"
                                            >
                                                <option value="remote">Remote</option>
                                                <option value="onsite">On-site</option>
                                                <option value="hybrid">Hybrid</option>
                                            </select>
                                            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="var(--theme-text-muted)" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--theme-text-muted)" }}>Compensation</label>
                                        <div className="relative">
                                            <select
                                                value={compType}
                                                onChange={(e) => setCompType(e.target.value)}
                                                className="w-full px-3 py-2.5 rounded-xl text-[12px] bg-(--theme-input-bg) border border-(--theme-border) outline-none cursor-pointer appearance-none text-(--theme-text-primary)"
                                            >
                                                <option value="paid">Paid</option>
                                                <option value="unpaid">Unpaid</option>
                                                <option value="equity">Equity</option>
                                                <option value="negotiable">Negotiable</option>
                                            </select>
                                            <ChevronDown size={13} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" color="var(--theme-text-muted)" />
                                        </div>
                                    </div>
                                </div>

                                {/* Deadline */}
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider mb-1.5" style={{ color: "var(--theme-text-muted)" }}>Application Deadline</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={(e) => setDeadline(e.target.value)}
                                        className={inputCls}
                                        onFocus={inputFocus}
                                        onBlur={inputBlur}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case "hashtags":
                return (
                    <div className="space-y-3">
                        <p className="text-[12px]" style={{ color: "var(--theme-text-muted)" }}>Add up to 5 hashtags to help people discover your post.</p>
                        {hashtags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5">
                                {hashtags.map((tag) => (
                                    <span key={tag} className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full font-medium" style={{ background: accentDim, color: accent }}>
                                        #{tag}
                                        <button onClick={() => removeHashtag(tag)} className="bg-transparent border-none cursor-pointer flex items-center" style={{ color: accent }}>
                                            <X size={10} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                        {hashtags.length < 5 && (
                            <div className="relative">
                                <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-(--theme-input-bg) border border-(--theme-border)" style={{ transition: "border-color .2s" }}>
                                    <Hash size={13} color={accent} />
                                    <input
                                        value={hashInput}
                                        onChange={(e) => { setHashInput(e.target.value.replace("#", "")); setShowTagSugg(true); }}
                                        onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); addHashtag(hashInput); } }}
                                        placeholder="Type a hashtag and press Enter"
                                        className="flex-1 bg-transparent outline-none text-[13px] text-(--theme-text-primary) placeholder:text-(--theme-text-muted)"
                                    />
                                </div>
                                {showTagSugg && hashInput && tagSuggestions.length > 0 && (
                                    <div className="absolute top-full left-0 right-0 mt-1 rounded-xl shadow-xl py-1 z-20 max-h-36 overflow-y-auto" style={{ background: "var(--theme-surface)", border: "1px solid var(--theme-border)" }}>
                                        {tagSuggestions.slice(0, 8).map((t) => (
                                            <button key={t} onClick={() => addHashtag(t)} className="w-full px-3 py-2 text-left text-[12px] bg-transparent border-none cursor-pointer hover:bg-(--theme-input-bg) flex items-center gap-2" style={{ color: "var(--theme-text-tertiary)" }}>
                                                <Hash size={11} /> {t}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                        {/* Seed tags */}
                        <div>
                            <p className="text-[10px] uppercase tracking-wider font-semibold mb-2" style={{ color: "var(--theme-text-muted)" }}>Popular tags</p>
                            <div className="flex flex-wrap gap-1.5">
                                {SEED_TAGS.filter((t) => !hashtags.includes(t)).slice(0, 12).map((t) => (
                                    <button key={t} onClick={() => addHashtag(t)} className="text-[11px] px-2.5 py-1 rounded-full border bg-transparent cursor-pointer transition-all hover:border-current flex items-center gap-1" style={{ borderColor: "var(--theme-border)", color: "var(--theme-text-muted)" }}>
                                        <Hash size={9} /> {t}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case "settings":
                return (
                    <div className="space-y-4">
                        {/* Visibility */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--theme-text-muted)" }}>Who can see this post?</label>
                            <div className="grid grid-cols-2 gap-2">
                                {[
                                    { val: "public", Icon: Globe, label: "Everyone", sub: "Visible to all users" },
                                    { val: "followers", Icon: Users, label: "Followers", sub: "Only people who follow you" },
                                ].map(({ val, Icon, label, sub }) => (
                                    <button
                                        key={val}
                                        onClick={() => setVisibility(val as "public" | "followers")}
                                        className="flex flex-col items-start gap-1.5 p-3 rounded-xl border-2 cursor-pointer bg-transparent text-left transition-all"
                                        style={{
                                            borderColor: visibility === val ? accent : "var(--theme-border)",
                                            background: visibility === val ? accentDim : "transparent",
                                        }}
                                    >
                                        <Icon size={16} color={visibility === val ? accent : "var(--theme-text-muted)"} />
                                        <span className="text-[12px] font-semibold" style={{ color: visibility === val ? accent : "var(--theme-text-primary)" }}>{label}</span>
                                        <span className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>{sub}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Engagement controls */}
                        <div>
                            <label className="block text-[11px] font-semibold uppercase tracking-wider mb-2" style={{ color: "var(--theme-text-muted)" }}>Engagement Controls</label>
                            <div className="space-y-2">

                                {/* Hide like count */}
                                <button
                                    onClick={() => setHideLikes(v => !v)}
                                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 cursor-pointer bg-transparent text-left transition-all"
                                    style={{
                                        borderColor: hideLikes ? accent : "var(--theme-border)",
                                        background: hideLikes ? accentDim : "transparent",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {hideLikes
                                            ? <EyeOff size={16} color={accent} />
                                            : <Eye size={16} color="var(--theme-text-muted)" />
                                        }
                                        <div>
                                            <p className="text-[12px] font-semibold" style={{ color: hideLikes ? accent : "var(--theme-text-primary)" }}>Hide like count</p>
                                            <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>Others won&apos;t see how many likes this post gets</p>
                                        </div>
                                    </div>
                                    {/* Toggle pill */}
                                    <div className="relative w-9 h-5 rounded-full shrink-0 transition-all duration-200"
                                        style={{
                                            background: hideLikes ? accent : "var(--theme-input-bg)",
                                            border: `1px solid ${hideLikes ? accent : "var(--theme-border)"}`,
                                        }}>
                                        <div className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all duration-200"
                                            style={{ left: hideLikes ? "17px" : "2px", background: hideLikes ? "#000" : "var(--theme-text-muted)" }} />
                                    </div>
                                </button>

                                {/* Turn off commenting */}
                                <button
                                    onClick={() => setCommentsOff(v => !v)}
                                    className="w-full flex items-center justify-between gap-3 p-3 rounded-xl border-2 cursor-pointer bg-transparent text-left transition-all"
                                    style={{
                                        borderColor: commentsOff ? accent : "var(--theme-border)",
                                        background: commentsOff ? accentDim : "transparent",
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        {commentsOff
                                            ? <MessageSquareOff size={16} color={accent} />
                                            : <MessageSquare size={16} color="var(--theme-text-muted)" />
                                        }
                                        <div>
                                            <p className="text-[12px] font-semibold" style={{ color: commentsOff ? accent : "var(--theme-text-primary)" }}>Turn off commenting</p>
                                            <p className="text-[10px]" style={{ color: "var(--theme-text-muted)" }}>No one can comment on this post</p>
                                        </div>
                                    </div>
                                    {/* Toggle pill */}
                                    <div className="relative w-9 h-5 rounded-full shrink-0 transition-all duration-200"
                                        style={{
                                            background: commentsOff ? accent : "var(--theme-input-bg)",
                                            border: `1px solid ${commentsOff ? accent : "var(--theme-border)"}`,
                                        }}>
                                        <div className="absolute top-0.5 w-4 h-4 rounded-full shadow-sm transition-all duration-200"
                                            style={{ left: commentsOff ? "17px" : "2px", background: commentsOff ? "#000" : "var(--theme-text-muted)" }} />
                                    </div>
                                </button>

                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    // ─────────────────────────────────────────
    // JSX
    // ─────────────────────────────────────────
    return (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div
                className="relative w-full sm:max-w-[560px] max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl flex flex-col"
                style={{
                    background: "var(--theme-card)",
                    boxShadow: accentGlow,
                }}
            >
                {/* ── Header ── */}
                <div
                    className="sticky top-0 z-10 flex items-center justify-between px-5 py-3.5 backdrop-blur-xl"
                    style={{
                        background: "var(--theme-header-bg)",
                        borderBottom: `1px solid var(--theme-border)`,
                    }}
                >
                    <button
                        onClick={onClose}
                        className="flex items-center gap-1.5 text-[13px] font-medium bg-transparent border-none cursor-pointer transition-opacity hover:opacity-70"
                        style={{ color: "var(--theme-text-muted)" }}
                    >
                        <X size={15} /> Cancel
                    </button>

                    <span className="text-[14px] font-bold tracking-tight" style={{ color: "var(--theme-text-primary)" }}>
                        Create Spill
                    </span>

                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit()}
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[12px] font-bold border-none cursor-pointer transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                        style={{
                            background: accent,
                            color: isRecruiter ? "#fff" : "#0a0a0a",
                            boxShadow: canSubmit() ? `0 0 12px ${accent}60` : "none",
                        }}
                    >
                        {submitting ? (
                            <span className="flex items-center gap-1.5">
                                <svg className="animate-spin" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 12a9 9 0 1 1-6.219-8.56" /></svg>
                                Posting...
                            </span>
                        ) : (
                            <><Send size={13} /> Spill It</>
                        )}
                    </button>
                </div>

                {/* Thin accent line */}
                <div style={{ height: "2px", background: `linear-gradient(90deg, ${accent}00, ${accent}, ${accent}00)` }} />

                <div className="p-5 space-y-4">
                    {/* ── User row ── */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            {userData?.avatarUrl ? (
                                <img src={userData.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                            ) : (
                                <div
                                    className="w-10 h-10 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0"
                                    style={{ background: avatarGradient }}
                                >
                                    {initials}
                                </div>
                            )}
                            <div>
                                <p className="text-[13px] font-bold leading-tight" style={{ color: "var(--theme-text-primary)" }}>
                                    {userData?.fullName ?? "User"}
                                </p>
                                <p className="text-[11px]" style={{ color: "var(--theme-text-muted)" }}>
                                    @{userData?.username ?? "unknown"}
                                </p>
                            </div>
                        </div>

                        {/* Visibility pill */}
                        <div className="relative">
                            <select
                                value={visibility}
                                onChange={(e) => setVisibility(e.target.value as "public" | "followers")}
                                className="appearance-none pl-3 pr-7 py-1.5 rounded-full text-[11px] font-semibold bg-(--theme-input-bg) border border-(--theme-border) outline-none cursor-pointer text-(--theme-text-primary)"
                            >
                                <option value="public">Public</option>
                                <option value="followers">Followers</option>
                            </select>
                            <ChevronDown size={11} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" color="var(--theme-text-muted)" />
                        </div>
                    </div>

                    {/* ── Tabs ── */}
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {filteredTabs.map(({ key, label, Icon }) => {
                            const isActive = activeTab === key;
                            return (
                                <button
                                    key={key}
                                    onClick={() => setActiveTab(key)}
                                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[12px] font-semibold whitespace-nowrap border cursor-pointer transition-all shrink-0"
                                    style={{
                                        background: isActive ? accentDim : "transparent",
                                        borderColor: isActive ? `${accent}50` : "var(--theme-border)",
                                        color: isActive ? accent : "var(--theme-text-muted)",
                                    }}
                                >
                                    <Icon size={13} strokeWidth={isActive ? 2.5 : 2} />
                                    {label}
                                    {/* Active dot */}
                                    {isActive && (
                                        <span
                                            className="w-1 h-1 rounded-full"
                                            style={{ background: accent, boxShadow: `0 0 4px ${accent}` }}
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* ── Tab content ── */}
                    <div className="min-h-[180px]">
                        {renderTabContent()}
                    </div>

                    {/* ── Hashtag preview strip (always visible) ── */}
                    {hashtags.length > 0 && activeTab !== "hashtags" && (
                        <div className="flex flex-wrap gap-1.5 pt-1 border-t border-(--theme-border)">
                            {hashtags.map((tag) => (
                                <span key={tag} className="text-[11px] px-2 py-0.5 rounded-full font-medium flex items-center gap-1" style={{ background: accentDim, color: accent }}>
                                    <Hash size={9} />{tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
