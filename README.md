# 📱 FIAP — React Native (Expo)

## Aula: Login + Navegação + CRUD de Produtos

Aplicação mobile desenvolvida em aula na FIAP com **React Native + Expo**, integrando autenticação e banco de dados via **Firebase**.

---

## 🧱 Tecnologias utilizadas

- React Native
- Expo (SDK 54)
- React Navigation (Stack)
- Firebase Authentication
- Firebase Realtime Database

---

## 📁 Estrutura do projeto

```
fiap-auth-app/
├── App.js
├── index.js
├── app.json
├── src/
│   ├── firebase/
│   │   ├── config.js          # Configuração do Firebase
│   │   ├── authService.js     # Funções de autenticação
│   │   └── productService.js  # Funções de CRUD de produtos
│   ├── navigation/
│   │   └── AppNavigator.js    # Configuração de rotas
│   └── screens/
│       ├── LoginScreen.js
│       ├── RegisterScreen.js
│       ├── ForgotPasswordScreen.js
│       ├── HomeScreen.js
│       └── BarcodeScannerScreen.js
```

---

## 🚀 Como rodar o projeto

### Pré-requisitos

Antes de começar, certifique-se de ter instalado na sua máquina:

- [Node.js](https://nodejs.org) (versão 18 ou superior)
- npm (já vem com o Node.js)

Para verificar se estão instalados, rode no terminal:

```bash
node -v
npm -v
```

---

### 1. Clonar o repositório

```bash
git clone https://github.com/Chel2815/Checkpoint1-Mobile
```

### 2. Entrar na pasta do projeto

```bash
cd fiap-auth-app
```

### 3. Instalar as dependências

```bash
npm install
```

### 4. Configurar o Firebase

Abra o arquivo `src/firebase/config.js` e preencha com as credenciais do seu projeto Firebase:

```js
const firebaseConfig = {
  apiKey: 'SUA_API_KEY',
  authDomain: 'SEU_AUTH_DOMAIN',
  projectId: 'SEU_PROJECT_ID',
  databaseURL: 'SUA_DATABASE_URL',
  storageBucket: 'SEU_STORAGE_BUCKET',
  messagingSenderId: 'SEU_MESSAGING_SENDER_ID',
  appId: 'SEU_APP_ID',
};
```

> Como obter essas credenciais: acesse [console.firebase.google.com](https://console.firebase.google.com), crie um projeto, registre um app Web e copie o objeto `firebaseConfig` gerado.

Além disso, ative os seguintes serviços no console do Firebase:
- **Authentication → E-mail/senha**
- **Realtime Database** (em modo de teste para desenvolvimento)

### 5. Rodar o projeto

```bash
npx expo start
```

---

## 🖥️ Abrindo o app

Após rodar `npx expo start`, você verá as opções no terminal:

| Tecla | Ação |
|-------|------|
| `w` | Abre no navegador (Web) |
| `a` | Abre no emulador Android |
| `i` | Abre no simulador iOS |
| `r` | Recarrega o app |
| `m` | Abre o menu do Expo |

> Para rodar no celular físico, instale o app **Expo Go** (Android ou iOS) e escaneie o QR code que aparece no terminal.

---

## 🧭 Fluxo de navegação

```
Login
├── → Home (após login)
├── → Cadastro
└── → Esqueci minha senha

Cadastro → Voltar para Login
Esqueci senha → Voltar para Login
Home
├── → Leitor de código de barras
└── → Login (Sair)
```

---

## 📸 Telas do app

- **Login** — autenticação com email e senha
- **Cadastro** — criação de conta com confirmação de senha
- **Recuperação de senha** — envio de email de redefinição
- **Home** — CRUD completo de produtos com leitor de código de barras

---

## 🛠️ Problemas comuns

### Tela branca ao abrir na web

Verifique o console do navegador (F12 → Console). As causas mais comuns são:

- Credenciais do Firebase não configuradas no `config.js`
- Caminhos de import incorretos nas telas

### Erro: `Unable to resolve "../services/authService"`

Os arquivos de serviço estão em `src/firebase/`, não em `src/services/`. Certifique-se de que os imports nas telas usam o caminho correto:

```js
import { loginUser } from '../firebase/authService';
```

### Erro: `expected dynamic type 'boolean', but had type 'string'`

Fixe a versão do `react-native-screens`:

```bash
npm install react-native-screens@4.16.0 --save-exact
```

### Teclado cobrindo os campos (celular)

O projeto já usa `KeyboardAvoidingView` em todas as telas. Caso ainda ocorra, certifique-se de que o `behavior` está correto para o seu sistema:

- **iOS:** `behavior="padding"`
- **Android:** `behavior="height"`

---
