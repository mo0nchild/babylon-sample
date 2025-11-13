import { Node } from '@babylonjs/core'
import { useEffect, useState } from 'react';

interface NodeTreeProps {
  nodes: Node[];
}

export const NodeTree: React.FC<NodeTreeProps> = ({ nodes }) => {
  return (
    <ul style={{ listStyle: 'none', padding: 0, marginLeft: 12 }}>
      {nodes.map(node => (
        <NodeItem key={node.uniqueId} node={node} />
      ))}
    </ul>
  );
};

interface NodeItemProps {
  node: Node;
}

const NodeItem: React.FC<NodeItemProps> = ({ node }) => {
  const children = node.getChildren ? node.getChildren() : [];
  const [visibilityMap, setVisibilityMap] = useState<Record<number, boolean>>({});

  const uniqueId = node.uniqueId;

  useEffect(() => {
    setVisibilityMap(prev => {
      if (prev[uniqueId] === undefined) {
        return { ...prev, [uniqueId]: node.isEnabled() };
      }
      return prev;
    });
  }, [uniqueId, node]);

  const toggleVisibility = () => {
    setVisibilityMap(prev => {
      const newVisible = !prev[uniqueId];
      // Синхронизируем с Babylon.js
      node.setEnabled(newVisible);
      return { ...prev, [uniqueId]: newVisible };
    });
  };

  const isVisible = visibilityMap[uniqueId] ?? node.isEnabled();

  return (
    <li style={{ marginBottom: 4 }}>
      <label style={{ display: 'flex', alignItems: 'center' }}>
        <input
          type="checkbox"
          checked={isVisible}
          onChange={toggleVisibility}
          style={{ marginRight: 6 }}
        />
        <span>
          {node.name || '<unnamed>'} ({node.getClassName()})
        </span>
      </label>
      {children.length > 0 && <NodeTree nodes={children} />}
    </li>
  );
};