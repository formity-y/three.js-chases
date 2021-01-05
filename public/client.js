import * as THREE from '/build/three.module.js';
import {
    OrbitControls
} from '/jsm/controls/OrbitControls.js';
import Stats from '/jsm/libs/stats.module.js';
import {
    GLTFLoader
} from '/jsm/loaders/GLTFLoader.js';



const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 5;
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer();
renderer.setClearColor("#e5e5e5");
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.setClearColor(0xb6cbde);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap

const light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 40, 30);
light.castShadow = true;
scene.add(light);

const hlight = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
hlight.position.set(0.5, 1, 0.75);
scene.add(hlight);

const alight = new THREE.AmbientLight(0x404040, 0.5); // soft white light
scene.add(alight);

const controls = new OrbitControls(camera, renderer.domElement);


let outvilla;
let mouse = new THREE.Vector2();
const raycaster = new THREE.Raycaster();
let positioni;
let dX;
let dY;
let dZ;
let angle;
let angle1;
let intersectp = [];
class Villager {
    constuctor() {
        this.vX = 0;
        this.vY = 0;
        this.vZ = 0;

        this.forward = false;
        this.backward = false;
        this.left = false;
        this.right = false;



    }

    _Init() {
        const loader = new GLTFLoader();
        loader.load('villaf.glb', function (villa) {
            villa.scene.scale.set(1.5, 1.5, 1.5);
            villa.scene.position.set(0, 0, 0);

            scene.add(villa.scene);

            outvilla = villa.scene;

        }, undefined, function (error) {
            console.error(error);
        });



    }


    Mouse(event, ground) {
        mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        // See if the ray from the camera into the world hits one of our meshes
        const intersects = raycaster.intersectObject(ground);


        if (intersects.length > 0) {
            intersectp.push(intersects[0].point);
        }


    }

    Movin() {
        let posX = outvilla.position.x;
        let posZ = outvilla.position.z;
        let newPosX = intersectp[0].x;
        let newPosZ = intersectp[0].z;


        dX = newPosX - posX;
        dZ = newPosZ - posZ;


        angle = Math.abs(Math.atan(dX / dZ));
        angle1 = Math.abs(Math.atan(Math.floor(dZ) / Math.floor(dX)));

        if (dX > 0.05) {
            this.vX = 0.25;
        } else if (dX < 0) {
            this.vX = -0.25;
        }


        if (dZ > 0.05) {
            this.vZ = 0.25;
        } else if (dZ < 0) {
            this.vZ = -0.25;
        }


        outvilla.position.x = outvilla.position.x + Math.sin(angle) * this.vX;

        outvilla.position.z = outvilla.position.z + Math.cos(angle) * this.vZ;



        if ((outvilla.position.x <= newPosX + 1 && outvilla.position.x >= newPosX - 1) && (outvilla.position.z <= newPosZ + 1 && outvilla.position.z >= newPosZ - 1)) {


            outvilla.position.x = Math.floor(intersectp[0].x);
            outvilla.position.z = Math.floor(intersectp[0].z);


            this.vX = 0;
            this.vZ = 0;

            // reset intersectp
            intersectp = [];

        }
    }

    Rotate() {
        let ang = outvilla.rotation.y;
        let newAng;


        if (dX > 0 && dZ > 0) {
            newAng = angle;
        }
        if (dX > 0 && dZ < 0) {
            newAng = Math.PI - angle;
        }
        if (dX < 0 && dZ < 0) {
            newAng = Math.PI + angle;
        }
        if (dX < 0 && dZ > 0) {
            newAng = 2 * Math.PI - angle;
        }


        outvilla.rotation.y = newAng;


    }



}

let dog;
let dXp;
let dZp;
let dHp;
class Pet {
    constuctor() {
        this.vX = 0;
        this.vZ = 0;

    }

    _Init() {
        const loader = new GLTFLoader();
        loader.load('petu.glb', function (ppet) {
            ppet.scene.scale.set(1, 1, 1);
            ppet.scene.rotation.set(0, -Math.PI / 2, 0);
            ppet.scene.position.set(-10, 0, 0);

            ppet.scene.castShadow = true;


            scene.add(ppet.scene);
            dog = ppet.scene;


        }, undefined, function (error) {
            console.error(error);
        });
    }

    Chase(leader) {
        dXp = leader.x - dog.position.x;
        dZp = leader.z - dog.position.z;
        dHp = Math.sqrt(Math.pow(dX, 2) + Math.pow(dZ, 2));


        let anglee = Math.abs(Math.atan(dXp / dZp));

        if (dXp > 2) {
            this.vX = 0.25;
        } else if (dXp < -2) {
            this.vX = -0.25;
        } else if (dXp > -2 && dXp < 2) {
            this.vX = 0;
        }
        dog.position.x = dog.position.x + Math.sin(anglee) * this.vX;

        if (dZp > 2) {
            this.vZ = 0.25;
        } else if (dZp < -2) {
            this.vZ = -0.25;
        } else if (dZp > -2 && dZp < 2) {
            this.vZ = 0;
        }

        dog.position.z = dog.position.z + Math.cos(anglee) * this.vZ;
    }

    Rotating() {
        let ang = dog.rotation.y;
        let newAng;


        if (dXp > 0 && dZp > 0) {
            newAng = angle;
        }
        if (dXp > 0 && dZp < 0) {
            newAng = Math.PI - angle;
        }
        if (dXp < 0 && dZp < 0) {
            newAng = Math.PI + angle;
        }
        if (dXp < 0 && dZp > 0) {
            newAng = 2 * Math.PI - angle;
        }



        dog.rotation.y = newAng;
    }
}


class Obstacle {
    constructor(x, z) {
        this.x = x;
        this.z = z;
        this.vX = 0;
        this.vZ = 0;
        this.self;
    }

    _Init() {
        const geometry = new THREE.BoxGeometry();
        const material = new THREE.MeshLambertMaterial({
            color: 0xc97d7d,
            wireframe: false
        });
        const cube = new THREE.Mesh(geometry, material);
        cube.scale.set(1, 1, 1);
        cube.position.x = this.x;
        cube.position.y = 0.5;
        cube.position.z = this.z;
        scene.add(cube);
        this.self = cube;


    }

    detect(thing) {
        let dX;
        let dZ;
        let dH;

        dX = thing.x - this.self.position.x;
        dZ = thing.z - this.self.position.z;
        dH = Math.sqrt(Math.pow(dX, 2) + Math.pow(dZ, 2));

        let angles = Math.abs(Math.atan(dX / dZ));

        if (dX > 0 && dH < 2 && dH > -2) {
            this.vX = -0.5;
        } else if (dX < 0 && dH < 2 && dH > -2) {
            this.vX = 0.5;
        } else {
            this.vX = 0;
        }

        this.self.position.x = this.self.position.x + Math.sin(angles) * this.vX;


        if (dZ > 0 && dH < 2 && dH > -2) {
            this.vZ = -0.5;
        } else if (dZ < 0 && dH < 2 && dH > -2) {
            this.vZ = 0.5;
        } else {
            this.vZ = 0;
        }

        this.self.position.z = this.self.position.z + Math.cos(angles) * this.vZ;




    }
}



const vertex = new THREE.Vector3();
const color = new THREE.Color();
let floor;
class Plane {
    constructor() {
        this._Init();
    }

    _Init() {
        this.floorGeometry = new THREE.PlaneBufferGeometry(2000, 2000, 50, 50);

        this.floorGeometry.rotateX(-Math.PI / 2);

        //vertex displacement
        let position = this.floorGeometry.attributes.position;

        for (let i = 0, l = position.count; i < l; i++) {
            vertex.fromBufferAttribute(position, i)

            vertex.x += Math.random() * 20 - 10;
            vertex.z += Math.random() * 20 - 10;

            position.setXYZ(i, vertex.x, vertex.y, vertex.z);
        }


        this.floorGeometry = this.floorGeometry.toNonIndexed();

        position = this.floorGeometry.attributes.position;


        const colorsFloor = [];
        for (let i = 0, l = position.count; i < l; i++) {
            color.setHSL(Math.random() * 0.3 + 0.2, 1, 0.80);
            //sets colors in hsl. end up pushing rgb values of the already set color
            colorsFloor.push(color.r, color.g, color.b);
        }

        this.floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));

        this.floorMaterial = new THREE.MeshBasicMaterial({
            vertexColors: true
        });

        this.floor = new THREE.Mesh(this.floorGeometry, this.floorMaterial);

        floor = this.floor;
        scene.add(this.floor);
    }
}

let boi = new Villager();
let planee = new Plane();
let pett = new Pet();
let myBox;
let boxes = [];



window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    render();
}, false);

const stats = Stats();
document.body.appendChild(stats.dom);


function start() {

    for (let i = 0; i < 20; i++) {
        myBox = new Obstacle(Math.random() * (20) - 10, Math.random() * (20) - 10);

        boxes.push(myBox);

    }

    for (let i in boxes) {
        boxes[i]._Init();
    }

    boi._Init();
    document.addEventListener('click', (e) => boi.Mouse(e, floor), false);

    pett._Init();

    animate();

}

var animate = function () {
    requestAnimationFrame(animate);
    controls.update();

    for (let i in boxes) {
        boxes[i].detect(outvilla.position);

    }


    if (intersectp.length > 0) {
        boi.Movin();
        boi.Rotate();
    }

    pett.Chase(outvilla.position);
    pett.Rotating();


    render();
    stats.update();
};

function render() {
    renderer.render(scene, camera);
}


start();
