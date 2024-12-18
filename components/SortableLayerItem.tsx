// app/components/SortableLayerItem.tsx
import { FC } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { BaseLayer } from '@/domain/layers/BaseLayer';
import { GripVertical } from 'lucide-react'; // optional icon lib

interface SortableLayerItemProps {
  layer: BaseLayer;
  index: number;
  isLast: boolean;
  isSelected: boolean;
  onSelectLayer: () => void;
  onDeleteLayer: () => void;
}

const SortableLayerItem: FC<SortableLayerItemProps> = ({
  layer,
  index,
  isLast,
  isSelected,
  onSelectLayer,
  onDeleteLayer,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: layer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`flex items-center justify-between p-2 rounded 
        ${isSelected ? 'bg-blue-100' : 'bg-gray-100 hover:bg-gray-200'}
      `}
    >
      <div className="flex items-center space-x-2" onClick={onSelectLayer}>
        {/* Drag handle */}
        {!layer.locked && (
          <button {...listeners} className="p-1 cursor-grab">
            <GripVertical size={16} />
          </button>
        )}
        <div>
          <div className="font-semibold">
            {`${layer.typeName.toUpperCase() + (isLast ? ' (Output)' : '')}`}
          </div>
          <div className="text-sm text-gray-600">
            In: {layer.inputShape.dims.join('x')} → Out: {layer.outputShape.dims.join('x')}
          </div>
          {layer.locked && <div className="text-xs text-red-500">LOCKED</div>}
        </div>
      </div>

      {/* Delete button if not locked */}
      {!layer.locked && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteLayer();
          }}
          className="text-red-500 hover:text-red-700 text-sm"
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default SortableLayerItem;
