const fs = require('fs');
let file = 'd:/FYP/skillspill/app/recruiter/profile/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

txt = txt.replace(/<h2[^>]*>\s*.*?Company\s*<\/h2>/, '<h2 className="text-[14px] font-bold text-[var(--theme-text-primary)] mb-3 flex items-center gap-2">\n                                    🏢 Company\n                                </h2>');

txt = txt.replace(/<span[^>]*>.*?\{post\.likes\}<\/span>/, '<span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1">❤️ {post.likes}</span>');

txt = txt.replace(/\{ label: "Total Hires", value: "47", icon: ".*?", bg: "bg-\\[#A855F7\\]\\/10" \},/, '{ label: "Total Hires", value: "47", icon: "🏆", bg: "bg - [#A855F7] / 10" },');

fs.writeFileSync(file, txt, 'utf8');
