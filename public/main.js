import * as THREE from '/build/three.module.js';
import {
    OrbitControls
} from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';
import {
    GLTFLoader
} from '/jsm/loaders/GLTFLoader.js';
import {
    graphics
} from "./threeBasics.js";


//const controls = new OrbitControls(camera, renderer.domElement);

//loading in glb format 3D models
const loader = new GLTFLoader();
loader.load('villager3.glb', function (gltf) {
    //    scene.add(gltf.scene);
}, undefined, function (error) {
    console.error(error);
});

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({
    color: 0x00ff00,
    wireframe: true
});
const cube = new THREE.Mesh(geometry, material);
//scene.add(cube);

class Plane {
    constructor(params) {
//        this._params = params;
//        this._Init(params);
    }

    _Init(params) {
        this.planegeo = new THREE.PlaneGeometry(1, 1, 256, 256);
        this.planemat = new THREE.MeshBasicMaterial({
            color: 0xb8d9b8,
            wireframe: true
        });
        this._plane = new THREE.Mesh(this.planegeo, this.planemat);
        //        this._plane.castShadow = false;
        //        this._plane.receiveShadow = true;
        this._plane.rotation.x = THREE.Math.degToRad(-90);
        params.scene.add(this._plane);
    }
}


let _graphics = new graphics.Graphics(this);
let planee = new Plane({
    scene: _graphics.Scene
});



var animate = function () {
    requestAnimationFrame(animate);
//    controls.update();
    render();
//    stats.update();
};

function render() {
    _graphics.Render();
}

animate();
