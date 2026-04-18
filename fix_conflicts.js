const fs = require('fs');

// Resolve keeping the OTHER side (Pusher / 7dce057), discarding HEAD (Socket.io)
function resolveKeepOther(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const output = [];
    let state = 'keep'; // 'keep' | 'head' | 'other'

    for (const line of lines) {
        if (/^<{7}\s/.test(line)) {
            state = 'head';  // entering HEAD block — skip these
            continue;
        }
        if (/^={7}$/.test(line)) {
            state = 'other'; // entering OTHER block — keep these
            continue;
        }
        if (/^>{7}\s/.test(line)) {
            state = 'keep';
            continue;
        }
        if (state === 'keep' || state === 'other') {
            output.push(line);
        }
        // state === 'head' → skip
    }

    fs.writeFileSync(filePath, output.join('\r\n'), 'utf-8');
    console.log('Resolved (keep Pusher):', filePath);
}

const files = [
    'd:/FYP/skillspill/app/components/MessagesUI.tsx',
    'd:/FYP/skillspill/app/recruiter/page.tsx',
    'd:/FYP/skillspill/app/talent/page.tsx',
];

for (const f of files) {
    resolveKeepOther(f);
}
