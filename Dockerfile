# Змінюємо на 20-alpine, щоб відповідати вимогам твоїх пакетів (Noble/Kysely)
FROM node:20-alpine as builder

WORKDIR /app

# Копіюємо файли залежностей та конфіг SvelteKit ОДРАЗУ
# Це закриє помилку "Missing Svelte config file"
COPY package*.json ./
COPY svelte.config.js ./
COPY prisma ./prisma/

# Встановлюємо залежності.
# Додаємо --ignore-scripts, щоб npm ci не намагався робити sync без сирців
RUN apk add --no-cache openssl libc6-compat libssl1.1 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/main
RUN npm ci --ignore-scripts

# Тепер копіюємо все інше
COPY . .

# Тепер, коли всі файли на місці, генеруємо клієнт та білдимо
RUN npx prisma generate
RUN npm run build

# Stage для запуску
FROM node:20-alpine as runner
RUN apk add --no-cache openssl libssl1.1 --repository=http://dl-cdn.alpinelinux.org/alpine/v3.16/main
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 sveltekit

# Копіюємо результат білду (adapter-node створить тут index.js)
COPY --from=builder --chown=sveltekit:nodejs /app/build build/
COPY --from=builder --chown=sveltekit:nodejs /app/node_modules node_modules/
COPY --from=builder --chown=sveltekit:nodejs /app/package.json package.json
COPY --from=builder --chown=sveltekit:nodejs /app/prisma prisma/

USER sveltekit
EXPOSE 3000

ENV NODE_ENV=production
ENV PORT=3000

# adapter-node за замовчуванням запускається через index.js у папці build
CMD ["node", "build/index.js"]