# LEGATVM

LEGATVM se trata de una plataforma educativa full-stack donde los usuarios pueden explorar, comprar y avanzar a través de volúmenes de aprendizaje. Cada volumen contiene capítulos con diferentes tipos de contenido (video, texto, interactivo) y pruebas que los usuarios deben aprobar para avanzar. El proposito principal es hacer del aprendizaje un proceso entretenido y edificante.

## Url de la presentación:

https://www.canva.com/design/DAHCLQ-8Rgc/mm3y20w3W1tLbVdqoVal9w/edit?utm_content=DAHCLQ-8Rgc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton

## Url de despliegue:

https://legatvm.vercel.app/

## Stack Tecnológico

### Backend

| Tecnología | Propósito |
|---|---|
| Node.js + Express 5 | Servidor HTTP y enrutamiento |
| TypeScript 5.9 | Tipado estático |
| PostgreSQL (pg) | Base de datos relacional |
| bcrypt | Hashing de contraseñas |
| jsonwebtoken | Autenticación basada en JWT |
| cookie-parser | Refresh token mediante cookies httpOnly |
| uuid | Generación de IDs únicos |
| dotenv | Gestión de variables de entorno |
| tsx | Ejecución de TypeScript (desarrollo) |
| Vitest + Supertest | Testing |

### Frontend

| Tecnología | Propósito |
|---|---|
| React 19 | Librería de UI |
| React Router 7 | Enrutamiento del lado del cliente |
| Vite (rolldown-vite) | Herramienta de build y servidor de desarrollo |
| SASS | Estilos |
| TypeScript | Tipado estático |
| Vitest + Testing Library | Tests unitarios y de componentes |

### Gestor de paquetes

- **pnpm** tanto para frontend como para backend

---

## Arquitectura

### Backend — Clean Architecture (Hexagonal / Puertos y Adaptadores)

El backend sigue estrictamente los principios de **Clean Architecture** con la **Regla de Dependencia**: las capas internas nunca dependen de las capas externas.

```
src/
├── domain/                          # Entidades de negocio principales
│   ├── User.ts
│   ├── Volume.ts
│   ├── Chapter.ts
│   ├── Prueba.ts
│   ├── UserProgress.ts
│   └── Wallet.ts
├── application/
│   ├── ports/                       # Interfaces (abstracciones)
│   │   ├── AuthRepository.ts
│   │   ├── UserRepository.ts
│   │   ├── WalletRepository.ts
│   │   ├── VolumeRepository.ts
│   │   ├── ChapterRepository.ts
│   │   ├── PruebaRepository.ts
│   │   ├── UserProgressRepository.ts
│   │   ├── UserVolumeRepository.ts
│   │   └── VolumeStartRepository.ts
│   └── use-cases/                   # Lógica de negocio de aplicación
│       ├── RegisterUser.ts
│       ├── LoginUser.ts
│       ├── LogoutUser.ts
│       ├── RotateToken.ts
│       ├── GetVolumes.ts
│       ├── GetVolumeDetails.ts
│       ├── ContinueVolume.ts
│       ├── CheckVolumeStarted.ts
│       ├── PurchaseVolume.ts
│       ├── GetUserVolumes.ts
│       ├── GetPrueba.ts
│       └── SubmitPrueba.ts
├── infrastructure/                  # Capa de infraestructura
│   ├── http/
│   │   ├── routes/                  # Definiciones de rutas Express
│   │   │   ├── authRoutes.ts
│   │   │   ├── volumeRoutes.ts
│   │   │   ├── pruebaRoutes.ts
│   │   │   └── userRoutes.ts
│   │   └── middlewares/
│   │       └── authMiddleware.ts
│   ├── persistence/
│   │   ├── postgres/                # Implementaciones PostgreSQL
│   │   │   ├── connection.ts        # Configuración de pg.Pool
│   │   │   ├── migrator.ts          # Ejecutor de migraciones SQL
│   │   │   ├── migrations/          # Archivos de migración SQL (001–010)
│   │   │   ├── PostgresUserRepository.ts
│   │   │   ├── PostgresAuthRepository.ts
│   │   │   ├── PostgresWalletRepository.ts
│   │   │   ├── PostgresVolumeRepository.ts
│   │   │   ├── PostgresChapterRepository.ts
│   │   │   ├── PostgresPruebaRepository.ts
│   │   │   ├── PostgresUserProgressRepository.ts
│   │   │   ├── PostgresUserVolumeRepository.ts
│   │   │   └── PostgresVolumeStartRepository.ts
│   │   └── InMemory*.ts             # Implementaciones en memoria (legacy)
│   ├── JwtTokenProvider.ts
│   └── config/
├── scripts/
│   ├── migrate.ts                   # Ejecutar migraciones pendientes
│   └── reset-db.ts                  # Eliminar todas las tablas
├── shared/
│   └── result.ts                    # Utilidad de resultado
└── main.ts                          # Punto de entrada — conecta dependencias
```

### Frontend — Screaming Architecture + Regla de Alcance

```
src/
├── pages/                           # Componentes a nivel de página
│   ├── Home.tsx
│   ├── Login.tsx
│   ├── Register.tsx
│   ├── About.tsx
│   ├── VolumeContent.tsx
│   ├── ChapterChallenge.tsx
│   └── Profile.tsx
├── shared/
│   └── components/                  # Reutilizables en 2+ páginas
│       ├── NavBar.tsx
│       ├── VolumeList.tsx
│       ├── VolumeDetails.tsx
│       ├── ProtectedRoute.tsx
│       ├── Loading.tsx
│       ├── ResultModal.tsx
│       ├── DesigningModal.tsx
│       └── NotFound.tsx
├── context/                         # Proveedores de contexto React
│   ├── AuthContext.tsx
│   └── VolumeContext.tsx
├── hooks/                           # Hooks personalizados
│   ├── useAuth.tsx
│   └── useVolume.tsx
├── assets/
├── App.tsx                          # Componente raíz + enrutamiento
└── main.tsx                         # Punto de entrada React
```

---

## Requisitos Previos

- **Node.js** >= 18
- **pnpm** (instalar con `npm install -g pnpm`)
- **PostgreSQL** >= 14, en ejecución y accesible

---

## Primeros Pasos

### 1. Clonar el repositorio

```bash
git clone <repo-url>
cd LEGATVM
```

### 2. Configuración del backend

```bash
cd backend
pnpm install
```

Crear un archivo `.env` en `backend/` con las siguientes variables:

```env
SECRET_KEY=your_jwt_secret_key
DATABASE_URL=your-db.com
FRONTEND_URL=frontend.com
PORT=3000
```

Crear la base de datos en PostgreSQL:

```sql
CREATE DATABASE legatvm;
```

Ejecutar las migraciones para crear las tablas e insertar datos de ejemplo:

```bash
pnpm migrate
```

Iniciar el servidor de desarrollo:

```bash
pnpm dev
```

El backend se ejecuta en **http://localhost:3000** por defecto.

### 3. Configuración del frontend

```bash
cd frontend
pnpm install
pnpm dev
```

El frontend se ejecuta en **http://localhost:5173** por defecto.

---

## Scripts Disponibles

### Backend (`backend/`)

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `pnpm dev` | Iniciar servidor de desarrollo con hot reload (tsx watch) |
| `build` | `pnpm build` | Compilar TypeScript a JavaScript |
| `start` | `pnpm start` | Ejecutar JavaScript compilado |
| `test` | `pnpm test` | Ejecutar tests con Vitest |
| `migrate` | `pnpm migrate` | Ejecutar migraciones pendientes |
| `reset-db` | `pnpm reset-db` | Eliminar todas las tablas (destructivo) |
| `reset-and-migrate` | `pnpm reset-and-migrate` | Eliminar tablas y re-ejecutar migraciones |

### Frontend (`frontend/`)

| Script | Comando | Descripción |
|---|---|---|
| `dev` | `pnpm dev` | Iniciar servidor de desarrollo Vite |
| `build` | `pnpm build` | Compilar para producción |
| `preview` | `pnpm preview` | Previsualizar build de producción |
| `test` | `pnpm test` | Ejecutar tests con Vitest |
| `lint` | `pnpm lint` | Ejecutar ESLint |

---

## Migraciones de Base de Datos

El proyecto utiliza un sistema de migraciones SQL personalizado. Las migraciones se almacenan en `backend/src/infrastructure/persistence/postgres/migrations/` y se registran en una tabla `migrations` en la base de datos.

| Migración | Descripción |
|---|---|
| 001_create_users | Tabla de usuarios con email, nombre de usuario y contraseña hasheada |
| 002_create_wallets | Tabla de monederos vinculada a usuarios (saldo inicial: 150 monedas) |
| 003_create_refresh_tokens | Tokens de refresco para rotación JWT |
| 004_create_volumes | Volúmenes de aprendizaje con categorías y precios |
| 005_create_chapters | Capítulos dentro de los volúmenes (video, texto, interactivo) |
| 006_create_user_volumes | Registra qué usuarios poseen qué volúmenes |
| 007_create_user_progress | Registra el progreso de capítulos por usuario |
| 008_create_volume_starts | Registra si un usuario ha iniciado un volumen |
| 009_create_pruebas | Pruebas con preguntas, opciones y respuestas correctas |
| 010_seed_sample_data | Inserta volúmenes, capítulos y pruebas de ejemplo |

---

## Modelo de Dominio

| Entidad | Descripción |
|---|---|
| **User** | Usuario registrado con email, nombre de usuario y contraseña hasheada |
| **Wallet** | Saldo de monedas virtuales por usuario (por defecto: 150 monedas) |
| **Volume** | Módulo de aprendizaje con título, descripción, categoría, miniatura y precio |
| **Chapter** | Una lección dentro de un volumen (tipos: video, texto, interactivo) |
| **Prueba** | Un cuestionario asociado a un capítulo; contiene preguntas de opción múltiple |
| **UserProgress** | Registra qué capítulos ha completado un usuario |

### Reglas de Negocio

- Los usuarios reciben **150 monedas** al registrarse
- Comprar un volumen descuenta su precio del monedero del usuario
- Umbral de aprobación de pruebas: **≥ 70%** de respuestas correctas
- Un volumen se marca como completado cuando todos sus capítulos están completados
- Las respuestas correctas nunca se exponen al cliente en las respuestas de las pruebas

---

## Referencia de la API

### Autenticación

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | Público | Registrar un nuevo usuario |
| POST | `/api/auth/login` | Público | Iniciar sesión, recibir tokens de acceso y refresco |
| POST | `/api/auth/logout` | Cookie | Revocar token de refresco |
| POST | `/api/auth/refresh` | Cookie | Rotar token de refresco, obtener nuevo token de acceso |

### Volúmenes

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/volumes` | Público | Listar todos los volúmenes |
| GET | `/:volumeId` | Bearer | Obtener detalle del volumen con capítulos |
| GET | `/api/volumes/:volumeId/continue` | Bearer | Obtener siguiente capítulo incompleto (marca el volumen como iniciado) |
| POST | `/api/volumes/:volumeId/purchase` | Bearer | Comprar un volumen con monedas del monedero |
| GET | `/api/volumes/:volumeId/started` | Bearer | Verificar si el usuario ha iniciado un volumen |

### Pruebas

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/volumes/:volumeId/:chapterId/prueba` | Bearer | Obtener preguntas de la prueba de un capítulo |
| POST | `/api/pruebas/:pruebaId/submit` | Bearer | Enviar respuestas, obtener puntuación y aprobado/reprobado |

### Usuarios

| Método | Endpoint | Auth | Descripción |
|---|---|---|---|
| GET | `/api/users/volumes` | Bearer | Listar volúmenes del usuario autenticado |

---

## Flujo de Autenticación

1. **Registro**: `POST /api/auth/register` — crea usuario, monedero (150 monedas), devuelve token de acceso + establece token de refresco como cookie httpOnly
2. **Inicio de sesión**: `POST /api/auth/login` — valida credenciales, devuelve token de acceso + cookie de refresco
3. **Acceder a recursos**: Incluir header `Authorization: Bearer <access_token>`
4. **Refrescar token**: `POST /api/auth/refresh` — usa cookie httpOnly para emitir nuevo token de acceso y rotar token de refresco
5. **Cerrar sesión**: `POST /api/auth/logout` — revoca el token de refresco

---

## Rutas del Frontend

| Ruta | Componente | Auth Requerida | Descripción |
|---|---|---|---|
| `/` | Home | No | Explorar todos los volúmenes |
| `/login` | Login | No | Formulario de inicio de sesión |
| `/register` | Register | No | Formulario de registro |
| `/about` | About | No | Información de la plataforma |
| `/volumeContent` | VolumeContent | Sí | Ver capítulos del volumen |
| `/chapterChallenge` | ChapterChallenge | Sí | Realizar prueba de un capítulo |
| `/profile` | Profile | Sí | Perfil del usuario y volúmenes adquiridos |
| `*` | NotFound | No | Página 404 |

---

## Testing

### Backend

```bash
cd backend
pnpm test
```

Los tests utilizan **Vitest** y **Supertest** para tests de integración HTTP.

### Frontend

```bash
cd frontend
pnpm test
```

Los tests utilizan **Vitest**, **React Testing Library** y **jsdom** para tests de componentes.

---

## Variables de Entorno

### Backend (`backend/.env`)

| Variable | Descripción | Ejemplo |
|---|---|---|
| `SECRET_KEY` | Secreto para firmar JWT | `my_secret_key` |
| `DB_PORT` | Puerto de PostgreSQL | `5432` |
| `FRONTEND_URL` | Url del Frontend | `frontend.com` |
| `DATABASE_URL` | Url de donde se despliega la db | `db.com` |