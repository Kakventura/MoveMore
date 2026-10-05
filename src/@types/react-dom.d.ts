// Papel: declarar apenas a assinatura de createPortal usada pela interface web.
// Motivo: disponibilizar essa tipagem ao TypeScript sem alterar o comportamento do React DOM.
// Tipo mínimo para o createPortal (usado só na versão web da foto de perfil)
declare module 'react-dom' {
  export function createPortal(
    children: import('react').ReactNode,
    container: Element,
  ): import('react').ReactPortal;
}