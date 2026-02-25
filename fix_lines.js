const fs = require('fs');
const file = 'd:/FYP/skillspill/app/recruiter/profile/page.tsx';
let txt = fs.readFileSync(file, 'utf8');

let eol = txt.includes('\r\n') ? '\r\n' : '\n';
let arr = txt.split(eol);

if (arr[229].includes('Company')) {
    arr[229] = '                                    🏢 Company';
} else {
    console.error('Line 230 mismatch!');
}

if (arr[351].includes('{post.likes}')) {
    arr[351] = '                                        <span className="text-[11px] text-[var(--theme-text-muted)] flex items-center gap-1">❤️ {post.likes}</span>';
} else {
    console.error('Line 352 mismatch!');
}

if (arr[368].includes('Total Hires')) {
    arr[368] = '                                        { label: "Total Hires", value: "47", icon: "🏆", bg: "bg-[#A855F7]/10" },';
} else {
    console.error('Line 369 mismatch!');
}

fs.writeFileSync(file, arr.join(eol), 'utf8');
console.log('Fixed specific lines successfully.');
