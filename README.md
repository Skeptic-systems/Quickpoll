# VDMA QuickPoll

Mobile-optimierte Quiz-Webapp mit Admin-Panel für VDMA.

## Projektstruktur

```
apps/
  web/           # Next.js (App Router)
packages/
  ui/            # shadcn/ui wrapper, Theme, tokens
  db/            # Prisma schema & client
```

## Tech Stack

- **Frontend**: React + TypeScript, Next.js (App Router)
- **UI**: shadcn/ui, Tailwind CSS
- **Database**: MariaDB mit Prisma ORM
- **Auth**: better-auth
- **i18n**: next-intl
- **Charts**: react-chartjs-2
- **QR-Codes**: qrcode.react

## Features

- Sprachauswahl (DE/EN)
- 15 zufällige Fragen aus 30er-Pool
- Anonyme Teilnahme
- QR-Code Generation
- Live-Ergebnisse mit Charts
- Admin-Panel für Quiz-Management
- VDMA Branding
- Dark/Light Mode

## 🚀 Development Setup (Schritt-für-Schritt)

### Schritt 1: Voraussetzungen installieren

**Node.js und pnpm:**
```bash
# Node.js 18+ installieren (falls nicht vorhanden)
# Download von: https://nodejs.org/

# pnpm installieren
npm install -g pnpm

# Versionen prüfen
node --version  # sollte 18+ sein
pnpm --version  # sollte 8+ sein
```

**MariaDB/MySQL installieren:**
- **Windows**: XAMPP oder MySQL Installer herunterladen
- **macOS**: `brew install mariadb` oder MySQL von mysql.com
- **Linux**: `sudo apt install mariadb-server` (Ubuntu/Debian)

### Schritt 2: Repository klonen und Dependencies installieren

```bash
# Repository klonen
git clone <repository-url>
cd quickpoll

# Alle Dependencies installieren (Monorepo)
pnpm install
```

### Schritt 3: Datenbank einrichten

**MariaDB/MySQL starten:**
```bash
# Windows (XAMPP): XAMPP Control Panel öffnen und MySQL starten
# macOS/Linux: 
sudo systemctl start mariadb  # oder mysql
```

**Datenbank erstellen:**
```bash
# In MariaDB/MySQL einloggen
mysql -u root -p

# Datenbank erstellen
CREATE DATABASE quickpoll;
CREATE USER 'quickpoll'@'localhost' IDENTIFIED BY 'password123';
GRANT ALL PRIVILEGES ON quickpoll.* TO 'quickpoll'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Schritt 4: Umgebungsvariablen konfigurieren

```bash
# Umgebungsvariablen-Datei für lokales Development erstellen
cat > apps/web/.env.local << EOF
# Database - Ihre lokalen Datenbank-Credentials
DATABASE_URL="mysql://quickpoll:password123@localhost:3306/quickpoll"

# Authentication - Starken Secret generieren
AUTH_SECRET="ihr-super-geheimer-schluessel-hier-32-zeichen-minimum"

# App Configuration
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

# VDMA Branding
NEXT_PUBLIC_PRIMARY_COLOR="#003366"
NEXT_PUBLIC_ACCENT_COLOR="#FF6600"
EOF
```

### Schritt 5: Datenbank-Schema einrichten

```bash
# Prisma Client generieren
pnpm db:generate

# Datenbank-Schema erstellen
pnpm db:push

# Beispieldaten einfügen
pnpm db:seed
```

### Schritt 6: Development Server starten

```bash
# Development Server starten
pnpm dev
```

**✅ Erfolg!** Die App läuft jetzt auf: http://localhost:3000

### Schritt 7: Testen

1. **Startseite**: http://localhost:3000
2. **Admin-Panel**: http://localhost:3000/admin
3. **Beispiel-Quiz**: http://localhost:3000/q/sample-quiz/start
4. **Impressum**: http://localhost:3000/impressum
5. **Datenschutz**: http://localhost:3000/datenschutz

### Schritt 8: Database Studio (optional)

```bash
# Prisma Studio öffnen (GUI für Datenbank)
pnpm db:studio
```
Öffnet sich auf: http://localhost:5555

## Entwicklung

```bash
# Development Server starten
pnpm dev

# Build für Production
pnpm build

# Production Server starten
pnpm start

# Database Studio öffnen
pnpm db:studio
```

## Routen

### Öffentliche Routen
- `/` - Startseite
- `/q/[slug]/start` - Quiz-Start mit Sprachauswahl
- `/q/[slug]/s/[attemptId]/[index]` - Quiz-Fragen
- `/q/[slug]/results` - Öffentliche Ergebnisse
- `/impressum` - Impressum
- `/datenschutz` - Datenschutzerklärung

### Admin-Routen
- `/admin` - Admin-Dashboard
- `/admin/quizzes` - Quiz-Management
- `/admin/questions` - Fragen-Management
- `/admin/results` - Ergebnisse-Analyse

## Datenmodell

Das Projekt verwendet Prisma mit MariaDB und folgende Hauptmodelle:

- **User**: Admin-Benutzer
- **Quiz**: Quiz-Umfragen
- **Question**: Fragen mit DE/EN Texten
- **Choice**: Antwortoptionen
- **Attempt**: Quiz-Teilnahmen
- **Answer**: Antworten der Teilnehmer

## 🐳 Docker Deployment (Schritt-für-Schritt)

### Schritt 1: Docker installieren

**Windows:**
- Docker Desktop von https://docker.com herunterladen und installieren
- Nach Installation neu starten

**macOS:**
```bash
# Mit Homebrew
brew install --cask docker
```

**Linux (Ubuntu/Debian):**
```bash
# Docker installieren
sudo apt update
sudo apt install docker.io docker-compose
sudo systemctl start docker
sudo systemctl enable docker

# User zu Docker-Gruppe hinzufügen
sudo usermod -aG docker $USER
# Neu einloggen erforderlich
```

### Schritt 2: Umgebungsvariablen für Docker erstellen

```bash
# .env Datei im Projektroot erstellen
cp env.example .env
```

**Datei `.env` bearbeiten:**
```env
# Database Credentials
MYSQL_ROOT_PASSWORD=rootpassword123
MYSQL_USER=quickpoll
MYSQL_PASSWORD=password123

# App Configuration
AUTH_SECRET=ihr-super-geheimer-schluessel-fuer-production-32-zeichen-minimum
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# VDMA Branding
NEXT_PUBLIC_PRIMARY_COLOR=#003366
NEXT_PUBLIC_ACCENT_COLOR=#FF6600
```

### Schritt 3: Docker Compose starten

```bash
# Alle Services starten (App + MariaDB)
docker-compose up -d

# Logs verfolgen
docker-compose logs -f

# Status prüfen
docker-compose ps
```

### Schritt 4: Datenbank-Setup in Docker

```bash
# In den App-Container einloggen
docker-compose exec app sh

# Prisma Commands ausführen
pnpm db:generate
pnpm db:push
pnpm db:seed

# Container verlassen
exit
```

### Schritt 5: App testen

**✅ Erfolg!** Die App läuft jetzt auf: http://localhost:3000

**Services prüfen:**
- **App**: http://localhost:3000
- **MariaDB**: localhost:3306 (User: quickpoll, Password: password123)

### Schritt 6: Production Deployment

**Für echten Server:**

1. **Server vorbereiten:**
```bash
# Repository auf Server klonen
git clone <repository-url>
cd quickpoll

# .env mit Production-Werten erstellen
nano .env
```

2. **Production .env Beispiel:**
```env
# Database (externe MariaDB)
MYSQL_ROOT_PASSWORD=sehr-sicheres-root-passwort
MYSQL_USER=quickpoll_prod
MYSQL_PASSWORD=sehr-sicheres-prod-passwort

# App Configuration
AUTH_SECRET=sehr-sicherer-production-secret-64-zeichen-minimum
NEXT_PUBLIC_BASE_URL=https://quiz.vdma.de

# VDMA Branding
NEXT_PUBLIC_PRIMARY_COLOR=#003366
NEXT_PUBLIC_ACCENT_COLOR=#FF6600
```

3. **Mit Docker Compose starten:**
```bash
# Production Build
docker-compose up -d --build

# Logs überwachen
docker-compose logs -f app
```

### Schritt 7: SSL/TLS Setup (optional)

**Mit Let's Encrypt:**
```bash
# Certbot installieren
sudo apt install certbot

# SSL-Zertifikat erstellen
sudo certbot certonly --standalone -d quiz.vdma.de

# Nginx Reverse Proxy konfigurieren
# (siehe nginx.conf Beispiel unten)
```

### Schritt 8: Monitoring und Wartung

```bash
# Container-Status prüfen
docker-compose ps

# Logs anzeigen
docker-compose logs app
docker-compose logs db

# Backup erstellen
docker-compose exec db mysqldump -u root -p quickpoll > backup.sql

# Updates deployen
git pull
docker-compose up -d --build
```

## 🔧 Troubleshooting

### Häufige Probleme

**1. Port bereits belegt:**
```bash
# Port 3000 prüfen
netstat -tulpn | grep :3000

# Anderen Port verwenden
docker-compose up -d -p 3001:3000
```

**2. Datenbank-Verbindung fehlgeschlagen:**
```bash
# MariaDB-Container prüfen
docker-compose logs db

# Datenbank manuell testen
docker-compose exec db mysql -u root -p
```

**3. Build-Fehler:**
```bash
# Cache leeren
docker-compose down
docker system prune -a
docker-compose up -d --build
```

**4. Permission-Denied (Linux):**
```bash
# Docker-Berechtigungen prüfen
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
```

### Nginx Reverse Proxy (Production)

**nginx.conf Beispiel:**
```nginx
server {
    listen 80;
    server_name quiz.vdma.de;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name quiz.vdma.de;
    
    ssl_certificate /etc/letsencrypt/live/quiz.vdma.de/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/quiz.vdma.de/privkey.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🌍 DE-Hosting Empfehlungen

Das Projekt ist für Hosting in Deutschland optimiert:

**Empfohlene Provider:**
- **Hetzner**: Cloud-Server in Deutschland
- **IONOS**: Deutsche Hosting-Lösungen
- **Strato**: DSGVO-konforme Services

**Wichtige Punkte:**
- ✅ MariaDB auf DE-Server
- ✅ TLS/SSL mit Let's Encrypt
- ✅ DSGVO-konforme Datenhaltung
- ✅ Keine Datenübertragung außerhalb EU
- ✅ Deutsche Datenschutzbestimmungen

## Lizenz

© 2024 VDMA - Verband Deutscher Maschinen- und Anlagenbau e.V.
