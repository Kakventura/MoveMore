<div align="center">

# 🏃‍♀️ Move+

### Diário de Rotas e Recompensas

**Caminhe, grave seu percurso, junte pontos e troque por prêmios.**

![Expo](https://img.shields.io/badge/Expo-SDK_57-51166A?style=for-the-badge&logo=expo&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-0.86-BD2693?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-6-7623A6?style=for-the-badge&logo=typescript&logoColor=white)
![Android](https://img.shields.io/badge/Android-Expo_Go-FFA31A?style=for-the-badge&logo=android&logoColor=white)
![Web](https://img.shields.io/badge/Web-React_Native_Web-F45164?style=for-the-badge&logo=googlechrome&logoColor=white)

</div>

---

## ✨ Sobre o projeto

O **Move+** é um aplicativo que incentiva a atividade física de um jeito simples: você grava suas caminhadas com o GPS do celular, ganha pontos pela distância percorrida e troca esses pontos por prêmios.

O mesmo código roda no **Android** (via Expo Go) e no **navegador**, com uma experiência adaptada para cada um.

## 🎯 Funcionalidades

| | Recurso | Descrição |
|---|---|---|
| 🔐 | **Cadastro e login** | Autenticação por cookie de sessão (HttpOnly) com uma API externa |
| 📍 | **Gravação de rotas** | GPS em tempo real, mapa ao vivo, cronômetro e distância |
| ⭐ | **Pontos por distância** | Cada **10 metros** percorridos valem **1 ponto** |
| 🎁 | **Troca de prêmios** | Catálogo de produtos, saldo, barra de progresso e histórico de trocas |
| 🗺️ | **Minhas rotas** | Lista de rotas salvas, com detalhes, mapa, edição e exclusão |
| 👤 | **Perfil** | Foto (câmera ou galeria), estatísticas de atividade e mapa de cada rota |
| 📁 | **Exportação** | Cada rota é gravada como arquivo `.json` numa pasta escolhida pelo usuário |

## 🧱 Tecnologias

- **[Expo](https://expo.dev/)** e **React Native**, para o app Android e a versão web
- **[Expo Router](https://docs.expo.dev/router/introduction/)**, para rotas baseadas em arquivos
- **TypeScript**, com rotas tipadas (`typedRoutes`)
- **Axios**, para a comunicação com a API de login
- **AsyncStorage**, para guardar rotas, pontos e trocas por usuário
- **Leaflet + OpenStreetMap**, para os mapas (em WebView no celular e direto na web)
- **react-native-svg + @mdi/js**, para os ícones
- **PT Sans Narrow** (Google Fonts), como fonte do app

## 🚀 Como rodar

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão LTS)
- App **Expo Go** no celular Android (ou um navegador, para a versão web)

### Passo a passo

```bash
# 1. Instale as dependências
npm install

# 2. (Opcional) configure a API de login
cp .env.example .env

# 3. Inicie o projeto
npx expo start
```

Depois, no terminal:

- escaneie o **QR Code** com o Expo Go para abrir no celular;
- ou pressione **`w`** para abrir no navegador.

> 💡 Se algo estranho aparecer depois de mudar arquivos ou instalar pacotes, limpe o cache com `npx expo start -c`.

### Variáveis de ambiente

| Variável | Descrição | Padrão |
|---|---|---|
| `EXPO_PUBLIC_AUTH_API_URL` | URL da API de login e cadastro | `https://login-p26w.onrender.com/fatec/login` |

### Scripts

| Comando | O que faz |
|---|---|
| `npm start` | Inicia o servidor de desenvolvimento |
| `npm run android` | Inicia e abre no Android |
| `npm run web` | Inicia e abre no navegador |
| `npx tsc --noEmit` | Confere os tipos do TypeScript |

## 📱 Android x Web

| | Android (Expo Go) | Web |
|---|:---:|:---:|
| Login e cadastro | ✅ | ✅ |
| Gravar rotas com GPS | ✅ | — |
| Minhas rotas | ✅ | — |
| Trocas de prêmios | ✅ | ✅ |
| Perfil | ✅ | ✅ |
| Navegação | Barra inferior | Cabeçalho com menu |
| Foto de perfil | Câmera ou galeria | Webcam ou arquivo |

Na web, a tela de perfil mostra **trajetos de exemplo** quando ainda não há rotas, apenas para demonstrar os mapas.

## 🗂️ Estrutura do projeto

```text
src/
├── @types/          # Tipos (rotas, produtos, trocas)
├── app/             # Telas (Expo Router)
│   ├── (auth)/      #   login e cadastro
│   └── (app)/       #   área logada: rotas, gravar, trocas, perfil
├── components/      # Componentes reutilizáveis (botões, cartões, mapa, ícones...)
├── constants/       # Cores, raios e sombras do tema
├── context/         # Estado global (Auth, Routes, Rewards)
├── data/            # Catálogo de produtos e rotas de exemplo
├── integration/     # Chamadas HTTP à API de login
├── services/        # GPS, armazenamento local e exportação de arquivos
└── utils/           # Distância, avisos e confirmações
```

### Como as peças se conectam

- **`AuthContext`** guarda só `userId` e `username` em memória. O token fica num cookie HttpOnly, gerenciado pelo sistema.
- **`RoutesContext`** faz o CRUD das rotas de cada usuário.
- **`RewardsContext`** calcula o saldo: pontos ganhos pelas rotas menos os pontos já trocados.
- **`directoryExport`** tem uma versão para cada plataforma (`.native.ts` e `.web.ts`), e o Metro escolhe a certa sozinho.

## 🎨 Identidade visual

O visual segue as cores do logo, em tons de roxo, magenta e laranja.

| Cor | Hex | Uso |
|---|---|---|
| 🟣 Roxo escuro | `#51166A` | Títulos, cartões de destaque |
| 🟣 Violeta | `#7623A6` | Ícones e itens ativos |
| 🟣 Magenta | `#BD2693` | Detalhes decorativos |
| 🟠 Laranja | `#FFA31A` | Botões principais e destaques |
| ⚪ Lavanda | `#F7F3FA` | Fundo geral |

## 🔒 Permissões

| Permissão | Para que serve |
|---|---|
| Localização | Registrar o percurso da rota |
| Câmera | Tirar a foto de perfil |
| Fotos | Escolher a foto de perfil |
| Pasta (Android) | Gravar os arquivos das rotas na pasta que você escolher |

## 🛣️ Ideias para o futuro

- [ ] Sincronizar rotas e pontos com um servidor
- [ ] Gravar rotas também pela versão web
- [ ] Ranking e metas semanais
- [ ] Tema escuro

---

<div align="center">

Feito com 💜 para incentivar quem quer **se mover mais**.

</div>