import "./style.css";
import * as dat from "lil-gui";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import { PerspectiveCamera, OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OGOrbitControls } from "three/examples/jsm/controls/OrbitControls";

const { Suspense, StrictMode, useRef, useEffect } = React;

function App() {
  return (
    <StrictMode>
      <Suspense fallback={null}>
        <Canvas gl={{ alpha: false }}>
          <House />
          <Floor />
          <Lights />
          <Camera />
          <Controls />
        </Canvas>
      </Suspense>
    </StrictMode>
  );
}

function House() {
  return (
    <mesh position={[0, 1, 0]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial roughness={0.7} />
    </mesh>
  );
}

function Floor() {
  return (
    <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[0, 0, 0]}>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color={"#a9c388"} />
    </mesh>
  );
}

function Lights() {
  const ambientLightRef = useRef(null);
  const moonLightRef = useRef(null);

  useEffect(() => {
    gui.add(ambientLightRef.current, "intensity").min(0).max(1).step(0.001);
    gui.add(moonLightRef.current, "intensity").min(0).max(1).step(0.001);
    gui.add(moonLightRef.current.position, "x").min(-5).max(5).step(0.001);
    gui.add(moonLightRef.current.position, "y").min(-5).max(5).step(0.001);
    gui.add(moonLightRef.current.position, "z").min(-5).max(5).step(0.001);
  }, []);
  return (
    <>
      {/* ambient light */}
      <ambientLight args={["#ffffff", 0.5]} ref={ambientLightRef} />
      {/* moonLight */}
      <directionalLight
        args={["#ffffff", 0.5]}
        position={[4, 5, -2]}
        ref={moonLightRef}
      />
    </>
  );
}

function Camera() {
  return (
    <PerspectiveCamera
      makeDefault
      args={[75, window.innerWidth / window.innerHeight, 0.1, 100]}
      position={[4, 2, 5]}
    />
  );
}

function Controls() {
  return <OrbitControls enableDamping={true} />;
}

ReactDOM.render(<App />, document.getElementById("root"));

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// // Canvas
// const canvas = document.querySelector("canvas.webgl");

// // Scene
// const scene = new THREE.Scene();

// /**
//  * Textures
//  */
// const textureLoader = new THREE.TextureLoader();

// /**
//  * House
//  */
// // Temporary sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial({ roughness: 0.7 })
// );
// sphere.position.y = 1;
// scene.add(sphere);

// // Floor
// const floor = new THREE.Mesh(
//   new THREE.PlaneGeometry(20, 20),
//   new THREE.MeshStandardMaterial({ color: "#a9c388" })
// );
// floor.rotation.x = -Math.PI * 0.5;
// floor.position.y = 0;
// scene.add(floor);

// /**
//  * Lights
//  */
// // Ambient light
// const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
// gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
// scene.add(ambientLight);

// // Directional light
// const moonLight = new THREE.DirectionalLight("#ffffff", 0.5);
// moonLight.position.set(4, 5, -2);
// gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
// gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
// gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
// scene.add(moonLight);

// /**
//  * Sizes
//  */
// const sizes = {
//   width: window.innerWidth,
//   height: window.innerHeight,
// };

// window.addEventListener("resize", () => {
//   // Update sizes
//   sizes.width = window.innerWidth;
//   sizes.height = window.innerHeight;

//   // Update camera
//   camera.aspect = sizes.width / sizes.height;
//   camera.updateProjectionMatrix();

//   // Update renderer
//   renderer.setSize(sizes.width, sizes.height);
//   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
// });

// /**
//  * Camera
//  */
// // Base camera
// const camera = new THREE.PerspectiveCamera(
//   75,
//   sizes.width / sizes.height,
//   0.1,
//   100
// );
// camera.position.x = 4;
// camera.position.y = 2;
// camera.position.z = 5;
// scene.add(camera);

// // Controls
// const controls = new OGOrbitControls(camera, canvas);
// controls.enableDamping = true;

// /**
//  * Renderer
//  */
// const renderer = new THREE.WebGLRenderer({
//   canvas: canvas,
// });
// renderer.setSize(sizes.width, sizes.height);
// renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// /**
//  * Animate
//  */
// const clock = new THREE.Clock();

// const tick = () => {
//   const elapsedTime = clock.getElapsedTime();

//   // Update controls
//   controls.update();

//   // Render
//   renderer.render(scene, camera);

//   // Call tick again on the next frame
//   window.requestAnimationFrame(tick);
// };

// tick();
