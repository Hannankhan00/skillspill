const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const replacements = {
    'âš¡': '⚡', 'ðŸ”’': '🔒', 'ðŸš€': '🚀', 'ðŸ§ ': '🧠', 'ðŸŽ¨': '🎨',
    'ðŸ’¼': '💼', 'ðŸŽ¯': '🎯', 'ðŸ“Š': '📊', 'âœ¨': '✨', 'â†’': '→',
    'â€”': '—', 'â€¢': '•', 'Â©': '©', 'â• ': '═', 'â”€': '─',
    'ðŸ”¥': '🔥', 'ðŸ‘¥': '👥', 'ðŸ” ': '🔍', 'ðŸ’¡': '💡', 'ðŸ †': '🏆',
    'âš™ï¸ ': '⚙️', 'âœ…': '✅', 'â Œ': '❌', 'ðŸš§': '🚧', 'ðŸŽ‰': '🎉',
    'ðŸ‘€': '👀', 'ðŸ‘‰': '👉', 'ðŸ’»': '💻', 'ðŸ’¾': '💾', 'ðŸ ²': '🐉',
    'ðŸŽ®': '🎮', 'ðŸ›¡ï¸ ': '🛡️', 'ðŸ’Ž': '💎', 'ðŸ’¬': '💬',
    'ðŸ‘Ќ': '👍', 'ðŸ‘Ž': '👎', 'ðŸ‘ ': '👏', 'â ¤ï¸ ': '❤️', 'ðŸ”„': '🔄',
    'ðŸ§ ': '🧠', 'âœ✨': '✨', 'ðŸ”’': '🔒'
};

let count = 0;
walkDir('./app', function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let changed = false;

        for (const [bad, good] of Object.entries(replacements)) {
            if (content.includes(bad)) {
                content = content.split(bad).join(good);
                changed = true;
            }
        }

        if (changed) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
            count++;
        }
    }
});
console.log('Total fixed:', count);
