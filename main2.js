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
        // Load all models
        const models = await this.modelLoader.loadModel();
        
        // Store references if needed
        this.computerModel = models.computerModel;
        this.coffeeModel = models.coffeeModel;
        this.tableModel = models.tableModel;
        this.pictureFrameModel = models.pictureFrameModel;
        this.penholderModel = models.penholderModel;
        
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
