export const MESSAGES = {

    // main dir

    HELP: [
        'Available commands:',
        '  help     - Show this help message',
        '  ls       - List directory contents',
        '  cd       - Change directory',
        '  cat      - Concatenate .txt files',
        '  open     - Open .pdf files',
        '  clear    - Clear terminal screen',
        '  whoami   - Display current user',
        'Navigation:',
        '  ↑/↓      - Navigate command history\n',
        '----------------------------------',
        '  website  - if you don\'t know what to do...'
    ].join('\n'),

    WHOAMI: 'Max\'s employer',

    LS: 'about.txt   contact.txt    resume.pdf \n' +
        '/notes      /projects',

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

    NOTES_LS: 'note1.txt',

    NOTE1: 'test',
}; 