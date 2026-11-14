<div align="center">
  <img src="./src/Assets/cats.svg" width="160" alt="Logo do Cats" />
  <p><strong>Rede social para quem gosta de gatos e quer compartilhar seus felinos</strong></p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React 19" />
  <img src="https://img.shields.io/badge/Vite_8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite 8" />
  <img src="https://img.shields.io/badge/PWA-5A0FC8?style=for-the-badge&logo=pwa&logoColor=white" alt="PWA" />
  <img src="https://img.shields.io/badge/Socket.io-010101?style=for-the-badge&logo=socket.io&logoColor=white" alt="Socket.io" />
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
</div>

## Sobre o projeto

O **Cats** é o frontend de uma rede social voltada a amantes de gatos. A aplicação começou como projeto de conclusão do curso React Completo, da Origamid, e evoluiu para uma experiência integrada a uma API WordPress headless e a um servidor de chat em tempo real.

Além do feed de fotos, o frontend oferece conversas públicas e privadas, interações sociais, estatísticas, detecção de gatos no navegador e instalação como PWA.

## Demonstração

https://github.com/Skitttz/Cats/assets/94083688/bcd0c656-1773-4e9c-9add-68d0176c3b36

## Funcionalidades atuais

### Conta e perfil

- Cadastro, login e sessão autenticada com JWT
- Login separado do nome de exibição público
- Onboarding obrigatório para completar contas antigas
- Recuperação de senha por e-mail
- Rotas protegidas para a área da conta

### Feed e publicações

- Feed responsivo com carregamento infinito
- Publicação de imagens JPEG e PNG com pré-visualização
- Detecção de gatos no navegador com COCO-SSD e TensorFlow.js
- Comentários, curtidas, contagem de visualizações e exclusão pelo autor
- Dashboard com resumo, ranking e gráfico de acessos das publicações

### Chat em tempo real

- Sala principal e conversas privadas
- Presença de usuários, reconexão automática e indicador de digitação
- Histórico paginado e contador de mensagens não lidas
- Envio otimista de texto, emojis e imagens JPEG, PNG ou WebP de até 5 MB
- Reações rápidas persistidas e sincronizadas em tempo real
- Notificações do navegador para mensagens privadas quando a aba está oculta

### PWA

- Manifesto e ícones para instalação no desktop ou celular
- Cache da estrutura estática para abertura offline
- Requisições autenticadas e do Socket.io sempre passam pela rede
- Banner para o usuário aceitar uma nova versão do service worker

> As notificações atuais dependem da página aberta e do socket conectado. Receber mensagens com o navegador fechado exigiria Web Push, que não faz parte desta implementação.

## Tecnologias

- **React 19**
- **Vite 8**
- **Socket.io**
- **TensorFlow.js e COCO-SSD**
- **TanStack Query**
- **Vite PWA**

## Pré-requisitos

- Node.js 22.12 ou superior (a CI usa Node.js 22)
- npm
- API WordPress do Cats em execução
- Servidor Socket.io do Cats em execução para usar o chat

## Configuração local

1. Instale as dependências na raiz do projeto:

   ```bash
   npm ci
   ```

2. Crie o arquivo `.env`:

   ```env
   VITE_BASE_API_URL=http://localhost:8080/json
   VITE_APP_URL=http://localhost:3001
   ```

   | Variável            | Finalidade                                            |
   | ------------------- | ----------------------------------------------------- |
   | `VITE_BASE_API_URL` | URL-base da API REST e dos endpoints JWT do WordPress |
   | `VITE_APP_URL`      | Origem do servidor Socket.io usado pelo chat          |

   As duas variáveis são obrigatórias, devem ser URLs válidas e, em produção, devem usar HTTPS. Ajuste portas e caminhos ao ambiente em que o backend estiver rodando.

3. Inicie o servidor de desenvolvimento:

   ```bash
   npm run dev
   ```

O Vite escuta em todas as interfaces de rede porque o script usa `--host`. A URL exata é exibida no terminal.

## Scripts

| Comando           | Descrição                                                |
| ----------------- | -------------------------------------------------------- |
| `npm run dev`     | Inicia o Vite em modo de desenvolvimento                 |
| `npm run build`   | Valida o ambiente e gera a versão de produção em `dist/` |
| `npm run preview` | Serve localmente o conteúdo gerado pelo build            |
| `npm run lint`    | Executa o ESLint em arquivos JavaScript e JSX            |

O service worker não é ativado por `npm run dev`. Para validar instalação, cache offline, atualização da PWA e notificações, use:

```bash
npm run build
npm run preview
```

Notificações do navegador exigem um contexto seguro. `localhost` é aceito no desenvolvimento; outros hosts devem usar HTTPS.

## Docker

O build é feito antes da imagem Docker (na CI ou localmente). O `Dockerfile`
copia `dist/` e publica os arquivos estáticos com Nginx. Como as variáveis do
Vite são incorporadas durante o build, prepare o `.env` e gere `dist/` primeiro:

```bash
npm run build
docker build -t cats-frontend .
docker run --rm -p 8080:80 cats-frontend
```

Em um deploy com rotas acessadas diretamente, configure o proxy Nginx para redirecionar o fallback da SPA para `index.html`.

## Estrutura

```text
.
├── config/                  # Validação das variáveis de ambiente
├── public/                  # Favicon e ícones da PWA
├── src/
│   ├── Api/                 # Contratos de acesso à API REST
│   ├── Assets/              # Imagens e SVGs
│   ├── Components/
│   │   ├── Detector/        # Detecção de gatos com TensorFlow.js
│   │   ├── Feed/            # Feed e modal de fotos
│   │   ├── Forms/           # Campos e botões reutilizáveis
│   │   ├── Helper/          # Loading, erros, metadados e rotas protegidas
│   │   ├── Login/           # Autenticação e recuperação de senha
│   │   ├── Photo/           # Foto, comentários e curtidas
│   │   └── User/            # Conta, publicação, estatísticas e chat
│   ├── Hooks/               # Hooks compartilhados
│   ├── Utils/               # Autenticação, datas e navegação
│   ├── App.jsx              # Providers e rotas principais
│   ├── ChatNotificationsContext.jsx
│   └── UserContext.jsx
├── Dockerfile
├── package.json
└── vite.config.js
```

Partes mais pesadas, como chat, gráficos e detector, são carregadas sob demanda.
O service worker mantém os endpoints autenticados fora do cache. A mídia privada
do chat usa Bearer e URLs de blob com limpeza ao sair; não é persistida no cache
da PWA. A ativação da nova versão remove o antigo cache `cats-chat-images`.

## Validação

Antes de enviar mudanças, execute:

```bash
npm test
npm run lint
npm run build
```

Os testes Node cobrem contratos HTTP, cache por conta, exclusão, mídia privada,
detector e scroll de diálogos. Não substituem testes completos com WordPress.

## Dependências e segurança

A atualização inclui React 19.3, Vite 8, plugin React 6, PWA 2, Victory 38,
Emoji Picker 5, Lucide 1 e tipos React 19. O lint usa configuração flat; ESLint
permanece em 9.39 por compatibilidade com o peer declarado de `eslint-plugin-react`.
O build usa Rolldown/Oxc conforme Vite 8.

O override de `glob` em `workbox-build` usa a versão corrigida 14.0.6 ou superior;
a API síncrona usada pelo Workbox e a geração do precache foram verificadas.
Não use `npm audit fix --force` para trocar essas versões automaticamente.

Na auditoria desta atualização, os 14 alertas iniciais caíram para quatro baixos,
todos na cadeia de build `vite-plugin-pwa → workbox-build → plugin-node-resolve
→ deepmerge`. Eles representam uma única causa, [GHSA-gcqx-w48m-w2h4](https://github.com/advisories/GHSA-gcqx-w48m-w2h4),
sem versão corrigida publicada de `deepmerge` na consulta. Não há alertas nas
dependências de produção (`npm audit --omit=dev`); os alertas de build continuam
visíveis em `npm audit`. O consumidor inspecionado mescla defaults internos,
não dados recebidos da API. Reavalie quando os mantenedores publicarem correção.

## Design

[Acesse o Design System no Figma](https://www.figma.com/file/W3Ms5OmiEDYSquoKonZ55h/Cats?type=design&node-id=0%3A1&mode=design&t=A2WmgYHU4V3n9mRr-1).
