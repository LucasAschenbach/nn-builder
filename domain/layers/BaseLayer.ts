import { v4 as uuidv4 } from 'uuid';

export interface Shape {
  dims: number[]; // e.g. [C, H, W] or [N] for linear
}

// Abstract base class
export abstract class BaseLayer {
  id: string;
  locked: boolean;
  inputShape: Shape;
  outputShape: Shape;

  constructor(inputShape: Shape, locked = false) {
    this.id = uuidv4();
    this.locked = locked;
    this.inputShape = { ...inputShape };
    this.outputShape = { ...inputShape }; // default
  }

  // Recalculate the layer’s output shape given the previous layer’s shape
  abstract calcOutputShape(): void;

  // Returns the number of trainable parameters for this layer
  abstract calcNumParams(): number;

  // Returns a snippet representing this layer in PyTorch
  abstract toPyTorchModule(): string;

  // A friendly name or type for display
  abstract get typeName(): string;
}
