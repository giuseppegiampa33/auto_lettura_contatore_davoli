# Autolettura Contatore Idrico — Comune di Davoli

Servizio web per l'invio di autoletture del contatore idrico senza registrazione.

## Architettura

```
┌───────────────┐       ┌───────────────┐       ┌────────────┐
│   Frontend    │──────▶│   Backend     │──────▶│   MySQL    │
│  (Next.js)    │ REST  │  (NestJS)     │ ORM   │            │
│  :3000        │       │  :3001        │       │  :3306     │
└───────────────┘       └───────┬───────┘       └────────────┘
                                │
                                │ S3 API
                                ▼
                        ┌───────────────┐
                        │    MinIO      │
                        │  (S3 compat.) │
                        │  :9000/:9001  │
                        └───────────────┘
```

## Struttura del Progetto

```
Autolettura/
├── backend/                    # NestJS API
│   ├── src/
│   │   ├── admin/              # Admin auth (JWT) + endpoints
│   │   ├── submissions/        # Logica autolettura
│   │   ├── upload/             # Upload S3/MinIO
│   │   ├── app.module.ts       # Modulo principale
│   │   └── main.ts             # Entry point + Helmet/CORS
│   ├── .env                    # Variabili ambiente (dev)
│   └── Dockerfile
├── frontend/                   # Next.js UI
│   ├── app/
│   │   ├── page.tsx            # Landing page
│   │   ├── submit/page.tsx     # Form autolettura
│   │   ├── confirm/page.tsx    # Conferma invio
│   │   ├── admin/              # Login + Dashboard admin
│   │   └── components/         # Componenti riutilizzabili
│   ├── .env.local              # Variabili ambiente (dev)
│   └── Dockerfile
└── docker-compose.yml          # MySQL + MinIO + Backend + Frontend
```

## Avvio Rapido (Sviluppo)

### Prerequisiti
- **Node.js** >= 18
- **Docker** e **Docker Compose** (per MySQL e MinIO)

### 1. Avviare i servizi di supporto
```bash
docker-compose up -d mysql minio createbuckets
```

### 2. Backend
```bash
cd backend
cp .env.example .env        # (il .env è già presente per dev)
npm install
npm run start:dev
```
Backend → `http://localhost:3001`

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```
Frontend → `http://localhost:3000`

### 4. Login Admin (dev)
- URL: `http://localhost:3000/admin`
- Username: `admin`
- Password: `admin`
- **⚠️ Cambiare le credenziali in produzione!**

## Variabili d'Ambiente

### Backend (`.env`)
| Variabile | Descrizione | Default Dev |
|-----------|-------------|-------------|
| `DATABASE_HOST` | Host MySQL | `localhost` |
| `DATABASE_PORT` | Porta MySQL | `3306` |
| `DATABASE_USER` | Utente MySQL | `davoli_user` |
| `DATABASE_PASSWORD` | Password MySQL | `davoli_password` |
| `DATABASE_NAME` | Nome DB | `autolettura` |
| `S3_ENDPOINT` | Endpoint MinIO/S3 | `http://localhost:9000` |
| `S3_BUCKET` | Nome bucket | `autolettura-uploads` |
| `S3_ACCESS_KEY` | Access Key S3 | `minioadmin` |
| `S3_SECRET_KEY` | Secret Key S3 | `minioadmin` |
| `JWT_SECRET` | Segreto JWT | cambiare |

### Frontend (`.env.local`)
| Variabile | Descrizione | Default Dev |
|-----------|-------------|-------------|
| `NEXT_PUBLIC_API_URL` | URL del backend | `http://localhost:3001` |

## Deploy su Server

### 1. Configurare HTTPS
Usare un reverse proxy (Nginx/Caddy) con certificato SSL (Let's Encrypt).

### 2. Build di produzione
```bash
# Backend
cd backend
npm run build
node dist/main.js

# Frontend
cd frontend
npm run build
npm start
```

### 3. Docker Compose (produzione)
```bash
docker-compose up -d
```
NB: Il frontend in Docker è configurato per avviarsi in modalità produzione (`npm run build && npm start`) per garantire stabilità e performance. Per lo sviluppo frontend, si consiglia di avviare Next.js in locale (`npm run dev`) puntando ai servizi Docker.

Assicurarsi di aggiornare le variabili ambiente con valori sicuri.

## Checklist Sicurezza

- [x] **Validazione server-side**: `ValidationPipe` globale con `whitelist` e `forbidNonWhitelisted`
- [x] **Sanitizzazione input**: `class-validator` + `class-transformer`
- [x] **Helmet**: header HTTP di sicurezza
- [x] **CORS**: configurabile (restrittivo in produzione)
- [x] **Upload sicuro**: validazione MIME type (jpg/png/webp), limite 10MB
- [x] **IP Hashing**: SHA-256, nessun IP in chiaro nel DB
- [x] **Nessuna PII nei log**: logging sicuro tramite Logger NestJS
- [x] **Query parametrizzate**: TypeORM (protezione SQL injection)
- [x] **JWT Auth**: per area admin con token scadenza 8h
- [x] **Audit Log**: tracciamento azioni admin
- [x] **Segreti via env**: nessuna credenziale nel codice
- [x] **GDPR**: informativa privacy con base giuridica, finalità, retention
- [x] **Checkbox privacy**: obbligatoria prima dell'invio
- [ ] **Rate limiting**: da configurare con `@nestjs/throttler` in produzione
- [ ] **CAPTCHA/Anti-bot**: da integrare (es. hCaptcha) in produzione
- [ ] **TOTP MFA**: predisposto, da attivare per admin
- [ ] **Antivirus hook**: opzionale, da configurare
- [ ] **Data retention cron**: da schedulare per cancellazione foto
