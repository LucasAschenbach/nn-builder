'use client';

import { useState, useMemo } from 'react';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';

import LayerList from '@/components/LayerList';
import LayerEditor from '@/components/LayerEditor';

import { BaseLayer } from '@/domain/layers/BaseLayer';
import { ConvolutionLayer } from '@/domain/layers/ConvolutionLayer';
import { MaxPoolLayer } from '@/domain/layers/MaxPoolLayer';
import { LinearLayer } from '@/domain/layers/LinearLayer';
import { ActivationLayer } from '@/domain/layers/ActivationLayer';
import { LayerType } from '@/components/types'; // type alias

export default function Home() {
  /**
   * For demonstration, let's define:
   *  - First layer locked: a ConvolutionLayer with shape [3,224,224]
   *  - Last layer locked: a LinearLayer outputting dimension 10
   */
  const [layers, setLayers] = useState<BaseLayer[]>([
    new ConvolutionLayer({ dims: [3, 224, 224] }, 3, 3, 1, 1, true),  // locked input
    new LinearLayer({ dims: [3, 224, 224] }, 10, true),               // locked output
  ]);

  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);
  const [showAddMenu, setShowAddMenu] = useState(false);

  // Recalculate shapes from a certain index forward
  const recalcSubsequentLayers = (layerArray: BaseLayer[], startIndex: number) => {
    for (let i = startIndex; i < layerArray.length; i++) {
      if (i === 0) continue;
      const layer = layerArray[i];
      const prevLayer = layerArray[i - 1];

      // Set layer input shape to the previous layer's output shape
      layer.inputShape = { dims: [...prevLayer.outputShape.dims] };

      if (!layer.locked) {
        // If not locked, recalc
        layer.calcOutputShape();
      } else {
        // If locked, we do not overwrite output shape
        // but the input shape is forced to match prev layer's output shape
      }
    }
  };

  const handleSelectLayer = (layerId: string) => {
    setSelectedLayerId(layerId);
  };

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null;

  /**
   * Add a new layer between the last two layers by default
   */
  const handleAddLayer = (type: LayerType) => {
    const insertIndex = layers.length - 1;
    const prevLayer = layers[insertIndex - 1];
    const inputShape = { dims: [...prevLayer.outputShape.dims] };

    let newLayer: BaseLayer;
    switch (type) {
      case 'convolution':
        newLayer = new ConvolutionLayer(inputShape, inputShape.dims[0], 3, 1, 1, false);
        break;
      case 'maxpool':
        newLayer = new MaxPoolLayer(inputShape, 2, 2, false);
        break;
      case 'linear':
        newLayer = new LinearLayer(inputShape, 64, false);
        break;
      case 'activation':
      default:
        newLayer = new ActivationLayer(inputShape, 'relu', false);
        break;
    }

    const newLayers = [...layers];
    newLayers.splice(insertIndex, 0, newLayer);

    recalcSubsequentLayers(newLayers, insertIndex);
    setLayers(newLayers);
    setShowAddMenu(false);
  };

  /**
   * Update layer parameters
   */
  const handleLayerChange = (changedLayer: BaseLayer) => {
    const index = layers.findIndex(l => l.id === changedLayer.id);
    if (index === -1) return;

    const newLayers = [...layers];
    newLayers[index] = changedLayer;
    recalcSubsequentLayers(newLayers, index);
    setLayers(newLayers);
  };

  /**
   * Delete a layer if it’s not first or last
   */
  const handleDeleteLayer = (layerId: string) => {
    const index = layers.findIndex(l => l.id === layerId);
    if (index <= 0 || index === layers.length - 1) {
      // locked input or locked output
      return;
    }
    const newLayers = [...layers];
    newLayers.splice(index, 1);
    recalcSubsequentLayers(newLayers, index - 1);
    setLayers(newLayers);
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null);
    }
  };

  /**
   * Drag-and-drop reordering using dnd-kit
   */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = layers.findIndex(layer => layer.id === active.id);
    const newIndex = layers.findIndex(layer => layer.id === over.id);

    // Don’t allow reordering the locked first or last layers
    // if (oldIndex === 0 || oldIndex === layers.length - 1) return;
    // if (newIndex === 0 || newIndex === layers.length - 1) return;

    const newLayers = arrayMove(layers, oldIndex, newIndex);
    // recalc shapes from the earliest changed index
    const earliestChangedIndex = Math.min(oldIndex, newIndex);
    recalcSubsequentLayers(newLayers, earliestChangedIndex);
    setLayers(newLayers);
  };

  /**
   * Compute total param count
   */
  const totalParams = useMemo(() => {
    return layers.reduce((sum, layer) => sum + layer.calcNumParams(), 0);
  }, [layers]);

  /**
   * Export to PyTorch code snippet
   */
  const exportToPyTorch = () => {
    // Basic approach: each layer's toPyTorchModule() in an nn.Sequential
    // If the shapes won't flatten automatically, we assume user inserted a flatten or did dimension matching manually.
    const codeLines = layers.map(layer => `    ${layer.toPyTorchModule()},`);
    const code = `
import torch
import torch.nn as nn

model = nn.Sequential(
${codeLines.join('\n')}
)

print(model)
`;
    return code.trim();
  };

  const [showExportCode, setShowExportCode] = useState(false);

  return (
    <main className="flex min-h-screen bg-gray-100">
      {/* Left Column */}
      <div className="w-1/3 flex flex-col h-screen border-r border-gray-200">
        {/* Title & Param Count */}
        <div className="p-4 bg-white border-b border-gray-200">
          <h1 className="text-xl font-bold mb-2">Neural Network Builder</h1>
          <p className="text-sm text-gray-700">
            Total Params: {totalParams.toLocaleString()}
          </p>
        </div>

        {/* Scrollable layer list */}
        <div className="flex-1 overflow-y-auto h-0 p-4 bg-white">
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={layers.map((l) => l.id)}
              strategy={verticalListSortingStrategy}
            >
              <LayerList
                layers={layers}
                selectedLayerId={selectedLayerId}
                onSelectLayer={handleSelectLayer}
                onDeleteLayer={handleDeleteLayer}
              />
            </SortableContext>
          </DndContext>
        </div>

        {/* Bottom buttons (always visible) */}
        <div className="p-4 bg-white border-t border-gray-200 flex gap-2">
          <div className="relative inline-block">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded"
              onClick={() => setShowAddMenu(!showAddMenu)}
            >
              Add Layer
            </button>
            {showAddMenu && (
              <div className="absolute bottom-full mb-2 bg-white border border-gray-200 rounded shadow-lg z-10">
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAddLayer("convolution")}
                >
                  Convolution
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAddLayer("maxpool")}
                >
                  MaxPool
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAddLayer("linear")}
                >
                  Linear
                </button>
                <button
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleAddLayer("activation")}
                >
                  Activation
                </button>
              </div>
            )}
          </div>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded"
            onClick={() => setShowExportCode(true)}
          >
            Export PyTorch
          </button>
        </div>
      </div>

      {/* Right Column: Editor Panel */}
      <div className="flex-1 p-4">
        {selectedLayer ? (
          <LayerEditor layer={selectedLayer} onChange={handleLayerChange} />
        ) : (
          <p>Select a layer to edit its parameters...</p>
        )}
      </div>

      {/* PyTorch Code Modal */}
      {showExportCode && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-2xl p-4 rounded relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-gray-900"
              onClick={() => setShowExportCode(false)}
            >
              X
            </button>
            <h2 className="text-lg font-bold mb-2">PyTorch Code</h2>
            <textarea
              id="export-code-textarea"
              readOnly
              className="w-full h-64 border p-2 font-mono text-sm"
              value={exportToPyTorch()}
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-3 py-1 bg-blue-500 text-white rounded"
                onClick={() => {
                  navigator.clipboard.writeText(exportToPyTorch());
                }}
              >
                Copy
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
