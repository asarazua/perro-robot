# 🌐 Servidor Alpha K9

## 📖 Descripción General

El servidor Alpha K9 constituye la capa backend del sistema robótico, encargado de gestionar la comunicación entre el robot y los servicios de almacenamiento y monitoreo. Fue desarrollado utilizando Node.js y MongoDB, implementando una arquitectura basada en servicios REST que permite registrar, consultar y supervisar eventos generados por el robot en tiempo real.

La infraestructura se encuentra desplegada mediante contenedores Docker sobre un servidor VPS en DigitalOcean, proporcionando acceso remoto, escalabilidad y facilidad de mantenimiento.

---

## 🎯 Objetivos

- Recibir eventos enviados por el robot Alpha K9.
- Almacenar información histórica en una base de datos MongoDB.
- Proporcionar una API REST para consulta y monitoreo.
- Verificar el estado operativo del sistema.
- Facilitar futuras integraciones con aplicaciones web, móviles o sistemas IoT.

---

## 🛠️ Tecnologías Utilizadas

| Tecnología | Función |
|------------|----------|
| Node.js | Desarrollo del backend y API REST |
| Express.js | Gestión de rutas y solicitudes HTTP |
| MongoDB | Almacenamiento de eventos |
| Docker | Contenerización de servicios |
| Docker Compose | Orquestación de contenedores |
| DigitalOcean | Infraestructura en la nube |
| Visual Studio Code | Desarrollo y mantenimiento del código |

---

## 🏗️ Arquitectura del Sistema

El robot Alpha K9 se comunica con el servidor mediante solicitudes HTTP enviadas a través de WiFi. El servidor procesa la información recibida y la almacena en MongoDB para su posterior consulta desde el panel de monitoreo.

```text
Alpha K9
    │
    ▼
HTTP / REST
    │
    ▼
Servidor Node.js
    │
    ▼
MongoDB
    │
    ▼
Dashboard Web
```

---

## 📂 Estructura del Proyecto

```text
robot-server/
│
├── docker-compose.yml
│
└── api/
    ├── Dockerfile
    ├── package.json
    ├── server.js
    └── dashboard.html
```
![Estructura del proyecto en VSCode](https://github.com/asarazua/perro-robot/blob/692e23294d893925a56aba3a42762688982786d2/Estructura.jpeg)

### 📄 Descripción de Archivos

#### ⚙️ docker-compose.yml

Archivo encargado de coordinar la ejecución de los contenedores del sistema, definiendo redes, puertos y dependencias.

#### 🐳 Dockerfile

Contiene las instrucciones necesarias para construir la imagen Docker del servidor Node.js.

#### 📦 package.json

Administra dependencias, configuración y scripts de ejecución del proyecto.

#### 🚀 server.js

Implementa la lógica principal del backend, incluyendo las rutas REST, procesamiento de solicitudes y conexión con MongoDB.

#### 📊 dashboard.html

Interfaz web utilizada para visualizar registros y supervisar la actividad del robot.

---

## 🔌 API REST

### ❤️ Verificación del Estado

```http
GET /health
```

Permite verificar que el servidor se encuentra operativo y disponible para recibir solicitudes.

**Respuesta esperada:**

```json
{
  "status": "OK"
}
```

### 📝 Registro de Eventos

```http
POST /evento
```

Permite recibir y almacenar eventos generados por el robot.

**Ejemplo de solicitud:**

```json
{
  "tipo": "movimiento",
  "descripcion": "Robot caminando",
  "datos": "Adelante"
}
```

---

## 🗄️ Base de Datos

MongoDB almacena la información enviada por el robot, incluyendo:

- Tipo de evento.
- Descripción.
- Datos adicionales.
- Fecha y hora de registro.

**Ejemplo de documento almacenado:**

```json
{
  "tipo": "movimiento",
  "descripcion": "Robot caminando",
  "datos": "Adelante",
  "fecha": "2026-05-22T14:30:00Z"
}
```

---

## ☁️ Despliegue

El servidor se ejecuta mediante contenedores Docker desplegados sobre un VPS de DigitalOcean con Ubuntu Server.

### 💻 Ejecución Local

```bash
docker-compose up --build
```

### ✅ Verificación

```text
http://localhost:3000/health
```

---

## 🔄 Flujo de Funcionamiento

1. El robot ejecuta una acción.
2. El ESP32 genera un evento asociado.
3. El evento es enviado mediante HTTP al servidor.
4. Node.js procesa la solicitud recibida.
5. MongoDB almacena la información.
6. El panel web actualiza los registros disponibles.
7. El usuario puede consultar el historial de eventos.

---

## 🚀 Beneficios de la Implementación

- Registro centralizado de eventos y actividades.
- Monitoreo remoto del sistema robótico.
- Arquitectura escalable para futuras ampliaciones.
- Integración sencilla con aplicaciones web y móviles.
- Despliegue portable mediante Docker.
- Almacenamiento persistente de información para análisis y auditoría.
- Base sólida para proyectos de Internet de las Cosas (IoT).

---

## 📋 Conclusión

La implementación del servidor Alpha K9 permite extender las capacidades del robot más allá del control local, proporcionando una plataforma robusta para almacenamiento, monitoreo y administración remota. Gracias al uso de tecnologías modernas como Node.js, MongoDB, Docker y DigitalOcean, el sistema ofrece una solución escalable, modular y adaptable a futuras mejoras dentro del campo de la robótica e Internet de las Cosas.

---

## 👨‍💻 Autores


**Andrea María Sarazúa Roca**

**Sergio Josue Daniel Cúmez Pichiyá**

**Meily Sucely Chonay Cán**

**Wilson Armando Felipe Jerónimo**

**Universidad Mariano Gálvez de Guatemala**  
**Facultad de Ingeniería en Sistemas**

