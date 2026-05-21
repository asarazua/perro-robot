# 🐶 Perro Robótico — Servidor y Servicios en la Nube

Proyecto del curso Sistemas Operativos II — 2026

## Descripción
Servidor en la nube responsable de recibir eventos del robot, almacenarlos en MongoDB y proveer un panel web de monitoreo y control en tiempo real.

## Tecnologías
- Ubuntu 24.04 LTS (Linux)
- Docker + Docker Compose
- Node.js + Express
- MongoDB 6
- DigitalOcean

## URLs del servidor
- Panel de monitoreo: http://159.65.228.0:3000/dashboard.html
- Estado del servidor: http://159.65.228.0:3000/health
- Ver logs: http://159.65.228.0:3000/logs

## Comandos disponibles para el robot
| Comando | Acción |
|---------|--------|
| adelante | El robot avanza |
| atras | El robot retrocede |
| stop | El robot se detiene |
| flexionar | El robot flexiona |
| sentar | El robot se sienta |
| estirar | El robot se estira |
| inicio | Posición inicial |

## Responsable
Andrea Sarazua — Servidor y Servicios en la Nube
