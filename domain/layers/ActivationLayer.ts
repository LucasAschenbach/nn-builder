import { BaseLayer, Shape } from './BaseLayer';

export type ActivationType = 'relu' | 'sigmoid' | 'tanh' | 'softmax';

export class ActivationLayer extends BaseLayer {
  activation: ActivationType;

  constructor(inputShape: Shape, activation: ActivationType, locked = false) {
    super(inputShape, locked);
    this.activation = activation;
  }

  get typeName() {
    return 'activation';
  }

  calcOutputShape(): void {
    // Activation doesn't change shape
    this.outputShape = { dims: [...this.inputShape.dims] };
  }

  calcNumParams(): number {
    // No trainable params for activations
    return 0;
  }

  toPyTorchModule(): string {
    // We'll map string activation to a PyTorch module
    switch (this.activation) {
      case 'relu':
        return `nn.ReLU()`;
      case 'sigmoid':
        return `nn.Sigmoid()`;
      case 'tanh':
        return `nn.Tanh()`;
      case 'softmax':
        // For PyTorch Softmax we might specify dim, ignoring for simplicity
        return `nn.Softmax(dim=1)`;
    }
  }
}
