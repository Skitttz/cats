<div align="center">
  <img src="https://i.ibb.co/KyVmV01/cats.png" width="20%" />
  <p align="center">
  <strong>Uma plataforma social dedicada aos amantes de gatos e seus adoráveis felinos</strong>
  </p>
</div>

<div align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Socket.io-black?style=for-the-badge&logo=socket.io&badgeColor=010101" alt="Socket.io" />
  <img src="https://img.shields.io/badge/WordPress-21759B?style=for-the-badge&logo=wordpress&logoColor=white" alt="WordPress" />
  <img src="https://img.shields.io/badge/TensorFlow-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow" />
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
</div>


## 🐾 Sobre o Projeto

O **Cats** é uma rede social criada especificamente para entusiastas de gatos. A plataforma permite que usuários se conectem, compartilhem fotos dos seus felinos, troquem experiências e participem de conversas em tempo real através de um chat integrado.

Este projeto foi inicialmente desenvolvido como trabalho de conclusão do curso "React Completo" da Origamid, mas evoluiu muito além do escopo original, incorporando funcionalidades avançadas como:

- 🤖 **Detecção de gatos** em imagens usando TensorFlow
- 💬 **Chat em tempo real** com WebSockets
- ❤️ **Sistema de curtidas** e interações sociais
- 📱 **Interface responsiva** e moderna

## 🖼️ Demonstração

https://github.com/Skitttz/Cats/assets/94083688/bcd0c656-1773-4e9c-9add-68d0176c3b36

> **Nota:** Foram feitos cortes no vídeo para torná-lo mais conciso.

## ✨ Funcionalidades

### 🔐 Autenticação
- Login e cadastro de usuários
- Gerenciamento de sessão
- Perfis personalizados

### 📸 Feed Social
- Upload de fotos com detecção automática de gatos
- Sistema de curtidas e comentários
- Rolagem infinita (infinite scroll)
- Visualização de estatísticas das postagens

### 💬 Chat em Tempo Real
- Mensagens instantâneas entre usuários
- Lista de usuários online
- Histórico de conversas

## 🛠️ Tecnologias

### Frontend
- **React.js** - Biblioteca para construção da interface
- **JavaScript (ES6+)** - Linguagem principal
- **CSS3** - Estilização e layouts responsivos
- **Vite** - Build tool e servidor de desenvolvimento

### Backend & APIs
- **WordPress Headless** - CMS para gerenciamento de conteúdo
- **Node.js** - Runtime JavaScript para o servidor
- **Socket.io** - Comunicação em tempo real (WebSockets)

### Machine Learning
- **TensorFlow.js** - Framework de machine learning
- **COCO-SSD** - Modelo de detecção de objetos

### DevOps
- **GitHub Actions** - CI/CD para automação de testes e deploy
- **Docker** - Utilizado para deploy do frontend em container

## ⚙️ CI/CD & Deploy

O projeto utiliza **GitHub Actions** para automação de processos de desenvolvimento:  

- **Continuous Integration (CI):**
  - Verificação de build
  - Linting e análise de qualidade de código
  - Validação de dependências  

- **Continuous Deployment (CD):**
  - Deploy automatizado em container (via Docker)
  - Preview de deploys em Pull Requests
  - Notificações de status de deploy  

## 📁 Estrutura do Projeto

```
cats/
├── src/
│ ├── Components/ # Componentes React reutilizáveis
│ ├── Hooks/ # Hooks customizados
│ ├── Api/ # APIs e serviços externos
│ ├── Utils/ # Funções utilitárias
│ └── Assets/ # Imagens, ícones e recursos estáticos
└── package.json # Configurações e dependências
```


## 🎯 Desafios Técnicos

Durante o desenvolvimento, foram superados diversos desafios técnicos:

- **Arquitetura de Componentes:** Criação de uma estrutura modular e reutilizável
- **Estado Global:** Gerenciamento eficiente do estado da aplicação
- **Performance:** Implementação de infinite scroll otimizado
- **Real-time:** Integração complexa entre WebSockets e React
- **Object Detection Model:** Incorporação do TensorFlow para detecção de objetos
- **Responsividade:** Interface adaptativa para diferentes dispositivos

## 🎨 Design

O projeto conta com um design system completo desenvolvido no Figma, incluindo:

- **Paleta de cores** cuidadosamente escolhida
- **Tipografia** moderna e legível
- **Duas versões** da logomarca

**🔗 [Acesse o Design System no Figma](https://www.figma.com/file/W3Ms5OmiEDYSquoKonZ55h/Cats?type=design&node-id=0%3A1&mode=design&t=A2WmgYHU4V3n9mRr-1)**


