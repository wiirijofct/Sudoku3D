// unused module, for future reference if needed
import {
    Vector2,
    Vector3,
    Raycaster
} from 'three';

class CustomCam {

    constructor(object, domElement, objects) {
        this.object = object; // The camera
        this.domElement = domElement; // The canvas or renderer dom element
        this.objects = objects; // The array of objects (tiles) used for raycasting

        // API
        this.enabled = true;
        this.transitionSpeed = 0.01; // How fast the camera focuses on a subgrid

        // internals
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
        this.targetPosition = new Vector3();

        // Initial setup
        this.object.position.set(0, 2.2, 0);
        this.object.up.set(0, 0, -1);
        this.object.lookAt(0, 0, 0);

        // Event listeners
        this.domElement.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

    onMouseMove(event) {
        // Calculate mouse position in normalized device coordinates (-1 to +1) for both components.
        this.pointer.set((event.clientX / window.innerWidth) * 2 - 1, - (event.clientY / window.innerHeight) * 2 + 1);
        this.raycaster.setFromCamera(this.pointer, this.object);

        // Calculate objects intersecting the picking ray
        const intersects = this.raycaster.intersectObjects(this.objects, false);

        if (intersects.length > 0) {
            const intersect = intersects[0];
            const subgridCenter = intersect.object.position.clone(); // Assume each object's position is at its center

            // Calculate the target position for the camera to look at, assuming subgrids are 1x1 units in size
            this.targetPosition.x = Math.floor(subgridCenter.x) + 0.5;
            this.targetPosition.y = 0; // Keep the camera's current height (y value)
            this.targetPosition.z = Math.floor(subgridCenter.z) + 0.5;
        }
    }

    update() {
        if (this.enabled === false) return;

        // Smoothly move the camera's lookAt position towards the target position
        this.object.lookAt(this.targetPosition);
        // Assuming you want to keep the camera's current height, no need to lerp the y position
        this.object.position.lerp(new Vector3(this.targetPosition.x, this.object.position.y, this.targetPosition.z), this.transitionSpeed);
    }

    dispose() {
        this.domElement.removeEventListener('mousemove', this.onMouseMove.bind(this), false);
    }

}

function contextmenu(event) {
    event.preventDefault();
}

export { CustomCam };
