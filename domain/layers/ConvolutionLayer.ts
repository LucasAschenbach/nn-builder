import { BaseLayer, Shape } from './BaseLayer';

export class ConvolutionLayer extends BaseLayer {
  kernelSize: number;
  filters: number;
  stride: number;
  padding: number;

  constructor(inputShape: Shape, filters: number, kernelSize = 3, stride = 1, padding = 1, locked = false) {
    super(inputShape, locked);
    this.kernelSize = kernelSize;
    this.filters = filters;
    this.stride = stride;
    this.padding = padding;
  }

  get typeName() {
    return 'convolution';
  }

  calcOutputShape(): void {
    const [c, h, w] = this.inputShape.dims;
    const outH = Math.floor((h + 2 * this.padding - this.kernelSize) / this.stride + 1);
    const outW = Math.floor((w + 2 * this.padding - this.kernelSize) / this.stride + 1);
    this.outputShape = { dims: [this.filters, outH, outW] };
  }

  calcNumParams(): number {
    // For a 2D convolution (with bias):
    // weight params = filters * c * kernelSize * kernelSize
    // bias params   = filters
    const [inC] = this.inputShape.dims;
    const weightParams = this.filters * inC * this.kernelSize * this.kernelSize;
    const biasParams = this.filters;
    return weightParams + biasParams;
  }

  toPyTorchModule(): string {
    const [inC] = this.inputShape.dims;
    return `nn.Conv2d(${inC}, ${this.filters}, kernel_size=${this.kernelSize}, stride=${this.stride}, padding=${this.padding})`;
  }
}
