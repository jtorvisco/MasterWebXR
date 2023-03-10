import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let container;
let point, point2;
let camera, scene, renderer;
let controller1, controller2, controllerGrip1, controllerGrip2;
let position_start, position_end;

init()
animate()

function init() {
    container = document.createElement( 'div' );
    document.body.appendChild( container );

    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0x808080 );

    camera = new THREE.PerspectiveCamera( 50, window.innerWidth / window.innerHeight, 0.1, 10 );
    camera.position.set( 0, 1.6, 3 );

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
    
    const geometry2 = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
    const material2 = new THREE.MeshStandardMaterial( {
                    color: Math.random() * 0xffffff,
                    roughness: 0.7,
                    metalness: 0.0
            } );
    
    
    point2 = new THREE.Mesh(geometry2, material2);
    scene.add(point2)
    
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.xr.enabled = true;
    container.appendChild( renderer.domElement );

    document.body.appendChild( VRButton.createButton( renderer ) );

    // controllers
    controller1 = renderer.xr.getController( 0 );
    controller1.addEventListener( 'selectstart', onSelectStart );
    controller1.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller1 );

    controller2 = renderer.xr.getController( 1 );
    controller2.addEventListener( 'selectstart', onSelectStart );
    controller2.addEventListener( 'selectend', onSelectEnd );
    scene.add( controller2 );

    const controllerModelFactory = new XRControllerModelFactory();

    controllerGrip1 = renderer.xr.getControllerGrip( 0 );
    controllerGrip1.add( controllerModelFactory.createControllerModel( controllerGrip1 ) );
    scene.add( controllerGrip1 );

    controllerGrip2 = renderer.xr.getControllerGrip( 1 );
    controllerGrip2.add( controllerModelFactory.createControllerModel( controllerGrip2 ) );
    scene.add( controllerGrip2 );
}

function animate() {
  renderer.setAnimationLoop( render );
}

function onSelectStart( event ) {
    position_start = [...event.target.position]; // deep copy
}

function onSelectEnd( event ) {
    position_end = [...event.target.position]; // deep copy
    console.log(position_start, position_end);

    const x = Math.abs(position_start[0] - position_end[0]);
    const y = Math.abs(position_start[1] - position_end[1]);
    const z = Math.abs(position_start[2] - position_end[2]);

    console.log(x, y, z)
    const boxGeom = new THREE.BoxGeometry(x, y, z);
    const boxmat = new THREE.MeshStandardMaterial({color: 0xffff00});
    const cube = new THREE.Mesh(boxGeom, boxmat);
    cube.position.set((position_start[0] + position_end[0])/2, 
                    (position_start[1] + position_end[1])/2, 
                    (position_start[2] + position_end[2])/2);
    console.log(cube)
    scene.add(cube)
}

function render() {
  renderer.render( scene, camera );
}