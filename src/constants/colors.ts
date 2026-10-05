// Papel: reunir a paleta, os raios de borda e a sombra usados pela interface.
// Motivo: permitir que telas e componentes compartilhem uma identidade visual consistente.
export const Colors = {
  forest: '#51166A',
  moss: '#BD2693',
  sand: '#F7F3FA', // fundo geral (lavanda bem clara)
  ink: '#2A1238',
  line: '#E7DEEE',
  white: '#FFFFFF',
  danger: '#D93A56',
  muted: '#7A6A86',
  orange: '#FFA31A',
  coral: '#F45164',
  magenta: '#BD2693',
  violet: '#7623A6',
};

export const Radius = { sm: 12, md: 16, lg: 24 };

export const Shadow = {
  shadowColor: '#51166A',
  shadowOpacity: 0.08,
  shadowRadius: 16,
  shadowOffset: { width: 0, height: 6 },
  elevation: 3,
} as const;