// src/components/BabylonScene.tsx
import React, { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  Node,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  AppendSceneAsync,
} from '@babylonjs/core';
import type { SceneState } from '@types/SceneState';

import "@babylonjs/loaders/glTF";

interface BabylonScene {
  fileBase64: string | null
}

const BabylonScene: React.FC<BabylonScene> = ({fileBase64}) => {

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  const clearScene = () => {
    if (!sceneRef.current) return;

    sceneRef.current.meshes.forEach((m) => m.dispose());
    sceneRef.current.materials.forEach((m) => m.dispose());
    sceneRef.current.textures.forEach((t) => t.dispose());
  };

  useEffect(() => {

    

  }, [fileBase64])

  useEffect(() => {
    if (!canvasRef.current) return;

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 5, Vector3.Zero(), scene);

    camera.attachControl(canvasRef.current, true);

    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 20;
    camera.wheelPrecision = 50;

    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    sceneRef.current = scene;

    engine.runRenderLoop(() => { scene.render() });

    const resize = () => engine.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  return (
    <div style={{ }}>
      
      <canvas ref={canvasRef} style={{ width: '300px', height: '300px', display: 'block' }}/>
    </div>
  );
};

export default BabylonScene;

function buildSceneState(nodes: Node[], parentId: number | null = null): SceneState {
  let state: SceneState = {};
  for (const node of nodes) {
    const id = node.uniqueId;
    const children = node.getChildren ? node.getChildren() : [];
    state[id] = {
      uniqueId: id,
      name: node.name || '<unnamed>',
      className: node.getClassName(),
      parentId,
      isVisible: node.isEnabled(),
      children: children.map(c => c.uniqueId),
    };
    // Рекурсия для дочерних узлов
    const childState = buildSceneState(children, id);
    state = { ...state, ...childState };
  }
  return state;
}