import "./style.css";
import * as dat from "lil-gui";
import * as React from "react";
import ReactDOM from "react-dom";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  PerspectiveCamera,
  OrbitControls,
  useTexture,
  useHelper,
} from "@react-three/drei";
import * as THREE from "three";

const { Suspense, StrictMode, useRef, useEffect, useState } = React;

function App() {
  return (
    <StrictMode>
      <Suspense fallback={null}>
        <Canvas
          gl={{ alpha: false }}
          shadows={{ type: THREE.PCFSoftShadowMap }}
        >
          <Fog />
          <House />
          <Graves />
          <Floor />
          <Lights />
          <Ghosts />
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
  const doorPointLightRef = useRef();
  // useHelper(doorPointLightRef, THREE.PointLightHelper, 1, "cyan");
  // useEffect(() => {
  //   gui
  //     .add(doorPointLightRef.current.position, "x")
  //     .name("doorx")
  //     .min(-5)
  //     .max(5)
  //     .step(0.001);
  //   gui
  //     .add(doorPointLightRef.current.position, "y")
  //     .name("doory")
  //     .min(-5)
  //     .max(5)
  //     .step(0.001);
  //   gui
  //     .add(doorPointLightRef.current.position, "z")
  //     .name("doorz")
  //     .min(-5)
  //     .max(5)
  //     .step(0.001);
  // }, []);

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
        castShadow
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.25, 0.25, 0.25]}
        position={[1.4, 0.1, 2.1]}
        castShadow
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.4, 0.4, 0.4]}
        position={[-0.8, 0.1, 2.2]}
        castShadow
      />
      <mesh
        geometry={bushGeometry}
        material={bushMaterial}
        scale={[0.15, 0.15, 0.15]}
        position={[-1, 0.05, 2.6]}
        castShadow
      />
      {/* door light */}
      <pointLight
        args={["#ff7d46", 1, 7]}
        position={[0, 2.2, 2.7]}
        castShadow
        ref={doorPointLightRef}
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={7}
      />
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
    <mesh position={[0, wallHeight / 2, 0]} ref={wallMeshRef} castShadow>
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
          castShadow
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
  const [
    grassColorTexture,
    grassAmbientOcclusionTexture,
    grassNormalTexture,
    grassRoughnessTexture,
  ] = useTexture([
    "/textures/grass/color.jpg",
    "/textures/grass/ambientOcclusion.jpg",
    "/textures/grass/normal.jpg",
    "/textures/grass/roughness.jpg",
  ]);

  grassColorTexture.repeat.set(8, 8);
  grassAmbientOcclusionTexture.repeat.set(8, 8);
  grassNormalTexture.repeat.set(8, 8);
  grassRoughnessTexture.repeat.set(8, 8);

  grassColorTexture.wrapS = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
  grassNormalTexture.wrapS = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

  grassColorTexture.wrapT = THREE.RepeatWrapping;
  grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
  grassNormalTexture.wrapT = THREE.RepeatWrapping;
  grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

  const floorMeshRef = useRef();
  useEffect(() => {
    floorMeshRef.current.geometry.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(
        floorMeshRef.current.geometry.attributes.uv.array,
        2
      )
    );
  }, []);

  return (
    <mesh
      rotation={[-Math.PI * 0.5, 0, 0]}
      position={[0, 0, 0]}
      ref={floorMeshRef}
      receiveShadow
    >
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial
        map={grassColorTexture}
        aoMap={grassAmbientOcclusionTexture}
        normalMap={grassNormalTexture}
        roughnessMap={grassRoughnessTexture}
      />
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
        castShadow
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

function Ghosts() {
  const ghost1Ref = useRef();
  const ghost2Ref = useRef();
  const ghost3Ref = useRef();
  useFrame((state) => {
    const elapsedTime = state.clock.getElapsedTime();
    // update ghost
    const ghost1Angle = elapsedTime * 0.5;
    ghost1Ref.current.position.x = Math.cos(ghost1Angle) * 4;
    ghost1Ref.current.position.z = Math.sin(ghost1Angle) * 4;
    ghost1Ref.current.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2Ref.current.position.x = Math.cos(ghost2Angle) * 5;
    ghost2Ref.current.position.z = Math.sin(ghost2Angle) * 5;
    ghost2Ref.current.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3Ref.current.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3Ref.current.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3Ref.current.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  });

  // useHelper(ghost3Ref, THREE.PointLightHelper, 1, "cyan");
  return (
    <>
      <pointLight
        args={["#ff00ff", 2, 3]}
        ref={ghost1Ref}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={7}
      />
      <pointLight
        args={["#00ffff", 2, 3]}
        ref={ghost2Ref}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={7}
      />
      <pointLight
        args={["#ffff00", 2, 3]}
        ref={ghost3Ref}
        castShadow
        shadow-mapSize-width={256}
        shadow-mapSize-height={256}
        shadow-camera-far={7}
      />
    </>
  );
}

ReactDOM.render(<App />, document.getElementById("root"));

// Debug
const gui = new dat.GUI();
