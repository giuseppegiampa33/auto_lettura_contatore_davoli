# Autolettura Frontend (Next.js)

Questo è il frontend del progetto Autolettura, realizzato con [Next.js](https://nextjs.org/).

## Funzionalità
- **Invio Lettura**: Form intuitivo per l'inserimento dei dati del contatore e upload della foto.
- **Area Amministrativa**: Dashboard per la visualizzazione e gestione delle letture inviate dai cittadini.
- **Design Moderno**: Interfaccia pulita e responsive.

## Sviluppo Locale
```bash
npm install
npm run dev
```
L'applicazione sarà disponibile all'indirizzo `http://localhost:3000`.

## Integrazione Backend
Il frontend comunica con il backend definito dalla variabile d'ambiente `NEXT_PUBLIC_API_URL` (default: `http://localhost:3001`).

## Docker
In ambiente containerizzato, l'app viene compilata per la produzione:
```bash
npm run build
npm start
```
