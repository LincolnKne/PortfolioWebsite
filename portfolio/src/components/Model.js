import React, { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { AnimationMixer } from 'three';

function Model({ url, setCamera, setActions, setMixer }) {
  const { scene, cameras, animations } = useGLTF(url);
  const mixer = useRef();
  const [cameraSet, setCameraSet] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);

  useEffect(() => {
    if (scene && !cameraSet) {
      scene.traverse((object) => {
        if (object.isCamera) {
          console.log('Camera in scene:', object.name, object);
        } else if (object.isMesh) {
          console.log('Mesh in scene:', object.name, object);
        }
      });

      const camera = cameras.find(cam => cam.name === "CameraMain");
      if (camera) {
        console.log('Camera properties:', camera);
        setCamera(camera);
        setActiveCamera(camera);
        setCameraSet(true);
      } else {
        console.warn('Camera not found in the scene');
      }

      mixer.current = new AnimationMixer(scene);
      setMixer(mixer.current);

      animations.forEach((clip) => {
        console.log(`Animation: ${clip.name}, Duration: ${clip.duration}`);
      });

      const actions = {
        deskZoom: animations.find((clip) => clip.name === 'DeskZoom') ? mixer.current.clipAction(animations.find((clip) => clip.name === 'DeskZoom')) : null,
        pictureZoom: animations.find((clip) => clip.name === 'PictureZoom') ? mixer.current.clipAction(animations.find((clip) => clip.name === 'PictureZoom')) : null,
      };

      const cameraAnimation = animations.find((clip) => clip.name === 'CameraMainAction');
      if (cameraAnimation) {
        const cameraAction = mixer.current.clipAction(cameraAnimation);
        cameraAction.play();
        console.log('Camera animation action set:', cameraAction);
      }

      setActions(actions);
      console.log('Actions set:', actions);

      return () => {
        if (mixer.current) {
          mixer.current.stopAllAction();
        }
      };
    }
  }, [scene, cameras, animations, setCamera, setActions, setMixer, cameraSet]);

  useFrame((state, delta) => {
    if (mixer.current && delta > 0) {
      mixer.current.update(delta);
      if (activeCamera) {
        state.camera.position.copy(activeCamera.position);
        state.camera.rotation.copy(activeCamera.rotation);
        state.camera.updateProjectionMatrix();
      }
      state.gl.render(state.scene, state.camera);
    }
  });

  return scene ? <primitive object={scene} /> : null;
}

export default Model;
