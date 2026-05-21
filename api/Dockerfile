# Usamos una imagen base ligera de Node.js versión 18
FROM node:18-alpine

# Definimos el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo package.json para instalar dependencias primero
COPY package.json .

# Instalamos las dependencias del proyecto
RUN npm install

# Copiamos el resto de los archivos del proyecto al contenedor
COPY . .

# Exponemos el puerto 3000 para acceder a la aplicación
EXPOSE 3000

# Comando por defecto que ejecuta el servidor Node.js
CMD ["node", "server.js"]
