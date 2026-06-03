# Guide VR / AR pour VSM Platform

## Objectif
Ce document explique comment utiliser la partie VR de l'application, comment configurer un casque, et ce qui est supporté aujourd'hui. Il précise aussi les limites actuelles pour la réalité augmentée (AR) ou l’affichage du monde réel.

---

## 1. Aperçu général

### Ce que l'application supporte
- Affichage d'une scène 3D interactive directement dans le navigateur.
- Passage en mode VR si le navigateur et le casque supportent WebXR.

### Ce que l'application ne supporte pas aujourd'hui
- Réalité augmentée (AR) en mode caméra sur téléphone.
- Affichage du monde réel dans le navigateur sans casque.
- Pas de capture vidéo en direct du réel dans l’application existante.

> En pratique, l'application fonctionne comme une scène 3D standard dans un navigateur, puis offre un bouton `Entrer en VR` pour les casques compatibles WebXR.

---

## 2. Prérequis matériels et logiciels

### Casques VR compatibles recommandés
- Meta Quest 2 / Quest 3
- HTC Vive / Vive Pro / Vive Cosmos
- Valve Index
- Windows Mixed Reality
- Pico 4 / Pico 5

### Navigateurs WebXR compatibles
- Google Chrome récent / Microsoft Edge basé Chromium
- Oculus Browser (sur Quest)
- Firefox Reality / Firefox Nightly (WebXR)
- Brave ou autres navigateurs Chromium avec support WebXR

### Environnement de développement
- Node.js installé
- `npm` disponible
- Projet cloné dans `vsm-platform`

---

## 3. Installation et lancement

### 1) Installer les dépendances front-end
```bash
cd frontend
npm install
```

### 2) Lancer le front-end
```bash
npm run dev
```

### 3) Ouvrir l'application
- Accédez à `http://localhost:5173`
- La scène 3D doit s'afficher directement dans le navigateur.

### 4) Ouvrir le backend (facultatif pour VR)
- Si besoin, démarrez le backend depuis `backend/` avec Maven ou Docker.
- Le VR/3D ne nécessite pas forcément le backend, mais le reste de l'application l'utilise.

---

## 4. Passage en VR

### Étapes pour utiliser un casque connecté
1. Assurez-vous que votre casque est allumé et connecté.
2. Ouvrez un navigateur WebXR compatible.
3. Dans l'application, cliquez sur le bouton `Entrer en VR`.
4. Le navigateur demandera éventuellement l'autorisation d'accéder au casque.
5. Une fois autorisé, vous serez plongé dans la scène en immersion VR.

### Cas de figure selon le casque

#### Meta Quest via Oculus Browser
- Le meilleur chemin est d’ouvrir l’application dans le navigateur du casque.
- Accédez à `http://localhost:5173` ou à l'adresse IP locale du PC si nécessaire.
- Cliquez sur `Entrer en VR` depuis le casque.

#### Meta Quest via Oculus Link / Air Link
- Connectez le casque au PC via USB (Link) ou Wi-Fi (Air Link).
- Assurez-vous que le runtime Oculus est actif.
- Ouvrez un navigateur sur le PC et accédez à l'URL.
- Cliquez sur `Entrer en VR` puis mettez le casque.

#### Casques SteamVR / OpenXR
- Lancez SteamVR.
- Vérifiez que le runtime OpenXR est bien configuré.
- Ouvrez un navigateur compatible WebXR.
- Accédez à `http://localhost:5173` et entrez en VR.

---

## 5. Configuration d’un casque externe connecté au PC

### A. Meta Quest avec Oculus Link (USB)
1. Installez l’application Oculus PC.
2. Connectez le Quest au PC avec un câble USB.
3. Activez le mode Oculus Link dans le casque.
4. Ouvrez un navigateur sur le PC.
5. Accédez à `http://localhost:5173`.
6. Cliquez sur `Entrer en VR`.

### B. Meta Quest avec Air Link
1. Activez Air Link dans l’application Oculus PC.
2. Connectez le Quest au PC sur le même réseau Wi-Fi.
3. Ouvrez le navigateur du Quest ou utilisez le navigateur du PC.
4. Accédez à `http://localhost:5173`.
5. Cliquez sur `Entrer en VR`.

### C. Casques SteamVR / OpenXR
1. Installez et lancez SteamVR.
2. Dans Windows, définissez OpenXR comme runtime par défaut si nécessaire.
3. Assurez-vous que le casque est reconnu par SteamVR.
4. Ouvrez un navigateur WebXR compatible.
5. Accédez à l'application et entrez en VR.

---

## 6. Vérifications et dépannage

### A. Si le bouton `Entrer en VR` n’apparaît pas
- Vérifiez que le navigateur supporte WebXR.
- Assurez-vous que le casque est connecté et détecté.
- Essayez un autre navigateur ou le navigateur du casque.

### B. Si la VR ne démarre pas correctement
- Actualisez la page.
- Fermez d’autres applications VR qui pourraient bloquer le runtime.
- Redémarrez le casque et le navigateur.
- Vérifiez les permissions WebXR dans le navigateur.

### C. Si le casque est connecté mais l'environnement reste visible seulement sur l’écran
- Le casque doit être en mode WebXR ou Oculus Link.
- Ouvrez le navigateur directement dans le casque si possible.
- Assurez-vous que le runtime OpenXR / Oculus est bien configuré.

---

## 7. Utilisation dans le navigateur sans casque

### Contrôles standard
- Clic gauche + glisser : rotation de la caméra.
- Molette : zoom avant/arrière.
- Clic droit + glisser : déplacement panoramique.

### Ce que tu vois
- Une scène 3D virtuelle générée par Three.js.
- Le mode sans casque ne montre pas le monde réel.
- C’est une visualisation immersive à l’intérieur du navigateur.

---

## 8. Limites AR / réalité réelle

### Statut actuel
- AR n’est pas implémenté dans ce projet.
- Il n’y a pas de capture vidéo de la caméra ou de passthrough du monde réel.
- Seule une scène virtuelle est rendue.

### Ce qui serait nécessaire pour AR
- support WebXR AR ou WebAR avec caméra mobile
- accès caméra et calage d’objets 3D sur le monde réel
- code supplémentaire pour gérer la détection de plan et le positionnement AR

---

## 9. Conseils pratiques

- Teste d’abord sans casque pour valider la scène 3D.
- Ensuite, passe en VR sur un casque compatible.
- Si tu veux du réel/AR plus tard, il faudra ajouter un module AR séparé.
- Le VR fonctionne mieux avec un navigateur récent et un runtime bien configuré.

---

## 10. Résumé rapide

1. Lance `npm run dev` dans `frontend`.
2. Ouvre `http://localhost:5173`.
3. Vérifie la scène 3D dans le navigateur.
4. Connecte ton casque VR compatible.
5. Clique sur `Entrer en VR`.
6. Si tu veux de l’AR, il faut un développement supplémentaire.

---

## 11. Fichiers utiles

- `frontend/src/components/3d/VSMScene3D.tsx` : scène 3D + support VR WebXR
- `frontend/package.json` : dépendances React / Three.js / XR
- `frontend/src/App.tsx` : point d’entrée de l’interface

---

## 12. Notes supplémentaires

- Ce guide est centré sur la configuration VR telle qu’elle est implémentée aujourd’hui.
