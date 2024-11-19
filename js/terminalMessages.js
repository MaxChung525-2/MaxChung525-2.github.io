export const MESSAGES = {

    // main dir

    HELP: [
        'Available commands:',
        '  help     - Show this help message',
        '  ls       - List directory contents',
        '  cd       - Change directory',
        '  cat      - Concatenate .txt files',
        '  open     - Open .pdf & .webp sites',
        '  clear    - Clear terminal screen',
        '  whoami   - Display current user',
        '  website  - to old website',
        'Navigation:',
        '  ↑/↓      - Navigate command history\n',
        '  quit     - to exit terminal -> desktop'
    ].join('\n'),

    WHOAMI: 'Max\'s employer',

    LS: [
        'about.txt   contact.txt    resume.pdf',
        '/notes      /projects      /socials'
    ].join('\n'),

    MAIN_CD: 'already at main',

    WEBSITE: 'Opening website...',

    ABOUT: [
        'Hello! I\'m Max, a passionate STEM student',
        'with a keen interest in technology, scien',
        'ce, and innovation. Currently pursuing my',
        'degree in Act-sci and Stat at UWaterloo.'
    ].join('\n'),

    RESUME: 'Opening resume.pdf...',

    CONTACT: [
        'Phone: +1 9053927304',
        'Email: maxchung525@uwaterloo.ca,',
        '       c25chung@uwaterloo.ca',
    ].join('\n'),

    COMMAND_NOT_FOUND: (command) => `Command not found: ${command}\nType 'help' for available commands.`,

    // projects dir

    PROJECT_LS: 'project1.txt',

    PROJECT1: 'test',

    PROJECT_ABOUT: [
        'Current Projects:',
        '  project1.txt - Web Development Portfolio',
    ].join('\n'),

    // notes dir

    NOTES_LS: [
        'MATH137.pdf   MATH136.pdf   MATH138.pdf',
        'MATH235.pdf   MATH237.pdf   MTHEL131.pdf',
        'ECON101.pdf'
    ].join('\n'),

    OPENING_PDF: 'Opening PDF...',

    // socials dir

    SOCIALS_LS: [
        'linkedin.webp      github.webp',
        'instagram.webp'
    ].join('\n'),

    LINKEDIN: 'Opening linkedin.webp...',

    GITHUB: 'Opening github.webp...',

    INSTAGRAM: 'Opening instagram.webp...',
}; 
