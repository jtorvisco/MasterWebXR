import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

init()
animate()

let point;
let camera, scene, renderer;

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x808080 );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );

    const floorGeometry = new THREE.PlaneGeometry( 4, 4 );
    const floorMaterial = new THREE.MeshStandardMaterial( {
            color: 0xeeeeee,
            roughness: 1.0,
            metalness: 0.0
    } );
    const floor = new THREE.Mesh( floorGeometry, floorMaterial );
    floor.rotation.x = - Math.PI / 2;
    floor.receiveShadow = true;
    scene.add( floor );

    scene.add( new THREE.HemisphereLight( 0x808080, 0x606060 ) );

    const light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 0, 6, 0 );
    light.castShadow = true;
    light.shadow.camera.top = 2;
    light.shadow.camera.bottom = - 2;
    light.shadow.camera.right = 2;
    light.shadow.camera.left = - 2;
    light.shadow.mapSize.set( 4096, 4096 );
    scene.add( light );
  
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );

    const material = new THREE.PointsMaterial( { color: 0x888888 } );
    point = THREE.Points(geometry, material)
    scene.add(point)
}

function animate() {
  renderer.setAnimationLoop( render );
}

function render() {
  renderer.render( scene, camera );
}
