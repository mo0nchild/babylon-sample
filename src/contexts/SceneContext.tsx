import { type  SceneState } from '@types/SceneState';
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

type SceneAction =
  | { type: 'SET_NODES'; payload: SceneState }
  | { type: 'TOGGLE_VISIBILITY'; payload: number }
  | { type: 'CLEAR' };

const initialState: SceneState = {};

function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {
    case 'SET_NODES':
      return action.payload;
    case 'TOGGLE_VISIBILITY': {
      const id = action.payload;
      const node = state[id];
      if (!node) return state;
      return {
        ...state,
        [id]: { ...node, isVisible: !node.isVisible },
      };
    }
    case 'CLEAR':
      return {};
    default:
      return state;
  }
}

const SceneContext = createContext<{
  state: SceneState;
  dispatch: React.Dispatch<SceneAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

export const useScene = () => useContext(SceneContext);

export const SceneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sceneReducer, initialState);

  return (
    <SceneContext.Provider value={{ state, dispatch }}>
      {children}
    </SceneContext.Provider>
  );
};