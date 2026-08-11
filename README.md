# Sistema Web de Gestión MiniMarket

## Descripción

Sistema web para la gestión de un minimarket, desarrollado como proyecto formativo del SENA.

La aplicación permite administrar productos, clientes, empleados, inventario y ventas, además de proporcionar un Dashboard con información estadística del sistema.

---

## Tecnologías utilizadas

### Backend

- Node.js
- Express.js
- MySQL
- JavaScript

### Frontend

- HTML5
- CSS3
- JavaScript

### Librerías principales

- express
- mysql2
- dotenv
- express-session
- bcrypt
- cors

### Librerías para pruebas

- Jest
- Supertest
- node-mocks-http

### Herramientas de desarrollo

- Nodemon
- npm
- Git

---

## Funcionalidades

- Gestión de productos.
- Gestión de clientes.
- Gestión de empleados.
- Gestión de inventario.
- Registro de ventas.
- Historial de ventas.
- Consulta del detalle de las ventas.
- Actualización automática del inventario.
- Acumulación de puntos para clientes.
- Autenticación mediante sesión.
- Autorización mediante roles.
- Dashboard administrativo.
- Estadísticas generales del sistema.
- Total vendido.
- Ventas del día.
- Productos con stock bajo.
- Productos más vendidos.
- Últimas ventas.
- Gráfica de ventas de los últimos días.

---

## Módulos del sistema

### Productos

Permite consultar y administrar los productos registrados en el sistema.

### Clientes

Permite gestionar la información de los clientes.

### Empleados

Permite gestionar los empleados del minimarket.

### Inventario

Permite consultar y controlar las existencias de productos.

### Ventas

Permite registrar ventas, consultar el historial y consultar el detalle de cada venta.

### Dashboard

Presenta información general del sistema y estadísticas relacionadas con las ventas y el inventario.

---

## Arquitectura del proyecto

El proyecto está organizado mediante separación de responsabilidades:

```text
minimarket/
│
├── config/
│   └── database.js
│
├── controllers/
│   └── Controladores de los módulos
│
├── middlewares/
│   ├── auth.js
│   └── roles.js
│
├── models/
│   └── Modelos de acceso a datos
│
├── routes/
│   └── Rutas de los módulos
│
├── public/
│   └── Archivos de la interfaz web
│
├── views/
│   └── Vistas de la aplicación
│
├── tests/
│   ├── productoController.test.js
│   └── server.test.js
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── server.js
