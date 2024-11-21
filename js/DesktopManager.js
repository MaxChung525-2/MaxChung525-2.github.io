class DesktopManager {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.texture = null;
        this.currentSelection = 0;
        this.isAboutWindowOpen = false;
        this.isNotesWindowOpen = false;
        this.notesSelection = 0;  // For selecting items within notes window
        this.items = [
            { type: 'folder', name: 'notes', x: 250, y: 300 },
            { type: 'folder', name: 'projects', x: 370, y: 300 },
            { type: 'folder', name: 'socials', x: 490, y: 300 },
            { type: 'terminal', name: 'terminal', x: 610, y: 300 },
            { type: 'txt', name: 'about.txt', x: 250, y: 400 },
            { type: 'txt', name: 'contact.txt', x: 370, y: 400 },
            { type: 'pdf', name: 'resume.pdf', x: 490, y: 400 }
        ];
        this.notesItems = [
            { type: 'exit', name: 'exit', x: 730, y: 125 },
            { type: 'pdf', name: 'MATH136.pdf', x: 280, y: 200 },
            { type: 'pdf', name: 'MATH137.pdf', x: 400, y: 200 },
            { type: 'pdf', name: 'MATH138.pdf', x: 520, y: 200 },
            { type: 'pdf', name: 'MATH235.pdf', x: 640, y: 200 },
            { type: 'pdf', name: 'MATH237.pdf', x: 280, y: 300 },
            { type: 'pdf', name: 'MTHEL131.pdf', x: 400, y: 300 },
            { type: 'pdf', name: 'ECON101.pdf', x: 520, y: 300 }
        ];
        this.images = {};
        this.onTerminalSelect = null; // Callback for terminal selection
        this.keydownListener = this.handleKeydown.bind(this);  // Store reference to bound listener
        this.isSocialsWindowOpen = false;
        this.socialsSelection = 0;
        this.socialsItems = [
            { type: 'exit', name: 'exit', x: 730, y: 125 },
            { type: 'linkedin', name: 'linkedin.webp', x: 280, y: 200, url: 'https://www.linkedin.com/in/chi-han-chung-146776277/' },
            { type: 'insta', name: 'instagram.webp', x: 400, y: 200, url: 'https://www.instagram.com/maxyee_kyoyu/profilecard/?igsh=aDR0dGNrMGZ1MnJo' },
            { type: 'github', name: 'github.webp', x: 520, y: 200, url: 'https://github.com/maxchung525' }
        ];
        this.isProjectsWindowOpen = false;
        this.projectsSelection = 0;
        this.projectsItems = [
            { type: 'exit', name: 'exit', x: 730, y: 125 },
            { type: 'github', name: 'SpeedType', x: 280, y: 200, url: 'https://github.com/MaxChung525/TypeSpeed' },
            { type: 'webp', name: 'Portfolio', x: 400, y: 200, url: 'https://maxchung525.github.io/' },
            { type: 'github', name: 'Language Tool', x: 520, y: 200, url: 'https://github.com/maxchung525/Language-Tool' },
            { type: 'pdf', name: 'Business Int...', x: 640, y: 200, file: 'Business Intelligence Project.pdf' }
        ];
        this.setupEventListeners();
    }

    async createCanvas() {
        try {
            this.canvas = document.createElement('canvas');
            
            const baseWidth = 1024;
            const aspectRatio = 0.248 / 0.164;
            this.canvas.width = baseWidth;
            this.canvas.height = baseWidth / aspectRatio;
            
            this.context = this.canvas.getContext('2d');
            
            await this.loadImages();
            
            this.texture = new THREE.CanvasTexture(this.canvas);
            this.texture.needsUpdate = true;

            this.render();

        } catch (error) {
            throw error;
        }
    }

    async loadImages() {
        const imageFiles = {
            folder: 'assets/pictures/folder icon.png',
            txt: 'assets/pictures/txt.png',
            pdf: 'assets/pictures/pdf.png',
            terminal: 'assets/pictures/terminal.png',
            wallpaper: 'assets/pictures/wallpaper.jpg',
            selection: 'assets/pictures/opacity square.png',
            aboutNotepad: 'assets/pictures/about notepad.png',
            contactNotepad: 'assets/pictures/contact notepad.png',
            notesFolder: 'assets/pictures/notes folder.png',
            exit: 'assets/pictures/folder quit.png',
            socialsFolder: 'assets/pictures/socials folder.png',
            linkedin: 'assets/pictures/linkedin.png',
            insta: 'assets/pictures/insta.png',
            github: 'assets/pictures/github.png',
            projectsFolder: 'assets/pictures/projects folder.png',
            webp: 'assets/pictures/webp.png'
        };

        const loadImage = (src) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = () => resolve(img);
                img.onerror = reject;
                img.src = src;
            });
        };

        // Load all images concurrently
        const promises = Object.entries(imageFiles).map(async ([key, src]) => {
            this.images[key] = await loadImage(src);
        });

        await Promise.all(promises);
    }

    render() {
        // Clear canvas and draw wallpaper
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.context.drawImage(this.images.wallpaper, 0, 0, this.canvas.width, this.canvas.height);

        // Draw desktop icons and labels
        if (!this.isNotesWindowOpen && !this.isSocialsWindowOpen && !this.isProjectsWindowOpen) {
            this.items.forEach((item, index) => {
                const icon = this.images[item.type];
                const iconSize = 64;
                
                this.context.drawImage(icon, item.x, item.y, iconSize, iconSize);
                
                if (index === this.currentSelection && !this.isAboutWindowOpen) {
                    this.context.globalAlpha = 1.0;
                    this.context.drawImage(
                        this.images.selection, 
                        item.x-10, 
                        item.y-18, 
                        iconSize + 20, 
                        iconSize + 35
                    );
                    this.context.globalAlpha = 1.0;
                }
                
                this.context.fillStyle = '#ffffff';
                this.context.font = '17px Arial';
                this.context.textAlign = 'center';
                this.context.fillText(item.name, item.x + iconSize/2, item.y + iconSize + 15);
            });
        }

        // Draw about window if open
        if (this.isAboutWindowOpen) {
            const aboutNotepadImg = this.images.aboutNotepad;
            const windowWidth = this.canvas.width * 0.5;
            const windowHeight = windowWidth * (aboutNotepadImg.height / aboutNotepadImg.width);
            const windowX = (this.canvas.width - windowWidth) / 2;
            const windowY = (this.canvas.height - windowHeight) / 2;
            this.context.drawImage(aboutNotepadImg, windowX, windowY, windowWidth, windowHeight);
        }

        if (this.isContactWindowOpen) {
            const contactNotepadImg = this.images.contactNotepad;
            const windowWidth = this.canvas.width * 0.5;
            const windowHeight = windowWidth * (contactNotepadImg.height / contactNotepadImg.width);
            const windowX = (this.canvas.width - windowWidth) / 2;
            const windowY = (this.canvas.height - windowHeight) / 2;
            this.context.drawImage(contactNotepadImg, windowX, windowY, windowWidth, windowHeight);
        }

        // Draw notes folder window if open
        if (this.isNotesWindowOpen) {
            const notesFolderImg = this.images.notesFolder;
            const windowWidth = this.canvas.width * 0.5;
            const windowHeight = windowWidth * (notesFolderImg.height / notesFolderImg.width);
            const windowX = (this.canvas.width - windowWidth) / 2;
            const windowY = (this.canvas.height - windowHeight) / 2;
            
            // Draw the folder window background
            this.context.drawImage(notesFolderImg, windowX, windowY, windowWidth, windowHeight);
            
            // Draw note items inside the window
            this.notesItems.forEach((item, index) => {
                const icon = this.images[item.type];
                let iconSize = 64;
                let iconWidth = iconSize;
                let iconHeight = iconSize;
                
                if (item.type === 'exit') {
                    iconWidth = 35;
                    iconHeight = 17;
                }
                
                this.context.drawImage(icon, item.x, item.y, iconWidth, iconHeight);
                
                if (index === this.notesSelection) {
                    this.context.globalAlpha = 1;
                    const selectionWidth = item.type === 'exit' ? iconWidth + 20 : iconSize + 20;
                    const selectionHeight = item.type === 'exit' ? iconHeight + 35 : iconSize + 35;
                    
                    this.context.drawImage(
                        this.images.selection, 
                        item.x-10, 
                        item.y-18, 
                        selectionWidth,
                        selectionHeight
                    );
                    this.context.globalAlpha = 1.0;
                }
                
                // Only draw labels for non-exit icons
                if (item.type !== 'exit') {
                    this.context.fillStyle = '#000000';
                    this.context.font = '12px Arial';
                    this.context.textAlign = 'center';
                    this.context.fillText(item.name, item.x + iconSize/2, item.y + iconSize + 15);
                }
            });
        }

        // Draw socials folder window if open
        if (this.isSocialsWindowOpen) {
            const socialsFolderImg = this.images.socialsFolder;
            const windowWidth = this.canvas.width * 0.5;
            const windowHeight = windowWidth * (socialsFolderImg.height / socialsFolderImg.width);
            const windowX = (this.canvas.width - windowWidth) / 2;
            const windowY = (this.canvas.height - windowHeight) / 2;
            
            // Draw the folder window background
            this.context.drawImage(socialsFolderImg, windowX, windowY, windowWidth, windowHeight);
            
            // Draw social items inside the window
            this.socialsItems.forEach((item, index) => {
                const icon = this.images[item.type];
                let iconSize = 64;
                let iconWidth = iconSize;
                let iconHeight = iconSize;
                
                if (item.type === 'exit') {
                    iconWidth = 35;
                    iconHeight = 17;
                }
                
                this.context.drawImage(icon, item.x, item.y, iconWidth, iconHeight);
                
                if (index === this.socialsSelection) {
                    this.context.globalAlpha = 1;
                    const selectionWidth = item.type === 'exit' ? iconWidth + 20 : iconSize + 20;
                    const selectionHeight = item.type === 'exit' ? iconHeight + 35 : iconSize + 35;
                    
                    this.context.drawImage(
                        this.images.selection, 
                        item.x-10, 
                        item.y-18, 
                        selectionWidth,
                        selectionHeight
                    );
                    this.context.globalAlpha = 1.0;
                }
                
                // Only draw labels for non-exit icons
                if (item.type !== 'exit') {
                    this.context.fillStyle = '#000000';
                    this.context.font = '12px Arial';
                    this.context.textAlign = 'center';
                    this.context.fillText(item.name, item.x + iconSize/2, item.y + iconSize + 15);
                }
            });
        }

        // Draw projects folder window if open
        if (this.isProjectsWindowOpen) {
            const projectsFolderImg = this.images.projectsFolder;
            const windowWidth = this.canvas.width * 0.5;
            const windowHeight = windowWidth * (projectsFolderImg.height / projectsFolderImg.width);
            const windowX = (this.canvas.width - windowWidth) / 2;
            const windowY = (this.canvas.height - windowHeight) / 2;
            
            // Draw the folder window background
            this.context.drawImage(projectsFolderImg, windowX, windowY, windowWidth, windowHeight);
            
            // Draw project items inside the window
            this.projectsItems.forEach((item, index) => {
                const icon = this.images[item.type];
                let iconSize = 64;
                let iconWidth = iconSize;
                let iconHeight = iconSize;
                
                if (item.type === 'exit') {
                    iconWidth = 35;
                    iconHeight = 17;
                }
                
                this.context.drawImage(icon, item.x, item.y, iconWidth, iconHeight);
                
                if (index === this.projectsSelection) {
                    this.context.globalAlpha = 1;
                    const selectionWidth = item.type === 'exit' ? iconWidth + 20 : iconSize + 20;
                    const selectionHeight = item.type === 'exit' ? iconHeight + 35 : iconSize + 35;
                    
                    this.context.drawImage(
                        this.images.selection, 
                        item.x-10, 
                        item.y-18, 
                        selectionWidth,
                        selectionHeight
                    );
                    this.context.globalAlpha = 1.0;
                }
                
                // Only draw labels for non-exit icons
                if (item.type !== 'exit') {
                    this.context.fillStyle = '#000000';
                    this.context.font = '12px Arial';
                    this.context.textAlign = 'center';
                    this.context.fillText(item.name, item.x + iconSize/2, item.y + iconSize + 15);
                }
            });
        }

        this.texture.needsUpdate = true;
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.keydownListener);
    }

    handleKeydown(event) {
        let newSelection = this.isNotesWindowOpen ? this.notesSelection : 
                          this.isSocialsWindowOpen ? this.socialsSelection :
                          this.isProjectsWindowOpen ? this.projectsSelection :
                          this.currentSelection;

        if (!this.isAboutWindowOpen && !this.isNotesWindowOpen && !this.isSocialsWindowOpen && !this.isProjectsWindowOpen) {
            switch(event.key) {
                case 'ArrowRight':
                    newSelection = (newSelection + 1) % this.items.length;
                    break;
                case 'ArrowLeft':
                    newSelection = (newSelection - 1 + this.items.length) % this.items.length;
                    break;
                case 'ArrowUp':
                    if (newSelection >= 4) newSelection -= 4;
                    break;
                case 'ArrowDown':
                    if (newSelection < 4) newSelection += 4;
                    break;
            }
        } else if (this.isNotesWindowOpen) {
            switch(event.key) {
                case 'ArrowRight':
                    newSelection = (newSelection + 1) % this.notesItems.length;
                    break;
                case 'ArrowLeft':
                    newSelection = (newSelection - 1 + this.notesItems.length) % this.notesItems.length;
                    break;
                case 'ArrowUp':
                    if (newSelection >= 4) newSelection -= 4;
                    break;
                case 'ArrowDown':
                    if (newSelection < 4) newSelection += 4;
                    break;
                case 'Enter':
                    const selectedNote = this.notesItems[this.notesSelection];
                    if (selectedNote.type === 'exit') {
                        this.isNotesWindowOpen = false;
                        this.render();
                    } else if (selectedNote.type === 'pdf') {
                        // Open PDF in new window
                        window.open(`assets/pdf/${selectedNote.name}`, '_blank');
                    }
                    return;
                    break;
            }
        } else if (this.isSocialsWindowOpen) {
            switch(event.key) {
                case 'ArrowRight':
                    newSelection = (newSelection + 1) % this.socialsItems.length;
                    break;
                case 'ArrowLeft':
                    newSelection = (newSelection - 1 + this.socialsItems.length) % this.socialsItems.length;
                    break;
                case 'ArrowUp':
                    if (newSelection >= 4) newSelection -= 4;
                    break;
                case 'ArrowDown':
                    if (newSelection < 4) newSelection += 4;
                    break;
                case 'Enter':
                    const selectedSocial = this.socialsItems[this.socialsSelection];
                    if (selectedSocial.type === 'exit') {
                        this.isSocialsWindowOpen = false;
                        this.render();
                    } else {
                        window.open(selectedSocial.url, '_blank');
                    }
                    return;
            }
        } else if (this.isProjectsWindowOpen) {
            switch(event.key) {
                case 'ArrowRight':
                    newSelection = (newSelection + 1) % this.projectsItems.length;
                    break;
                case 'ArrowLeft':
                    newSelection = (newSelection - 1 + this.projectsItems.length) % this.projectsItems.length;
                    break;
                case 'ArrowUp':
                    if (newSelection >= 4) newSelection -= 4;
                    break;
                case 'ArrowDown':
                    if (newSelection < 4) newSelection += 4;
                    break;
                case 'Enter':
                    const selectedProject = this.projectsItems[this.projectsSelection];
                    if (selectedProject.type === 'exit') {
                        this.isProjectsWindowOpen = false;
                        this.render();
                    } else if (selectedProject.type === 'pdf') {
                        window.open(`assets/pdf/Business Intelligence Project.pdf`, '_blank');
                    } else {
                        window.open(selectedProject.url, '_blank');
                    }
                    return;
            }
        }

        if (event.key === 'Enter') {
            if (!this.isNotesWindowOpen && !this.isSocialsWindowOpen && !this.isProjectsWindowOpen &&
                this.currentSelection >= 0 && this.currentSelection < this.items.length) {
                const selectedItem = this.items[this.currentSelection];
                if (selectedItem.type === 'terminal' && !this.isAboutWindowOpen) {
                    if (this.onTerminalSelect) {
                        this.onTerminalSelect();
                    }
                } else if (selectedItem.name === 'about.txt') {
                    this.isAboutWindowOpen = !this.isAboutWindowOpen;
                    this.render();
                } else if (selectedItem.name === 'notes') {
                    this.isNotesWindowOpen = !this.isNotesWindowOpen;
                    this.notesSelection = 0;
                    this.render();
                } else if (selectedItem.name === 'resume.pdf') {
                    window.open('assets/pdf/resume.pdf', '_blank');
                    this.render();
                } else if (selectedItem.name === 'contact.txt') {
                    this.isContactWindowOpen = !this.isContactWindowOpen;
                    this.render();
                } else if (selectedItem.name === 'socials') {
                    this.isSocialsWindowOpen = !this.isSocialsWindowOpen;
                    this.socialsSelection = 0;
                    this.render();
                } else if (selectedItem.name === 'projects') {
                    this.isProjectsWindowOpen = !this.isProjectsWindowOpen;
                    this.projectsSelection = 0;
                    this.render();
                }
            }
        }

        if (this.isNotesWindowOpen) {
            this.notesSelection = newSelection;
        } else if (this.isSocialsWindowOpen) {
            this.socialsSelection = newSelection;
        } else if (this.isProjectsWindowOpen) {
            this.projectsSelection = newSelection;
        } else {
            this.currentSelection = newSelection;
        }
        this.render();
    }

    createShaderMaterial() {
        if (!this.texture) {
            return null;
        }

        return new THREE.ShaderMaterial({
            uniforms: {
                screenTexture: { value: this.texture },
                uvOffset: { value: new THREE.Vector2(0.549, 0.312) },
                uvScale: { value: new THREE.Vector2(0.248, 0.164) }
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `,
            fragmentShader: `
                uniform sampler2D screenTexture;
                uniform vec2 uvOffset;
                uniform vec2 uvScale;
                varying vec2 vUv;
                
                void main() {
                    vec2 transformedUV = (vUv - uvOffset) / uvScale;
                    if(transformedUV.x >= 0.0 && transformedUV.x <= 1.0 &&
                       transformedUV.y >= 0.0 && transformedUV.y <= 1.0) {
                        gl_FragColor = texture2D(screenTexture, transformedUV);
                        gl_FragColor.rgb *= 1.3;
                    } else {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                    }
                }
            `,
            side: THREE.DoubleSide
        });
    }

    cleanup() {
        document.removeEventListener('keydown', this.keydownListener);
        
        this.isAboutWindowOpen = false;
        this.isNotesWindowOpen = false;
        this.isContactWindowOpen = false;
        this.isSocialsWindowOpen = false;
        this.isProjectsWindowOpen = false;
        this.currentSelection = 0;
        this.notesSelection = 0;
        this.socialsSelection = 0;
        this.projectsSelection = 0;
    }
}

export default DesktopManager; 