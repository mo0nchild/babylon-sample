export interface SceneNodeState {
  uniqueId: number;
  name: string;
  className: string;
  parentId?: number | null;
  isVisible: boolean;
  children: number[]; 
}

export type SceneState = {
  nodes: Record<number, SceneNodeState>,
  currentState: 'loading' | 'failed' | 'success' | 'empty'
};