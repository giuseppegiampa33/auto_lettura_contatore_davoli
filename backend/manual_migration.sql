-- 1. Seleziona il database (modifica se il nome è diverso)
USE autolettura;

-- 2. Aggiungi le nuove colonne
-- 'codice_fiscale' e 'recapito_telefonico' sono obbligatori (NOT NULL)
-- 'email' è opzionale (NULL)
ALTER TABLE submissions 
ADD COLUMN codice_fiscale VARCHAR(255) NOT NULL AFTER indirizzo,
ADD COLUMN recapito_telefonico VARCHAR(255) NOT NULL AFTER codice_fiscale,
ADD COLUMN email VARCHAR(255) NULL AFTER recapito_telefonico;

-- 3. Rimuovi le vecchie colonne (opzionale, se esistono ancora)
-- Se ricevi errore "Can't DROP ... check that column/key exists", significa che sono già state rimosse.
-- Puoi eseguire queste righe una alla volta o ignorare gli errori se le colonne non ci sono.

-- ALTER TABLE submissions DROP COLUMN numero_utenza;
-- ALTER TABLE submissions DROP COLUMN numero_fattura;
-- ALTER TABLE submissions DROP COLUMN data_ultima_fattura;
