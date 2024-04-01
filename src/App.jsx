import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'; // Import OrbitControls
import WebGL from 'three/addons/capabilities/WebGL.js'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {

  console.log('app running...')
  let camera

  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer();
  let shirtColor = 'white';

  const loader = new GLTFLoader();

  if (window.innerWidth < 600) {
    renderer.setSize(window.innerWidth, (window.innerHeight / 2));
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / (window.innerHeight / 2), 0.1, 1000);
  } else {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer.setSize(window.innerWidth, window.innerHeight);
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth < 600) {
      camera.aspect = window.innerWidth / (window.innerHeight/2);
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, (window.innerHeight/2));
    } else {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }
  });

  console.log(window.innerHeight)

  const controls = new OrbitControls(camera, renderer.domElement);
  document.body.appendChild(renderer.domElement);

  let model; // Define a variable to store the loaded model

  loader.load(`t-shirt-${shirtColor}.glb`, function (gltf) {
    model = gltf.scene;
    scene.add(model);

    const ambientLight = new THREE.AmbientLight(0xffffff, 5); // color, intensity
    scene.add(ambientLight);
  }, undefined, function (error) {
    console.error(error);
  });

  const pointLight = new THREE.PointLight(0xffffff, 10); // color, intensity
  pointLight.position.set(3, 50, 10); // Set position of the light
  scene.add(pointLight);

  const pointLightHelper = new THREE.PointLightHelper(pointLight, 10); // Pass the point light and optional size parameter
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

    renderer.setClearColor(0x333333);

    renderer.render(scene, camera);
  }

  setInterval(() => {

    let currentRotation

    shirtColor == 'white' ? shirtColor = 'yellow' : shirtColor = 'white'

    loader.load(`t-shirt-${shirtColor}.glb`, function (gltf) {
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

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button>3️⃣.js</button>
        <p>Bruno Silva</p>
      </div>
      <p className="read-the-docs">
        Nomin 😍
      </p>
    </>
  )
}

export default App
