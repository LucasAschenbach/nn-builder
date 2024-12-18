import { BaseLayer, Shape } from './BaseLayer';

export class FlattenLayer extends BaseLayer {
  constructor(inputShape: Shape, locked = false) {
    super(inputShape, locked);
  }

  get typeName() {
    return 'flatten';
  }

  calcOutputShape(): void {
    const [c, h, w] = this.inputShape.dims;
    this.outputShape = { dims: [c * h * w] };
  }

  calcNumParams(): number {
    // No trainable params for flatten
    return 0;
  }

  toPyTorchModule(): string {
    return `nn.Flatten()`;
  }
}
