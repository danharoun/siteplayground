import { Canvas, useFrame } from "@react-three/fiber";
import { Gltf, ScrollControls, useScroll, useGLTF } from "@react-three/drei";
import { getProject, val } from "@theatre/core";
import theatreState from "./theatreState.json";

import {
  SheetProvider,
  PerspectiveCamera,
  useCurrentSheet,
  editable as e,
} from "@theatre/r3f";

import React, { useState, useRef } from "react";

export default function App() {
  const project = getProject("Fly Through", { state: theatreState });
  const [activeAnimation, setActiveAnimation] = useState("scroll");
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Get all sheets - using your existing "Scene" sheet for scroll
  const sheets = {
    scroll: project.sheet("Scene"), // Your existing sheet
    rotate: project.sheet("RotateScene"), 
    zoom: project.sheet("ZoomScene"),
    orbit: project.sheet("OrbitScene"),
  };

  const currentSheet = sheets[activeAnimation];

  // Function to handle animation switching
  const handleAnimationSwitch = (animationType) => {
    setActiveAnimation(animationType);
    setIsPlaying(true);
  };

  // Add play/pause toggle function
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <>
      {/* Theatre.js Studio Sheet Indicator */}
      <div style={{
        position: "fixed",
        top: 10,
        right: 10,
        zIndex: 1000,
        backgroundColor: "rgba(0, 123, 255, 0.9)",
        color: "white",
        padding: "8px 12px",
        borderRadius: "4px",
        fontFamily: "Arial, sans-serif",
        fontSize: "12px",
        fontWeight: "bold"
      }}>
        Current Sheet: {activeAnimation === "scroll" ? "Scene" : activeAnimation.charAt(0).toUpperCase() + activeAnimation.slice(1) + "Scene"}
      </div>

      {/* Instructions for Studio */}
      <div style={{
        position: "fixed",
        top: 40,
        right: 10,
        zIndex: 1000,
        backgroundColor: "rgba(255, 165, 0, 0.9)",
        color: "white",
        padding: "6px 10px",
        borderRadius: "4px",
        fontFamily: "Arial, sans-serif",
        fontSize: "11px",
        maxWidth: "200px"
      }}>
        💡 In Studio: Select sheet "{activeAnimation === "scroll" ? "Scene" : activeAnimation.charAt(0).toUpperCase() + activeAnimation.slice(1) + "Scene"}" to edit this animation
      </div>

      {/* Navigation Buttons - Bottom */}
      <div style={{
        position: "fixed",
        bottom: 20,
        left: 20,
        zIndex: 1000,
        display: "flex",
        gap: "10px",
        flexDirection: "row",
        fontFamily: "Arial, sans-serif"
      }}>
        <button 
          onClick={() => handleAnimationSwitch("scroll")}
          style={{
            padding: "12px 16px",
            backgroundColor: activeAnimation === "scroll" ? "#007bff" : "#444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px"
          }}
        >
          📜 Scroll
        </button>
        <button 
          onClick={() => handleAnimationSwitch("rotate")}
          style={{
            padding: "12px 16px",
            backgroundColor: activeAnimation === "rotate" ? "#007bff" : "#444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px"
          }}
        >
          🔄 Rotate
        </button>
        <button 
          onClick={() => handleAnimationSwitch("zoom")}
          style={{
            padding: "12px 16px",
            backgroundColor: activeAnimation === "zoom" ? "#007bff" : "#444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px"
          }}
        >
          🔍 Zoom
        </button>
        <button 
          onClick={() => handleAnimationSwitch("orbit")}
          style={{
            padding: "12px 16px",
            backgroundColor: activeAnimation === "orbit" ? "#007bff" : "#444",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px"
          }}
        >
          🌐 Orbit
        </button>
      </div>

      {/* Animation Info Display - Bottom Right */}
      <div style={{
        position: "fixed",
        bottom: 20,
        right: 20,
        zIndex: 1000,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "white",
        padding: "10px 15px",
        borderRadius: "6px",
        fontFamily: "Arial, sans-serif",
        fontSize: "14px"
      }}>
        Active: <strong>{activeAnimation.charAt(0).toUpperCase() + activeAnimation.slice(1)}</strong>
        {activeAnimation === "scroll" && (
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Scroll to animate
          </div>
        )}
        {activeAnimation !== "scroll" && (
          <div style={{ fontSize: "12px", opacity: 0.8 }}>
            Auto-looping animation
          </div>
        )}
      </div>

      {/* Add Play/Pause button */}
      <div style={{
        position: "fixed",
        bottom: 20,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000
      }}>
        <button 
          onClick={togglePlayPause}
          style={{
            padding: "12px 16px",
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "500",
            transition: "all 0.2s ease",
            minWidth: "120px"
          }}
        >
          {isPlaying ? "⏸ Pause" : "▶ Play"}
        </button>
      </div>

      <Canvas gl={{ preserveDrawingBuffer: true }}>
        <ScrollControls pages={5}>
          <SheetProvider sheet={currentSheet}>
            {/* Use key prop to force remounting when animation changes */}
            <Scene 
              key={activeAnimation} 
              activeAnimation={activeAnimation} 
              currentSheet={currentSheet}
              isPlaying={isPlaying}
            />
          </SheetProvider>
        </ScrollControls>
      </Canvas>
    </>
  );
}

function Scene({ activeAnimation, currentSheet, isPlaying }) {
  const sheet = useCurrentSheet();
  const scroll = useScroll();
  const gltf = useGLTF("/cUBE3_sIMPL.gltf");
  
  // Animation timing state
  const [animationTime, setAnimationTime] = useState(0);

  // Set material properties for the model
  React.useEffect(() => {
    if (gltf.scene) {
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          child.material.metalness = 0.8;
          child.material.roughness = 0.2;
          child.material.envMapIntensity = 1;
        }
      });
    }
  }, [gltf]);

  // Reset animation when switching animations
  React.useEffect(() => {
    setAnimationTime(0);
    
    // Log sheet switching for debugging
    console.log(`Switched to: ${activeAnimation} animation using sheet:`, sheet?.address?.sheetId);
    console.log('Sheet sequence length:', sheet?.sequence ? val(sheet.sequence.pointer.length) : 'No sequence');
  }, [activeAnimation, sheet]);

  // Animation frame callback
  useFrame((state, delta) => {
    if (!sheet?.sequence) {
      console.warn('No sequence available for sheet:', sheet?.address?.sheetId);
      return;
    }

    const sequenceLength = val(sheet.sequence.pointer.length);

    // Respect Theatre.js Studio playback
    if (sheet.sequence.playing) return;

    if (activeAnimation === "scroll") {
      sheet.sequence.position = scroll.offset * sequenceLength;
    } else {
      setAnimationTime(prev => {
        if (!isPlaying) return prev;
        
        const newTime = prev + delta;
        let normalizedTime = 0;

        switch (activeAnimation) {
          case "rotate":
            // 5-second loop for rotate animation
            normalizedTime = (newTime % 5) / 5;
            break;
            
          case "zoom":
            // 6-second loop for zoom animation  
            normalizedTime = (newTime % 6) / 6;
            break;
            
          case "orbit":
            // 8-second loop for orbit animation
            normalizedTime = (newTime % 8) / 8;
            break;
            
          default:
            normalizedTime = (newTime % 4) / 4;
        }

        const newPosition = normalizedTime * sequenceLength;
        sheet.sequence.position = newPosition;
        
        return newTime;
      });
    }
  });

  const bgColor = "#84a4f4";
  const starColor = "#ffffff";

  // Create unique theatre keys per animation to force rebinding
  const cameraKey = `Camera_${activeAnimation}`;
  const objectKey = `Website3DBoxV01_${activeAnimation}`;

  // Add a starry sky effect
  function Stars({ count = 5000 }) {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100;
    }
    return (
      <e.group theatreKey={`Stars_${activeAnimation}`}>
        <points>
          <bufferGeometry attach="geometry">
            <bufferAttribute
              attachObject={["attributes", "position"]}
              array={positions}
              count={count}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial attach="material" color={starColor} size={0.1} />
        </points>
      </e.group>
    );
  }

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {/* <fog attach="fog" color={bgColor} near={-4} far={10} /> */}
      
      {/* Conditionally render stars for non-scroll animations */}
      {activeAnimation !== "scroll" && <Stars />}
      
      <ambientLight intensity={0.5} />
      <directionalLight position={[-5, 5, -5]} intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[0, 2, 0]} intensity={0.8} />
      
      {/* Use unique theatreKey per animation */}
      <e.group theatreKey={objectKey} scale={0.5}>
        <primitive 
          object={gltf.scene} 
          castShadow 
          receiveShadow 
        />
      </e.group>
      
      {/* Use unique theatreKey per animation */}
      <PerspectiveCamera
        theatreKey={cameraKey}
        makeDefault
        position={[0, 0, 0]}
        fov={90}
        near={0.1}
        far={70}
      />
    </>
  );
}