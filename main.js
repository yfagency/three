import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import WebGL from 'three/addons/capabilities/WebGL.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

const controls = new OrbitControls(camera, renderer.domElement);
const loader = new GLTFLoader();

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let model; // Define a variable to store the loaded model

loader.load('./models/t-shirt.glb', function (gltf) {
  model = gltf.scene;
  scene.add(model);

  const ambientLight = new THREE.AmbientLight(0xffffff, 1); // color, intensity
  scene.add(ambientLight);
}, undefined, function (error) {
  console.error(error);
});

const pointLight = new THREE.PointLight(0xffffff, 1); // color, intensity
pointLight.position.set(3, 50, 10); // Set position of the light
scene.add(pointLight);

const pointLightHelper = new THREE.PointLightHelper(pointLight, 1); // Pass the point light and optional size parameter
scene.add(pointLightHelper); // Add the helper to the scene

camera.position.z = 100;
camera.position.x = 0;
camera.position.y = 0;

function animate() {

  requestAnimationFrame(animate);

  if (model) { // Check if the model is loaded
    // Rotate the model
    model.rotation.y += 0.01; // Example rotation
  }

  renderer.render(scene, camera);
}

setInterval(() => {

  let currentRotation

  loader.load('./models/t-shirt.glb', function (gltf) {
    if (model) {
      currentRotation = {
        x: model.rotation.x,
        y: model.rotation.y,
        z: model.rotation.z
      };
      // Remove the previous model from the scene
      scene.remove(model);
    }

    model = gltf.scene;

    model.rotation.set(currentRotation.x, currentRotation.y, currentRotation.z);

    scene.add(model);
    
  }, undefined, function (error) {
    console.error(error);
  });
}, 3000);

if (WebGL.isWebGLAvailable()) {
  animate();
} else {
  const warning = WebGL.getWebGLErrorMessage();
  document.body.appendChild(warning);
}