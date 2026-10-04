// Tipo mínimo para o createPortal (usado só na versão web da foto de perfil)
declare module 'react-dom' {
  export function createPortal(
    children: import('react').ReactNode,
    container: Element,
  ): import('react').ReactPortal;
}