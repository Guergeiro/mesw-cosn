FROM node:16
RUN npm install --global pnpm
WORKDIR /usr/src/app
COPY . .
RUN pnpm install
CMD ["pnpm", "start"]