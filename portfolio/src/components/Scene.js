import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Model from './Model';
import LaptopScreenContent from './LaptopScreenContent';
import Loading from './Loading';
import '../App.css'; // Import the CSS file

export default function Scene() {
  const [actions, setActions] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const previousActionRef = useRef(null); // Use ref to maintain previousAction
  const [showBackButton, setShowBackButton] = useState(false);
  const [showLaptopScreen, setShowLaptopScreen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false); // State to track loading status
  const [showWelcome, setShowWelcome] = useState(true); // State to track visibility of Welcome text
  const cameraRef = useRef();
  const mixerRef = useRef(null);

  const resetAction = (action) => {
    if (action) {
      console.log(`Resetting action: ${action.getClip().name}`);
      action.stop();
      action.reset();
      action.time = 0;
    }
  };

  const playAnimation = (actionName) => {
    console.log(`Attempting to play animation: ${actionName}`);
    const action = actions[actionName];
    if (action) {
      if (previousActionRef.current && actions[previousActionRef.current]) {
        console.log(`Resetting previous action: ${previousActionRef.current}`);
        resetAction(actions[previousActionRef.current]);
      }
      console.log(`Setting previousAction to ${actionName}`);
      previousActionRef.current = actionName; // Set previousAction using ref
      setIsAnimating(true);
      setShowWelcome(false); // Hide Welcome text when animation starts
      action.reset();
      action.timeScale = 1; // Ensure forward playback
      action.play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
      action.getMixer().addEventListener('finished', handleAnimationFinished);
    } else {
      console.log(`Action ${actionName} not found`);
    }
  };

  const handleAnimationFinished = (event) => {
    console.log(`Animation ${previousActionRef.current} finished`);
    setIsAnimating(false);
    if (previousActionRef.current === 'deskZoom') {
      console.log('Desk zoom finished, showing laptop screen');
      setShowLaptopScreen(true); // Show laptop screen after desk zoom animation
    }
    const mixer = event.target;
    mixer.removeEventListener('finished', handleAnimationFinished);
  };

  const zoomToDesk = () => {
    console.log('Zooming to desk, hiding laptop screen');
    setShowLaptopScreen(false); // Hide laptop screen before zooming
    setShowBackButton(true);
    playAnimation('deskZoom');
  };

  const playBackAnimation = () => {
    if (previousActionRef.current) {
      const action = actions[previousActionRef.current];
      if (action) {
        console.log(`Playing back animation: ${previousActionRef.current}`);
        setIsAnimating(true);
        setShowBackButton(false);
        setShowWelcome(true); // Show Welcome text when back animation starts
        action.paused = false;
        action.time = action.getClip().duration; // Set to end of animation
        action.timeScale = -1; // Play backwards
        action.play();
        action.getMixer().addEventListener('finished', handleBackAnimationFinished);
        setShowLaptopScreen(false);
      } else {
        console.log(`Previous action ${previousActionRef.current} not found`);
      }
    } else {
      console.log('No previous action to play back');
    }
  };

  const handleBackAnimationFinished = (event) => {
    setIsAnimating(false);
    const mixer = event.target;
    mixer.removeEventListener('finished', handleBackAnimationFinished);
    console.log('Back animation finished');
  };

  useEffect(() => {
    const handleResize = () => {
      if (cameraRef.current) {
        const { innerWidth, innerHeight } = window;
        cameraRef.current.aspect = innerWidth / innerHeight;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Call initially to set up

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const planes = [
    {
      name: 'LaptopPlane',
      content: showLaptopScreen ? <LaptopScreenContent /> : null, // Conditional rendering
    },
  ];

  const handleModelLoad = () => {
    console.log("Model has loaded");
    setIsLoaded(true);
  };

  return (
    <>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
          console.log("Canvas created");
          gl.setSize(window.innerWidth, window.innerHeight);
          gl.setPixelRatio(window.devicePixelRatio);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          cameraRef.current = camera;
        }}
      >
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Model
          url="/Room.glb"
          setCamera={(exportedCamera) => {
            if (cameraRef.current && exportedCamera) {
              cameraRef.current.position.copy(exportedCamera.position);
              cameraRef.current.rotation.copy(exportedCamera.rotation);
              cameraRef.current.fov = exportedCamera.fov;
              cameraRef.current.near = exportedCamera.near;
              cameraRef.current.far = exportedCamera.far;
              cameraRef.current.updateProjectionMatrix();
            }
          }}
          setActions={setActions}
          setIsAnimating={setIsAnimating}
          setMixer={(mixer) => (mixerRef.current = mixer)}
          planes={planes}
          onLoad={handleModelLoad} // Set isLoaded to true when model loads
        />
      </Canvas>
      {!isLoaded && <Loading />} {/* Show loading screen if not loaded */}
      {isLoaded && ( // Conditionally render the UI buttons
        <>
          {showWelcome && (
            <div className="welcome-text">
              Welcome to my Portfolio!
            </div>
          )}
          <div id="ui" className={`ui-buttons ${showBackButton ? 'back' : 'continue'}`}>
            {!showBackButton && <button onClick={zoomToDesk}>Continue</button>}
            {showBackButton && <button onClick={playBackAnimation}>Back</button>}
          </div>
        </>
      )}
    </>
  );
}
