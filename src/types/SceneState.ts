export interface SceneNodeState {
  uniqueId: number;
  name: string;
  className: string;
  parentId?: number | null;
  isVisible: boolean;
  children: number[]; 
}

export type SceneState = Record<number, SceneNodeState>;