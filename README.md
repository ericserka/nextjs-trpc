# Aplicação fullstack Next.js + tRPC

## Como foi construída

1. Cria um app Next: `npx create-next-app@latest nextjs-trpc --ts`
2. Instala as dependências: `yarn add @trpc/client @trpc/server @trpc/react @trpc/next zod react-query superjson jotai @prisma/client react-hook-form jsonwebtoken cookie nodemailer && yarn add @types/jsonwebtoken @types/cookie @types/nodemailer lint-staged prettier tailwindcss postcss autoprefixer -D`
3. Adiciona o husky (): `npx husky-init && yarn`
4. Cria arquivo de configuração do Prettier: `echo {}> .prettierrc.json`. É interessante ter a extensão do Prettier instalada no Visual Studio Code. Para checar as opções de configuração do Prettier, consultar [Options Prettier](https://prettier.io/docs/en/options.html)
5. Inicializa o tailwindcss: `npx tailwindcss init -p`. Preencha o content do `tailwind.config.js` com os caminhos dos arquivos tsx e adicione `@tailwind base; @tailwind components; @tailwind utilities;` no `globals.css`. Fonte: [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)

## Notas

### Husky

O husky atua muito bem em conjunto com o lint-staged. Ele ativa os git hooks enquanto que o lint-staged executa linters nos arquivos git 'staged'. Dessa forma, é possível executar o linter em todos os arquivos modificados antes de um commit ser realizado de fato, não deixando assim que entre código despadronizado no repositório. Enquanto o linter apontar erros, não será possível realizar o commit e nem tão pouco o push.
