class ModelLoader {
    constructor(scene, screenManager) {
        this.scene = scene;
        this.screenManager = screenManager;
        this.loader = new THREE.GLTFLoader();
    }

    async loadModel() {
        try {
            const [computerModel, coffeeModel, tableModel, pictureFrameModel, penholderModel] = await Promise.all([
                this.loadComputerModel(),
                this.loadCoffeeModel(),
                this.loadTableModel(),
                this.loadPictureFrameModel(),
                this.loadPenholderModel()
            ]);

            return { 
                computerModel, 
                coffeeModel, 
                tableModel,
                pictureFrameModel,
                penholderModel
            };
        } catch (error) {
            console.error('Error loading models:', error);
        }
    }

    loadComputerModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/models/computer terminal.glb',
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
                'assets/models/coffee cup.glb',
                (gltf) => {
                    const model = gltf.scene;
                    // Adjust these values to position the cup correctly
                    model.scale.set(1, 1, 1);  // Adjust scale if needed
                    model.position.set(-1.3, 0.06, 0.5);  // Position to the right of computer
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


    loadPictureFrameModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/models/picture frame.glb',
                (gltf) => {
                    const model = gltf.scene;
                    // Adjust these values to position the frame correctly
                    model.scale.set(1, 1, 1);  // Adjust scale if needed
                    model.position.set(-0.08, 0.027, -0.7);  // Adjust position as needed
                    model.rotation.y = 5 * (Math.PI / 6);  // Adjust rotation as needed
                    
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
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
                    console.log('Picture Frame: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
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

    // Add new method to load table
    loadTableModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/models/table.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);  // Adjust scale if needed
                    model.position.set(0, 0, 0);  // Adjust position if needed
                    
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
                    console.log('Table: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
            );
        });
    }

    loadPenholderModel() {
        return new Promise((resolve, reject) => {
            this.loader.load(
                'assets/models/penholder.glb',
                (gltf) => {
                    const model = gltf.scene;
                    model.scale.set(1, 1, 1);  // Adjust scale if needed
                    model.position.set(1.5, 0.05, 0);  // Position to the right of computer
                    model.rotation.y = Math.PI / 6;  // Slight rotation for better view
                    
                    model.traverse((node) => {
                        if (node.isMesh) {
                            node.castShadow = true;
                            node.receiveShadow = true;
                            if (node.material) {
                                node.material.roughness = 0.6;
                                node.material.metalness = 0.4;
                            }
                        }
                    });
                    
                    this.scene.add(model);
                    resolve(model);
                },
                (xhr) => {
                    console.log('Penholder: ' + (xhr.loaded / xhr.total * 100) + '% loaded');
                },
                reject
            );
        });
    }
}

export default ModelLoader; 