import { MESSAGES } from './terminalMessages.js';
import DesktopManager from './DesktopManager.js';

class InputManager {
    constructor(screenManager) {
        this.screenManager = screenManager;
        this.scene = null;  // Will be set from main.js
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
        this.inSocialsDir = false;
        this.desktopManager = null;
        this.originalMaterial = null;

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
        
        // Get current input with cursor
        const currentInputLine = `${this.getPrompt()} ${this.currentInput}${cursor}`;
        
        // Combine all lines
        const allLines = [
            ...this.startupMessages,
            ...this.commandHistory,
            currentInputLine
        ];

        // Calculate total lines including wraps
        const totalLines = allLines.length + (this.previousWraps || 0);
        const maxScroll = Math.max(0, totalLines - this.maxVisibleLines);
        
        // Ensure scroll offset is within bounds
        this.scrollOffset = Math.min(Math.max(0, this.scrollOffset), maxScroll);

        // Get visible portion of lines
        const visibleLines = allLines.slice(
            this.scrollOffset,
            this.scrollOffset + this.maxVisibleLines
        );
        
        // Update screen and store wrap count
        const currentWraps = this.screenManager.setContent(visibleLines);
        this.previousWraps = currentWraps;

        // If we're at the bottom and there are wraps, adjust scroll
        if (this.scrollOffset >= maxScroll - 1 && currentWraps > 0) {
            this.scrollOffset = Math.min(this.scrollOffset + currentWraps, maxScroll);
            // Update screen again with new scroll position
            this.screenManager.setContent(allLines.slice(
                this.scrollOffset,
                this.scrollOffset + this.maxVisibleLines
            ));
        }
    }

    handleCommand(command) {
        if (command.trim() === '') return;
        
        // Add command to both histories
        this.commandHistory.push(`${this.getPrompt()} ${command}`);
        this.fullCommandHistory.push(command);
        
        const response = this.processCommand(command);
        
        // Split response into lines and add non-empty ones
        const responseLines = response.split('\n').filter(line => line);
        this.commandHistory.push(...responseLines);

        // Calculate total lines including:
        // 1. Startup messages
        // 2. Command history
        // 3. Current input line
        // 4. Any wrapped lines from the current command
        const totalLines = this.startupMessages.length + 
                          this.commandHistory.length + 
                          1 + 
                          (this.previousWraps || 0);
        
        // Set scroll to show the last line, considering the visible area
        this.scrollOffset = Math.max(0, totalLines - this.maxVisibleLines);

        // Reset input and history index
        this.currentInput = '';
        this.commandHistoryIndex = -1;
        this.previousWraps = 0;
        
        // Force update screen with new scroll position
        this.updateScreen();
    }

    processCommand(command) {
        const cmd = command.trim();
        let response = '';
        
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
                case 'website':
                    window.open('https://maxchung525.github.io/', '_blank');
                    return MESSAGES.WEBSITE;
                case 'cd':
                case 'cd ..':
                    this.inProjectDir = false;
                    this.currentDirectory = '~';
                    response = '';  // Set empty response instead of return
                    break;
                case 'cat project1.txt':
                    return MESSAGES.PROJECT1;
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        } else if (this.inNotesDir) {
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
                case 'website':
                    window.open('https://maxchung525.github.io/', '_blank');
                    return MESSAGES.WEBSITE;
                case 'cd':
                case 'cd ..':
                    this.inNotesDir = false;
                    this.currentDirectory = '~';
                    response = '';  // Set empty response instead of return
                    break;
                case 'open MATH137.pdf':
                    window.open('assets/pdf/Math137.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open MATH136.pdf':
                    window.open('assets/pdf/Math136.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open MATH138.pdf':
                    window.open('assets/pdf/Math138.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open MATH235.pdf':
                    window.open('assets/pdf/Math235.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open MATH237.pdf':
                    window.open('assets/pdf/Math237.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open MTHEL131.pdf':
                    window.open('assets/pdf/Mthel131.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                case 'open ECON101.pdf':
                    window.open('assets/pdf/Econ101.pdf', '_blank');
                    return MESSAGES.OPENING_PDF;
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        } else if (this.inSocialsDir) {
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
                    return MESSAGES.SOCIALS_LS;
                case 'website':
                    window.open('https://maxchung525.github.io/', '_blank');
                    return MESSAGES.WEBSITE;
                case 'cd':
                case 'cd ..':
                    this.inSocialsDir = false;
                    this.currentDirectory = '~';
                    response = '';  // Set empty response instead of return
                    break;
                case 'open linkedin.webp':
                    window.open('https://www.linkedin.com/in/chi-han-chung-146776277/', '_blank');
                    return MESSAGES.LINKEDIN;
                case 'open github.webp':
                    window.open('https://github.com/maxchung525', '_blank');
                    return MESSAGES.GITHUB;
                case 'open instagram.webp':
                    window.open('https://www.instagram.com/maxyee_kyoyu/profilecard/?igsh=aDR0dGNrMGZ1MnJo', '_blank');
                    return MESSAGES.INSTAGRAM;
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        } else {
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
                case 'cd':
                    return MESSAGES.MAIN_CD;
                case 'website':
                    window.open('https://maxchung525.github.io/', '_blank');
                    return MESSAGES.WEBSITE;
                case 'cd notes':
                    this.inNotesDir = true;
                    this.currentDirectory = '~/notes';
                    response = '';  // Set empty response instead of return
                    break;
                case 'cd projects':
                    this.inProjectDir = true;
                    this.currentDirectory = '~/projects';
                    response = '';  // Set empty response instead of return
                    break;
                case 'cd socials':
                    this.inSocialsDir = true;
                    this.currentDirectory = '~/socials';
                    response = '';  // Set empty response instead of return
                    break;
                case 'cat about.txt':
                    return MESSAGES.ABOUT;
                case 'open resume.pdf':
                    window.open('assets/pdf/resume.pdf', '_blank');
                    return MESSAGES.RESUME;
                case 'cat contact.txt':
                    return MESSAGES.CONTACT;
                case 'quit':
                    this.switchToDesktop();
                    return 'Switching to desktop...';
                default:
                    return MESSAGES.COMMAND_NOT_FOUND(command);
            }
        }

        // Always return a response, even if empty
        return response;
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

    async switchToDesktop() {
        let screenMesh = null;
        
        try {
            if (!this.scene) {
                throw new Error('Scene not initialized');
            }

            screenMesh = this.scene.getObjectByName('Comp_Screen002_TerminalMaterial_0001');
            if (!screenMesh) {
                throw new Error('Screen mesh not found');
            }

            if (!this.originalMaterial) {
                this.originalMaterial = screenMesh.material;
            }

            const desktopManager = new DesktopManager();
            await desktopManager.createCanvas();
            this.desktopManager = desktopManager;
            
            const newMaterial = this.desktopManager.createShaderMaterial();
            if (!newMaterial) {
                throw new Error('Failed to create shader material');
            }
            
            screenMesh.material = newMaterial;
            
            this.desktopManager.onTerminalSelect = () => {
                this.switchBackToTerminal();
            };

            this.isActive = false;

        } catch (error) {
            this.desktopManager = null;
            
            if (this.originalMaterial) {
                this.switchBackToTerminal();
            }
        }
    }

    switchBackToTerminal() {
        try {
            const screenMesh = this.scene.getObjectByName('Comp_Screen002_TerminalMaterial_0001');
            if (screenMesh && this.originalMaterial) {
                screenMesh.material = this.originalMaterial;
                
                // Clean up desktop manager event listeners before nullifying
                if (this.desktopManager) {
                    this.desktopManager.cleanup();
                    this.desktopManager = null;
                }
                
                this.isActive = true;
                this.updateScreen();
            }
        } catch (error) {
            console.error('Error switching back to terminal:', error);
        }
    }
}

export default InputManager; 