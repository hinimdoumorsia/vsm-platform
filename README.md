#  VSM Platform — Plateforme de Cartographie de Flux de Valeur

## **Pourquoi VSM Platform ?**

**VSM Platform** est une plateforme industrielle pensée selon une nouvelle manière, dédiée à la **cartographie et l'optimisation des flux de valeur** (Value Stream Mapping) dans les processus de fabrication et les chaînes logistiques. Conçue avec une architecture modulaire et des interfaces intuitives, elle combine des outils d'analyse 2D/3D avec un moteur de simulation avancé et des calculs KPI Lean en temps réel.

**Statut** : La réalité virtuelle (VR/XR) est déjà intégrée dans ce projet. La plateforme permet dès maintenant une visualisation immersive et collaborative des flux de processus via les casques VR compatibles WebXR (Meta Quest, HTC Vive, etc.).

### **Les limites des approches actuelles :**

Les interfaces 2D actuelles sont lentes et complexes. Les ingénieurs et industriels réalisent encore leurs VSM sur papier ou Excel après une visite terrain. Il existe un décalage entre la phase d'observation terrain et la phase de modélisation, ce qui entraîne des pertes d'informations, des oublis et des erreurs.

La collaboration avec un expert distant (en France, aux États-Unis ou ailleurs) est extrêmement difficile. Il est également complexe de travailler à plusieurs simultanément sur le même diagramme.

### **La solution VSM Platform :**

Avec l'utilisation de technologies modernes — **React (Three.js)** pour le frontend 2D/3D, **Spring Boot** pour le backend robuste, et **WebSocket** pour la collaboration temps réel — nous proposons une **plateforme VSM complètement immersive et synchronisée 2D/3D**.

La plateforme permet :
- Une synchronisation en temps réel entre la vue 2D et la vue 3D
- Une collaboration temps réel via WebSocket (plusieurs experts peuvent travailler ensemble où qu'ils soient dans le monde)
- Une interface rapide et fluide
- Un lien direct entre le terrain et la modélisation
- Une immersion VR déjà fonctionnelle avec support WebXR (Meta Quest, HTC Vive, etc.)

**VSM Platform réinvente la cartographie des flux de valeur pour l'industrie 4.0.**

---
## *Aperçu rapide de la plateforme*

Voici un aperçu animé de **VSM Platform** en action, montrant l'éditeur 2D synchronisé avec la vue 3D immersive :

![Démo VSM Platform](image/mon-demo.gif)

> **Vidéo démo** : Visualisation en temps réel du flux de valeur, synchronisation 2D ↔ 3D, et interface interactive.

## **Problématiques des Interfaces Traditionnelles**

### Limites des outils VSM actuels :

| Problème | Impact |
|----------|--------|
| **Interfaces 2D statiques** | Difficulté à visualiser la complexité spatiale des flux | 
| **Pas de synchronisation 2D ↔ 3D** | Maintenance de deux modèles différents, incohérences |
| **Simulation manuelle** | Calculs manuels longs et sujets aux erreurs |
| **KPI non mis à jour en temps réel** | Décisions basées sur des données obsolètes |
| **Pas de collaboration interactive** | Ateliers VSM limités à une personne à la fois |
| **Manque d'immersion** | Difficile de "marcher" mentalement dans le processus |

---

## **Solution Présentée**

### Comment VSM Platform résout ces problèmes :

#### 1️ **Synchronisation 2D ↔ 3D Bidirectionnelle**
-  Modèle unique (Zustand store)
- Modifications 2D → mise à jour 3D instantanée
- Navigation 3D → édition 2D synchronisée
- Cohérence garantie

#### 2️⃣ **Simulation en Temps Réel**
-  Moteur à événements discrets intégré
-  Calcul KPI live pendant la simulation
-  Comparaison État Actuel ↔ État Futur
-  Identification des goulots d'étranglement

#### 3️⃣ **Visualisation 3D Immersive**
- Three.js + React Three Fiber pour rendu haute performance
- OrbitControls pour exploration intuitive
- Prêt pour intégration WebXR (Meta Quest, HTC Vive, etc.)
- Immersion VR déjà fonctionnelle et opérationnelle

#### 4️⃣ **Dashboard KPI Avancé**
- 7 KPI Lean calculés automatiquement
- Graphiques interactifs (Recharts)
- Comparaison visuelle améliorations
- Export multi-formats (PDF, Excel, PNG, JSON)

#### 5️⃣ **Collaborative & Scalable**
- WebSocket STOMP pour collaboration temps réel
- Backend Spring Boot robuste
- PostgreSQL pour persistance
- REST API complète

---

## **Vue d'ensemble**

Plateforme web industrielle de Value Stream Mapping combinant :
- Éditeur 2D drag & drop (React Flow)
- Vue 3D synchronisée (React Three Fiber / Three.js)
- Moteur de simulation discret
- Calcul KPI Lean en temps réel
- Backend Spring Boot + PostgreSQL

---

---

## *Étapes des Travaux Réalisés*

### **Phase 1 : Analyse et Architecture (Fondations)**
- Définition de l'architecture modulaire frontend/backend
- Conception du modèle de données VSM complet
- Sélection des frameworks (React, React Flow, Three.js, Spring Boot)
- Conception de la synchronisation 2D ↔ 3D

### **Phase 2 : Développement Backend**
- API REST complète (Spring Boot)
- Configuration JWT + OAuth2 (SecurityConfig)
- Schéma PostgreSQL avec migrations Flyway
- Services métier (VSM, KPI, Simulation, Export)
- WebSocket STOMP pour collaboration temps réel

### **Phase 3 : Développement Frontend - Édition**
-  Éditeur 2D avec React Flow
-  13 symboles VSM (SVG React components)
-  Panneau de propriétés interactif
- Palette drag & drop
- Toolbar (undo/redo/zoom)
-  Timeline (état actuel/futur)

### **Phase 4 : Développement Frontend - 3D & Synchronisation**
-  Scène Three.js avec OrbitControls
- Synchronisation bidirectionnelle (Zustand store)
-  Conversion coordonnées 2D → 3D
-  Animations et interactions 3D
- Support VR intégré et fonctionnel (WebXR)

### **Phase 5 : Simulation & KPI**
- Moteur de simulation à événements discrets
- Calcul des 7 KPI Lean
- Calcul Lead Time, VAT, WIP, Takt Time
- Comparaison État Actuel ↔ État Futur
- Évènements WebSocket de simulation

### **Phase 6 : Dashboard & Reporting**
- Dashboard KPI avec Recharts
- Graphiques interactifs
- Export multi-formats
  - PDF via jsPDF
  - Excel (XLSX)
  - PNG (html2canvas)
  - JSON

### **Phase 7 : Tests & Déploiement**
- Tests unitaires backend
- Tests d'intégration API
- Docker support (docker-compose.yml)
- Configuration multi-environnements (dev, prod)

### **Phase 8 : Documentation & Préparation VR** (En cours)
-  Génération de cette documentation
- Support WebXR
- Contrôles manettes VR
- Mode immersif Multi-utilisateurs

---

## **Comment Lancer le Projet**

### Prérequis
- **Node.js** >= 18.x
- **Java** >= 21 (Maven)
- **Docker** & **Docker Compose** (recommandé)
- **PostgreSQL** 16+ (ou via Docker)

### *Option 1 : Démarrage avec Docker Compose (Recommandé)*

```bash
# À la racine du projet
docker-compose up -d

# Le projet sera accessible à :
# - Frontend : http://localhost:5173
# - Backend API : http://localhost:8080
# - Base de données : localhost:5432
```

**Docker Compose lance automatiquement :**
- PostgreSQL (5432)
- Backend Spring Boot (8080)
- Frontend Vite (5173)

### Option 2 : Démarrage Manuel

#### 1. **Démarrer la Base de Données**

```bash
# Avec Docker uniquement
docker run -d --name vsm-db \
  -e POSTGRES_DB=vsm_db \
  -e POSTGRES_USER=vsm \
  -e POSTGRES_PASSWORD=vsm_secret \
  -p 5432:5432 postgres:16

# Ou installez PostgreSQL localement et créez la base :
createdb -U postgres vsm_db
```

#### 2. **Démarrer le Backend**

```bash
cd backend

# Option A : Avec Maven
mvn clean install
mvn spring-boot:run

# Option B : En IDE (VS Code / IntelliJ)
# - Ouvrir VSMApplication.java
# - Cliquer "Run" ou Shift+F10

# Le backend s'exécute sur : http://localhost:8080
```

#### 3. **Démarrer le Frontend**

```bash
cd frontend

# Installer les dépendances
npm install

# Mode développement
npm run dev
# Accès : http://localhost:5173

# Ou générer une version production
npm run build
npm run preview
```

### Vérification du Démarrage

1. **Frontend** : Accédez à `http://localhost:5173`
   - Vous devriez voir l'interface VSM Platform

2. **Backend API** : Testez avec Postman/cURL
   ```bash
   curl http://localhost:8080/api/v1/projects
   # Retourne : []  (liste vide de projets)
   ```

3. **Base de Données** : Connectez-vous à PostgreSQL
   ```bash
   psql -U vsm -d vsm_db -h localhost -p 5432
   # Affichera les tables créées par les migrations
   ```

---

## *Structure des Dossiers*

```
vsm-platform/
├── docker-compose.yml          # Configuration Docker complète
├── README.md
├── frontend/
│   ├── src/
│   │   ├── api/                        # Clients HTTP (axios)
│   │   │   ├── projectApi.ts
│   │   │   ├── diagramApi.ts
│   │   │   ├── kpiApi.ts
│   │   │   └── simulationApi.ts
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   ├── VSMEditor.tsx       Éditeur React Flow principal
│   │   │   │   ├── PropertyPanel.tsx   # Panneau de propriétés nœud
│   │   │   │   ├── SymbolPalette.tsx   # Palette drag & drop
│   │   │   │   ├── Toolbar.tsx         # Barre d'outils (undo/redo/zoom)
│   │   │   │   └── TimelineBar.tsx     # Barre de temps (état actuel/futur)
│   │   │   ├── 3d/
│   │   │   │   └── VSMScene3D.tsx      Scène Three.js synchronisée (Prêt VR)
│   │   │   ├── simulation/
│   │   │   │   ├── SimulationPanel.tsx # Contrôles simulation
│   │   │   │   └── SimEngine.ts        # Moteur temps discret
│   │   │   ├── dashboard/
│   │   │   │   └── KPIDashboard.tsx    Dashboard KPI + graphiques
│   │   │   ├── export/
│   │   │   │   └── ExportModal.tsx     # Modal d'export
│   │   │   └── ui/                     # Composants UI réutilisables
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts         # WebSocket STOMP
│   │   │   └── ...
│   │   ├── store/
│   │   │   └── vsmStore.ts             Zustand global store (2D ↔ 3D sync)
│   │   ├── types/
│   │   │   └── vsm.types.ts            Types TypeScript complets
│   │   └── pages/
│   │       ├── EditorPage.tsx
│   │       └── DashboardPage.tsx
│   ├── package.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
└── backend/
    ├── pom.xml
    └── src/main/
        ├── java/com/vsm/platform/
        │   ├── VSMApplication.java      Classe main Spring Boot
        │   ├── controller/
        │   │   ├── VSMController.java
        │   │   ├── KPIController.java
        │   │   ├── SimulationController.java
        │   │   └── ExportController.java
        │   ├── service/
        │   │   ├── VSMService.java
        │   │   ├── KPIService.java      Calculs KPI côté serveur
        │   │   ├── SimulationService.java
        │   │   └── ExportService.java
        │   ├── domain/
        │   │   ├── model/               Entities JPA
        │   │   └── enums/
        │   ├── repository/              # Spring Data JPA
        │   ├── dto/                     # Request / Response DTOs
        │   ├── config/
        │   │   ├── SecurityConfig.java  # JWT + OAuth2
        │   │   └── WebSocketConfig.java # STOMP WebSocket
        │   └── websocket/
        │       └── VSMWebSocketHandler.java
        └── resources/
            ├── application.yml          Configuration complète
            ├── application-dev.yml
            ├── application-prod.yml
            └── db/migration/
                └── V1__init_schema.sql  Schéma PostgreSQL
```

---

## **API REST**

| Méthode | Endpoint                             | Description                    |
|---------|--------------------------------------|--------------------------------|
| GET     | `/api/v1/projects`                   | Tous les projets               |
| POST    | `/api/v1/projects`                   | Créer projet                   |
| GET     | `/api/v1/diagrams/project/{id}`      | Diagrammes d'un projet         |
| POST    | `/api/v1/diagrams`                   | Sauvegarder diagramme          |
| POST    | `/api/v1/kpi/compute/{diagramId}`    | Calculer KPIs                  |
| GET     | `/api/v1/kpi/compare?current&future` | Comparer état actuel/futur     |
| POST    | `/api/v1/simulation/run/{id}`        | Lancer simulation              |
| GET     | `/api/v1/export/{id}/pdf`            | Exporter PDF                   |
| GET     | `/api/v1/export/{id}/excel`          | Exporter Excel KPI             |
| GET     | `/api/v1/export/{id}/json`           | Exporter JSON                  |

---
## **Réalité Virtuelle (VR) et Intégration de Casque**

### Affichage 3D sans casque
- La scène 3D est visible directement dans le navigateur via la page 3D.
- Utilisez la souris :
  - Clic gauche + glisser = rotation
  - Molette = zoom
  - Clic droit + glisser = déplacement caméra
- Ceci fonctionne sur tous les postes, casque ou non.

### Utiliser un casque VR avec le projet
1. Ouvrez le navigateur compatible WebXR :
   - Chrome/Edge avec support WebXR
   - Oculus Browser (Quest/Meta)
   - Firefox Reality / WebXR compatible
2. Lancez le frontend : `npm run dev`
3. Accédez à `http://localhost:5173`
4. Activez la vue 3D dans l’application.
5. Cliquez sur le bouton **Entrer en VR** affiché en superposition.

### Casques recommandés
- Meta Quest 2 / Quest 3 (via Oculus Link, Air Link ou navigateur intégré)
- HTC Vive / Vive Pro / Vive Cosmos
- Valve Index
- Windows Mixed Reality
- Pico 4 / Pico 5

### Configuration d’un casque externe connecté au PC
#### Meta Quest via Oculus Link (USB)
1. Installez **Oculus PC App**.
2. Connectez le Quest au PC en USB.
3. Activez **Oculus Link** dans le casque.
4. Ouvrez un navigateur compatible WebXR sur le PC.
5. Accédez à `http://localhost:5173` et entrez en VR.

#### Meta Quest via Air Link (sans fil)
1. Dans l’application Oculus PC, activez **Air Link**.
2. Connectez le Quest au PC en Wi-Fi.
3. Lancez le navigateur Oculus ou un navigateur WebXR compatible.
4. Accédez à `http://localhost:5173`.

#### Casques SteamVR / OpenXR
1. Installez **SteamVR** et démarrez-le.
2. Configurez **OpenXR** en runtime par défaut si nécessaire.
3. Démarrez votre casque et ouvrez un navigateur WebXR compatible.
4. Accédez à `http://localhost:5173`.

### Vérifications et conseils
- Si la page ne propose pas de mode VR, votre navigateur n’est peut-être pas WebXR compatible.
- Assurez-vous que le navigateur a l’autorisation d’utiliser WebXR.
- Si l’accès WebXR échoue dans le navigateur, testez avec un casque connecté directement au PC ou utilisez l’application Oculus Browser.
- Si un casque externe ne s’affiche pas, vérifiez le runtime OpenXR et la reconnaissance du casque dans Windows.

### Meilleures pratiques pour dev VR
- Utilisez un navigateur récent et mettez à jour le runtime VR.
- Redémarrez le casque après installation d’un runtime ou d’un lien USB.
- Laisser la scène 3D tourner dans le navigateur permet de tester sans VR.
- Pour les tests immersifs, utilisez une session VR sur casque avec `Entrer en VR`.

---
## **Architecture et Flux de Données**

### Flux 2D → 3D Synchronisé

```
┌─────────────────────────────────────────┐
│   Éditeur 2D (React Flow)               │
│   - Drag & drop nœuds/edges            │
│   - Modification propriétés             │
└────────┬────────────────────────────────┘
         │ onChange
         ↓
┌─────────────────────────────────────────┐
│   Zustand Store (Global State)          │
│   - Modèle VSM unique                   │
│   - Synchronisation temps réel          │
└────────┬────────────────────────────────┘
         │ useVSMStore()
         ↓
┌─────────────────────────────────────────┐
│   Scène 3D (Three.js)                   │
│   - Rendu automatique                   │
│   - OrbitControls interactif            │
└─────────────────────────────────────────┘
```

### Flux Simulation & KPI

```
┌──────────────────────┐
│  Simulation Panel    │  ← Lancer/Pause/Reset
└────────┬─────────────┘
         │
         ↓
┌──────────────────────────────────┐
│  SimEngine (Événements Discrets) │
│  - Tick simulation               │
│  - Calcul KPI live              │
└────────┬───────────────────────┬─┘
         │                       │
         ↓                       ↓
    KPI Store            Dashboard Update
    (Zustand)            (Recharts)
```

---

## *KPI Lean calculés*

| KPI                        | Formule                           | Cas d'Usage |
|----------------------------|-----------------------------------|-------------|
| **Lead Time**              | Σ CT + Σ (Inventory × Takt Time) | Temps total de transformation |
| **Value Added Time (VAT)** | Σ CT des processus VA             | Temps créant de la valeur |
| **Non Value Added Time**   | Lead Time − VAT                   | Temps gaspillé |
| **Process Cycle Efficiency** | VAT / Lead Time × 100            | Efficacité du processus (%) |
| **Takt Time**              | Temps de travail / Demande client | Cadence production |
| **WIP** (Work in Progress) | Σ inventaires en encours          | Encours stock |
| **Utilisation**            | CT / Takt Time × 100             | Taux d'utilisation des ressources (%) |

---

## **Dépendances Frontend**

```json
{
  "react": "^18.3",
  "typescript": "^5.4",
  "reactflow": "^11.11",
  "@react-three/fiber": "^8.16",
  "@react-three/drei": "^9.108",
  "three": "^0.165",
  "zustand": "^4.5",
  "immer": "^10.1",
  "tailwindcss": "^3.4",
  "recharts": "^2.12",
  "nanoid": "^5.0",
  "axios": "^1.7",
  "@stomp/stompjs": "^7.0",
  "html2canvas": "^1.4",
  "xlsx": "^0.18",
  "@types/webxr": "*"
}
```

---

## *Dépendances Backend*

```xml
<!-- Spring Boot 3.3+ -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Spring Data JPA + PostgreSQL -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>

<!-- WebSocket STOMP -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-websocket</artifactId>
</dependency>

<!-- Sécurité JWT + OAuth2 -->
<dependency>
  <groupId>org.springframework.boot</groupId>
  <artifactId>spring-boot-starter-security</artifactId>
</dependency>

<!-- Lombok (Reduce Boilerplate) -->
<dependency>
  <groupId>org.projectlombok</groupId>
  <artifactId>lombok</artifactId>
  <optional>true</optional>
</dependency>
```

---

## **Contrôles et Navigation**

### **Éditeur 2D (React Flow)**

| Action | Contrôle |
|--------|----------|
| **Ajouter nœud** | Drag & drop depuis la palette |
| **Connecter nœuds** | Drag depuis port → vers port |
| **Sélectionner** | Clic sur nœud/edge |
| **Multi-sélection** | Ctrl + Clic |
| **Zoom** | Scroll molette |
| **Panoramique** | Espace + Drag |
| **Supprimer** | Delete key |
| **Undo/Redo** | Ctrl+Z / Ctrl+Y |

### **Vue 3D (Three.js)**

| Action | Contrôle |
|--------|----------|
| **Rotation** | Clic-glisser (bouton gauche) |
| **Zoom** | Scroll molette |
| **Panoramique** | Clic-glisser (bouton droit) ou Shift+Clic-glisser |
| **Reset vue** | Touche 'R' |
| **Afficher tous** | Touche 'F' (fit all) |

---

## *Prochaines Étapes (VR Integration)*

### **Roadmap VR/XR :**

```
Phase 9 : Support WebXR
├── Implémentation WebXRButton
├── Configuration XRSession
└── Adaptation des contrôles

Phase 10 : Contrôles VR
├── Support manettes Meta Quest
├── Support HTC Vive controllers
├── Gestes main (future)
└── Haptic feedback

Phase 11 : Mode Immersif
├── Visualisation 360°
├── Collaboration multi-utilisateurs
├── Voice commands (future)
└── Performance optimization

Phase 12 : Release VR
├── Tests sur casques réels
├── Optimisation perf VR
└── Documentation VR
```

---

## **Documentation Complète**

- **[Backend](./backend/README.md)** - Configuration Spring Boot
- **[Frontend](./frontend/README.md)** - Guide React + TypeScript
- **[API Documentation](./docs/API.md)** - Endpoints détaillés (si dispo)
- **[Database Schema](./backend/src/main/resources/db/migration/)** - Schéma SQL

---

## **Sécurité**

- JWT Token-based authentication
- OAuth2 support
- CORS configuré
- HTTPS ready (production)
- Validation input côté serveur
- Protection CSRF

---

## **Licence**

Ce projet est développé pour fins éducatives et de démonstration industrielle.
Tous droits réservés © 2025 VSM Platform Team

---

## **Réalisateur**

### **HINIMDOU MORSIA GUITDAM**

**Email** : [hinimdoumorsia@gmail.com](mailto:hinimdoumorsia@gmail.com)

🌐**Portfolio** : [https://site-web-nodemailer.vercel.app](https://site-web-nodemailer.vercel.app)

**LinkedIn** : [https://www.linkedin.com/in/morsia-guitdam-hinimdou-266bb0269/](https://www.linkedin.com/in/morsia-guitdam-hinimdou-266bb0269/)

---

##  **Support & Feedback**

Pour des questions, suggestions ou rapports de bugs :
- Contactez-moi via email
- Ouvrez une issue sur GitHub (si dispo)
- Consultez mon portfolio pour voir autres projets

---

**Merci d'utiliser VSM Platform !** 

Cette plateforme est en **développement continu**. Comme l'esprit **Kaizen** le nécessite, nous améliorons constamment les fonctionnalités, l'expérience utilisateur et les performances. N'hésitez pas à contribuer, suggérer des améliorations ou signaler des bugs. Ensemble, construisons l'outil VSM de demain ! 
