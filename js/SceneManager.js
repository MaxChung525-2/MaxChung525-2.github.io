class SceneManager {
    constructor() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x000000);
        
        this.setupCamera();
        this.setupRenderer();
        this.setupLights();
        this.setupPlane();
    }

    setupCamera() {
        this.camera = new THREE.PerspectiveCamera(55, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(7, 4, 10);
    }

    setupRenderer() {
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            powerPreference: "high-performance",
            precision: "highp"
        });
        
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.2;
        document.body.appendChild(this.renderer.domElement);
    }

    setupLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
        this.scene.add(ambientLight);

        const hemisphereLight = new THREE.HemisphereLight(0xffffff, 0x222222, 0.1);
        this.scene.add(hemisphereLight);

        const spotLight = new THREE.SpotLight(0xffffff, 1.5);
        spotLight.position.set(0, 8, 0);
        spotLight.angle = Math.PI / 6;
        spotLight.penumbra = 0.2;
        spotLight.decay = 2;
        spotLight.distance = 30;
        spotLight.castShadow = true;
        spotLight.shadow.mapSize.width = 2048;
        spotLight.shadow.mapSize.height = 2048;
        spotLight.shadow.bias = -0.0001;
        this.scene.add(spotLight);
    }

    setupPlane() {
        const planeGeometry = new THREE.PlaneGeometry(100, 100, 32, 32);
        const planeMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x030303,
            roughness: 0.95,
            metalness: 0.0,
            side: THREE.DoubleSide
        });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -Math.PI / 2;
        plane.position.y = -0.001;
        plane.receiveShadow = true;
        this.scene.add(plane);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

export default SceneManager; 