import { type  SceneState } from './../types/SceneState';
import React, { createContext, useContext, useReducer, type ReactNode } from 'react';

type SceneAction =
  | { type: 'SET_NODES'; payload: SceneState }
  | { type: 'TOGGLE_VISIBILITY'; payload: number }
  | { type: 'CLEAR' };

const initialState: SceneState = {
  currentState: 'empty',
  nodes: { }
};

function sceneReducer(state: SceneState, action: SceneAction): SceneState {
  switch (action.type) {

    case 'SET_NODES': return action.payload;

    case 'TOGGLE_VISIBILITY': {
      const id = action.payload;
      const node = state.nodes[id];
      if (!node) return state;
      return {
        currentState: state.currentState,
        nodes: {
          ...state.nodes,
          [id]: { ...node, isVisible: !node.isVisible }
        },
      } as SceneState;
    }

    case 'CLEAR': return ({ 
      nodes: { },
      currentState: 'empty'
    } as SceneState);

    default: return state;
  }
}

const SceneContext = createContext<{
  state: SceneState;
  dispatch: React.Dispatch<SceneAction>;
}>({
  state: initialState,
  dispatch: () => null,
});

// eslint-disable-next-line react-refresh/only-export-components
export const useScene = () => useContext(SceneContext);

export const SceneProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(sceneReducer, initialState);

  return (
    <SceneContext.Provider value={{ state, dispatch }}>
      {children}
    </SceneContext.Provider>
  );
};