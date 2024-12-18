import { FC } from 'react';
import { BaseLayer } from '@/domain/layers/BaseLayer';
import SortableLayerItem from './SortableLayerItem';

interface LayerListProps {
  layers: BaseLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (layerId: string) => void;
  onDeleteLayer: (layerId: string) => void;
}

const LayerList: FC<LayerListProps> = ({
  layers,
  selectedLayerId,
  onSelectLayer,
  onDeleteLayer,
}) => {
  return (
    <div className="space-y-2">
      {layers.map((layer, index) => (
        <SortableLayerItem
          key={layer.id}
          layer={layer}
          index={index}
          isLast={layers.length === index+1}
          isSelected={selectedLayerId === layer.id}
          onSelectLayer={() => onSelectLayer(layer.id)}
          onDeleteLayer={() => onDeleteLayer(layer.id)}
        />
      ))}
    </div>
  );
};

export default LayerList;
