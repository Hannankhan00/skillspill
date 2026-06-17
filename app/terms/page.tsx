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

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      {/* ── Header ── */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between sticky top-0 bg-[#0a0a0a]/95 backdrop-blur-sm z-10">
        <Link href="/" className="opacity-80 hover:opacity-100 transition-opacity">
          <Image src="/assets/logo 2.png" alt="SkillSpill" width={100} height={28} />
        </Link>
        <span className="text-[0.65rem] text-[#444] px-2 py-1 border border-white/10 rounded" style={mono}>LEGAL PROTOCOL v1.0</span>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-16">

        {/* ── Hero ── */}
        <div className="mb-16">
          <p className="text-[#3CF91A] text-xs font-bold mb-3 tracking-widest" style={mono}>SYSTEM DOCUMENT</p>
          <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
            Terms of<br /><span className="text-[#3CF91A]">Service</span>
          </h1>
          <p className="text-[#555] text-sm leading-relaxed max-w-xl">
            These terms govern your access to and use of the SkillSpill platform. Read them carefully before creating an account or using any part of the network.
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
              ["01", "Acceptance of Terms", "#acceptance"],
              ["02", "Platform Description", "#platform"],
              ["03", "Eligibility & Accounts", "#eligibility"],
              ["04", "Talent Protocol", "#talent"],
              ["05", "Recruiter Assignment Terms", "#recruiter"],
              ["06", "Code & Portfolio Analysis", "#analysis"],
              ["07", "Bounties & Payments", "#bounties"],
              ["08", "Prohibited Conduct", "#conduct"],
              ["09", "Intellectual Property", "#ip"],
              ["10", "Privacy & Data", "#privacy"],
              ["11", "Limitation of Liability", "#liability"],
              ["12", "Termination", "#termination"],
              ["13", "Governing Law", "#law"],
              ["14", "Contact", "#contact"],
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
        <Section id="acceptance" title="Acceptance of Terms">
          <Clause label="1.1">
            By accessing or using SkillSpill — whether as a visitor, a registered Talent, or a Recruiter — you agree to be bound by these Terms of Service (&quot;Terms&quot;) in full. If you do not agree, do not use the platform.
          </Clause>
          <Clause label="1.2">
            These Terms constitute a legally binding agreement between you and SkillSpill Inc. (&quot;SkillSpill&quot;, &quot;we&quot;, &quot;us&quot;, &quot;our&quot;). We may update these Terms at any time. Continued use of the platform after changes are posted constitutes acceptance of the revised Terms.
          </Clause>
          <Clause label="1.3">
            If you are using SkillSpill on behalf of an organization, you represent and warrant that you have authority to bind that organization to these Terms.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="platform" title="Platform Description">
          <Clause label="2.1">
            SkillSpill is a skill-first career marketplace that connects software engineering talent with companies and recruiters. The platform uses AI-driven matching, portfolio analysis, and verified assessments to evaluate candidates on demonstrated ability rather than credentials alone.
          </Clause>
          <Clause label="2.2">
            Features include but are not limited to: profile creation, AI skill matching, bounty-based challenges, job listings, direct messaging, recruiter dashboards, and an analytics feed.
          </Clause>
          <Clause label="2.3">
            SkillSpill reserves the right to modify, suspend, or discontinue any feature at any time without prior notice.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="eligibility" title="Eligibility &amp; Accounts">
          <Clause label="3.1">
            You must be at least 16 years old to create an account on SkillSpill. By creating an account you confirm that you meet this requirement.
          </Clause>
          <Clause label="3.2">
            You are responsible for maintaining the confidentiality of your account credentials. You must notify us immediately at{" "}
            <a href="mailto:support@skillspill.com" className="text-[#3CF91A] hover:underline">support@skillspill.com</a>{" "}
            if you suspect unauthorized access to your account.
          </Clause>
          <Clause label="3.3">
            You may not create multiple accounts for the same individual or organization, or create accounts to circumvent a ban or suspension.
          </Clause>
          <Clause label="3.4">
            Account information (name, email, skills, work history) must be accurate and kept up to date. Providing false or misleading information is grounds for immediate termination.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="talent" title="Talent Protocol">
          <p className="text-[#555] text-xs mb-4 italic">These terms apply specifically to users registered as Talent on the SkillSpill network.</p>
          <Clause label="4.1">
            By joining as Talent, you grant SkillSpill a non-exclusive, royalty-free license to display your profile, portfolio links, GitHub activity summary, and skill scores to prospective recruiters and companies on the platform.
          </Clause>
          <Clause label="4.2">
            You retain full ownership of all code, projects, and creative works linked in your profile. SkillSpill does not claim ownership over your intellectual property.
          </Clause>
          <Clause label="4.3">
            Connecting your GitHub account authorizes SkillSpill to read public repository metadata, contribution graphs, and language statistics for the purpose of skill verification and AI matching. We do not access private repositories without explicit permission.
          </Clause>
          <Clause label="4.4">
            You agree not to misrepresent your skills, experience, or work history. Inflating skill scores, submitting others&apos; code as your own, or providing falsified portfolio items is a violation of these Terms and may result in permanent account removal.
          </Clause>
          <Clause label="4.5">
            Participation in platform bounties is voluntary. Bounty submissions become the property of the issuing recruiter/company upon acceptance unless otherwise agreed in the bounty description.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="recruiter" title="Recruiter Assignment Terms">
          <p className="text-[#555] text-xs mb-4 italic">These terms apply specifically to users registered as Recruiters or Companies on the SkillSpill network.</p>
          <Clause label="5.1">
            Recruiter accounts must represent a legitimate, verifiable organization. SkillSpill reserves the right to verify your organization and suspend accounts that cannot be validated.
          </Clause>
          <Clause label="5.2">
            You may use SkillSpill to search for, contact, and evaluate Talent candidates only for bona fide employment or contracting purposes. Misuse of candidate data for any other purpose — including mass marketing, data harvesting, or reselling — is strictly prohibited.
          </Clause>
          <Clause label="5.3">
            Job listings and bounties posted must accurately describe the role, compensation, and requirements. Deceptive or misleading listings will be removed without notice.
          </Clause>
          <Clause label="5.4">
            You agree to comply with all applicable employment laws, including anti-discrimination regulations, when evaluating and hiring candidates discovered through SkillSpill.
          </Clause>
          <Clause label="5.5">
            Recruiter access to AI-generated match scores and candidate analytics is for internal hiring decisions only. These scores may not be exported, shared with third parties, or used outside the SkillSpill platform without written consent from SkillSpill Inc.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="analysis" title="Code &amp; Portfolio Analysis">
          <Clause label="6.1">
            SkillSpill employs automated systems, including AI models, to analyze publicly available code repositories, portfolio links, and submitted assessments. This analysis generates skill scores used for matching and discovery.
          </Clause>
          <Clause label="6.2">
            Skill scores and AI-generated assessments are indicative, not definitive evaluations of your abilities. They should not be the sole basis for hiring decisions.
          </Clause>
          <Clause label="6.3">
            You agree that SkillSpill may process your submitted content and linked public data through machine learning models for the purpose of improving matching accuracy.
          </Clause>
          <Clause label="6.4">
            You may request removal of your data and AI-derived scores at any time by contacting{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="bounties" title="Bounties &amp; Payments">
          <Clause label="7.1">
            Recruiters may post bounties — time-limited technical challenges with defined reward amounts. Talent may submit solutions to active bounties on the platform.
          </Clause>
          <Clause label="7.2">
            SkillSpill does not guarantee payment of bounties from third-party recruiters. Disputes between Talent and Recruiters over bounty payments must be resolved between the parties. SkillSpill may mediate but assumes no financial liability.
          </Clause>
          <Clause label="7.3">
            SkillSpill may charge platform fees on bounty transactions. Current fee schedules are displayed at the time of posting and are subject to change with 14 days&apos; notice.
          </Clause>
          <Clause label="7.4">
            Bounty submissions that violate intellectual property rights, contain plagiarized code, or are generated entirely by AI tools without meaningful human contribution may be disqualified.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="conduct" title="Prohibited Conduct">
          <p className="text-[#555] text-xs mb-4">The following are expressly prohibited on the SkillSpill platform:</p>
          {[
            ["8.1", "Impersonating another person, organization, or SkillSpill employee."],
            ["8.2", "Posting offensive, discriminatory, or harassing content in profiles, messages, or job listings."],
            ["8.3", "Attempting to scrape, crawl, or extract data from SkillSpill beyond normal platform use."],
            ["8.4", "Reverse engineering, decompiling, or attempting to access SkillSpill's source code or infrastructure."],
            ["8.5", "Using automated bots, scripts, or tools to interact with the platform without express written permission."],
            ["8.6", "Circumventing or attempting to circumvent any platform security measures or authentication systems."],
            ["8.7", "Submitting malicious code, viruses, or harmful content to bounties or portfolio links."],
            ["8.8", "Using the platform to facilitate or promote illegal activity of any kind."],
          ].map(([label, text]) => (
            <Clause key={label} label={label}>{text}</Clause>
          ))}
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="ip" title="Intellectual Property">
          <Clause label="9.1">
            The SkillSpill name, logo, interface design, AI systems, and all platform content created by SkillSpill are the exclusive property of SkillSpill Inc. and are protected by copyright, trademark, and other applicable laws.
          </Clause>
          <Clause label="9.2">
            You may not copy, reproduce, distribute, or create derivative works from SkillSpill&apos;s proprietary materials without written consent.
          </Clause>
          <Clause label="9.3">
            User-generated content (profiles, portfolio items, messages) remains the property of the respective user. By posting content, you grant SkillSpill a limited license to display and process it as necessary to operate the platform.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="privacy" title="Privacy &amp; Data">
          <Clause label="10.1">
            SkillSpill collects, stores, and processes personal data in accordance with our Privacy Policy. By using the platform, you consent to these practices.
          </Clause>
          <Clause label="10.2">
            We use industry-standard security measures to protect your data. However, no method of electronic storage or transmission is 100% secure, and we cannot guarantee absolute security.
          </Clause>
          <Clause label="10.3">
            You have the right to access, correct, or request deletion of your personal data. Submit requests to{" "}
            <a href="mailto:privacy@skillspill.com" className="text-[#3CF91A] hover:underline">privacy@skillspill.com</a>.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="liability" title="Limitation of Liability">
          <Clause label="11.1">
            SkillSpill is provided &quot;as is&quot; without warranties of any kind, express or implied, including but not limited to merchantability, fitness for a particular purpose, or non-infringement.
          </Clause>
          <Clause label="11.2">
            To the maximum extent permitted by applicable law, SkillSpill Inc. shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform.
          </Clause>
          <Clause label="11.3">
            SkillSpill&apos;s total aggregate liability to you for any claim arising from these Terms shall not exceed the greater of USD $100 or the total fees paid by you to SkillSpill in the 12 months prior to the claim.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="termination" title="Termination">
          <Clause label="12.1">
            You may deactivate your account at any time from your account settings. Deactivation removes your public profile but we may retain certain data as required by law or legitimate business purposes.
          </Clause>
          <Clause label="12.2">
            SkillSpill reserves the right to suspend or permanently terminate any account at any time, with or without notice, for violation of these Terms or any conduct we determine, in our sole discretion, to be harmful to the platform, other users, or SkillSpill Inc.
          </Clause>
          <Clause label="12.3">
            Upon termination, your right to access the platform immediately ceases. Sections on intellectual property, liability, and governing law survive termination.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="law" title="Governing Law">
          <Clause label="13.1">
            These Terms are governed by and construed in accordance with applicable laws. Any disputes arising under these Terms shall first be attempted to be resolved through good-faith negotiation.
          </Clause>
          <Clause label="13.2">
            If informal resolution fails, disputes shall be submitted to binding arbitration or the courts of competent jurisdiction, as applicable under local law.
          </Clause>
        </Section>

        <div className="border-b border-white/5 mb-12" />

        <Section id="contact" title="Contact">
          <p>
            If you have questions about these Terms, please reach out:
          </p>
          <div className="mt-4 p-5 bg-white/[0.02] border border-white/8 rounded-xl space-y-3">
            {[
              ["General", "support@skillspill.com"],
              ["Privacy / Data Requests", "privacy@skillspill.com"],
              ["Legal", "legal@skillspill.com"],
            ].map(([label, email]) => (
              <div key={label} className="flex items-center justify-between gap-4">
                <span className="text-[#444] text-xs" style={mono}>{label.toUpperCase()}</span>
                <a href={`mailto:${email}`} className="text-[#3CF91A] text-xs hover:underline" style={mono}>{email}</a>
              </div>
            ))}
          </div>
        </Section>

        {/* ── Footer note ── */}
        <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-[0.65rem] text-[#333]" style={mono}>© 2026 SKILLSPILL INC. ALL RIGHTS RESERVED.</p>
          <Link href="/" className="text-[0.65rem] text-[#444] hover:text-[#3CF91A] transition-colors" style={mono}>
            ← RETURN TO PLATFORM
          </Link>
        </div>
      </main>
    </div>
  );
}
