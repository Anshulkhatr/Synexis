const fs = require('fs');
const path = require('path');

const directory = "c:/Users/Dell/Desktop/Synexis/Synexis/client/src";

const replacements = [
    { pattern: /(?<!dark:)bg-\[\#0a0a0f\]/g, repl: 'bg-gray-50 dark:bg-[#0a0a0f]' },
    { pattern: /(?<!dark:)bg-black/g, repl: 'bg-white dark:bg-black' },
    { pattern: /(?<!dark:)text-white/g, repl: 'text-gray-900 dark:text-white' },
    { pattern: /(?<!dark:)bg-\[\#0f0f18\]/g, repl: 'bg-white dark:bg-[#0f0f18]' },
    { pattern: /(?<!dark:)border-white\/10/g, repl: 'border-gray-200 dark:border-white/10' },
    { pattern: /(?<!dark:)border-white\/5/g, repl: 'border-gray-200 dark:border-white/5' },
    { pattern: /(?<!dark:)text-gray-400/g, repl: 'text-gray-600 dark:text-gray-400' },
    { pattern: /(?<!dark:)text-gray-300/g, repl: 'text-gray-700 dark:text-gray-300' },
    { pattern: /(?<!dark:)bg-white\/5/g, repl: 'bg-gray-100 dark:bg-white/5' },
    { pattern: /(?<!dark:)bg-white\/10/g, repl: 'bg-gray-200 dark:bg-white/10' },
    { pattern: /(?<!dark:)bg-white\/20/g, repl: 'bg-gray-300 dark:bg-white/20' },
    { pattern: /(?<!dark:)text-white\/80/g, repl: 'text-gray-800 dark:text-white/80' },
    { pattern: /(?<!dark:)text-white\/60/g, repl: 'text-gray-600 dark:text-white/60' },
    { pattern: /(?<!dark:)text-white\/50/g, repl: 'text-gray-500 dark:text-white/50' }
];

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) { 
            results = results.concat(walk(file));
        } else { 
            results.push(file);
        }
    });
    return results;
}

const files = walk(directory);

for (const filepath of files) {
    if (filepath.endsWith('.jsx') || filepath.endsWith('.js') || filepath.endsWith('.css')) {
        const content = fs.readFileSync(filepath, 'utf-8');
        let new_content = content;
        
        for (const {pattern, repl} of replacements) {
            new_content = new_content.replace(pattern, repl);
        }
        
        if (new_content !== content) {
            fs.writeFileSync(filepath, new_content, 'utf-8');
            console.log(`Refactored ${filepath}`);
        }
    }
}

console.log("Refactoring complete.");
