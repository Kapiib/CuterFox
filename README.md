# Rev Avstemningsapplikasjon

Dette er en webapplikasjon som lar brukere stemme på hvilken rev de synes er søtest. Applikasjonen viser to tilfeldige revebilder og registrerer brukerens valg. Den holder også oversikt over hvilke rever som får flest stemmer.

## Funksjonalitet

- Vise to tilfeldige revebilder som ikke er like
- La brukere stemme på den reven de synes er søtest
- Vise topp 5 mest populære rever
- Vise en fullstendig rangering av alle rever med paginering
- Automatisk oppdatering av bilder etter avstemning
- Responsivt design som fungerer på mobile enheter

## API-dokumentasjon

Applikasjonen har følgende API-endepunkter:

### `POST /api/vote`

Registrerer en stemme for et revebilde.

**Request:**
```json
{
  "imageUrl": "https://randomfox.ca/images/42.jpg"
}
```

**Response: (success(200))**
```json
{
  "success": true,
  "message": "Stemme registrert!"
}
```

**Response: (error(400))**
```json
{
  "success": false,
  "message": "Kunne ikke registrere stemme."
}
```

### `GET /api/vote/stats`

Henter statistikk om avstemningene.

**Response: (success(200))**
```json
{
  "totalVotes": 12,
  "uniqueImages": 30,
  "lastVote": "2023-11-20T14:30:45Z"
}
```

### `GET /api/vote/leaderboard`

Henter rangeringen av de mest populære revebildene.

**Query Parameters:**
- `limit` - Antall resultater (standard: 5)
- `page` - Sidenummer for paginering (standard: 1)

**Response: (success(200))**
```json
{
  "leaderboard": [
    {
      "imageUrl": "https://randomfox.ca/images/10.jpg",
      "votes": 235
    },
    {
      "imageUrl": "https://randomfox.ca/images/7.jpg",
      "votes": 187
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 6,
    "totalItems": 30
  }
}
```

## Prosjektskisse

### Systemarkitektur
```
+----------------+      HTTP      +----------------+      +----------------+
|                |  Forespørsler  |                |      |                |
|    Frontend    | ------------> |    Backend     | <--> |    Database    |
|  (React/Vue)   |   Responser    |   (Node.js)    |      |   (MongoDB)    |
|                | <------------ |                |      |                |
+----------------+               +----------------+      +----------------+
```

### Database-tabeller

#### Tabell: foxImages
- `_id`: ObjectId (primærnøkkel)
- `imageUrl`: String (unik)
- `addedDate`: Date
- `active`: Boolean

#### Tabell: votes
- `_id`: ObjectId (primærnøkkel)
- `imageUrl`: String (fremmednøkkel til foxImages.imageUrl)
- `timestamp`: Date
- `userIdentifier`: String (anonym brukeridentifikator)

### IP-plan
- **Frontend:** 192.168.1.10/24
- **Backend:** 192.168.1.20/24
- **Database:** 192.168.1.30/24 (lukket nettverk)
- **Lastbalanserer:** 192.168.1.5/24
- **Offentlig IP:** 203.0.113.10 (NAT til intern lastbalanserer)

## Sikkerhetsvurdering

### Potensielle sikkerhetshull

1. **Manglende API-autentisering**
   - Problem: API-endepunkter mangler autentisering, noe som kan tillate uautoriserte stemmer.
   - Løsning: Implementer JWT-basert autentisering for API-forespørsler.

2. **Sårbarhet for injeksjonsangrep**
   - Problem: Manglende validering av brukerinput kan føre til injeksjonsangrep.
   - Løsning: Implementer streng validering av alle brukerinput og bruk parameteriserte spørringer mot databasen.

3. **Rate limiting mangler**
   - Problem: Uten begrensninger kan brukere sende mange stemmer i rask rekkefølge.
   - Løsning: Implementer rate limiting for å begrense antall API-kall fra samme IP-adresse.

4. **Potensielle CORS-problemer**
   - Problem: Feil konfigurert CORS kan tillate forespørsler fra uautoriserte domener.
   - Løsning: Konfigurer CORS-innstillinger for å kun tillate forespørsler fra godkjente domener.

### Mulige angrepstyper

1. **Distributed Denial of Service (DDoS)**
   - Beskrivelse: Overbelastning av serveren med mange samtidige forespørsler.
   - Mottak: Implementer lastbalansering, rate limiting og CDN-beskyttelse.

2. **Cross-Site Scripting (XSS)**
   - Beskrivelse: Injisering av ondsinnet kode i brukergrensesnittet.
   - Mottak: Implementer Content Security Policy (CSP) og sikker håndtering av brukerdata.

3. **Cross-Site Request Forgery (CSRF)**
   - Beskrivelse: Tvinger brukere til å utføre uønskede handlinger på en applikasjon de er autentisert på.
   - Mottak: Bruk anti-CSRF tokens for alle POST-forespørsler.

