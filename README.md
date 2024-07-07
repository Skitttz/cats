<h1 align="center">
  <div align="center" >
  <img src="https://i.ibb.co/KyVmV01/cats.png" width="20%" />
</div>
</h1>

<p align="center">
  <a href="#contexto-">Contexto</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#tecnologias-%EF%B8%8F">Tecnologias</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#desafios-">Desafios</a>&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;&nbsp;
  <a href="#passos-para-testar-">Testar localmente</a>&nbsp;&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;
  <a href="#design-">Como acessar</a>&nbsp;&nbsp;&nbsp;&nbsp;┋&nbsp;&nbsp;
  <a href="#design-">Design</a>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

</p>

<h3 align="center">Demo Video</h3>


https://github.com/Skitttz/Cats/assets/94083688/bcd0c656-1773-4e9c-9add-68d0176c3b36
> **Nota:**
> Foram feitos cortes no vídeo para torná-lo mais conciso, resultando em um vídeo mais curto.

## Contexto 📝

Uma plataforma dedicada aos entusiastas de gatos e seus fiéis felinos. O objetivo principal do projeto "Cats" é cultivar uma comunidade online vibrante, onde os amantes de gatos possam se conectar, compartilhar suas experiências, trocar dicas sobre o cuidado com esses adoráveis animais de estimação e mostrar seus carismáticos felinos.

Este projeto nasceu como parte do curso de conclusão do "React Completo" da Origamid, mas não se limitou às instruções do curso. Elevando a experiência a novos desafios, foram incorporados elementos adicionais, como uma inteligência artificial para detectar gatos em imagens, um chat em tempo real para interações instantâneas e até mesmo a funcionalidade de "curtir" fotos, entre outras melhorias.

## Tecnologias 🖥️

As tecnologias utilizadas na plataforma foram diversas e abrangem diferentes aspectos do desenvolvimento. Aqui está uma descrição mais detalhada de como essas tecnologias são aplicadas no projeto:

- <p> <b>⁍ React JS</b> usado para desenvolver a interface do Cats criando componentes interativos e dinâmicos que exibem perfis dos usuarios, feeds com as fotos e outras partes da interface do usuário.;</p>

- <p> <b>⁍ Headless CMS WordPress</b> utilizado como o backend do projeto ele lida com o armazenamento e gerenciamento de conteúdo, como informações do perfil do usuario, postagens de feed e mensagens do chat entre outras coisas; </p>
- <p><b>⁍ TensorFlow com COCO-SSD</b>, uma biblioteca de aprendizado de máquina e COCO-SSD é um modelo de detecção de objetos. Neste projeto, eles são usados para a detecção de gatos em fotos enviadas pelos usuários. Isso permite que o sistema identifique automaticamente a presença de gatos em imagens compartilhadas evitando que os usuarios postem fotos que fujam o proposito da plataforma;</p>

- <p><b>⁍ Node.js</b> e <b>Socket.io</b>, o Node.js permite a execução de códigos JavaScript fora de um navegador web, já o Socket.io é uma biblioteca que permite a criação de comunicação em tempo real entre o servidor e o cliente. Pode ser usado para implementar chats, permitindo que os usuários conversem uns com os outros de forma instantânea.</p>

## Desafios 🎯

Desenvolver um projeto pode ser empolgante, mas também apresenta desafios. Aqui está um resumo de alguns desafios que foram impostos para executar esse projeto:

- [x] Estruturar a criação de componentes de menor escala no ambiente React;
- [x] Desenvolver uma interface dinâmica que se adapte de acordo com o status de login do usuário.
- [x] Implementar um feed com rolagem infinita para uma experiência de usuário contínua;
- [x] Desenvolver funcionalidades que permitam ao usuário dar "like", enviar, remover e salvar curtidas, bem como efetuar o devido registro e contagem dessas interações;
- [x] Estabelecer um sistema para armazenar mensagens de chat e atualizar em tempo real a lista de usuários ativos no mesmo.


## Passos para Testar 🧪

> Confira o passo-a-passo para testar o projeto localmente.

1. <b>Instale o Software Necessário: </b>

   - Chamado [LocalWP](https://localwp.com/), fazendo com que consiga utilizar a API localmente.

2. <b>Clone o Repositório "cats-api":</b>

   - Utilize o Git para clonar o repositório ["cats-local"](https://github.com/Skitttz/cats-local) em seu ambiente de desenvolvimento local **será utilizado em formato zip**;

3. <b>Configuração no Local WP:</b>

   - Abra o Local WP e escolha a opção que afirma que você já possui um site.
     Selecione a pasta clonada do repositório "cats-local" como o local para o seu site, ao aparecer a tela de colocar o nome do site clique em Advanced Options
     e troque o nome do dominio para "catsapi.test";

4. <b>Baixe o repositório:</b>

   - O qual você está atualmente visualizando (o repositório do projeto Cats) para o seu computador.

5. <b>Instale Dependências:</b>

   - Abra um terminal na pasta do projeto Cats (o repositório que você baixou neste passo). Execute o comando `npm install` para instalar todas as dependências do projeto.

6. <b>Inicie o Projeto:</b>

   - Após a conclusão da instalação das dependências, execute o comando `npm run dev` em um terminal e inicie um segundo terminal para iniciar o comando `node server.cjs`;

7. <b>Configurarando middleware:</b>

   - Vá no arquivo `server.cjs` e insira o endereço fornecido pelo comando npm run dev na propriedade origin.

   ```javascript
   // Por padrão o origin sera http://localhost:5174
   // Entretando pode ser fornecido uma URL com outras portas apos o comando
   // ex: http://localhost:5172, http://localhost:5173 ...
   // Altere o origin no cors caso seja preciso.
   cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    }
   ```

8. <b>Para finalizar: </b>
   - Para acessar o projeto, acesse "localhost" fornecido pelo `npm run dev` em seu navegador, a conta padrão é `login/senha: "cat"` 😸.
  

## Como acessar 🚪🚶

O projeto está hospedado na DigitalOcean. Para acessar o projeto, basta clicar no seguinte link: [Cats](https://app.smallcats.live/)

## Design 🎨

A parte do planejamento estético da plataforma, incluindo a definição das paletas de cores, tipografia e a apresentação de duas versões da logomarca. Foi criado um guia de estilo do projeto dentro do software Figma. Para acessá-lo, clique no link:
<a href="https://www.figma.com/file/W3Ms5OmiEDYSquoKonZ55h/Cats?type=design&node-id=0%3A1&mode=design&t=A2WmgYHU4V3n9mRr-1">Figma</a>
