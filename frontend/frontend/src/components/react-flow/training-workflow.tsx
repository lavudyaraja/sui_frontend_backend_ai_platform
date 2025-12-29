'use client';

import React, { useCallback, useState, useEffect } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Node,
  Edge,
  Connection,
  Panel,
  Position,
  NodeProps,
  NodeTypes,
  BackgroundVariant
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';

interface CustomNodeData {
  label: string;
  description: string;
  status?: 'pending' | 'active' | 'completed' | 'error';
  icon?: string;
}

// Custom styled nodes
const DataUploadNode = ({ data }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    active: 'border-blue-500 bg-blue-50 animate-pulse',
    completed: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50'
  };
  
  const statusDots = {
    pending: 'bg-gray-400',
    active: 'bg-blue-500 animate-pulse',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className={`px-6 py-4 shadow-lg rounded-xl border-2 transition-all ${statusColors[nodeData.status || 'pending']}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-full w-4 h-4 ${statusDots[nodeData.status || 'pending']}`}></div>
        <div className="text-lg font-bold text-gray-800">{nodeData.label}</div>
      </div>
      <div className="text-sm text-gray-600">{nodeData.description}</div>
      {nodeData.status && (
        <div className="mt-2">
          <Badge variant={
            nodeData.status === 'completed' ? 'default' :
            nodeData.status === 'active' ? 'default' :
            nodeData.status === 'error' ? 'destructive' :
            'secondary'
          }>
            {nodeData.status}
          </Badge>
        </div>
      )}
    </div>
  );
};

const TrainingNode = ({ data }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    active: 'border-purple-500 bg-purple-50 shadow-xl',
    completed: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50'
  };
  
  const statusDots = {
    pending: 'bg-gray-400',
    active: 'bg-purple-500 animate-pulse',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className={`px-6 py-4 shadow-lg rounded-xl border-2 transition-all ${statusColors[nodeData.status || 'pending']}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-full w-4 h-4 ${statusDots[nodeData.status || 'pending']}`}></div>
        <div className="text-lg font-bold text-gray-800">{nodeData.label}</div>
      </div>
      <div className="text-sm text-gray-600">{nodeData.description}</div>
      {nodeData.status === 'active' && (
        <div className="mt-3 flex items-center gap-2">
          <div className="flex-1 bg-gray-200 rounded-full h-2">
            <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
          </div>
          <span className="text-xs font-medium text-purple-600">60%</span>
        </div>
      )}
      {nodeData.status && (
        <div className="mt-2">
          <Badge variant={
            nodeData.status === 'completed' ? 'default' :
            nodeData.status === 'active' ? 'default' :
            nodeData.status === 'error' ? 'destructive' :
            'secondary'
          }>
            {nodeData.status}
          </Badge>
        </div>
      )}
    </div>
  );
};

const StorageNode = ({ data }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    active: 'border-indigo-500 bg-indigo-50 animate-pulse',
    completed: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50'
  };
  
  const statusDots = {
    pending: 'bg-gray-400',
    active: 'bg-indigo-500 animate-pulse',
    completed: 'bg-green-500',
    error: 'bg-red-500'
  };
  
  return (
    <div className={`px-6 py-4 shadow-lg rounded-xl border-2 transition-all ${statusColors[nodeData.status || 'pending']}`}>
      <div className="flex items-center gap-3 mb-2">
        <div className={`rounded-full w-4 h-4 ${statusDots[nodeData.status || 'pending']}`}></div>
        <div className="text-lg font-bold text-gray-800">{nodeData.label}</div>
      </div>
      <div className="text-sm text-gray-600">{nodeData.description}</div>
      {nodeData.status && (
        <div className="mt-2">
          <Badge variant={
            nodeData.status === 'completed' ? 'default' :
            nodeData.status === 'active' ? 'default' :
            nodeData.status === 'error' ? 'destructive' :
            'secondary'
          }>
            {nodeData.status}
          </Badge>
        </div>
      )}
    </div>
  );
};

const ValidationNode = ({ data }: NodeProps) => {
  const nodeData = data as unknown as CustomNodeData;
  const statusColors = {
    pending: 'border-gray-300 bg-gray-50',
    active: 'border-yellow-500 bg-yellow-50 animate-pulse',
    completed: 'border-green-500 bg-green-50',
    error: 'border-red-500 bg-red-50'
  };
  
  return (
    <div className={`px-5 py-3 shadow-md rounded-lg border-2 transition-all ${statusColors[nodeData.status || 'pending']}`}>
      <div className="text-sm font-semibold text-gray-700">{nodeData.label}</div>
      <div className="text-xs text-gray-500">{nodeData.description}</div>
    </div>
  );
};

const nodeTypes: NodeTypes = {
  dataUpload: DataUploadNode,
  training: TrainingNode,
  storage: StorageNode,
  validation: ValidationNode,
};

// Initial workflow nodes
const initialNodes: Node[] = [
  {
    id: '1',
    type: 'dataUpload',
    position: { x: 50, y: 50 },
    data: { 
      label: 'Dataset Upload', 
      description: 'Upload training data',
      status: 'pending'
    },
    sourcePosition: Position.Right,
  },
  {
    id: '2',
    type: 'validation',
    position: { x: 350, y: 50 },
    data: { 
      label: 'Validation', 
      description: 'Verify data integrity',
      status: 'pending'
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Right,
  },
  {
    id: '3',
    type: 'storage',
    position: { x: 550, y: 50 },
    data: { 
      label: 'Walrus Storage', 
      description: 'Store on decentralized network',
      status: 'pending'
    },
    targetPosition: Position.Left,
    sourcePosition: Position.Bottom,
  },
  {
    id: '4',
    type: 'training',
    position: { x: 450, y: 250 },
    data: { 
      label: 'Model Training', 
      description: 'Train AI model locally',
      status: 'pending'
    },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '5',
    type: 'validation',
    position: { x: 450, y: 450 },
    data: { 
      label: 'Gradient Validation', 
      description: 'Verify training results',
      status: 'pending'
    },
    targetPosition: Position.Top,
    sourcePosition: Position.Bottom,
  },
  {
    id: '6',
    type: 'storage',
    position: { x: 400, y: 600 },
    data: { 
      label: 'Gradient Storage', 
      description: 'Store gradients on Walrus',
      status: 'pending'
    },
    targetPosition: Position.Top,
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: false, style: { stroke: '#94a3b8' } },
  { id: 'e2-3', source: '2', target: '3', animated: false, style: { stroke: '#94a3b8' } },
  { id: 'e3-4', source: '3', target: '4', animated: false, style: { stroke: '#94a3b8' } },
  { id: 'e4-5', source: '4', target: '5', animated: false, style: { stroke: '#94a3b8' } },
  { id: 'e5-6', source: '5', target: '6', animated: false, style: { stroke: '#94a3b8' } },
];

export default function EnhancedTrainingWorkflow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  // Simulation steps
  const simulationSteps = [
    { nodeId: '1', status: 'active' as const, edgeId: 'e1-2', duration: 2000 },
    { nodeId: '1', status: 'completed' as const, edgeId: null, duration: 500 },
    { nodeId: '2', status: 'active' as const, edgeId: 'e2-3', duration: 1500 },
    { nodeId: '2', status: 'completed' as const, edgeId: null, duration: 500 },
    { nodeId: '3', status: 'active' as const, edgeId: 'e3-4', duration: 2500 },
    { nodeId: '3', status: 'completed' as const, edgeId: null, duration: 500 },
    { nodeId: '4', status: 'active' as const, edgeId: 'e4-5', duration: 4000 },
    { nodeId: '4', status: 'completed' as const, edgeId: null, duration: 500 },
    { nodeId: '5', status: 'active' as const, edgeId: 'e5-6', duration: 1500 },
    { nodeId: '5', status: 'completed' as const, edgeId: null, duration: 500 },
    { nodeId: '6', status: 'active' as const, edgeId: null, duration: 2000 },
    { nodeId: '6', status: 'completed' as const, edgeId: null, duration: 500 },
  ];

  // Run simulation
  const runSimulation = async () => {
    setIsSimulating(true);
    setIsPaused(false);
    
    for (let i = 0; i < simulationSteps.length; i++) {
      if (!isSimulating) break;
      
      while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      const step = simulationSteps[i];
      setCurrentStep(i);
      
      // Update node status
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === step.nodeId) {
            return {
              ...node,
              data: {
                ...node.data,
                status: step.status,
              },
            };
          }
          return node;
        })
      );
      
      // Update edge animation
      if (step.edgeId) {
        setEdges((eds) =>
          eds.map((edge) => {
            if (edge.id === step.edgeId) {
              return {
                ...edge,
                animated: true,
                style: { stroke: '#10b981', strokeWidth: 2 },
              };
            }
            return edge;
          })
        );
      }
      
      await new Promise(resolve => setTimeout(resolve, step.duration));
    }
    
    setIsSimulating(false);
  };

  // Reset simulation
  const resetSimulation = () => {
    setIsSimulating(false);
    setIsPaused(false);
    setCurrentStep(0);
    
    setNodes((nds) =>
      nds.map((node) => ({
        ...node,
        data: {
          ...node.data,
          status: 'pending',
        },
      }))
    );
    
    setEdges((eds) =>
      eds.map((edge) => ({
        ...edge,
        animated: false,
        style: { stroke: '#94a3b8' },
      }))
    );
  };

  return (
    <Card className="w-full shadow-xl border-t-4 border-gradient-to-r from-blue-500 to-purple-500">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700">
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-6 w-6 text-blue-600" />
          Training Workflow Visualization
        </CardTitle>
        <CardDescription>
          Interactive visualization of the decentralized AI training process
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[700px] border-t relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            minZoom={0.5}
            maxZoom={1.5}
          >
            <Controls />
            <MiniMap 
              nodeColor={(node) => {
                const status = (node.data as any).status;
                if (status === 'completed') return '#10b981';
                if (status === 'active') return '#3b82f6';
                if (status === 'error') return '#ef4444';
                return '#d1d5db';
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            
            <Panel position="top-right" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4">
              <div className="space-y-3">
                <div className="flex gap-2">
                  {!isSimulating ? (
                    <Button
                      onClick={runSimulation}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                    >
                      <Play className="h-4 w-4 mr-2" />
                      Start Simulation
                    </Button>
                  ) : (
                    <Button
                      onClick={() => setIsPaused(!isPaused)}
                      size="sm"
                      variant="secondary"
                    >
                      <Pause className="h-4 w-4 mr-2" />
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                  )}
                  
                  <Button
                    onClick={resetSimulation}
                    size="sm"
                    variant="outline"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Reset
                  </Button>
                </div>
                
                {isSimulating && (
                  <div className="text-sm">
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">Progress</span>
                      <span className="font-medium">{Math.round((currentStep / simulationSteps.length) * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(currentStep / simulationSteps.length) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            </Panel>
            
            <Panel position="bottom-left" className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 m-4">
              <h4 className="font-semibold mb-3 text-sm">Workflow Steps</h4>
              <div className="space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Upload dataset to platform</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Validate data integrity</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <span>Store on Walrus network</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <span>Train model locally</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <span>Validate gradients</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <span>Store gradients on Walrus</span>
                </div>
              </div>
            </Panel>
          </ReactFlow>
        </div>
      </CardContent>
    </Card>
  );
}