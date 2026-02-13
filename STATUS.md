# Stato Globale del Progetto - Autolettura Davoli

## Data: 13 Febbraio 2026

### Panoramica Architetturale
Il sistema è composto da quattro servizi principali che girano in container Docker:
- **Frontend**: Next.js (Porta 3000) - Interfaccia utente per cittadini e amministratori.
- **Backend**: NestJS (Porta 3001) - API server per la gestione dei dati e degli upload.
- **MySQL**: Database (Porta 3307 esterna, 3306 interna) - Persistenza dei dati delle autoletture.
- **MinIO**: S3-Compatible Storage (Porta 9002/9003) - Archiviazione delle foto dei contatori.

### Stato dei Servizi
| Servizio | Stato | Container Name | Note |
|----------|-------|----------------|------|
| MySQL | ✅ Running | `davoli_mysql` | Database inizializzato. |
| MinIO | ✅ Running | `davoli_minio` | Storage configurato con bucket `autolettura-uploads`. |
| Backend | ✅ Running | `davoli_backend` | API attiva e collegata a DB e S3. |
| Frontend | ✅ Running | `davoli_frontend` | Interfaccia attiva. |

### Funzionalità Recenti e Modifiche
- **Rimozione Firma Digitale**: La funzionalità di firma digitale è stata completamente rimossa per semplificare l'esperienza utente.
- **Dockerizzazione**: Tutti i servizi sono ora completamente gestiti tramite Docker Compose, garantendo consistenza tra ambiente locale e produzione.
- **Area Admin**: Accesso protetto per la gestione delle letture caricate.

### Come Avviare Sempre i Servizi
Il metodo raccomandato per avviare il sistema è tramite Docker Compose:
```bash
docker-compose up -d
```
Questo comando avvia tutti i componenti necessari nell'ordine corretto.

### Note Tecniche
- Le variabili d'ambiente sono configurate nel file `docker-compose.yml` e nei file `.env` delle rispettive cartelle.
- Per lo sviluppo del frontend, è possibile avviarlo localmente con `npm run dev` nella cartella `frontend` dopo aver avviato i servizi di supporto con Docker.
