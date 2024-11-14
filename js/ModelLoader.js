class ModelLoader {
    constructor(scene, screenManager) {
        this.scene = scene;
        this.screenManager = screenManager;
        this.loader = new THREE.GLTFLoader();
    }

    async loadModel() {
        try {
            // Load all models
            const [computerModel, coffeeModel, leftJoystickModel, rightJoystickModel] = await Promise.all([
                this.loadComputerModel(),
                this.loadCoffeeModel(),
                this.loadLeftJoystickModel(),
                this.loadRightJoystickModel()
            ]);

            return { 
                computerModel, 
                coffeeModel, 
                leftJoystickModel, 
                rightJoystickModel 
            };
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    loadComputerModel() {
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
                    console.log('Computer: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
            );
        });
    }

    loadCoffeeModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/coffee cup.glb',
                (gltf) => {
                    const model = gltf.scene;
                    // Adjust these values to position the cup correctly
                    model.scale.set(1, 1, 1);  // Adjust scale if needed
                    model.position.set(-1.3, 0, 0.5);  // Position to the right of computer
                    model.rotation.y = -Math.PI / 6;  // Slight rotation for better view
                    
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            // Adjust material properties if needed
                            if (node.material) {
                                node.material.roughness = 0.5;
                                node.material.metalness = 0.3;
                            }
                        }
                    });
                    
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log('Coffee cup: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
            );
        });
    }

    loadLeftJoystickModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/left joystick.glb',
                (gltf) => {
                    const model = gltf.scene;
                    // Position left joystick
                    model.scale.set(1, 1, 1);
                    model.position.set(-0.9, 0, 1.3); // Left side of computer
                    model.rotation.y = Math.PI / 6; // Slight rotation inward
                    
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (node.material) {
                                node.material.roughness = 0.7;
                                node.material.metalness = 0.3;
                            }
                        }
                    });
                    
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log('Left Joystick: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
            );
        });
    }

    loadRightJoystickModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/right joystick.glb',
                (gltf) => {
                    const model = gltf.scene;
                    // Position right joystick
                    model.scale.set(1, 1, 1);
                    model.position.set(1.1, 0, 1); // Right side of computer
                    model.rotation.y = -Math.PI / 6; // Slight rotation inward
                    
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (node.material) {
                                node.material.roughness = 0.7;
                                node.material.metalness = 0.3;
                            }
                        }
                    });
                    
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log('Right Joystick: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
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