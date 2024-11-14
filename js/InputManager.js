import { MESSAGES } from './terminalMessages.js';

class InputManager {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.isActive = false;
        this.currentInput = '';
        this.cursorVisible = true;
        this.currentDirectory = '~';
        this.username = '🀅 user';
        this.systemName = 'WSTP0525';
        this.commandHistory = [];
        this.fullCommandHistory = [];
        this.inProjectDir = false;
        this.inNotesDir = false;

        // Initial startup messages that stay at the top
        this.startupMessages = [
            '',
            '-------------',
            '',
            'STP Terminal v1.0.0',
            'Copyright (c) 2024 Max\'s Portfolio',
            'Initializing system components... Done',
            '->> type "help" to get started',
            'System ready.',
            '',
            ''
        ];

        // Set initial content
        this.currentScreenContent = [
            ...this.startupMessages,
            `${this.getPrompt()}`
        ];
        
        // Immediately set the content
        this.screenManager.setContent(this.currentScreenContent);
        
        this.maxVisibleLines = 15; // Adjust based on your screen size
        this.scrollOffset = 0;
        this.commandHistoryIndex = -1;  // For navigating command history
        this.commandHistoryTemp = '';   // Store current input when navigating history
        this.setupEventListeners();
        this.startCursorBlink();
        this.startTimeUpdate();
    }

    startCursorBlink() {
        setInterval(() => {
            if (this.isActive) {
                this.cursorVisible = !this.cursorVisible;
                this.updateScreen();
            }
        }, 530);
    }

    getPrompt() {
        return `🀅 user@WSTP0525:${this.currentDirectory}`;
    }

    updateScreen() {
        const cursor = this.cursorVisible && this.isActive ? '█' : ' ';
        
        // Combine all lines including the current input line
        const allLines = [
            ...this.startupMessages,
            ...this.commandHistory,
            `${this.getPrompt()} ${this.currentInput}${cursor}`
        ];

        // Calculate total lines and max scroll offset
        const totalLines = allLines.length;
        const maxScroll = Math.max(0, totalLines - this.maxVisibleLines);
        
        // Ensure scroll offset is within bounds
        this.scrollOffset = Math.min(Math.max(0, this.scrollOffset), maxScroll);

        // Get visible portion of lines
        const visibleLines = allLines.slice(
            this.scrollOffset,
            this.scrollOffset + this.maxVisibleLines
        );
        
        // Update the screen content
        const currentWraps = this.screenManager.setContent(visibleLines);

        // Store wrap count for next comparison
        this.previousWraps = currentWraps;
    }

    handleCommand(command) {
        if (command.trim() === '') return;
        
        // Add command to both histories
        this.commandHistory.push(`${this.getPrompt()} ${command}`);
        this.fullCommandHistory.push(command);
        
        const response = this.processCommand(command);
        if (response) {
            // Split response into lines and add each line to command history
            response.split('\n').forEach(line => {
                this.commandHistory.push(line);
            });

            // Calculate total lines including all content
            const totalLines = this.startupMessages.length + this.commandHistory.length + 1;
            
            // Set scroll to show the last line
            this.scrollOffset = Math.max(0, totalLines - this.maxVisibleLines);
        }

        this.currentInput = '';
        this.commandHistoryIndex = -1;
        this.previousWraps = 0;  // Reset wrap count
        this.updateScreen();
    }

    processCommand(command) {
        const cmd = command.toLowerCase().trim();
        
        // Handle commands based on current directory
        if (this.inProjectDir) {
            switch(cmd) {
                case 'help':
                    return MESSAGES.HELP;
                case 'clear':
                    this.commandHistory = [];
                    this.scrollOffset = 0;
                    return '';
                case 'whoami':
                    return MESSAGES.WHOAMI;
                case 'ls':
                    return MESSAGES.PROJECT_LS;
                case 'cd':
                case 'cd ..':
                    this.inProjectDir = false;
                    this.currentDirectory = '~';
                    return;
                case 'cat project1.txt':
                    return MESSAGES.PROJECT1;
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        }

        // Handle commands based on current directory
        if (this.inNotesDir) {
            switch(cmd) {
                case 'help':
                    return MESSAGES.HELP;
                case 'clear':
                    this.commandHistory = [];
                    this.scrollOffset = 0;
                    return '';
                case 'whoami':
                    return MESSAGES.WHOAMI;
                case 'ls':
                    return MESSAGES.NOTES_LS;
                case 'cd':
                case 'cd ..':
                    this.inNotesDir = false;
                    this.currentDirectory = '~';
                    return;
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        }
        
        // Main directory commands
        switch(cmd) {
            case 'help':
                return MESSAGES.HELP;
            case 'clear':
                this.commandHistory = [];
                this.scrollOffset = 0;
                return '';
            case 'whoami':
                return MESSAGES.WHOAMI;
            case 'ls':
                return MESSAGES.LS;
            case 'cd notes':
                this.inNotesDir = true;
                this.currentDirectory = '~/notes';
                return;
            case 'cd projects':
                this.inProjectDir = true;
                this.currentDirectory = '~/projects';
                return;
            case 'cat about.txt':
                return MESSAGES.ABOUT;
            case 'open resume.pdf':
                window.open('assets/resume.pdf', '_blank');
                return MESSAGES.RESUME;
            case 'cat contact.txt':
                return MESSAGES.CONTACT;
            default:
                return MESSAGES.COMMAND_NOT_FOUND(command);
        }
    }

    setupEventListeners() {
        document.addEventListener('keydown', (event) => {
            if (!this.isActive) return;
            
            switch(event.key) {
                case 'Enter':
                    if (this.currentInput.trim()) {
                        this.handleCommand(this.currentInput);
                        this.commandHistoryIndex = -1;  // Reset history index
                        this.previousWraps = 0;  // Reset wrap count
                    }
                    break;

                case 'Backspace':
                    event.preventDefault();
                    this.currentInput = this.currentInput.slice(0, -1);
                    this.updateScreen();
                    break;

                case 'ArrowUp':
                    event.preventDefault();
                    if (event.ctrlKey) {
                        // Scroll up
                        this.scrollOffset = Math.max(0, this.scrollOffset - 1);
                        this.updateScreen();
                    } else {
                        // Command history navigation
                        this.navigateCommandHistory('up');
                    }
                    break;

                case 'ArrowDown':
                    event.preventDefault();
                    if (event.ctrlKey) {
                        // Calculate total lines including current input line
                        const totalLines = this.startupMessages.length + 
                                         this.commandHistory.length + 1;
                        const maxScroll = Math.max(0, totalLines - this.maxVisibleLines);
                        this.scrollOffset = Math.min(this.scrollOffset + 1, maxScroll);
                        this.updateScreen();
                    } else {
                        // Command history navigation
                        this.navigateCommandHistory('down');
                    }
                    break;

                default:
                    if (event.key.length === 1 && !event.ctrlKey && !event.altKey && !event.metaKey) {
                        this.currentInput += event.key;
                        this.updateScreen();
                    }
            }
        });

        // Add wheel event listener for mouse scrolling
        document.addEventListener('wheel', (event) => {
            if (!this.isActive) return;
            
            event.preventDefault();
            
            const scrollDirection = Math.sign(event.deltaY);
            const totalLines = this.startupMessages.length + 
                              this.commandHistory.length + 1;
            
            // Calculate max scroll including all lines
            const maxScroll = Math.max(0, totalLines - this.maxVisibleLines);
            
            if (scrollDirection > 0) {
                // Scrolling down - increase scroll offset
                this.scrollOffset = Math.min(this.scrollOffset + 2, maxScroll);
            } else {
                // Scrolling up - decrease scroll offset
                this.scrollOffset = Math.max(0, this.scrollOffset - 2);
            }
            
            this.updateScreen();
        }, { passive: false });
    }

    navigateCommandHistory(direction) {
        const commands = this.fullCommandHistory;  // Use full history instead of visible history

        if (commands.length === 0) return;

        if (direction === 'up') {
            // Store current input when starting to navigate
            if (this.commandHistoryIndex === -1) {
                this.commandHistoryTemp = this.currentInput;
            }
            this.commandHistoryIndex = Math.min(
                commands.length - 1,
                this.commandHistoryIndex + 1
            );
        } else {
            this.commandHistoryIndex = Math.max(-1, this.commandHistoryIndex - 1);
        }

        if (this.commandHistoryIndex === -1) {
            this.currentInput = this.commandHistoryTemp;
        } else {
            this.currentInput = commands[commands.length - 1 - this.commandHistoryIndex];
        }

        this.updateScreen();
    }

    activate() {
        console.log('InputManager activated');
        this.isActive = true;
        this.updateScreen();  // This will just add the cursor
    }

    deactivate() {
        console.log('InputManager deactivated');
        this.isActive = false;
        this.updateScreen();  // This will remove the cursor
    }

    startTimeUpdate() {
        // Update time immediately
        this.updateTime();
        
        // Update time every second
        setInterval(() => {
            this.updateTime();
        }, 1000);
    }

    updateTime() {
        // Update the first line with current time
        this.startupMessages[0] = `TIME: ${new Date().toLocaleTimeString()}`;
        this.updateScreen();
    }
}

export default InputManager; 