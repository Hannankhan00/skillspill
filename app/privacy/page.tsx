"use client";

import Link from "next/link";
import Image from "next/image";

const mono = { fontFamily: "var(--font-jetbrains-mono, 'JetBrains Mono', monospace)" };

const Section = ({ id, title, children }: { id: string; title: string; children: React.ReactNode }) => (
  <section id={id} className="mb-12">
    <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-3" style={mono}>
      <span className="text-[#3CF91A]">{'//'}</span> {title}
    </h2>
    <div className="text-sm text-[#888] leading-7 space-y-3">{children}</div>
  </section>
);

const Clause = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex gap-3">
    <span className="text-[#3CF91A] shrink-0 mt-0.5" style={mono}>{label}</span>
    <p>{children}</p>
  </div>
);

const DataRow = ({ type, purpose, retention }: { type: string; purpose: string; retention: string }) => (
  <div className="grid grid-cols-3 gap-4 py-3 border-b border-white/5 text-xs">
    <span className="text-white font-medium">{type}</span>
    <span className="text-[#666]">{purpose}</span>
    <span className="text-[#444]" style={mono}>{retention}</span>
  </div>
);

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Header ── */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-10">
        <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/assets/logo 2.png" alt="SkillSpill" width={100} height={28} />
        </Link>
        <span className="text-[0.65rem] text-[#444] px-2 py-1 border border-white/10 rounded" style={mono}>NEURAL SECURITY PROTOCOL v1.0</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* ── Hero ── */}
        <div className="mb-16">
          <p className="text-[#3CF91A] text-xs font-bold mb-3 tracking-widest" style={mono}>SYSTEM DOCUMENT</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Privacy<br /><span className="text-[#3CF91A]">Policy</span>
          </h1>
          <p className="text-[#555] text-sm leading-relaxed max-w-xl">
            Your data, your rules. This policy explains exactly what we collect, why we collect it, how long we keep it, and how you can take control of it at any time.
          </p>
          <div className="flex gap-6 mt-6">
            <div>
              <p className="text-[0.6rem] text-[#444] tracking-widest mb-1" style={mono}>EFFECTIVE DATE</p>
              <p className="text-xs text-white font-semibold">01 January 2026</p>
            </div>
            <div>
              <p className="text-[0.6rem] text-[#444] tracking-widest mb-1" style={mono}>LAST UPDATED</p>
              <p className="text-xs text-white font-semibold">30 May 2026</p>
            </div>
          </div>
        </div>

        {/* ── Quick Nav ── */}
        <nav className="mb-14 p-5 bg-white/[0.02] border border-white/8 rounded-xl">
          <p className="text-[0.6rem] text-[#444] tracking-widest mb-4" style={mono}>CONTENTS</p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-xs text-[#555]">
            {[
              ["01", "Who We Are", "#who"],
              ["02", "Data We Collect", "#collect"],
              ["03", "How We Use Your Data", "#use"],
              ["04", "GitHub & OAuth Data", "#github"],
              ["05", "AI Processing & Scoring", "#ai"],
              ["06", "Data Sharing", "#sharing"],
              ["07", "Cookies & Tracking", "#cookies"],
              ["08", "Data Retention", "#retention"],
              ["09", "Your Rights", "#rights"],
              ["10", "Data Security", "#security"],
              ["11", "Children's Privacy", "#children"],
              ["12", "Changes to This Policy", "#changes"],
              ["13", "Contact", "#contact"],
            ].map(([num, label, href]) => (
              <li key={num}>
                <a href={href} className="flex items-center gap-2 hover:text-[#3CF91A] transition-colors group">
                  <span className="text-[#3CF91A] group-hover:text-white transition-colors" style={mono}>{num}.</span>
                  <span>{label}</span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {/* ── Sections ── */}
        <Section id="who" title="Who We Are">
          <Clause label="1.1">
            SkillSpill Inc. (&quot;SkillSpill&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the SkillSpill platform — a skill-first career marketplace for software engineering talent and technical recruiters.
          </Clause>
          <Clause label="1.2">
            This Privacy Policy applies to all users of the platform, including visitors, registered Talent, and Recruiters. It covers data collected through our website, mobile interfaces, APIs, and any connected services.
          </Clause>
          <Clause label="1.3">
            For privacy-related questions, contact us at{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="collect" title="Data We Collect">
          <p className="mb-4">We collect data in three ways: data you provide directly, data generated by your activity on the platform, and data from connected third-party services.</p>

          <div className="mb-6">
            <p className="text-[0.6rem] text-[#444] tracking-widest mb-3 font-bold" style={mono}>DIRECTLY PROVIDED</p>
            {[
              ["2.1", "Account data: full name, email address, username, password (stored as a salted hash, never plain text)."],
              ["2.2", "Profile data: bio, location, years of experience, skills, portfolio URLs, resume file."],
              ["2.3", "Recruiter data: company name, company size, industry, website, phone number, job listings, and posted bounties."],
              ["2.4", "Communications: messages sent through the platform's chat system, support tickets, and feedback forms."],
            ].map(([label, text]) => <Clause key={label} label={label}>{text}</Clause>)}
          </div>

          <div className="mb-6">
            <p className="text-[0.6rem] text-[#444] tracking-widest mb-3 font-bold" style={mono}>AUTOMATICALLY COLLECTED</p>
            {[
              ["2.5", "Usage data: pages visited, features used, search queries, time spent, click patterns, and session duration."],
              ["2.6", "Device data: IP address, browser type and version, operating system, screen resolution, and timezone."],
              ["2.7", "Performance data: error logs, load times, and crash reports used to improve platform stability."],
            ].map(([label, text]) => <Clause key={label} label={label}>{text}</Clause>)}
          </div>

          <div>
            <p className="text-[0.6rem] text-[#444] tracking-widest mb-3 font-bold" style={mono}>FROM THIRD-PARTY SERVICES</p>
            {[
              ["2.8", "GitHub OAuth: public profile data, repository metadata, contribution graphs, and programming language statistics when you connect your GitHub account."],
              ["2.9", "OAuth providers: basic profile info (name, email, avatar) from any OAuth provider you use to sign in."],
            ].map(([label, text]) => <Clause key={label} label={label}>{text}</Clause>)}
          </div>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="use" title="How We Use Your Data">
          {[
            ["3.1", "To create and manage your account and authenticate your identity."],
            ["3.2", "To power AI-driven skill matching between Talent and Recruiters based on verified abilities."],
            ["3.3", "To display your public profile to recruiters and other users who have access to the platform."],
            ["3.4", "To send transactional emails — account verification, password resets, match notifications, and bounty updates."],
            ["3.5", "To analyze platform usage and improve features, performance, and user experience."],
            ["3.6", "To enforce our Terms of Service, detect fraud, and maintain platform security."],
            ["3.7", "To comply with legal obligations and respond to lawful requests from authorities."],
            ["3.8", "We do not sell your personal data to third parties. We do not use your data for advertising targeting on external platforms."],
          ].map(([label, text]) => <Clause key={label} label={label}>{text}</Clause>)}
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="github" title="GitHub &amp; OAuth Data">
          <Clause label="4.1">
            When you connect your GitHub account, we request read-only access to your public profile and public repositories. We do not request access to private repositories, write permissions, or the ability to act on your behalf.
          </Clause>
          <Clause label="4.2">
            GitHub data we process includes: username, avatar, public bio, follower/following counts, public repository names and descriptions, primary programming languages, contribution frequency, and star counts.
          </Clause>
          <Clause label="4.3">
            This data is used exclusively to generate and update your skill score and to improve match quality. It is not shared with recruiters in raw form — only the derived skill score and language summary are visible.
          </Clause>
          <Clause label="4.4">
            You can revoke SkillSpill&apos;s GitHub access at any time from your GitHub account settings under &quot;Authorized OAuth Apps.&quot; Revoking access will pause GitHub-based score updates but will not delete previously derived scores.
          </Clause>
          <Clause label="4.5">
            To delete GitHub-derived data from our systems entirely, submit a data deletion request to{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="ai" title="AI Processing &amp; Scoring">
          <Clause label="5.1">
            SkillSpill uses AI models to analyze your portfolio, GitHub activity, skill declarations, and assessment results to produce a skill score and a match compatibility rating with job listings and recruiters.
          </Clause>
          <Clause label="5.2">
            AI-generated scores are probabilistic estimates, not definitive evaluations. They are one input among many that recruiters use, and are not intended to be the sole basis for hiring decisions.
          </Clause>
          <Clause label="5.3">
            Your data may be used to train or fine-tune our AI models in an anonymized or aggregated form. We do not use personally identifiable information directly in model training without explicit consent.
          </Clause>
          <Clause label="5.4">
            You have the right to request a human review of any AI-generated decision that significantly affects your access to opportunities on the platform. Submit such requests to{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="sharing" title="Data Sharing">
          <Clause label="6.1">
            <strong className="text-white">With Recruiters:</strong> Your public profile, skill scores, portfolio links, and match rating are visible to verified Recruiter accounts. You control which profile fields are public via your privacy settings.
          </Clause>
          <Clause label="6.2">
            <strong className="text-white">With Service Providers:</strong> We share data with trusted third-party vendors who help us operate the platform — cloud infrastructure (Azure), real-time messaging (Pusher), email delivery (SMTP providers), and AI services (Groq). These vendors are contractually prohibited from using your data for their own purposes.
          </Clause>
          <Clause label="6.3">
            <strong className="text-white">For Legal Compliance:</strong> We may disclose data if required by law, court order, or to protect the rights, property, or safety of SkillSpill, our users, or the public.
          </Clause>
          <Clause label="6.4">
            <strong className="text-white">Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of that transaction. We will notify you before your data becomes subject to a different privacy policy.
          </Clause>
          <Clause label="6.5">
            We never sell, rent, or trade your personal data to third parties for their own marketing or commercial purposes.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="cookies" title="Cookies &amp; Tracking">
          <Clause label="7.1">
            SkillSpill uses cookies and similar technologies (localStorage, sessionStorage) to maintain your session, remember your theme preference, and improve platform performance.
          </Clause>
          <Clause label="7.2">
            <strong className="text-white">Essential cookies</strong> are required for authentication and core platform functionality. They cannot be disabled without breaking the platform.
          </Clause>
          <Clause label="7.3">
            <strong className="text-white">Analytics data</strong> (usage patterns, feature interactions) is collected to help us understand how the platform is used. This data is processed in aggregate and is not linked to your identity.
          </Clause>
          <Clause label="7.4">
            We do not use third-party advertising cookies or cross-site tracking technologies.
          </Clause>
          <Clause label="7.5">
            You can clear cookies and local storage at any time via your browser settings. Doing so will log you out of your session.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="retention" title="Data Retention">
          <p className="mb-5">We retain different categories of data for different periods based on necessity and legal requirements.</p>

          <div className="bg-white/[0.02] border border-white/8 rounded-xl p-5">
            <div className="grid grid-cols-3 gap-4 pb-3 border-b border-white/10 text-[0.6rem] text-[#444] tracking-widest font-bold" style={mono}>
              <span>DATA TYPE</span>
              <span>PURPOSE</span>
              <span>RETENTION</span>
            </div>
            <DataRow type="Account data" purpose="Core platform operation" retention="Until deletion request" />
            <DataRow type="Profile & portfolio" purpose="Recruiter matching" retention="Until deletion request" />
            <DataRow type="Messages" purpose="Communication record" retention="2 years after last activity" />
            <DataRow type="GitHub sync data" purpose="Skill scoring" retention="Until OAuth revoked + 30 days" />
            <DataRow type="Usage logs" purpose="Analytics & security" retention="12 months rolling" />
            <DataRow type="Error logs" purpose="Platform stability" retention="90 days" />
            <DataRow type="Payment records" purpose="Legal / accounting" retention="7 years (legal requirement)" />
            <DataRow type="Support tickets" purpose="Issue resolution" retention="3 years" />
          </div>
          <p className="mt-4 text-xs text-[#555]">After the retention period expires, data is securely deleted or anonymized. You can request early deletion at any time (see Your Rights).</p>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="rights" title="Your Rights">
          <p className="mb-4">You have the following rights over your personal data. To exercise any of them, email{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
            We will respond within 30 days.
          </p>
          {[
            ["9.1", "Right of Access — Request a copy of all personal data we hold about you."],
            ["9.2", "Right to Rectification — Request correction of inaccurate or incomplete data."],
            ["9.3", "Right to Erasure — Request deletion of your account and associated personal data. Some data may be retained where required by law."],
            ["9.4", "Right to Portability — Request your profile and activity data in a machine-readable format (JSON or CSV)."],
            ["9.5", "Right to Object — Object to processing of your data for AI scoring or analytics purposes."],
            ["9.6", "Right to Restrict Processing — Request that we pause processing your data while a dispute is resolved."],
            ["9.7", "Right to Human Review — Request human review of any significant AI-generated decision affecting your platform experience."],
          ].map(([label, text]) => <Clause key={label} label={label}>{text}</Clause>)}
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="security" title="Data Security">
          <Clause label="10.1">
            Passwords are hashed using industry-standard algorithms. We never store plain-text passwords.
          </Clause>
          <Clause label="10.2">
            All data in transit is encrypted via TLS 1.2 or higher. Data at rest is encrypted using AES-256 on our cloud infrastructure.
          </Clause>
          <Clause label="10.3">
            Access to production data is restricted to authorized personnel on a need-to-know basis, with audit logging enabled.
          </Clause>
          <Clause label="10.4">
            In the event of a data breach that affects your personal data, we will notify you within 72 hours of becoming aware of the breach, as required by applicable law.
          </Clause>
          <Clause label="10.5">
            No method of electronic storage or transmission is 100% secure. While we implement strong safeguards, we cannot guarantee absolute security against all threats.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="children" title="Children's Privacy">
          <Clause label="11.1">
            SkillSpill is not intended for users under the age of 16. We do not knowingly collect personal data from anyone under 16.
          </Clause>
          <Clause label="11.2">
            If you believe a minor has created an account, please contact us immediately at{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>{" "}
            and we will delete the account and associated data promptly.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="changes" title="Changes to This Policy">
          <Clause label="12.1">
            We may update this Privacy Policy from time to time. When we make significant changes, we will notify you via email and display a notice on the platform at least 14 days before the changes take effect.
          </Clause>
          <Clause label="12.2">
            Your continued use of SkillSpill after the effective date of an updated policy constitutes acceptance of the changes. If you do not agree, you may close your account before the effective date.
          </Clause>
          <Clause label="12.3">
            The date at the top of this page always reflects when the policy was last updated. Prior versions are available on request.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="contact" title="Contact">
          <p>For any privacy-related questions, data requests, or concerns, reach out to us:</p>
          <div className="mt-4 p-5 bg-white/[0.02] border border-white/8 rounded-xl space-y-3">
            {[
              ["Privacy Requests", "privacy@skillspill.com"],
              ["General Support", "support@skillspill.com"],
              ["Legal", "legal@skillspill.com"],
            ].map(([label, email]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-[#444] text-xs" style={mono}>{label.toUpperCase()}</span>
                <a href={`mailto:${email}`} className="text-[#3CF91A] text-xs hover:underline" style={mono}>{email}</a>
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-[#555]">
            You also have the right to lodge a complaint with your local data protection authority if you believe your rights have been violated.
          </p>
        </Section>

        {/* ── Also see ── */}
        <div className="mt-8 p-5 bg-white/[0.02] border border-white/8 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="text-[0.6rem] text-[#444] tracking-widest mb-1" style={mono}>RELATED DOCUMENT</p>
            <p className="text-sm text-white font-semibold">Terms of Service</p>
            <p className="text-xs text-[#555]">Platform rules, Talent Protocol, Recruiter Assignment Terms.</p>
          </div>
          <Link
            href="/terms"
            className="text-[0.7rem] text-[#3CF91A] border border-[#3CF91A]/30 px-4 py-2 rounded hover:bg-[#3CF91A]/10 transition-colors shrink-0"
            style={mono}
          >
            READ TERMS →
          </Link>
        </div>

        {/* ── Footer note ── */}
        <div className="mt-10 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[0.65rem] text-[#333]" style={mono}>© 2026 SKILLSPILL INC. ALL RIGHTS RESERVED.</p>
          <Link href="/" className="text-[0.65rem] text-[#444] hover:text-[#3CF91A] transition-colors" style={mono}>
            ← RETURN TO PLATFORM
          </Link>
        </div>
      </main>
    </div>
  );
}
