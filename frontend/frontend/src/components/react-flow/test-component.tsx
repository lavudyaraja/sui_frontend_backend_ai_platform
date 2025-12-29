'use client';

import React from 'react';
import { ReactFlow, Background, Controls, MiniMap, Node } from '@xyflow/react';

const TestComponent = () => {
  const nodes: Node[] = [
    {
      id: '1',
      position: { x: 0, y: 0 },
      data: { label: 'Test Node' },
    },
  ];

  return (
    <div style={{ width: '100%', height: '400px' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]}
        fitView
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};

export default TestComponent;