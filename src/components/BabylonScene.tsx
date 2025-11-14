import React, { useEffect, useRef } from 'react';
import {
  Engine,
  Scene,
  Node,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  LoadAssetContainerAsync,
  AssetContainer,
} from '@babylonjs/core';
import type { SceneNodeState } from '@./../types/SceneState';

import { registerBuiltInLoaders } from '@babylonjs/loaders/dynamic';
registerBuiltInLoaders();

import { useScene } from '@contexts/SceneContext';

interface BabylonScene {
  fileBase64: string | null
}

const BabylonScene: React.FC<BabylonScene> = ({ fileBase64 }) => {
  const { state, dispatch } = useScene();

  const containerRef = useRef<AssetContainer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);

  useEffect(() => {
    if (!fileBase64) return;
    const loadModel = async () => {
      if (!sceneRef.current) return;
      
      
      await new Promise(resolve => setTimeout(resolve, 0));
        
      try {
        if (containerRef.current) {
          containerRef.current.removeAllFromScene();
          containerRef.current.dispose();
        }
        await new Promise(resolve => requestAnimationFrame(resolve));
        const modelUrl = `data:model/gltf-binary;base64,${fileBase64}`;

        containerRef.current = await LoadAssetContainerAsync(modelUrl, sceneRef.current);
        containerRef.current.addAllToScene();
        
        const rootNodes = containerRef.current.rootNodes
        dispatch({ 
          type: 'SET_NODES', 
          payload: { 
            nodes: buildSceneNodes(rootNodes), 
            currentState: 'success' 
          } 
        });

        console.log('Модель загружена')
        
      } catch (error) {

        console.error('Ошибка загрузки модели:', error);
        alert('Ошибка загрузки модели')

        dispatch({ type: 'CLEAR' });
      }
    };

    loadModel();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileBase64])

  useEffect(() => {
    console.log('mount')
    
    if (!canvasRef.current) return;

    console.log('mounting')

    const engine = new Engine(canvasRef.current, true);
    const scene = new Scene(engine);

    const camera = new ArcRotateCamera('camera', -Math.PI / 2, Math.PI / 2.5, 5, Vector3.Zero(), scene);
    camera.attachControl(canvasRef.current, true);

    camera.lowerRadiusLimit = 1;
    camera.upperRadiusLimit = 20;
    camera.wheelPrecision = 50;

    new HemisphericLight('light', new Vector3(0, 1, 0), scene);

    sceneRef.current = scene;
    engine.runRenderLoop(() => { 
      if (!engine.isDisposed && !scene.isDisposed) {
        scene.render();
      }
    });

    const resize = () => engine.resize();
    window.addEventListener('resize', resize);

    return () => {
      window.removeEventListener('resize', resize);
      scene.dispose();
      engine.dispose();
    };
  }, []);

  useEffect(() => {
    if (!sceneRef.current) return;

    Object.values(state.nodes).forEach((nodeState) => {
      const babylonNode = sceneRef.current!.getNodes().find(n => n.uniqueId === nodeState.uniqueId);
      if (babylonNode) {
        if (babylonNode.isEnabled() != nodeState.isVisible) {
          babylonNode.setEnabled(nodeState.isVisible);
        }
      }
    });
  }, [state]);

  return (
    <div style={{ }}>
      <canvas ref={canvasRef} style={{ width: '500px', height: '500px', display: 'block' }}/>
    </div>
  );
};

export default BabylonScene;

function buildSceneNodes(nodes: Node[], parentId: number | null = null): Record<number, SceneNodeState> {
  let nodesMap: Record<number, SceneNodeState> = { };

  for (const node of nodes) {

    const id = node.uniqueId;
    const children = node.getChildren ? node.getChildren() : [];

    nodesMap[id] = {
      uniqueId: id,
      name: node.name || '<unnamed>',
      className: node.getClassName(),
      parentId,
      isVisible: node.isEnabled(),
      children: children.map(c => c.uniqueId),
    };

    const childState = buildSceneNodes(children, id);
    nodesMap = { ...nodesMap, ...childState };
  }
  return nodesMap
}