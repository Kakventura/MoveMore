# Diário de Rotas

App Android + site (Expo / React Native Web) com cadastro, login por cookie e **GPS + gravação em pasta**.

```bash
npm install
cp .env.example .env     # opcional
npx expo start           # a = Android (Expo Go), w = web
```

## Arquitetura
- `src/app` – telas (Expo Router). `(auth)` = login/cadastro, `(app)` = área protegida.
- `src/context` – estado global (AuthContext, RoutesContext com o CRUD).
- `src/integration` – chamadas HTTP à API de login (axios, `withCredentials`).
- `src/services` – recursos nativos: `location.ts` (GPS) e `directoryExport.*` (pasta; `.native` x `.web`).
- `src/components`, `src/utils`, `src/constants`, `src/@types` – UI reutilizável e apoio.

## Sessão
A API devolve o JWT num cookie HttpOnly; o app só guarda `userId/username` em memória.

## Pasta de destino
Android: seletor do sistema (Storage Access Framework). Web: `showDirectoryPicker` (Chrome/Edge).
