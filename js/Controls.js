class Controls {
    constructor(camera, renderer, inputManager) {
        this.camera = camera;
        this.renderer = renderer;
        this.controls = new THREE.OrbitControls(camera, renderer.domElement);
        this.setupControls();
        this.setupRaycaster();
        this.isAnimating = false;
        this.isFocused = false;
        
        // Default position (adjustable based on your scene)
        this.defaultPosition = new THREE.Vector3(0, 2, 5);
        this.defaultTarget = new THREE.Vector3(0, 0.5, 0);
        
        // Screen focus position (directly facing -Z)
        // Adjust these values based on your screen's exact position
        this.screenPosition = new THREE.Vector3(-0.1, 0.7, 1);    // Camera position when focused
        this.screenTarget = new THREE.Vector3(-0.1, 0.7, -1);     // Where camera looks when focused

        this.inputManager = inputManager;
        console.log('Controls initialized with inputManager:', !!inputManager);
    }

    setupControls() {
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.05;
        this.controls.minDistance = 2;
        this.controls.maxDistance = 6;
        this.controls.target.set(0, 0.5, 0);
        this.controls.zoomSpeed = 2;
        this.controls.maxPolarAngle = Math.PI / 2;
        
        this.controls.rotateSpeed = 0.5;
        this.controls.panSpeed = 0.3;
    }

    setupRaycaster() {
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2();
        this.renderer.domElement.addEventListener('click', (event) => this.onClick(event));
    }

    onClick(event) {
        if (this.isAnimating) return;

        this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        this.raycaster.setFromCamera(this.mouse, this.camera);
        const intersects = this.raycaster.intersectObjects(this.scene.children, true);

        if (intersects.length > 0) {
            const clickedObject = intersects[0].object;
            if (clickedObject.name === 'Comp_Screen002_TerminalMaterial_0001') {
                this.toggleCameraPosition();
            }
        }
    }

    toggleCameraPosition() {
        if (this.isAnimating) return;
        console.log('Toggling camera position. Current focus:', this.isFocused);

        if (!this.isFocused) {
            this.animateCamera(
                this.screenPosition,
                this.screenTarget,
                () => {
                    this.isFocused = true;
                    this.disableControls();
                    if (this.inputManager) {
                        console.log('Activating input manager');
                        this.inputManager.activate();
                    } else {
                        console.warn('InputManager not found');
                    }
                }
            );
        } else {
            // Returning to default position
            this.animateCamera(
                this.defaultPosition,
                this.defaultTarget,
                () => {
                    this.isFocused = false;
                    this.enableControls();
                    console.log('Deactivating input manager');
                    this.inputManager.deactivate(); // Deactivate input when unfocused
                }
            );
        }
    }

    animateCamera(targetPosition, targetLookAt, callback) {
        this.isAnimating = true;
        const startPosition = this.camera.position.clone();
        const startLookAt = this.controls.target.clone();
        const duration = 1000;
        const startTime = Date.now();

        const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Smooth easing
            const easing = t => t<.5 ? 2*t*t : -1+(4-2*t)*t;
            const easedProgress = easing(progress);

            // Update camera position
            this.camera.position.lerpVectors(startPosition, targetPosition, easedProgress);
            
            // Update look-at target smoothly
            this.controls.target.lerpVectors(startLookAt, targetLookAt, easedProgress);
            
            // Ensure camera is looking at the target during animation
            this.camera.lookAt(this.controls.target);

            if (progress < 1) {
                requestAnimationFrame(animate);
            } else {
                this.isAnimating = false;
                if (callback) callback();
            }
        };

        animate();
    }

    disableControls() {
        this.controls.enabled = false;
        this.controls.enableZoom = false;
        this.controls.enableRotate = false;
        this.controls.enablePan = false;
        
        // Don't force position here anymore, let the animation handle it
        this.camera.up.set(0, 1, 0);
        this.camera.updateProjectionMatrix();
    }

    enableControls() {
        this.controls.enabled = true;
        this.controls.enableZoom = true;
        this.controls.enableRotate = true;
        this.controls.enablePan = true;
    }

    setScene(scene) {
        this.scene = scene;
    }

    update() {
        if (!this.isAnimating && !this.isFocused) {
            this.controls.update();
        }
    }
}

export default Controls; 