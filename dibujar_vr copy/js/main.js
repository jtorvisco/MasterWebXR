import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';
import { XRControllerModelFactory } from 'three/addons/webxr/XRControllerModelFactory.js';

let container;
let point, point2;
let camera, scene, renderer;
let controller1, controller2, controllerGrip1, controllerGrip2;
let position_start, position_end;
let raycaster;
let drawRectangle = true, drawBox = false;
const intersected = [];
const tempMatrix = new THREE.Matrix4();
let group;
let redDot, dotGeometry, dotMaterial, arrowGeometry = new THREE.BufferGeometry();
let heightLine, arrow, finalInterPoint;

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

    // Controller lines

    const lineControllerGeometry = new THREE.BufferGeometry().setFromPoints( [ new THREE.Vector3( 0, 0, 0 ), new THREE.Vector3( 0, 0, - 1 ) ] );

    const controllerLine = new THREE.Line( lineControllerGeometry );
    controllerLine.name = 'controllerLine';
    controllerLine.scale.z = 5;

    controller1.add( controllerLine.clone() );
    controller2.add( controllerLine.clone() );

    raycaster = new THREE.Raycaster();

    // Intersect dot
    dotGeometry = new THREE.BufferGeometry();
    dotMaterial = new THREE.PointsMaterial(  {size: 0.05, color: 0xff0000 } );
    redDot = new THREE.Points(dotGeometry, dotMaterial);
    redDot.visible = false;
    scene.add(redDot)
}

function animate() {
  renderer.setAnimationLoop( render );
}

function onSelectStart( event ) {
  if (drawRectangle){  
    position_start = [...event.target.position]; // deep copy
  }
}

function onSelectEnd( event ) {
    if (drawRectangle) {
      drawRectangle = false;
      drawBox = true;
      position_end = [...event.target.position]; // deep copy

      group = new THREE.Group();
      scene.add(group);

      // line
      const linematerial = new THREE.LineBasicMaterial( { color: 0x0000ff } );

      const points = []
      points.push( new THREE.Vector3( position_start[0], position_end[1], position_start[2] ) ); // Arriba izquierda
      points.push( new THREE.Vector3( position_end[0], position_end[1], position_start[2] ) );  // Arriba derecha
      points.push( new THREE.Vector3( position_end[0], position_end[1], position_end[2] ) );  // Abajo derecha
      points.push( new THREE.Vector3( position_start[0], position_end[1], position_end[2] ) );  // Abajo izquierda
      points.push( new THREE.Vector3( position_start[0], position_end[1], position_start[2] ) ); // Arriba izquierda

      const linegeometry = new THREE.BufferGeometry().setFromPoints( points );

      const line = new THREE.Line( linegeometry, linematerial );

      group.add(line);
    } else {
      if (drawBox){
        console.log(position_end[1], event.target.position.y);
        const x = Math.abs(position_start[0] - position_end[0]);
        const y = Math.abs(position_end[1] - event.target.position.y);
        const z = Math.abs(position_start[2] - position_end[2]);

        const boxGeom = new THREE.BoxGeometry(x, y, z);
        const boxmat = new THREE.MeshStandardMaterial({color: 0xffff00});
        const cube = new THREE.Mesh(boxGeom, boxmat);

        console.log();
        cube.position.set((position_start[0] + position_end[0])/2, 
                        (position_end[1] + event.target.position.y)/2, 
                        (position_start[2] + position_end[2])/2);
        scene.add(cube)
      }
    }
}

function render() {

  renderer.render( scene, camera );
}