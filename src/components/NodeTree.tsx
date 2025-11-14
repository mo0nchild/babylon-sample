import React from 'react';
import { useScene } from '@contexts/SceneContext';
import type { SceneNodeState } from './../types/SceneState';

interface TreeNodeProps {
  nodeId: number;
  onSelect?: (nodeId: number) => void 
}

const TreeNode: React.FC<TreeNodeProps> = ({ nodeId, onSelect }) => {
  const { state, dispatch } = useScene();
  const node = state.nodes[nodeId];

  if (!node) return null;

  const handleToggle = () => {
    dispatch({ type: 'TOGGLE_VISIBILITY', payload: nodeId });
  };

  const isDisabled = isNodeDisabled(nodeId, state.nodes);

  return (
    <li style={{ marginBottom: 4, listStyle: 'none' }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <button 
          onClick={() => {
            onSelect?.(node.uniqueId)
          }}
          style={{
            fontSize: '10px',
            padding: '5px'
          }}>Выбрать</button>
        <input
          type="checkbox"
          checked={node.isVisible}
          onChange={handleToggle}
          style={{ marginRight: 6 }}
          disabled={isDisabled}
        />
        <span>
          {node.name} <small style={{ color: '#888' }}>({node.className})</small>
        </span>
      </label>

      {node.children.length > 0 && (
        <ul style={{ paddingLeft: 16, marginTop: 4, marginBottom: 0 }}>
          {node.children.map((childId) => (
            <TreeNode key={childId} nodeId={childId} onSelect={onSelect} />
          ))}
        </ul>
      )}
    </li>
  );
};

const NodeTree: React.FC<{onSelect?: (nodeId: number) => void}> = ({onSelect}) => {
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
            <TreeNode key={index} nodeId={id} onSelect={onSelect} />
          )) 
        }
      </ul>
    </div>
  );
};

export default NodeTree;

function isNodeDisabled(nodeId: number, nodes: Record<number, SceneNodeState>): boolean {
  const node = nodes[nodeId];
  if (!node) return false;

  // Если текущий узел — корень (нет родителя)
  if (node.parentId == null) {
    return false; // корни никогда не блокируются
  }

  const parent = nodes[node.parentId];
  if (!parent) return false;

  // Если родитель скрыт → текущий узел заблокирован
  if (!parent.isVisible) {
    return true;
  }

  // Иначе — проверяем родителя рекурсивно
  return isNodeDisabled(node.parentId, nodes);
}