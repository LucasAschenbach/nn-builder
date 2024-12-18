import { BaseLayer, Shape } from './BaseLayer';

export class BatchNormLayer extends BaseLayer {
  constructor(inputShape: Shape, locked = false) {
    super(inputShape, locked);
  }

  get typeName() {
    return 'batchnorm';
  }

  calcOutputShape(): void {
    // BatchNorm does not change the shape
    this.outputShape = { dims: [...this.inputShape.dims] };
  }

  calcNumParams(): number {
    const [channels] = this.inputShape.dims;
    // BatchNorm has two parameters for each channel: gamma and beta
    return channels * 2;
  }

  toPyTorchModule(): string {
    const [channels] = this.inputShape.dims;
    return `nn.BatchNorm2d(${channels})`;
  }
}
