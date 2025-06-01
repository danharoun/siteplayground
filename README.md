 `# 3D Animation System with Theatre.js

A sophisticated React Three.js application featuring a multi-animation system powered by Theatre.js, enabling both scroll-driven and button-triggered 3D animations with real-time editing capabilities.

## Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Animation System](#animation-system)
- [Technical Implementation](#technical-implementation)
- [Development Guide](#development-guide)
- [API Reference](#api-reference)
- [Troubleshooting](#troubleshooting)

## Overview

This application demonstrates a complex 3D animation system that supports multiple animation types:

- **Scroll Animation**: Traditional scroll-driven camera movement and object animation
- **Rotate Animation**: Object rotation sequences triggered by buttons
- **Zoom Animation**: Camera zoom and object scaling effects
- **Orbit Animation**: Camera orbital movement around objects

### Key Features

- **Real-time Animation Editing**: Live keyframe editing with Theatre.js Studio
- **Multiple Animation Sheets**: Separate Theatre.js sheets for each animation type
- **Dynamic Sheet Switching**: Seamless transitions between animation modes
- **Professional UI**: Clean interface with animation controls and status indicators
- **Performance Optimized**: Efficient rendering with React Three Fiber

## Architecture

### Technology Stack

\`\`\`
React 18+
├── @react-three/fiber     # React renderer for Three.js
├── @react-three/drei      # Useful helpers for R3F
├── @theatre/core          # Animation sequencing
├── @theatre/r3f           # Theatre.js integration for R3F
└── @theatre/studio        # Visual animation editor
\`\`\`

### Project Structure

\`\`\`
src/
├── App.jsx                # Main application component
├── theatreState.json      # Theatre.js animation data
└── public/
    └── cUBE3_sIMPL.gltf   # 3D model file
\`\`\`

## Animation System

### Core Concepts

#### 1. Multi-Sheet Architecture

The system uses separate Theatre.js sheets for each animation type:

\`\`\`javascript
const sheets = {
  scroll: project.sheet("Scene"),         // Original scroll animation
  rotate: project.sheet("RotateScene"),   // Rotation sequences
  zoom: project.sheet("ZoomScene"),       // Zoom/scale effects
  orbit: project.sheet("OrbitScene"),     // Camera orbit paths
};
\`\`\`

#### 2. Unique Object Binding

Each animation sheet has uniquely named objects to prevent conflicts:

\`\`\`javascript
// Animation-specific object keys
const cameraKey = \`Camera_\${activeAnimation}\`;        // Camera_scroll, Camera_rotate, etc.
const objectKey = \`Website3DBoxV01_\${activeAnimation}\`; // Website3DBoxV01_scroll, etc.
\`\`\`

#### 3. Dynamic Sheet Switching

The system switches between sheets using React's SheetProvider:

\`\`\`javascript
<SheetProvider sheet={currentSheet}>
  <Scene key={activeAnimation} />  {/* Key forces remount */}
</SheetProvider>
\`\`\`

### Animation Timing System

#### Scroll Animation
\`\`\`javascript
if (activeAnimation === "scroll") {
  sheet.sequence.position = scroll.offset * sequenceLength;
}
\`\`\`

#### Loop-Based Animations
\`\`\`javascript
switch (activeAnimation) {
  case "rotate":
    normalizedTime = (newTime % 5) / 5;  // 5-second loop
    break;
  case "zoom":
    normalizedTime = (newTime % 6) / 6;  // 6-second loop
    break;
  case "orbit":
    normalizedTime = (newTime % 8) / 8;  // 8-second loop
    break;
}
sheet.sequence.position = normalizedTime * sequenceLength;
\`\`\`

## Technical Implementation

### State Management

\`\`\`javascript
const [activeAnimation, setActiveAnimation] = useState("scroll");
const [animationTime, setAnimationTime] = useState(0);
\`\`\`

### Theatre.js Integration

#### Project Initialization
\`\`\`javascript
const project = getProject("Fly Through", { state: theatreState });
\`\`\`

#### Sheet Configuration
\`\`\`json
{
  "sheetsById": {
    "Scene": { /* Scroll animation data */ },
    "RotateScene": { /* Rotation animation data */ },
    "ZoomScene": { /* Zoom animation data */ },
    "OrbitScene": { /* Orbit animation data */ }
  }
}
\`\`\`

### Object Definitions

Each sheet defines its own set of objects:

\`\`\`javascript
// In Theatre.js Studio, objects are created with unique keys:
"Camera_scroll"           // Scroll animation camera
"Website3DBoxV01_scroll"  // Scroll animation object
"Camera_rotate"           // Rotate animation camera
"Website3DBoxV01_rotate"  // Rotate animation object
// ... etc for each animation type
\`\`\`

### Animation Loop Control

The main animation loop handles different animation types:

\`\`\`javascript
useFrame((state, delta) => {
  if (!sheet?.sequence) return;
  
  // Respect Theatre.js Studio playback
  if (sheet.sequence.playing) return;
  
  const sequenceLength = val(sheet.sequence.pointer.length);
  
  if (activeAnimation === "scroll") {
    // Scroll-driven animation
    sheet.sequence.position = scroll.offset * sequenceLength;
  } else {
    // Time-based loop animations
    setAnimationTime(prev => {
      const newTime = prev + delta;
      const normalizedTime = (newTime % loopDuration) / loopDuration;
      sheet.sequence.position = normalizedTime * sequenceLength;
      return newTime;
    });
  }
});
\`\`\`

## Development Guide

### Setting Up New Animations

#### 1. Add Animation Type

\`\`\`javascript
// In App.jsx, add to sheets object
const sheets = {
  scroll: project.sheet("Scene"),
  rotate: project.sheet("RotateScene"),
  zoom: project.sheet("ZoomScene"),
  orbit: project.sheet("OrbitScene"),
  newAnimation: project.sheet("NewAnimationScene"),  // Add new sheet
};
\`\`\`

#### 2. Add UI Button

\`\`\`javascript
<button onClick={() => handleAnimationSwitch("newAnimation")}>
  🆕 New Animation
</button>
\`\`\`

#### 3. Configure Animation Timing

\`\`\`javascript
// In useFrame switch statement
case "newAnimation":
  normalizedTime = (newTime % 10) / 10;  // 10-second loop
  break;
\`\`\`

#### 4. Update theatreState.json

\`\`\`json
{
  "sheetsById": {
    // ... existing sheets
    "NewAnimationScene": {
      "staticOverrides": {
        "byObject": {
          "Camera_newAnimation": {
            "position": { "x": 0, "y": 0, "z": 5 }
          },
          "Website3DBoxV01_newAnimation": {
            "position": { "x": 0, "y": 0, "z": 0 },
            "rotation": { "x": 0, "y": 0, "z": 0 },
            "scale": { "x": 0.5, "y": 0.5, "z": 0.5 }
          }
        }
      },
      "sequence": {
        "subUnitsPerUnit": 30,
        "length": 10,
        "type": "PositionalSequence",
        "tracksByObject": {
          "Camera_newAnimation": {
            "trackData": {},
            "trackIdByPropPath": {}
          },
          "Website3DBoxV01_newAnimation": {
            "trackData": {},
            "trackIdByPropPath": {}
          }
        }
      }
    }
  }
}
\`\`\`

### Creating Keyframe Animations

#### 1. Switch to Target Animation
Click the corresponding animation button (e.g., "🔄 Rotate")

#### 2. Open Theatre.js Studio
The system will indicate which sheet to select in Studio

#### 3. Select Correct Sheet
In Theatre.js Studio, select the sheet (e.g., "RotateScene")

#### 4. Add Keyframes
- Select object (e.g., "Camera_rotate")
- Add keyframes at different timeline positions
- Adjust properties (position, rotation, scale)
- Preview animation using Studio's playback controls

#### 5. Test in Application
Switch back to the animation button to see the live result

### Animation Types Guide

#### Scroll Animation
- **Purpose**: Traditional scroll-driven narrative
- **Sheet**: "Scene"
- **Objects**: "Camera_scroll", "Website3DBoxV01_scroll"
- **Timing**: Controlled by scroll position (0-100%)

#### Rotate Animation
- **Purpose**: Object rotation showcase
- **Sheet**: "RotateScene"
- **Loop Duration**: 5 seconds
- **Suggested Keyframes**:
  - 0s: rotation.y = 0°
  - 2.5s: rotation.y = 180°
  - 5s: rotation.y = 360°

#### Zoom Animation
- **Purpose**: Camera zoom effects with object scaling
- **Sheet**: "ZoomScene"
- **Loop Duration**: 6 seconds
- **Suggested Keyframes**:
  - 0s: camera.z = 8, object.scale = 0.5
  - 3s: camera.z = 2, object.scale = 1.0
  - 6s: camera.z = 8, object.scale = 0.5

#### Orbit Animation
- **Purpose**: Camera orbiting around object
- **Sheet**: "OrbitScene"
- **Loop Duration**: 8 seconds
- **Suggested Keyframes**:
  - 0s: camera.position = (5, 2, 5)
  - 2s: camera.position = (5, 2, -5)
  - 4s: camera.position = (-5, 2, -5)
  - 6s: camera.position = (-5, 2, 5)
  - 8s: camera.position = (5, 2, 5)

## API Reference

### Key Components

#### App Component
Main application component that manages animation state and UI.

**Props**: None

**State**:
- \`activeAnimation\`: Current animation type (\`"scroll" | "rotate" | "zoom" | "orbit"\`)

#### Scene Component
3D scene component that handles rendering and animation.

**Props**:
- \`activeAnimation\`: Current animation type
- \`currentSheet\`: Active Theatre.js sheet

**Key Methods**:
- \`useFrame()\`: Main animation loop
- Material setup for GLTF models
- Dynamic Theatre.js object binding

### Theatre.js Objects

#### Camera Objects
- \`Camera_scroll\`: Scroll animation camera
- \`Camera_rotate\`: Rotation animation camera
- \`Camera_zoom\`: Zoom animation camera
- \`Camera_orbit\`: Orbit animation camera

**Animatable Properties**:
- \`position.x\`, \`position.y\`, \`position.z\`
- \`rotation.x\`, \`rotation.y\`, \`rotation.z\`
- \`fov\` (field of view)

#### 3D Object
- \`Website3DBoxV01_[animation]\`: Main 3D object for each animation

**Animatable Properties**:
- \`position.x\`, \`position.y\`, \`position.z\`
- \`rotation.x\`, \`rotation.y\`, \`rotation.z\`
- \`scale.x\`, \`scale.y\`, \`scale.z\`

### Configuration

#### Animation Durations
\`\`\`javascript
const durations = {
  rotate: 5,  // seconds
  zoom: 6,    // seconds
  orbit: 8,   // seconds
};
\`\`\`

#### Scroll Pages
\`\`\`javascript
<ScrollControls pages={5}>  // 5 pages of scroll content
\`\`\`

## Troubleshooting

### Common Issues

#### Objects Not Animating
**Problem**: Timeline moves but objects don't animate
**Solution**: 
1. Ensure correct sheet is selected in Theatre.js Studio
2. Verify object names match between code and Studio
3. Check that keyframes exist for the object properties

#### Animation Not Switching
**Problem**: Button clicks don't change animation
**Solution**:
1. Check console for sheet switching logs
2. Verify \`theatreState.json\` contains all required sheets
3. Ensure \`key={activeAnimation}\` is set on Scene component

#### Theatre.js Studio Not Working
**Problem**: Studio doesn't show current animation
**Solution**:
1. Manually select correct sheet in Studio
2. Verify Theatre.js Studio is properly initialized
3. Check browser console for Studio-related errors

#### Performance Issues
**Problem**: Animation is choppy or slow
**Solution**:
1. Reduce number of keyframes
2. Optimize 3D model complexity
3. Use \`useMemo\` for expensive calculations
4. Check for memory leaks in animation loops

## Best Practices

### Animation Design
- Keep animation durations consistent with user expectations
- Use easing curves for smooth transitions
- Avoid rapid camera movements that can cause motion sickness
- Test animations on different devices and screen sizes

### Code Organization
- Keep animation logic separated by type
- Use descriptive names for Theatre.js objects
- Comment complex animation calculations
- Maintain consistent naming conventions

### Performance
- Limit the number of active animations
- Use object pooling for repeated elements
- Optimize 3D models before importing
- Monitor memory usage during development

### Debugging
- Use console logs to track animation state
- Leverage Theatre.js Studio's debugging features
- Test each animation type independently
- Verify keyframe data integrity
