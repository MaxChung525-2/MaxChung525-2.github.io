class ModelLoader {
    constructor(scene, screenManager) {
        this.scene = scene;
        this.screenManager = screenManager;
        this.loader = new THREE.GLTFLoader();
    }

    loadModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/computer terminal.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);
                    model.position.set(0, 0, 0);
                    model.castShadow = true;
                    model.receiveShadow = true;
                    
                    this.setupScreenMaterial(model);
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log((xhr.loaded / xhr.total * 100) + '% loaded');
                },
                (error) => {
                    console.error('An error occurred loading the model:', error);
                    reject(error);
                }
            );
        });
    }

    setupScreenMaterial(model) {
        model.traverse((node) => {
            if (node.isMesh) {
                node.castShadow = true;
                node.receiveShadow = true;
                
                if (node.name === 'Comp_Screen002_TerminalMaterial_0001') {
                    node.material = this.screenManager.createShaderMaterial();
                } else {
                    node.material.roughness = 0.5;
                    node.material.metalness = 0.8;
                    node.material.envMapIntensity = 1.2;
                }
            }
        });
    }
}

export default ModelLoader; 