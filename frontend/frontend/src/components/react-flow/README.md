# React Flow Components

This directory contains React Flow components for visualizing workflows in the AI training application.

## Components

### TrainingWorkflow
A visualization of the AI training workflow with three main steps:
1. Dataset Upload - Upload training data to Walrus storage
2. Model Training - Train model with uploaded dataset
3. Gradient Storage - Store gradients back to Walrus

### TrainingFlowExample
A wrapper component that demonstrates how to use the TrainingWorkflow component in a card layout.

## Usage

To use the TrainingWorkflow component in your application:

```tsx
import TrainingWorkflow from '@/components/react-flow/training-workflow';

function MyComponent() {
  return (
    <div className="w-full h-[500px]">
      <TrainingWorkflow />
    </div>
  );
}
```

## Features

- Interactive nodes that can be dragged and connected
- Visual status indicators for each step of the workflow
- Animated edges showing data flow
- Simulation controls to demonstrate workflow progression
- Responsive design that works on different screen sizes

## Customization

You can customize the workflow by:
1. Modifying the initial nodes and edges
2. Adding new node types
3. Changing the styling of nodes and edges
4. Adding new simulation logic

## Dependencies

This component uses:
- `@xyflow/react` - The React Flow library
- Tailwind CSS for styling