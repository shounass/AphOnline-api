# 🏥 Aphonline - Plataforma de Consultorios Médicos Online

Plataforma integral para la gestión de consultas médicas en línea. Permite a pacientes agendar citas, acceder a historias clínicas, gestionar recetas, y más, con autenticación segura y paneles personalizados.

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Tecnologías](#tecnologías)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Ejecución](#ejecución)
- [API Endpoints](#api-endpoints)
- [Modelos de Datos](#modelos-de-datos)
- [Autenticación](#autenticación)
- [Estructura de Carpetas](#estructura-de-carpetas)
- [Contribución](#contribución)

---

## ✨ Características

### Backend

- Autenticación y autorización con JWT
- Gestión de usuarios (pacientes, médicos, administradores)
- Administración de citas médicas
- Gestión de historias clínicas
- Sistema de recetas médicas
- Encriptación de contraseñas con bcryptjs
- API RESTful escalable
- Base de datos NoSQL (MongoDB)

### Frontend

- Interfaz responsiva y moderna
- Autenticación y registro de pacientes
- Panel de paciente (dashboard)
- Páginas informativas: Inicio, Acerca de, Blog, PQRS, Contacto
- Integración con API backend
- Manejo de contexto con React Context API
- Enrutamiento dinámico con React Router DOM

---

## 🛠 Tecnologías

### Backend

| Tecnología | Versión | Descripción                         |
| ---------- | ------- | ----------------------------------- |
| Node.js    | >=14    | Runtime de JavaScript               |
| Express    | ^5.1.0  | Framework web                       |
| MongoDB    | ^6.20.0 | Base de datos NoSQL                 |
| Mongoose   | ^8.19.3 | ODM para MongoDB                    |
| JWT        | ^9.0.2  | Autenticación por tokens            |
| bcryptjs   | ^3.0.3  | Encriptación de contraseñas         |
| CORS       | ^2.8.5  | Control de solicitudes cross-origin |
| dotenv     | ^17.2.3 | Gestión de variables de entorno     |
| Nodemon    | ^3.1.10 | Recarga automática en desarrollo    |

### Frontend

| Tecnología       | Versión | Descripción       |
| ---------------- | ------- | ----------------- |
| React            | ^18.2.0 | Biblioteca de UI  |
| React Router DOM | ^7.9.5  | Enrutamiento      |
| Axios            | ^1.13.2 | Cliente HTTP      |
| Context API      | -       | Gestión de estado |

---

## 📁 Estructura del Proyecto

```
aphonline-api/
├── backend/
│   ├── package.json
│   ├── server.js
│   ├── middleware/
│   │   └── auth.js
│   └── src/
│       ├── app.js
│       ├── config/
│       │   └── db.js
│       ├── controllers/
│       │   ├── citaController.js
│       │   ├── historiaClinicaController.js
│       │   ├── medicoController.js
│       │   ├── pacienteController.js
│       │   ├── recetaController.js
│       │   └── usuarioController.js
│       ├── models/
│       │   ├── citaModel.js
│       │   ├── historiaClinicaModel.js
│       │   ├── medicoModel.js
│       │   ├── pacienteModel.js
│       │   ├── recetaModel.js
│       │   └── usuarioModel.js
│       └── routes/
│           ├── citasRoutes.js
│           ├── historiasClinicasRoutes.js
│           ├── medicosRoutes.js
│           ├── pacientesRoutes.js
│           ├── recetasRoutes.js
│           └── usuariosRoutes.js
│
├── frontend/
│   ├── package.json
│   └── src/
│       ├── app.jsx
│       ├── index.js
│       ├── components/
│       │   ├── footer.jsx
│       │   ├── navbar.jsx
│       │   └── navbar.css
│       ├── context/
│       │   └── AuthContext.jsx
│       ├── pages/
│       │   ├── AcercaDe.jsx
│       │   ├── acercaDe.css
│       │   ├── Blog.jsx
│       │   ├── blog.css
│       │   ├── Contacto.jsx
│       │   ├── contacto.css
│       │   ├── DashboardPaciente.jsx
│       │   ├── dashboardPaciente.css
│       │   ├── inicio.jsx
│       │   ├── inicio.css
│       │   ├── loginPaciente.jsx
│       │   ├── loginPaciente.css
│       │   ├── PQRS.jsx
│       │   ├── pqrs.css
│       │   ├── registroPaciente.jsx
│       │   └── registroPaciente.css
│       └── services/
│           └── api.js
│
└── README.md
```

---

## 📦 Requisitos Previos

Asegúrate de tener instalados:

- **Node.js** (>=14) - [Descargar](https://nodejs.org)
- **npm** (incluido con Node.js)
- **MongoDB** (>=4.4) - [Descargar](https://www.mongodb.com/try/download/community) o usa **MongoDB Atlas**

Verifica la instalación:

```bash
node --version
npm --version
```

---

git clone https://github.com/tu-usuario/aphonline-api.git

## 🚀 Instalación

1. Clona el repositorio:

```bash
git clone https://github.com/tu-usuario/aphonline-api.git
cd aphonline-api
```

2. Instala dependencias del backend:

```bash
cd backend
npm install
```

3. Instala dependencias del frontend:

```bash
cd ../frontend
npm install
```

---

## ⚙️ Configuración

### Backend

1. Crea un archivo `.env` en la carpeta `backend/` con:

```env
MONGO_URI=mongodb://localhost:27017/aphonline
# O para MongoDB Atlas:
# MONGO_URI=mongodb+srv://usuario:contraseña@cluster.mongodb.net/aphonline?retryWrites=true&w=majority
PORT=4000
JWT_SECRET=tu_clave_secreta_muy_segura_aqui_123456
```

### Frontend (opcional)

1. Crea un archivo `.env` en la carpeta `frontend/` si necesitas personalizar la URL de la API:

```env
REACT_APP_API_URL=http://localhost:4000
```

---

## 🎯 Ejecución

### Desarrollo

**Backend:**

```bash
cd backend
npm run dev
```

Disponible en: `http://localhost:4000`

**Frontend:**

```bash
cd frontend
npm start
```

Disponible en: `http://localhost:3000`

### Producción

**Backend:**

```bash
cd backend
npm start
```

**Frontend:**

```bash
cd frontend
npm run build
# Servir build con tu servidor favorito
```

---

## 📡 API Endpoints (principales)

### Autenticación

| Método | Endpoint                 | Descripción       |
| ------ | ------------------------ | ----------------- |
| POST   | `/api/usuarios/registro` | Registrar usuario |
| POST   | `/api/usuarios/login`    | Iniciar sesión    |

### Pacientes

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/pacientes`     | Listar pacientes    |
| GET    | `/api/pacientes/:id` | Ver paciente        |
| POST   | `/api/pacientes`     | Crear paciente      |
| PUT    | `/api/pacientes/:id` | Actualizar paciente |
| DELETE | `/api/pacientes/:id` | Eliminar paciente   |

### Médicos

| Método | Endpoint           | Descripción       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/medicos`     | Listar médicos    |
| GET    | `/api/medicos/:id` | Ver médico        |
| POST   | `/api/medicos`     | Crear médico      |
| PUT    | `/api/medicos/:id` | Actualizar médico |
| DELETE | `/api/medicos/:id` | Eliminar médico   |

### Citas

| Método | Endpoint         | Descripción     |
| ------ | ---------------- | --------------- |
| GET    | `/api/citas`     | Listar citas    |
| GET    | `/api/citas/:id` | Ver cita        |
| POST   | `/api/citas`     | Agendar cita    |
| PUT    | `/api/citas/:id` | Actualizar cita |
| DELETE | `/api/citas/:id` | Cancelar cita   |

### Historias Clínicas

| Método | Endpoint             | Descripción         |
| ------ | -------------------- | ------------------- |
| GET    | `/api/historias`     | Listar historias    |
| GET    | `/api/historias/:id` | Ver historia        |
| POST   | `/api/historias`     | Crear historia      |
| PUT    | `/api/historias/:id` | Actualizar historia |

### Recetas

| Método | Endpoint           | Descripción       |
| ------ | ------------------ | ----------------- |
| GET    | `/api/recetas`     | Listar recetas    |
| GET    | `/api/recetas/:id` | Ver receta        |
| POST   | `/api/recetas`     | Crear receta      |
| PUT    | `/api/recetas/:id` | Actualizar receta |
| DELETE | `/api/recetas/:id` | Eliminar receta   |

---

## 🗄️ Modelos de Datos (resumen)

### Usuario

```js
{
  _id, nombre, email, contraseña, rol, telefono, fechaRegistro, estado;
}
```

### Paciente

```js
{
  _id,
    usuarioId,
    cedula,
    fechaNacimiento,
    genero,
    direccion,
    ciudad,
    telefonoEmergencia,
    alergias,
    grupoSanguineo,
    historiaClinicaId;
}
```

### Médico

```js
{
  _id,
    usuarioId,
    cedula,
    especialidad,
    numeroLicencia,
    institucionEducativa,
    experienciaAnos,
    horarioAtencion,
    consultorio;
}
```

### Cita

```js
{
  _id, pacienteId, medicoId, fecha, hora, estado, motivo, notas;
}
```

### Historia Clínica

```js
{
  _id,
    pacienteId,
    antecedentes,
    enfermedadesActuales,
    medicamentosActuales,
    cirugias,
    historiaCitas;
}
```

### Receta

```js
{
  _id,
    pacienteId,
    medicoId,
    citaId,
    medicamentos,
    fechaExpedicion,
    fechaVencimiento;
}
```

---

## 🔐 Autenticación

El sistema utiliza **JWT (JSON Web Tokens)**:

1. Login con email y contraseña
2. El backend genera un token JWT
3. El frontend lo almacena (localStorage)
4. El token se envía en cada request protegido
5. El middleware `verificarToken` valida el token

Ejemplo de uso:

```js
app.get("/api/pacientes", verificarToken, (req, res) => {
  // req.user contiene el usuario autenticado
});
```

---

## 🔧 Scripts Disponibles

### Backend (ubicado en `backend/package.json`)

```powershell
# En desarrollo (nodemon)
cd backend
npm run dev

# En producción
cd backend
npm start
```

### Frontend (ubicado en `frontend/package.json`)

```powershell
cd frontend
npm start       # Ejecuta la app en modo desarrollo
npm run build   # Compila para producción
npm test        # Ejecuta pruebas
```

Nota: en Windows usa PowerShell (`pwsh.exe`) o la terminal que prefieras. Si `npm start` falla, revisa la sección de "Solución de Problemas" a continuación.

## 🐞 Solución de Problemas (rápida)

1. Backend no arranca (Exit code 1 / error al ejecutar `npm run dev` o `npm start`)

- Asegúrate de tener un archivo `.env` en `backend/` con `MONGO_URI` correcto.
- Verifica que MongoDB esté corriendo localmente o que la URI de Atlas sea válida.
- Ejecuta directamente para ver errores crudos:

```powershell
cd backend
node server.js
```

2. Frontend falla en `npm start` (react-scripts / Exit code 1)

- Ejecuta `npm install` dentro de `frontend` si no lo has hecho.
- Revisa variables de entorno: crea `frontend/.env` con `REACT_APP_API_URL=http://localhost:4000` si es necesario.
- Limpia e instala de nuevo si persiste (PowerShell):

```powershell
cd frontend
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
npm install
npm start
```

3. Import/Path errors en backend

- Verifica que en `server.js` o `src/app.js` las rutas importadas existan y la ruta relativa sea correcta (ej. `./src/routes/pacientesRoutes.js`).

4. Permisos en Windows

- Ejecuta PowerShell como administrador si hay errores de permisos al instalar paquetes.

5. Logs y debug

- Revisa la consola para el stacktrace y usa `console.log` en el servidor para identificar dónde falla la inicialización.

Si después de seguir estos pasos el problema persiste, copia aquí el mensaje de error exacto y lo investigo.

## 📚 Estructura de Carpetas Explicada

### `/backend`

- `server.js`: Entrada del servidor Express
- `middleware/`: Middlewares (autenticación, etc.)
- `src/config/`: Configuración de base de datos
- `src/controllers/`: Lógica de negocio
- `src/models/`: Esquemas de datos (Mongoose)
- `src/routes/`: Rutas de la API

### `/frontend`

- `src/pages/`: Páginas principales (Inicio, Login, Registro, Dashboard, AcercaDe, Blog, PQRS, Contacto)
- `src/components/`: Componentes reutilizables (navbar, footer)
- `src/context/`: Contexto global de autenticación
- `src/services/`: Servicios de conexión a la API
- `src/app.jsx`: Componente raíz y rutas

---

## 🤝 Contribución

1. Haz fork del repositorio
2. Crea una rama (`git checkout -b feature/mi-feature`)
3. Haz commit de tus cambios
4. Haz push a tu rama
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto está licenciado bajo ISC License.

---

## 📧 Contacto

Para consultas o soporte, contacta al equipo de desarrollo.

---

## 🔗 Referencias Útiles

- [Express.js Documentation](https://expressjs.com)
- [MongoDB Documentation](https://docs.mongodb.com)
- [Mongoose Documentation](https://mongoosejs.com)
- [React Documentation](https://react.dev)
- [JWT Introduction](https://jwt.io/introduction)

---

**Última actualización**: 14 de noviembre de 2025
