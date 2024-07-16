// Model.js
import React, { useRef, useEffect, useState } from 'react';
import { useFrame, extend } from '@react-three/fiber';
import { useGLTF, Html } from '@react-three/drei';
import { AnimationMixer, PlaneGeometry } from 'three';

extend({ PlaneGeometry });

function Model({ url, setCamera, setActions, setMixer, planes = [], onLoad }) {
  const { scene, cameras, animations } = useGLTF(url);
  const mixer = useRef();
  const [cameraSet, setCameraSet] = useState(false);
  const [activeCamera, setActiveCamera] = useState(null);

  useEffect(() => {
    if (scene && !cameraSet) {
      console.log("Scene is loaded:", scene);
      scene.traverse((object) => {
        if (object.isCamera) {
          console.log('Camera in scene:', object.name, object);
        } else if (object.isMesh) {
          console.log('Mesh in scene:', object.name, object);
        }
      });

      const camera = cameras.find(cam => cam.name === "CameraMain");
      if (camera) {
        setCamera(camera);
        setActiveCamera(camera);
        setCameraSet(true);
      }

      mixer.current = new AnimationMixer(scene);
      setMixer(mixer.current);

      const actions = {
        deskZoom: animations.find((clip) => clip.name === 'DeskZoom') ? mixer.current.clipAction(animations.find((clip) => clip.name === 'DeskZoom')) : null,
        pictureZoom: animations.find((clip) => clip.name === 'PictureZoom') ? mixer.current.clipAction(animations.find((clip) => clip.name === 'PictureZoom')) : null,
      };

      const cameraAnimation = animations.find((clip) => clip.name === 'CameraMainAction');
      if (cameraAnimation) {
        const cameraAction = mixer.current.clipAction(cameraAnimation);
        cameraAction.play();
      }

      setActions(actions);

      // Call onLoad after scene is set up
      if (onLoad) {
        console.log("Calling onLoad callback");
        onLoad();
      }

      return () => {
        if (mixer.current) {
          mixer.current.stopAllAction();
        }
      };
    }
  }, [scene, cameras, animations, setCamera, setActions, setMixer, cameraSet, onLoad]);

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

  return scene ? (
    <>
      <primitive object={scene} />
      {planes.map(({ name, content }, idx) => {
        const plane = scene.getObjectByName(name);
        if (plane) {
          return (
            <mesh key={idx} position={plane.position} rotation={plane.rotation} scale={plane.scale}>
              <planeGeometry attach="geometry" args={[plane.scale.x, plane.scale.y]} />
              <meshBasicMaterial attach="material" transparent opacity={0}>
                <Html
                  position={[plane.position.x, plane.position.y, plane.position.z]}
                  rotation={[plane.rotation.x, plane.rotation.y, plane.rotation.z]}
                  scale={[plane.scale.x, plane.scale.y, plane.scale.z]}
                  center
                  distanceFactor={1}
                >
                  {content}
                </Html>
              </meshBasicMaterial>
            </mesh>
          );
        }
        return null;
      })}
    </>
  ) : <div>Loading model...</div>;
}

export default Model;
