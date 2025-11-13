import React from 'react';
import { useScene } from '@contexts/SceneContext';

interface TreeNodeProps {
  nodeId: number;
}

const TreeNode: React.FC<TreeNodeProps> = ({ nodeId }) => {
  const { state, dispatch } = useScene();
  const node = state.nodes[nodeId];

  if (!node) return null;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_VISIBILITY', payload: nodeId });
  };

  return (
    <li style={{ marginBottom: 4, listStyle: 'none' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={node.isVisible}
          onChange={handleToggle}
          style={{ marginRight: 6 }}
        />
        <span>
          {node.name} <small style={{ color: '#888' }}>({node.className})</small>
        </span>
      </label>

      {node.children.length > 0 && (
        <ul style={{ paddingLeft: 16, marginTop: 4, marginBottom: 0 }}>
          {node.children.map((childId) => (
            <TreeNode key={childId} nodeId={childId} />
          ))}
        </ul>
      )}
    </li>
  );
};

const NodeTree: React.FC = () => {
  const { state } = useScene();

  const rootIds = Object.values(state.nodes)
    .filter((node) => node.parentId == null)
    .map((node) => node.uniqueId);

  if (rootIds.length === 0) {
    return (
      <div style={{ padding: '12px', color: '#666' }}>
        Загрузите модель для просмотра иерархии
      </div>
    );
  }

  return (
    <div style={{
      padding: '12px',
      border: '1px solid #eee',
      borderRadius: 4,
      maxHeight: '400px',
      overflowY: 'auto',
      backgroundColor: '#242424ff',
    }} >
      <h3 style={{ marginTop: 0, fontSize: '16px' }}>Дерево сцены</h3>
      <ul style={{ padding: 0, margin: 0, listStyle: 'none' }}>
        { 
          rootIds.map((id, index) => (
            <TreeNode key={index} nodeId={id} />
          )) 
        }
      </ul>
    </div>
  );
};

export default NodeTree;