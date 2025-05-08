# 🎌 Animes FullStack

Um aplicativo web desenvolvido com React e Redux que permite buscar, visualizar e explorar animes utilizando a API pública do [Kitsu](https://kitsu.docs.apiary.io/).

## 🔍 Funcionalidades

- 🔎 Busca por nome de animes com sugestões automáticas.
- 📂 Filtro por categorias.
- 📄 Exibição de informações detalhadas sobre o anime selecionado.
- 🧠 Histórico de buscas armazenado localmente.
- 🎨 Interface moderna utilizando Material UI (MUI).
- 📱 Responsivo e com ótima usabilidade.

## 🛠️ Tecnologias Utilizadas

- **React** + **Redux Toolkit**
- **Material UI (MUI)**
- **Kitsu API**
- **LocalStorage** para histórico de busca

## 📦 Instalação

1. Clone o repositório:
   git clone https://github.com/seu-usuario/animes-fullstack.git
   cd animes-fullstack

2. Instale as dependências:

    npm install

3. Inicie o projeto:

        npm run dev

        Certifique-se de ter o Node.js instalado em sua máquina.

📁 Estrutura de Pastas

src/
├── components/
│   ├── CardAnime.jsx
│   ├── FormularioBusca.jsx
│   └── ListaAnimes.jsx
├── contexts/
│   ├── sliceBusca.js
│   └── store.js
├── App.jsx
├── main.jsx

💡 Como funciona?

    O componente FormularioBusca lida com a busca e sugestões.

    O CardAnime exibe os animes encontrados ou detalhes.

    O ListaAnimes lista os resultados ou exibe um anime selecionado.

    O estado global é gerenciado com Redux Toolkit (sliceBusca.js).

📄 Licença

Este projeto está sob a licença MIT.