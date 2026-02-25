const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walkDir(dirPath, callback) : callback(dirPath);
    });
}

const mojibake = {
    'â€“': '–',
    'ðŸ’œ': '💜',
    'ðŸ ¢': '🏢',
    'â ¤ï¸ ': '❤️',
    'ðŸ †': '🏆',
    'ðŸŽ¯': '🎯',
    'âš¡': '⚡', 'ðŸ”’': '🔒', 'ðŸš€': '🚀', 'ðŸ§ ': '🧠', 'ðŸŽ¨': '🎨',
    'ðŸ’¼': '💼', 'ðŸ“Š': '📊', 'âœ¨': '✨', 'â†’': '→',
    'â€”': '—', 'â€¢': '•', 'Â©': '©', 'â• ': '═', 'â”€': '─',
    'ðŸ”¥': '🔥', 'ðŸ‘¥': '👥', 'ðŸ” ': '🔍', 'ðŸ’¡': '💡',
    'âš™ï¸ ': '⚙️', 'âœ…': '✅', 'â Œ': '❌', 'ðŸš§': '🚧', 'ðŸŽ‰': '🎉',
    'ðŸ‘€': '👀', 'ðŸ‘‰': '👉', 'ðŸ’»': '💻', 'ðŸ’¾': '💾', 'ðŸ ²': '🐉',
    'ðŸŽ®': '🎮', 'ðŸ›¡ï¸ ': '🛡️', 'ðŸ’Ž': '💎', 'ðŸ’¬': '💬',
    'ðŸ‘Ќ': '👍', 'ðŸ‘Ž': '👎', 'ðŸ‘ ': '👏', 'ðŸ”„': '🔄',
    'ðŸ§ ': '🧠', 'âœ✨': '✨', 'ðŸ”’': '🔒'
};

const classReplace = {
    'bg-purple-50/30': 'bg-purple-500/10',
    'bg-purple-50': 'bg-[#A855F7]/10',
    'hover:bg-purple-50': 'hover:bg-[#A855F7]/10',
    'text-purple-600': 'text-[#A855F7]',
    'text-purple-700': 'text-[#A855F7]',
    'text-purple-500': 'text-[#A855F7]',
    'border-purple-100': 'border-[#A855F7]/20',
    'border-purple-200': 'border-[#A855F7]/30',
    'border-purple-300': 'border-[#A855F7]/40',
    'hover:border-purple-300': 'hover:border-[#A855F7]/40',
    'bg-purple-100': 'bg-[#A855F7]/20',
    'bg-green-50': 'bg-green-500/10',
    'text-green-700': 'text-green-500',
    'text-green-600': 'text-green-500',
    'bg-green-100': 'bg-green-500/20',
    'bg-orange-50': 'bg-orange-500/10',
    'text-orange-700': 'text-orange-500',
    'text-orange-600': 'text-orange-500',
    'bg-orange-100': 'bg-orange-500/20',
    'bg-blue-50': 'bg-blue-500/10',
    'text-blue-700': 'text-blue-500',
    'text-blue-600': 'text-blue-500',
    'bg-blue-100': 'bg-blue-500/20',
    'divide-gray-50': 'divide-[var(--theme-border-light)]',
    'text-gray-300': 'text-[var(--theme-text-muted)]',
    'bg-indigo-50': 'bg-indigo-500/10',
    'text-indigo-600': 'text-indigo-500',
    'bg-emerald-50': 'bg-emerald-500/10',
    'text-emerald-600': 'text-emerald-500',
    'text-gray-200': 'text-[var(--theme-text-secondary)]',
    'text-gray-400': 'text-[var(--theme-text-muted)]',
    'border-gray-100': 'border-[var(--theme-border-light)]',
    'border-gray-200': 'border-[var(--theme-border)]'
};

walkDir('./app', function (filePath) {
    if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
        let content = fs.readFileSync(filePath, 'utf8');
        let original = content;

        for (const [bad, good] of Object.entries(mojibake)) {
            content = content.split(bad).join(good);
        }

        for (const [bad, good] of Object.entries(classReplace)) {
            const regex = new RegExp('(?<![a-zA-Z0-9-])' + bad.replace(/\//g, '\\/') + '(?![a-zA-Z0-9-])', 'g');
            content = content.replace(regex, good);
        }

        if (content !== original) {
            fs.writeFileSync(filePath, content, 'utf8');
            console.log('Fixed:', filePath);
        }
    }
});
