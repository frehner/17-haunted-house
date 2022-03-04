import "./style.css";
import * as dat from "lil-gui";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import * as THREE from "three";
import { OrbitControls as OGOrbitControls } from "three/examples/jsm/controls/OrbitControls";

const { Suspense, StrictMode, useRef, useEffect, useState } = React;

function App() {
  return (
    <StrictMode>
      <Suspense fallback={null}>
        <Canvas gl={{ alpha: false }}>
          <Fog />
          <House />
          <Graves />
          <Floor />
          <Lights />
          <Camera />
          <Controls />
        </Canvas>
      </Suspense>
    </StrictMode>
  );
}

const bushGeometry = new THREE.SphereBufferGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "#89c854" });
function House() {
  const wallHeight = 2.5;

  return (
    <group>
      {/* roof */}
      <mesh
        position={[0, wallHeight + 0.5, 0]}
        rotation={[0, Math.PI * 0.25, 0]}
      >
        <coneBufferGeometry args={[3.5, 1, 4]} />
        <meshStandardMaterial color={"#b35f45"} />
      </mesh>
      <Walls wallHeight={wallHeight} />
      <Door />
      {/* bushes */}
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.5, 0.5, 0.5]}
        position={[0.8, 0.2, 2.2]}
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.25, 0.25, 0.25]}
        position={[1.4, 0.1, 2.1]}
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.4, 0.4, 0.4]}
        position={[-0.8, 0.1, 2.2]}
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.15, 0.15, 0.15]}
        position={[-1, 0.05, 2.6]}
      />
      {/* door light */}
      <pointLight args={["#ff7d46", 1, 7]} position={[0, 2.2, 2.7]} />
    </group>
  );
}

function Door() {
  const [
    doorColorTexture,
    doorAlphaTexture,
    doorAmbientOcclusionTexture,
    doorHeightTexture,
    doorNormalTexture,
    doorMetalnessTexture,
    doorRoughnessTexture,
  ] = useTexture([
    "/textures/door/color.jpg",
    "/textures/door/alpha.jpg",
    "/textures/door/ambientOcclusion.jpg",
    "/textures/door/height.jpg",
    "/textures/door/normal.jpg",
    "/textures/door/metalness.jpg",
    "/textures/door/roughness.jpg",
  ]);

  const doorMeshRef = useRef();
  useEffect(() => {
    doorMeshRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        doorMeshRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);
  return (
    <mesh position={[0, 1, 2 + 0.01]} ref={doorMeshRef}>
      <planeBufferGeometry args={[2.2, 2.2, 100, 100]} />
      <meshStandardMaterial
        map={doorColorTexture}
        transparent={true}
        alphaMap={doorAlphaTexture}
        aoMap={doorAmbientOcclusionTexture}
        displacementMap={doorHeightTexture}
        displacementScale={0.1}
        normalMap={doorNormalTexture}
        metalnessMap={doorMetalnessTexture}
        roughnessMap={doorRoughnessTexture}
        // wireframe
      />
    </mesh>
  );
}

function Walls({ wallHeight }) {
  const [
    bricksColorTexture,
    bricksAmbientOcclusionTexture,
    bricksNormalTexture,
    bricksRoughnessTexture,
  ] = useTexture([
    "/textures/bricks/color.jpg",
    "/textures/bricks/ambientOcclusion.jpg",
    "/textures/bricks/normal.jpg",
    "/textures/bricks/roughness.jpg",
  ]);

  const wallMeshRef = useRef();
  useEffect(() => {
    wallMeshRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        wallMeshRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);
  return (
    <mesh position={[0, wallHeight / 2, 0]} ref={wallMeshRef}>
      <boxBufferGeometry args={[4, wallHeight, 4]}>
        <bufferAttribute
          attachObject={["geometry", "attributes"]}
          args={["uv2"]}
        />
      </boxBufferGeometry>
      <meshStandardMaterial
        map={bricksColorTexture}
        aoMap={bricksAmbientOcclusionTexture}
        normalMap={bricksNormalTexture}
        roughnessMap={bricksRoughnessTexture}
      />
    </mesh>
  );
}

const graveGeometry = new THREE.BoxBufferGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: "#b2b6b1" });
const graveLocations = [];
for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = 3 + Math.random() * 6;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;
  graveLocations.push({ x, z });
}
function Graves() {
  return (
    <group>
      {graveLocations.map((locationObj, i) => (
        <mesh
          key={i}
          geometry={graveGeometry}
          material={graveMaterial}
          position={[locationObj.x, 0.3, locationObj.z]}
          rotation={[
            0,
            (Math.random() - 0.5) * 0.4,
            (Math.random() - 0.5) * 0.4,
          ]}
        />
      ))}
    </group>
  );
}

function Fog() {
  return (
    <>
      <fog args={["#262837", 1, 15]} attach="fog" />
      <color attach="background" args={["#262837"]} />
    </>
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
      <ambientLight args={["#b9d5ff", 0.12]} ref={ambientLightRef} />
      {/* moonLight */}
      <directionalLight
        args={["#b9d5ff", 0.12]}
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
