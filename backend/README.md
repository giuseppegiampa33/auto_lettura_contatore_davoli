# Autolettura Backend (NestJS)

Questo è il backend del progetto Autolettura, realizzato con il framework [NestJS](https://nestjs.com/).

## Caratteristiche Principali
- **API REST**: Gestione delle autoletture e interfaccia admin.
- **TypeORM**: Integrazione con MySQL per la persistenza dei dati.
- **S3 Integration**: Supporto per il caricamento di foto su MinIO (S3-compatible).
- **Security**: Implementazione di Helmet, CORS, e ValidationPipe.
- **JWT Auth**: Protezione dell'area amministrativa.

## Requisiti
- Node.js (v18+)
- Docker (per database e storage)

## Installazione Locale
```bash
npm install
```

## Esecuzione
```bash
# Sviluppo
npm run start:dev

# Produzione
npm run start:prod
```

## Variabili d'Ambiente
Consultare il file `.env` (o le impostazioni in `docker-compose.yml`) per le configurazioni di:
- DB (Host, Port, User, Password, Name)
- S3 (Endpoint, Bucket, Access Key, Secret Key)
- JWT_SECRET
