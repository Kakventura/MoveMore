// Papel: exibir a imagem da marca com dimensões configuráveis.
// Motivo: reutilizar o mesmo logo e texto alternativo em diferentes partes da navegação.
import { Image } from 'react-native';

export function BrandLogo({ width = 124, height = 64 }: { width?: number; height?: number }) {
  return (
    <Image
      accessibilityLabel="Logo Move+"
      source={require('../../assets/images/Logo.png')}
      resizeMode="contain"
      style={{ width, height }}
    />
  );
}
