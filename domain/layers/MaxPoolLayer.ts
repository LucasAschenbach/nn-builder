import { BaseLayer, Shape } from './BaseLayer';

export class MaxPoolLayer extends BaseLayer {
  poolSize: number;
  stride: number;

  constructor(inputShape: Shape, poolSize = 2, stride = 2, locked = false) {
    super(inputShape, locked);
    this.poolSize = poolSize;
    this.stride = stride;
  }

  get typeName() {
    return 'maxpool';
  }

  calcOutputShape(): void {
    const [c, h, w] = this.inputShape.dims;
    const outH = Math.floor(h / this.stride);
    const outW = Math.floor(w / this.stride);
    this.outputShape = { dims: [c, outH, outW] };
  }

  calcNumParams(): number {
    // MaxPool2d has no trainable parameters
    return 0;
  }

  toPyTorchModule(): string {
    return `nn.MaxPool2d(kernel_size=${this.poolSize}, stride=${this.stride})`;
  }
}
