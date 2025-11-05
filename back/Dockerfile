# ================================
# STAGE 1: Build (Construcción)
# ================================
FROM node:20-alpine AS builder

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala las dependencias (incluidas las de desarrollo para compilar)
RUN npm ci

# Copia el resto del código fuente
COPY . .

# Compila la aplicación TypeScript a JavaScript
RUN npm run build

# ================================
# STAGE 2: Production (Producción)
# ================================
FROM node:20-alpine AS production

# Instala dumb-init para manejar señales correctamente
RUN apk add --no-cache dumb-init

# Crea un usuario no-root para ejecutar la app (seguridad)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nestjs -u 1001

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos de dependencias
COPY package*.json ./

# Instala solo las dependencias de producción
RUN npm ci --only=production && \
    npm cache clean --force

# Copia los archivos compilados desde el stage builder
COPY --from=builder /app/dist ./dist

# Copia archivos necesarios para producción
COPY --from=builder /app/src/config ./src/config
COPY --from=builder /app/src/migrations ./src/migrations
COPY --from=builder /app/utils ./utils

# Cambia la propiedad de los archivos al usuario nestjs
RUN chown -R nestjs:nodejs /app

# Cambia al usuario no-root
USER nestjs

# Expone el puerto de la aplicación
EXPOSE 3000

# Usa dumb-init para ejecutar la aplicación
ENTRYPOINT ["dumb-init", "--"]

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]
