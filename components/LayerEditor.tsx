// app/components/LayerEditor.tsx
import { FC } from 'react';
import { BaseLayer } from '@/domain/layers/BaseLayer';
import { ConvolutionLayer } from '@/domain/layers/ConvolutionLayer';
import { MaxPoolLayer } from '@/domain/layers/MaxPoolLayer';
import { LinearLayer } from '@/domain/layers/LinearLayer';
import { ActivationLayer } from '@/domain/layers/ActivationLayer';
import { ActivationType } from '@/domain/layers/ActivationLayer';

interface LayerEditorProps {
  layer: BaseLayer;
  onChange: (layer: BaseLayer) => void;
}

const LayerEditor: FC<LayerEditorProps> = ({ layer, onChange }) => {
  const handleLockToggle = () => {
    layer.locked = !layer.locked;
    onChange(layer);
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h2 className="text-lg font-bold mb-2">Edit Layer: {layer.typeName.toUpperCase()}</h2>

      <label className="flex items-center space-x-2 mb-4">
        <input
          type="checkbox"
          checked={layer.locked}
          onChange={handleLockToggle}
        />
        <span>Locked</span>
      </label>

      <div className="mb-2 text-sm text-gray-600">
        <p>Input Shape: {layer.inputShape.dims.join('x')}</p>
        <p>Output Shape: {layer.outputShape.dims.join('x')}</p>
      </div>

      {/* Convolution Editor */}
      {layer instanceof ConvolutionLayer && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Filters</label>
            <input
              type="range"
              min={1}
              max={256}
              value={layer.filters}
              onChange={(e) => {
                layer.filters = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.filters}</span>
          </div>
          <div>
            <label className="block text-sm">Kernel Size</label>
            <input
              type="range"
              min={1}
              max={11}
              step={2}
              value={layer.kernelSize}
              onChange={(e) => {
                layer.kernelSize = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.kernelSize}</span>
          </div>
          <div>
            <label className="block text-sm">Stride</label>
            <input
              type="range"
              min={1}
              max={4}
              value={layer.stride}
              onChange={(e) => {
                layer.stride = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.stride}</span>
          </div>
          <div>
            <label className="block text-sm">Padding</label>
            <input
              type="range"
              min={0}
              max={5}
              value={layer.padding}
              onChange={(e) => {
                layer.padding = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.padding}</span>
          </div>
        </div>
      )}

      {/* MaxPool Editor */}
      {layer instanceof MaxPoolLayer && (
        <div className="space-y-2">
          <div>
            <label className="block text-sm">Pool Size</label>
            <input
              type="range"
              min={1}
              max={5}
              value={layer.poolSize}
              onChange={(e) => {
                layer.poolSize = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.poolSize}</span>
          </div>
          <div>
            <label className="block text-sm">Stride</label>
            <input
              type="range"
              min={1}
              max={5}
              value={layer.stride}
              onChange={(e) => {
                layer.stride = Number(e.target.value);
                onChange(layer);
              }}
              disabled={layer.locked}
            />
            <span className="ml-2">{layer.stride}</span>
          </div>
        </div>
      )}

      {/* Linear Editor */}
      {layer instanceof LinearLayer && (
        <div>
          <label className="block text-sm">Units</label>
          <input
            type="range"
            min={1}
            max={1024}
            value={layer.units}
            onChange={(e) => {
              layer.units = Number(e.target.value);
              onChange(layer);
            }}
            disabled={layer.locked}
          />
          <span className="ml-2">{layer.units}</span>
        </div>
      )}

      {/* Activation Editor */}
      {layer instanceof ActivationLayer && (
        <div>
          <label className="block text-sm">Activation</label>
          <select
            value={layer.activation}
            onChange={(e) => {
              layer.activation = e.target.value as ActivationType;
              onChange(layer);
            }}
            disabled={layer.locked}
            className="border rounded p-1"
          >
            <option value="relu">ReLU</option>
            <option value="sigmoid">Sigmoid</option>
            <option value="tanh">Tanh</option>
            <option value="softmax">Softmax</option>
          </select>
        </div>
      )}
    </div>
  );
};

export default LayerEditor;
