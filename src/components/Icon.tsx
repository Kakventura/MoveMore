// Papel: fornecer ícones SVG tipados a partir do catálogo Material Design Icons.
// Motivo: usar um conjunto visual comum em Android e web sem depender de fontes de ícones.
import type { StyleProp, TextStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import {
  mdiAccount, mdiAccountOutline, mdiBagPersonalOutline, mdiBottleTonicOutline, mdiCamera, mdiCameraOutline,
  mdiCheckCircle, mdiCrosshairsGps, mdiGift, mdiGiftOutline, mdiHatFedora, mdiInformationOutline,
  mdiMapMarkerDistance, mdiMapMarkerPath, mdiPlay, mdiRoutes, mdiShoeSneaker, mdiStarCircle, mdiStop,
  mdiTimerOutline, mdiWalk, mdiWatchVariant,
} from '@mdi/js';

// Ícones desenhados em SVG (não dependem de baixar fontes, funcionam no Expo Go e na web)
const paths = {
  'account': mdiAccount,
  'account-outline': mdiAccountOutline,
  'bag-personal-outline': mdiBagPersonalOutline,
  'bottle-tonic-outline': mdiBottleTonicOutline,
  'camera': mdiCamera,
  'camera-outline': mdiCameraOutline,
  'check-circle': mdiCheckCircle,
  'crosshairs-gps': mdiCrosshairsGps,
  'gift': mdiGift,
  'gift-outline': mdiGiftOutline,
  'hat-fedora': mdiHatFedora,
  'information-outline': mdiInformationOutline,
  'map-marker-distance': mdiMapMarkerDistance,
  'map-marker-path': mdiMapMarkerPath,
  'play': mdiPlay,
  'routes': mdiRoutes,
  'shoe-sneaker': mdiShoeSneaker,
  'star-circle': mdiStarCircle,
  'stop': mdiStop,
  'timer-outline': mdiTimerOutline,
  'walk': mdiWalk,
  'watch-variant': mdiWatchVariant,
};

export type IconName = keyof typeof paths;

interface Props { name: IconName; size?: number; color?: string; style?: StyleProp<TextStyle> }

export function Icon({ name, size = 24, color = '#000' }: Props) {
  // Resolve o nome conhecido para seu caminho SVG e renderiza no tamanho/cor pedidos.
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path d={paths[name]} fill={color} />
    </Svg>
  );
}