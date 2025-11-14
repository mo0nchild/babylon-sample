import React, { useEffect, useRef, useState } from 'react';
import {
  Engine,
  Scene,
  Node,
  ArcRotateCamera,
  HemisphericLight,
  Vector3,
  LoadAssetContainerAsync,
  AssetContainer,
  MeshBuilder,
  StandardMaterial,
  Color3,
  GizmoManager,
} from '@babylonjs/core';
import type { SceneNodeState } from '@./../types/SceneState';

import "@babylonjs/loaders/glTF";

import { useScene } from '@contexts/SceneContext';

interface BabylonScene {
  modelUrl: string | null,
  selectedNode: number | null
}

const BabylonScene: React.FC<BabylonScene> = ({ modelUrl, selectedNode }) => {
  const { state, dispatch } = useScene();
  const [sceneReady, setSceneReady] = useState(false);

  const containerRef = useRef<AssetContainer | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<Scene | null>(null);
  const gizmoManagerRef = useRef<GizmoManager | null>(null);

  useEffect(() => {
    if (!modelUrl || !sceneReady) return;
    
    const loadModel = async () => {
      if (!sceneRef.current) return;
      dispatch({ type: 'LOADING' })
      try {

        if (containerRef.current) {

          containerRef.current.removeAllFromScene();
          containerRef.current.dispose();

        }

        containerRef.current = await LoadAssetContainerAsync(
          modelUrl, 
          sceneRef.current
        );

        console.log('Meshes loaded:', containerRef.current.meshes.length);
        containerRef.current.addAllToScene();
        
        const rootNodes = containerRef.current.rootNodes
        if (gizmoManagerRef.current && rootNodes.length > 0) {
          gizmoManagerRef.current.attachToNode(rootNodes[0])
        }

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

    loadModel().then(() => sceneRef.current?.getEngine().resize());

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modelUrl, sceneReady])

  useEffect(() => {
    if (!sceneRef.current || !gizmoManagerRef.current || !containerRef.current) return;
    const node = containerRef.current
      .getNodes()
      .find(n => n.uniqueId == selectedNode)
    if (node) {
      gizmoManagerRef.current.attachToNode(node)
    }
  }, [selectedNode])

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

    const ground = MeshBuilder.CreateGround("grid", { width: 20, height: 20, subdivisions: 20 }, scene);
    const gridMat = new StandardMaterial("gridMat", scene);

    gridMat.wireframe = true;
    gridMat.emissiveColor = new Color3(0.5, 0.5, 0.5);
    ground.material = gridMat;
    ground.position.y = 0; 

    const gizmoManager = new GizmoManager(scene);
    gizmoManager.positionGizmoEnabled = true; 
    gizmoManager.rotationGizmoEnabled = true; 
    gizmoManager.scaleGizmoEnabled = false;
    gizmoManager.usePointerToAttachGizmos = false;
    gizmoManagerRef.current = gizmoManager;

    sceneRef.current = scene;
    setSceneReady(true);

    engine.runRenderLoop(() => { 
      if (!engine.isDisposed && !scene.isDisposed) {
        scene.render();
      }
    });
    
    const resize = () => engine.resize()
    window.addEventListener('resize', resize);
    setTimeout(() => {
      engine.resize();
    }, 0);
    return () => {
      setSceneReady(false);

      window.removeEventListener('resize', resize);
      
      scene.dispose();
      engine.dispose();
      gizmoManager.dispose();
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
    <div style={{ border: '1px solid #ccc'}}>
      <canvas ref={canvasRef} style={{ width: '728px', height: '480px' }} />
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