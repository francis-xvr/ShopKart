import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 100, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor( 0x000000, 0 );
const domcon = document.getElementById("background");
domcon.appendChild( renderer.domElement );

const controls = new OrbitControls( camera, renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
const light = new THREE.AmbientLight( 0xffffff ); // soft white light
scene.add( light );
const p1 = new THREE.PointLight( 0xffffff, 40, 100 );
p1.position.set( 3, 5, 0 );
scene.add( p1 );

// const axesHelper = new THREE.AxesHelper( 5 );
// scene.add( axesHelper );


let loadedasset = null

const loader = new GLTFLoader();
loader.load(
	// resource URL
	'src/assets/GiftBox_gltf.gltf',
	// called when the resource is loaded
	function ( gltf ) {

		scene.add( gltf.scene );

		gltf.animations; // Array<THREE.AnimationClip>
		gltf.scene; // THREE.Group
		gltf.scenes; // Array<THREE.Group>
		gltf.cameras; // Array<THREE.Camera>
		gltf.asset; // Object
        loadedasset = gltf.scene;
		loadedasset.position.y = -1;
	},
	// called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);
const loader1 = new OBJLoader();

// load a resource
loader1.load(
	// resource URL
	'src/assets/Heart.obj',
	// called when resource is loaded
	function ( object ) {
        // loadedasset = object;
		// loadedasset.position.y = -1;
		// scene.add( object );
		console.log(object);

	},
	// called when loading is in progresses
	function ( xhr ) {
	
		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	}
);

camera.position.z = 5;

function animate() {
	requestAnimationFrame( animate );
    // controls.update();
	// loadedasset.rotation.x += 0.01;
	if(loadedasset!=null){
		loadedasset.rotation.y += 0.01;
	}

	renderer.render( scene, camera );
}
function initiate3DScene(){
	// loadedasset.position.y = 0.01;
    animate();
}


export {initiate3DScene};