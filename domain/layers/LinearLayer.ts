import { BaseLayer, Shape } from './BaseLayer';

export class LinearLayer extends BaseLayer {
  units: number;

  constructor(inputShape: Shape, units: number, locked = false) {
    super(inputShape, locked);
    this.units = units;
  }

  get typeName() {
    return 'linear';
  }

  calcOutputShape(): void {
    // For simplicity, assume input shape dims = [N]
    this.outputShape = { dims: [this.units] };
  }

  calcNumParams(): number {
    const [inDim] = this.inputShape.dims; // flatten assumed
    // weight params = inDim * units
    // bias params   = units
    return inDim * this.units + this.units;
  }

  toPyTorchModule(): string {
    const [inDim] = this.inputShape.dims;
    return `nn.Linear(${inDim}, ${this.units})`;
  }
}
