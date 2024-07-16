import React, { useRef, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';
import Model from './Model';

export default function Scene() {
  const [actions, setActions] = useState({});
  const [isAnimating, setIsAnimating] = useState(false);
  const [previousAction, setPreviousAction] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);
  const cameraRef = useRef();
  const mixerRef = useRef(null);

  const resetAction = (action) => {
    action.stop();
    action.reset();
    action.time = 0;
  };

  const playAnimation = (actionName) => {
    const action = actions[actionName];
    if (action) {
      if (previousAction && actions[previousAction]) {
        resetAction(actions[previousAction]);
      }
      console.log(`Playing ${actionName} animation`);
      setIsAnimating(true);
      setPreviousAction(actionName);
      action.reset();
      action.timeScale = 1; // Ensure forward playback
      action.play();
      action.clampWhenFinished = true;
      action.loop = THREE.LoopOnce;
      action.getMixer().addEventListener('finished', handleAnimationFinished);
    } else {
      console.error(`${actionName} action not available`);
    }
  };

  const handleAnimationFinished = (event) => {
    setIsAnimating(false);
    setShowBackButton(true);
    console.log(`${previousAction} animation finished`);
    const mixer = event.target;
    mixer.removeEventListener('finished', handleAnimationFinished);
  };

  const zoomToDesk = () => {
    playAnimation('deskZoom');
  };

  const zoomToPicture = () => {
    playAnimation('pictureZoom');
  };

  const playBackAnimation = () => {
    if (previousAction) {
      const action = actions[previousAction];
      if (action) {
        console.log(`Reversing ${previousAction} animation`);
        setIsAnimating(true);
        action.paused = false;
        action.time = action.getClip().duration; // Set to end of animation
        action.timeScale = -1; // Play backwards
        action.play();
        action.getMixer().addEventListener('finished', handleBackAnimationFinished);
      } else {
        console.error(`No previous action to reverse`);
      }
    } else {
      console.error(`No previous action to reverse`);
    }
  };

  const handleBackAnimationFinished = (event) => {
    setIsAnimating(false);
    setShowBackButton(false);
    console.log(`${previousAction} animation reversed`);
    const mixer = event.target;
    mixer.removeEventListener('finished', handleBackAnimationFinished);
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

  return (
    <>
      <Canvas
        style={{ width: '100vw', height: '100vh' }}
        gl={{ antialias: true }}
        onCreated={({ gl, camera }) => {
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
              console.log('Camera position:', exportedCamera.position);
              console.log('Camera rotation:', exportedCamera.rotation);
              console.log('Camera FOV:', exportedCamera.fov);
              console.log('Camera Near:', exportedCamera.near);
              console.log('Camera Far:', exportedCamera.far);
            }
          }}
          setActions={setActions}
          setIsAnimating={setIsAnimating}
          setMixer={(mixer) => mixerRef.current = mixer}
        />
      </Canvas>
      <div id="ui">
        {!showBackButton && (
          <>
            <button onClick={zoomToDesk}>Zoom to Desk</button>
            <button onClick={zoomToPicture}>Zoom to Picture</button>
          </>
        )}
        {showBackButton && <button onClick={playBackAnimation}>Back</button>}
      </div>
    </>
  );
}
