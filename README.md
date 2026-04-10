# EvoGym — Frontend

Panel de administración web para el sistema de gestión de gimnasio EvoGym.
Desarrollado con React y Tailwind CSS.

---

## ¿Qué incluye este panel?

- Pantalla de login seguro para el administrador
- Dashboard con estadísticas en tiempo real
- Gestión completa de usuarios y membresías
- Control de acceso por reconocimiento facial automático
- Control de acceso alternativo por número de cédula
- Cámara flotante activa en todas las secciones del panel
- Diseño oscuro profesional con colores verde esmeralda

---

## Requisitos previos

- Node.js 18 o superior
- El backend de EvoGym corriendo en http://localhost:8000

---

## Instalación paso a paso

1. Clona el proyecto

git clone https://github.com/TU_USUARIO/gimnasio-frontend.git
cd gimnasio-frontend

2. Instala las dependencias

npm install

3. Inicia el servidor de desarrollo

npm run dev

El panel queda disponible en: http://localhost:5173

---

## Uso del sistema

Iniciar sesión:
Abre http://localhost:5173 e ingresa con las credenciales del administrador.

Registrar un nuevo miembro:
Ve a Usuarios → Nuevo Usuario → llena los datos, captura la foto y selecciona el plan.

Control de acceso:
Ve a la sección Acceso. La cámara se activa automáticamente y detecta a los miembros
cada 2.5 segundos. Si la cámara falla, el miembro puede ingresar su cédula en el
teclado numérico de la pantalla.

Cámara flotante:
Activa la cámara desde el botón del Navbar para tenerla activa mientras usas
otras secciones del panel.

---

## Estructura del proyecto

gimnasio-frontend/
├── src/
│   ├── pages/        — Pantallas principales
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Usuarios.jsx
│   │   └── Acceso.jsx
│   ├── components/   — Componentes reutilizables
│   │   ├── Navbar.jsx
│   │   ├── FloatingCamera.jsx
│   │   └── ProtectedRoute.jsx
│   ├── context/      — Estado global
│   │   ├── AuthContext.jsx
│   │   └── CameraContext.jsx
│   └── services/     — Conexión con el backend
│       └── api.js
└── public/

---

## Tecnologías utilizadas

React          — Construcción de la interfaz
React Router   — Navegación entre pantallas
Axios          — Comunicación con el backend
Tailwind CSS   — Estilos y diseño
React Webcam   — Acceso a la cámara
Vite           — Herramienta de desarrollo

---

## ¿Problemas comunes?

La cámara no funciona:
Asegúrate de dar permisos de cámara al navegador cuando lo solicite.

No carga los datos:
Verifica que el backend esté corriendo en http://localhost:8000.

La página redirige al login:
El token de sesión expiró. Vuelve a iniciar sesión con tus credenciales.