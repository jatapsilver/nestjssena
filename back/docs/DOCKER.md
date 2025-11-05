# 🐳 Guía de Dockerización - NestJS E-commerce

Esta guía te enseñará cómo dockerizar tu aplicación NestJS con PostgreSQL paso a paso.

## 📋 Tabla de Contenidos

1. [¿Qué es Docker?](#qué-es-docker)
2. [Requisitos Previos](#requisitos-previos)
3. [Archivos de Docker](#archivos-de-docker)
4. [Configuración](#configuración)
5. [Comandos Básicos](#comandos-básicos)
6. [Desarrollo vs Producción](#desarrollo-vs-producción)
7. [Troubleshooting](#troubleshooting)
8. [Mejores Prácticas](#mejores-prácticas)

---

## 🤔 ¿Qué es Docker?

**Docker** es una plataforma que permite empaquetar tu aplicación y todas sus dependencias en un "contenedor" que puede ejecutarse en cualquier lugar de manera consistente.

### Conceptos Clave:

- **Imagen**: Plantilla de solo lectura con las instrucciones para crear un contenedor
- **Contenedor**: Instancia ejecutable de una imagen
- **Dockerfile**: Archivo con instrucciones para construir una imagen
- **Docker Compose**: Herramienta para definir y ejecutar aplicaciones multi-contenedor
- **Volumen**: Almacenamiento persistente para los datos

### Ventajas:

✅ **Portabilidad**: "Funciona en mi máquina" → "Funciona en todas las máquinas"  
✅ **Aislamiento**: Cada contenedor es independiente  
✅ **Consistencia**: Mismo entorno en desarrollo, staging y producción  
✅ **Escalabilidad**: Fácil de escalar horizontalmente  
✅ **Versionado**: Control de versiones de todo el entorno

---

## 📦 Requisitos Previos

Antes de empezar, necesitas instalar:

### 1. Docker Desktop

**Windows/Mac:**

```bash
# Descarga desde: https://www.docker.com/products/docker-desktop
```

**Linux:**

```bash
# Ubuntu/Debian
sudo apt-get update
sudo apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin

# Fedora
sudo dnf install docker docker-compose-plugin
```

### 2. Verificar Instalación

```bash
# Verificar Docker
docker --version
# Salida esperada: Docker version 24.x.x

# Verificar Docker Compose
docker-compose --version
# Salida esperada: Docker Compose version v2.x.x
```

---

## 📁 Archivos de Docker

### Estructura de Archivos

```
back/
├── .dockerignore              # Archivos a ignorar al construir la imagen
├── Dockerfile                 # Imagen de producción (optimizada)
├── Dockerfile.dev             # Imagen de desarrollo (con hot-reload)
├── docker-compose.yml         # Configuración multi-contenedor (producción)
├── docker-compose.dev.yml     # Configuración para desarrollo
├── .env.docker                # Variables de entorno para Docker
└── docker/
    └── init-db.sql           # Script de inicialización de PostgreSQL
```

### 1. `.dockerignore`

Indica qué archivos/carpetas NO copiar al contenedor:

```
node_modules
npm-debug.log
.git
.env.local
coverage
*.spec.ts
test
dist
```

**¿Por qué?**

- Reduce el tamaño de la imagen
- Evita copiar archivos innecesarios
- Mejora la velocidad de construcción

### 2. `Dockerfile` (Producción)

Construcción en **2 etapas (multi-stage)**:

```dockerfile
# STAGE 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# STAGE 2: Production
FROM node:20-alpine AS production
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
CMD ["node", "dist/main"]
```

**Ventajas del multi-stage:**

- Imagen final más pequeña (solo producción)
- No incluye dependencias de desarrollo
- Más seguro y rápido

### 3. `Dockerfile.dev` (Desarrollo)

Para desarrollo con **hot-reload**:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]
```

### 4. `docker-compose.yml`

Orquesta múltiples contenedores:

```yaml
services:
  postgres: # Base de datos
  app: # Aplicación NestJS
  pgadmin: # Admin de BD (opcional)
```

---

## ⚙️ Configuración

### Paso 1: Copiar Variables de Entorno

```bash
# Copia el archivo de ejemplo
cp .env.docker .env

# O créalo manualmente
touch .env
```

### Paso 2: Editar `.env`

```bash
# Abre el archivo
nano .env

# O con VS Code
code .env
```

### Paso 3: Configurar Variables

```env
# Base de Datos
DB_HOST=postgres              # Nombre del servicio en docker-compose
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres123       # ⚠️ Cambiar en producción
DB_NAME=ecommerce_db

# Aplicación
NODE_ENV=production
APP_PORT=3000

# JWT
JWT_SECRET=your-secret-key    # ⚠️ Cambiar en producción

# pgAdmin
PGADMIN_EMAIL=admin@admin.com
PGADMIN_PASSWORD=admin123
PGADMIN_PORT=5050
```

---

## 🚀 Comandos Básicos

### Desarrollo (con hot-reload)

```bash
# 1. Construir las imágenes
docker-compose -f docker-compose.dev.yml build

# 2. Iniciar los contenedores
docker-compose -f docker-compose.dev.yml up

# 3. Iniciar en segundo plano (detached)
docker-compose -f docker-compose.dev.yml up -d

# 4. Ver los logs
docker-compose -f docker-compose.dev.yml logs -f

# 5. Detener los contenedores
docker-compose -f docker-compose.dev.yml down

# 6. Detener y eliminar volúmenes (⚠️ borra datos)
docker-compose -f docker-compose.dev.yml down -v
```

### Producción

```bash
# 1. Construir las imágenes
docker-compose build

# 2. Iniciar los contenedores
docker-compose up -d

# 3. Ver logs
docker-compose logs -f app

# 4. Detener
docker-compose down
```

### Comandos Útiles

```bash
# Ver contenedores activos
docker ps

# Ver todas las imágenes
docker images

# Ver logs de un contenedor específico
docker logs nestjs-app
docker logs nestjs-postgres

# Entrar a un contenedor
docker exec -it nestjs-app sh
docker exec -it nestjs-postgres psql -U postgres

# Ver uso de recursos
docker stats

# Limpiar sistema (⚠️ elimina contenedores, redes, imágenes no usadas)
docker system prune -a

# Eliminar volúmenes huérfanos
docker volume prune
```

---

## 🔄 Desarrollo vs Producción

### Modo Desarrollo

```bash
# Archivo: docker-compose.dev.yml
docker-compose -f docker-compose.dev.yml up
```

**Características:**

- ✅ Hot-reload activado
- ✅ Código montado como volumen (cambios en vivo)
- ✅ Todas las dependencias instaladas
- ✅ Logs detallados
- ✅ pgAdmin incluido

**URL:**

- App: http://localhost:3000
- pgAdmin: http://localhost:5050

### Modo Producción

```bash
# Archivo: docker-compose.yml
docker-compose up -d
```

**Características:**

- ✅ Código compilado (dist/)
- ✅ Solo dependencias de producción
- ✅ Imagen optimizada (multi-stage)
- ✅ Usuario no-root (seguridad)
- ✅ Health checks activos

**URL:**

- App: http://localhost:3000
- pgAdmin: http://localhost:5050 (opcional)

---

## 🔧 Configuración Avanzada

### Ejecutar Migraciones en Docker

```bash
# Opción 1: Dentro del contenedor
docker exec -it nestjs-app npm run migration:run

# Opción 2: Desde host (si tienes node_modules local)
docker-compose exec app npm run migration:run

# Generar una migración
docker exec -it nestjs-app npm run migration:generate -- src/migrations/MiMigracion
```

### Hacer Seed de Datos

```bash
# Ejecutar el seed
docker exec -it nestjs-app npm run seed

# O llamar al endpoint
curl http://localhost:3000/seed
```

### Backup de Base de Datos

```bash
# Crear backup
docker exec nestjs-postgres pg_dump -U postgres ecommerce_db > backup.sql

# Restaurar backup
docker exec -i nestjs-postgres psql -U postgres ecommerce_db < backup.sql
```

### Variables de Entorno por Servicio

Puedes crear archivos `.env` específicos:

```bash
.env.development    # Para desarrollo
.env.production     # Para producción
.env.test          # Para testing
```

Y usarlos así:

```yaml
# docker-compose.yml
services:
  app:
    env_file:
      - .env.production
```

---

## 🐛 Troubleshooting

### Problema 1: Puerto ya en uso

```bash
Error: bind: address already in use
```

**Solución:**

```bash
# Ver qué proceso usa el puerto
# Windows
netstat -ano | findstr :3000

# Linux/Mac
lsof -i :3000

# Cambiar el puerto en .env
APP_PORT=3001
```

### Problema 2: No conecta a PostgreSQL

```bash
Error: connect ECONNREFUSED
```

**Solución:**

```bash
# Verificar que postgres esté corriendo
docker ps

# Ver logs de postgres
docker logs nestjs-postgres

# Asegurar que DB_HOST=postgres (no localhost)
DB_HOST=postgres
```

### Problema 3: Cambios no se reflejan

**Solución:**

```bash
# Reconstruir la imagen
docker-compose -f docker-compose.dev.yml build --no-cache

# Reiniciar contenedores
docker-compose -f docker-compose.dev.yml up -d
```

### Problema 4: Permisos (Linux)

```bash
Permission denied
```

**Solución:**

```bash
# Agregar tu usuario al grupo docker
sudo usermod -aG docker $USER

# Reiniciar sesión
logout
```

### Problema 5: Memoria insuficiente

```bash
Docker daemon not responding
```

**Solución:**

```bash
# Windows/Mac: Docker Desktop → Settings → Resources
# Aumentar memoria RAM (mínimo 4GB)

# Linux: Editar daemon.json
sudo nano /etc/docker/daemon.json
```

---

## 📊 Monitoreo y Logs

### Ver Logs en Tiempo Real

```bash
# Todos los servicios
docker-compose logs -f

# Solo la app
docker-compose logs -f app

# Solo postgres
docker-compose logs -f postgres

# Últimas 100 líneas
docker-compose logs --tail=100 app
```

### Inspeccionar Contenedor

```bash
# Ver detalles del contenedor
docker inspect nestjs-app

# Ver variables de entorno
docker exec nestjs-app env

# Ver procesos
docker top nestjs-app
```

---

## 🎯 Mejores Prácticas

### 1. Seguridad

✅ **DO:**

- Usar usuario no-root en producción
- No incluir secretos en el Dockerfile
- Usar `.dockerignore` para excluir archivos sensibles
- Actualizar imágenes base regularmente
- Escanear imágenes por vulnerabilidades

```bash
# Escanear vulnerabilidades
docker scan nestjs-app
```

❌ **DON'T:**

- No poner contraseñas hardcodeadas
- No usar `latest` tag en producción
- No ejecutar como root
- No exponer puertos innecesarios

### 2. Optimización

✅ **DO:**

- Usar multi-stage builds
- Minimizar layers (combinar RUN)
- Usar alpine images cuando sea posible
- Limpiar cache de npm/apt

```dockerfile
# Bueno ✅
RUN apt-get update && \
    apt-get install -y curl && \
    rm -rf /var/lib/apt/lists/*

# Malo ❌
RUN apt-get update
RUN apt-get install -y curl
```

### 3. Desarrollo

✅ **DO:**

- Usar docker-compose para multi-contenedor
- Montar código como volumen en dev
- Usar health checks
- Versionar las imágenes

```yaml
# Versionar imágenes
image: mi-app:1.0.0
```

### 4. Producción

✅ **DO:**

- Usar orchestrators (Kubernetes, Docker Swarm)
- Implementar health checks
- Configurar restart policies
- Monitorear recursos

```yaml
services:
  app:
    restart: unless-stopped
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:3000/health']
      interval: 30s
      timeout: 3s
      retries: 3
```

---

## 📚 Comandos de Referencia Rápida

### Construcción

```bash
docker build -t mi-app .                    # Construir imagen
docker build --no-cache -t mi-app .         # Sin cache
docker-compose build                         # Construir servicios
```

### Ejecución

```bash
docker run -p 3000:3000 mi-app              # Ejecutar contenedor
docker-compose up                            # Iniciar servicios
docker-compose up -d                         # En segundo plano
```

### Gestión

```bash
docker ps                                    # Contenedores activos
docker ps -a                                 # Todos los contenedores
docker stop <container>                      # Detener
docker rm <container>                        # Eliminar
docker-compose down                          # Detener y eliminar
```

### Limpieza

```bash
docker system prune                          # Limpiar sistema
docker volume prune                          # Limpiar volúmenes
docker image prune -a                        # Limpiar imágenes
```

### Debugging

```bash
docker logs <container>                      # Ver logs
docker exec -it <container> sh              # Entrar al contenedor
docker inspect <container>                   # Inspeccionar
```

---

## 🚀 Despliegue

### Deploy en Desarrollo Local

```bash
# 1. Clonar repositorio
git clone <repo-url>
cd back

# 2. Configurar variables
cp .env.docker .env
nano .env

# 3. Iniciar
docker-compose -f docker-compose.dev.yml up -d

# 4. Verificar
docker ps
curl http://localhost:3000
```

### Deploy en Producción

```bash
# 1. Construir imagen
docker-compose build

# 2. Ejecutar migraciones
docker-compose run app npm run migration:run

# 3. Iniciar servicios
docker-compose up -d

# 4. Verificar salud
docker-compose ps
docker-compose logs -f app
```

---

## 🔗 Recursos Adicionales

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [NestJS Documentation](https://docs.nestjs.com/)
- [PostgreSQL Docker Hub](https://hub.docker.com/_/postgres)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

## 📝 Próximos Pasos

1. ✅ Ejecutar en desarrollo local
2. ✅ Configurar pgAdmin y explorar la BD
3. ✅ Ejecutar migraciones y seed
4. ✅ Probar la API
5. ⬜ Configurar CI/CD (GitHub Actions)
6. ⬜ Deploy en producción (AWS, DigitalOcean, etc.)
7. ⬜ Configurar monitoreo (Prometheus, Grafana)
8. ⬜ Implementar logging centralizado

---

## 💡 Tips Finales

1. **Siempre usa volúmenes** para datos persistentes
2. **Nombra tus contenedores** para facilitar la gestión
3. **Documenta tus Dockerfiles** con comentarios
4. **Versiona tus imágenes** (no uses `latest` en prod)
5. **Prueba localmente** antes de deploy
6. **Monitorea recursos** en producción
7. **Haz backups** de los volúmenes regularmente
8. **Actualiza imágenes** por seguridad

---

¡Feliz Dockerización! 🐳🚀
