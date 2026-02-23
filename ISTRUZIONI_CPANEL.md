# ISTRUZIONI DEPLOY SU CPANEL
## Prerequisiti completati
- Database MySQL: corapi_autolettura
- Utente DB: autolettura
- Password DB: autolettura*26

---

## STEP 1 — Modifica i placeholder prima di tutto

Nei file seguenti, sostituisci `autolettura.corapi.it` con il tuo vero dominio:
- `backend/.env` → riga PUBLIC_URL
- `frontend/.env.production` → riga NEXT_PUBLIC_API_URL

---

## STEP 2 — Builda il frontend sul TUO PC

```bash
cd frontend
npm install
npm run build
```

Questo crea la cartella `.next/` che dovrai caricare sul server.

---

## STEP 3 — Carica il backend su cPanel

1. Vai su **cPanel → File Manager**
2. Entra nella cartella `public_html` (o crea una sottocartella es. `api`)
3. Carica tutto il contenuto della cartella `backend/` 
   - inclusi: `src/`, `dist/` (dopo il build), `package.json`, `.env`, `app.js`
   - NON caricare: `node_modules/`

4. Vai su **cPanel → Node.js App → Create Application**
   - Node.js version: 18.x o superiore
   - Application mode: Production
   - Application root: `api` (o dove hai caricato i file)
   - Application URL: `tuodominio.it/api`  
   - Application startup file: `app.js`

5. Clicca **"Run NPM Install"** dal pannello Node.js App
6. Poi esegui il build: nel pannello trovi "Run script" → digita `build`
7. Clicca **Restart**

---

## STEP 4 — Carica il frontend su cPanel

1. Crea una seconda Node.js App in cPanel:
   - Application root: `frontend` (o `public_html` se è il dominio principale)  
   - Application startup file: `node_modules/.bin/next` con args `start`
   - Oppure crea `server.js` con: `require('next/dist/server/next-server')`

2. Carica i file del frontend:
   - `app/`, `public/`, `.next/`, `package.json`, `next.config.ts`, `.env.production`
   - NON caricare: `node_modules/`

3. **Run NPM Install** → poi **Restart**

---

## STEP 5 — Configura il database

Puoi usare il file SQL incluso:
1. cPanel → phpMyAdmin
2. Seleziona `corapi_autolettura`
3. Importa `backend/manual_migration.sql` (se presente)
   oppure avvia l'app: TypeORM creerà le tabelle automaticamente (synchronize: true)

---

## STEP 6 — Crea l'utente admin

Dopo aver avviato il backend, fai una richiesta POST:
```
POST https://tuodominio.it/api/admin/setup
```
(solo la prima volta, poi questo endpoint si disabilita automaticamente)

---

## NOTE IMPORTANTI
- Cambia JWT_SECRET nel file .env con una stringa lunga e casuale
- Cambia la password del DB dopo il deploy
- La cartella `uploads/` verrà creata automaticamente dal backend
