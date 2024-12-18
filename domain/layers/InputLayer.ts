import { BaseLayer, Shape } from './BaseLayer';

export class InputLayer extends BaseLayer {
  constructor(inputShape: Shape) {
    super(inputShape, true); // locked by default
  }

  get typeName() {
    return 'input';
  }

  calcOutputShape(): void {
    // Output shape = input shape, no change
    this.outputShape = { dims: [...this.inputShape.dims] };
  }

  calcNumParams(): number {
    // No parameters
    return 0;
  }

  toPyTorchModule(): string {
    // Not actually used in PyTorch code (usually input shape is defined outside the model),
    // but we can return a comment or a placeholder.
    return `# input: ${this.inputShape.dims.join('x')}`;
  }
}
