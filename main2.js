import SceneManager from './js/SceneManager.js';
import ScreenManager from './js/ScreenManager.js';
import ModelLoader from './js/ModelLoader.js';
import Controls from './js/Controls.js';
import InputManager from './js/InputManager.js';

class App {
    constructor() {
        this.sceneManager = new SceneManager();
        this.screenManager = new ScreenManager();
        
        // Create canvas and set initial content immediately
        this.screenManager.createCanvas();
        
        this.inputManager = new InputManager(this.screenManager);
        this.inputManager.scene = this.sceneManager.scene;
        this.modelLoader = new ModelLoader(this.sceneManager.scene, this.screenManager);
        this.controls = new Controls(
            this.sceneManager.camera, 
            this.sceneManager.renderer,
            this.inputManager
        );
        
        this.controls.setScene(this.sceneManager.scene);
        
        this.init();
    }

    async init() {
        const loadingScreen = document.getElementById('loading-screen');
        const loadingLeft = document.getElementById('loading-left');
        const loadingRight = document.getElementById('loading-right');
        const loader = loadingScreen.querySelector('.loader');
        const startTime = Date.now();
        const minimumLoadTime = 2000; // 2 seconds minimum loading time

        try {
            // Load models
            if (!this.modelsLoaded) {
                const models = await this.modelLoader.loadModel();
                this.modelsLoaded = true;
                
                // Store references if needed
                this.computerModel = models.computerModel;
                this.coffeeModel = models.coffeeModel;
                this.tableModel = models.tableModel;
                this.pictureFrameModel = models.pictureFrameModel;
                this.penholderModel = models.penholderModel;

                // Simulate 'quit' command by default to show desktop
                if (this.inputManager) {
                    this.inputManager.switchToDesktop();
                }
            }

            // Calculate how long the loading has taken
            const loadingDuration = Date.now() - startTime;
            
            // If loading was faster than minimum time, wait for the remaining time
            if (loadingDuration < minimumLoadTime) {
                await new Promise(resolve => 
                    setTimeout(resolve, minimumLoadTime - loadingDuration)
                );
            }

            // Hide loader first
            loader.style.opacity = '0';
            await new Promise(resolve => setTimeout(resolve, 500));

            // Animate the split
            loadingLeft.style.transform = 'translateX(-100%)';
            loadingRight.style.transform = 'translateX(100%)';

            // Remove the loading screen after animation
            setTimeout(() => {
                loadingScreen.style.display = 'none';
            }, 1500);

        } catch (error) {
            console.error('Error during initialization:', error);
            // Handle error - maybe show error message in loading screen
        }
        
        window.addEventListener('resize', () => this.sceneManager.onWindowResize(), false);
        this.animate();
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        this.controls.update();
        this.sceneManager.renderer.render(this.sceneManager.scene, this.sceneManager.camera);
    }
}

// Start the application
new App();
