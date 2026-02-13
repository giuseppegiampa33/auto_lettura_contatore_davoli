---
description: Come avviare sempre i servizi del progetto Autolettura
---

Questo workflow descrive la procedura standard e affidabile per avviare tutti i servizi del progetto.

### Prerequisiti
- Docker e Docker Compose installati e in esecuzione.

### Procedura di Avvio

1. **Assicurarsi di essere nella root del progetto** (`Autolettura`).

2. **Avviare i servizi con Docker Compose**
// turbo
```powershell
docker-compose up -d
```

3. **Verificare lo stato dei servizi**
// turbo
```powershell
docker-compose ps
```
Tutti i container (`davoli_mysql`, `davoli_minio`, `davoli_backend`, `davoli_frontend`) dovrebbero risultare in stato `Up`.

4. **Accedere alle interfacce**
- **Frontend**: [http://localhost:3000](http://localhost:3000)
- **Backend API**: [http://localhost:3001](http://localhost:3001)
- **MinIO Console**: [http://localhost:9003](http://localhost:9003) (User: `minioadmin`, Pass: `minioadmin`)

### In caso di errori
- Se un servizio non parte, controlla i log:
  ```powershell
  docker-compose logs [nome_servizio]
  ```
- Se il database non è aggiornato, puoi forzare il rebuild del backend:
  ```powershell
  docker-compose up -d --build backend
  ```
