class ScreenManager {
    constructor() {
        this.canvas = null;
        this.context = null;
        this.texture = null;
        this.material = null;
        this.currentContent = [];
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        
        const baseWidth = 1024;
        const aspectRatio = 0.248 / 0.164;
        this.canvas.width = baseWidth;
        this.canvas.height = baseWidth / aspectRatio;
        
        this.context = this.canvas.getContext('2d');
        
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.texture = new THREE.CanvasTexture(this.canvas);
        this.texture.needsUpdate = true;
    }

    setContent(lines) {
        if (!this.context || !this.texture) {
            console.warn('Context or texture not available');
            return;
        }
        
        this.currentContent = lines;
        
        this.context.fillStyle = '#000000';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        const fontSize = this.canvas.width * 0.035;
        const lineHeight = fontSize * 1.2;
        const startY = fontSize * 1.5;
        const startX = fontSize;
        const maxWidth = this.canvas.width - (startX * 2);
        const spaceWidth = fontSize * 0.7;  // Adjust for exact 2-space indentation
        
        let currentY = startY;
        let totalWrappedLines = 0;
        let lastLineWraps = 0;
        
        lines.forEach((line, index) => {
            // Determine if this is a prompt line
            const isPromptLine = line.includes('user@WSTP0525');
            
            // Add indentation for non-prompt lines (exactly 2 spaces)
            const xPosition = isPromptLine ? startX : startX + (spaceWidth * 2);
            
            if (isPromptLine && index === lines.length - 1) {
                this.context.fillStyle = '#00FFFF';
            } else {
                this.context.fillStyle = '#00FF00';
            }
            
            this.context.font = `${fontSize}px monospace`;
            
            // Word wrap calculation
            let words = line.split('');
            let currentLine = '';
            let lineWraps = 0;
            
            for (let i = 0; i < words.length; i++) {
                let char = words[i];
                let testLine = currentLine + char;
                let metrics = this.context.measureText(testLine);
                
                // Adjust maxWidth for indented lines
                if (metrics.width > maxWidth - (isPromptLine ? 0 : spaceWidth * 2) && i > 0) {
                    this.context.fillText(currentLine, xPosition, currentY);
                    currentLine = char;
                    currentY += lineHeight;
                    lineWraps++;
                    totalWrappedLines++;
                } else {
                    currentLine = testLine;
                }
            }
            
            this.context.fillText(currentLine, xPosition, currentY);
            currentY += lineHeight;
            
            // If this is the last line, store its wrap count
            if (index === lines.length - 1) {
                lastLineWraps = lineWraps;
            }
        });
        
        this.texture.needsUpdate = true;
        return lastLineWraps;
    }

    resetContent() {
        this.setContent(this.currentContent);
    }

    createShaderMaterial() {
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
                        gl_FragColor.rgb *= 1.5;
                    } else {
                        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
                    }
                }
            `,
            side: THREE.DoubleSide
        });
    }
}

export default ScreenManager; 