# Fullstack application using Next.js and tRPC.

## How was it built

1. Create an app next: `npx create-next-app@latest nextjs-trpc --ts`
2. Install the dependencies: `yarn add @trpc/client @trpc/server @trpc/react @trpc/next zod react-query superjson jotai @prisma/client react-hook-form @hookform/resolvers jsonwebtoken cookie nodemailer @fortawesome/fontawesome-svg-core @fortawesome/free-solid-svg-icons @fortawesome/react-fontawesome && yarn add @types/jsonwebtoken @types/cookie @types/nodemailer lint-staged prettier tailwindcss postcss autoprefixer -D`
3. Add [husky](#husky): `npx husky-init && yarn`
4. Create Prettier configuration file: `echo {}> .prettierrc.json`. It is interesting to have the Prettier extension installed in Visual Studio Code. To check Prettier configuration options, see [Options Prettier](https://prettier.io/docs/en/options.html)
5. Initializes Tailwind CSS: `npx tailwindcss init -p`. Fill the `tailwind.config.js` content with the paths of the tsx files and add `@tailwind base; @tailwind components; @tailwind utilities;` in `globals.css`. For more information, consult: [Install Tailwind CSS with Next.js](https://tailwindcss.com/docs/guides/nextjs)
6. Initializes Prisma: `npx prisma init`
7. Running start migration from Prisma: `npx prisma migrate dev --name init`

## Notes

### Husky

The husky works very well together with the lint-staged. It activates git hooks while lint-staged runs linters on the 'staged' git files. In this way, it is possible to run linter on all modified files before a commit is actually carried out, thus preventing nonstandard code from entering the repository. As long as the linter points out errors, it will not be possible to commit or push.
