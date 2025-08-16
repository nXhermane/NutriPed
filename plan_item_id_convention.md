# Convention de Nommage pour `planItemId`

Vous avez posé une excellente question : comment nommer les `planItemId` de manière cohérente ? Utiliser des UUIDs est une option, mais ils ne sont pas lisibles par un humain. Une convention de nommage structurée est bien plus puissante pour la lisibilité et le débogage.

Je vous propose une convention en 4 parties, séparées par des underscores (`_`).

## Structure Proposée : `[CONTEXTE]_[DÉCLENCHEUR]_[PRODUIT]_[SPÉCIFICATEUR]`

---

### 1. `[CONTEXTE]` (Où sommes-nous ?)

Cette partie décrit la situation ou la phase dans laquelle le traitement est recommandé.
*   **Exemples :** `PHASE1`, `TRANSITION`, `PHASE2`, `CNA_VISIT4`, `INFANT_TSS`

---

### 2. `[DÉCLENCHEUR]` (Pourquoi ce traitement est-il démarré ?)

Cette partie explique ce qui a déclenché la recommandation.
*   **`INITIAL`**: Pour les traitements systématiques qui commencent dès le début d'une phase.
*   **`FOLLOWUP`**: Pour les traitements qui sont démarrés en réponse à une condition qui apparaît en cours de phase (via le `followUpPlan`).
*   **`ADMISSION`**: Pour les traitements spécifiques à l'admission.

---

### 3. `[PRODUIT]` (De quoi s'agit-il ?)

C'est le code du produit ou du médicament, abrégé et clair.
*   **Exemples :** `F75`, `F100`, `ATPE`, `AMOX`, `GENTAMICIN`, `ZINC`, `VIT_A`

---

### 4. `[SPÉCIFICATEUR]` (Quel est le but ?)

Cette partie optionnelle donne un contexte supplémentaire sur le but du traitement.
*   **Exemples :** `SYSTEMATIC`, `DIARRHEA`, `ANEMIA`, `DEWORMING`

---

## Exemples Concrets

Voyons comment cette convention s'applique à des cas réels du protocole :

*   **L'amoxicilline systématique au début de la Phase 1 :**
    *   `planItemId: "PHASE1_INITIAL_AMOX_SYSTEMATIC"`

*   **Le Lait F-75 systématique en Phase 1 :**
    *   `planItemId: "PHASE1_INITIAL_F75_NUTRITIONAL"`

*   **Le traitement au Zinc qui est démarré en cours de Phase 1 si une diarrhée est détectée :**
    *   `planItemId: "PHASE1_FOLLOWUP_ZINC_DIARRHEA"`

*   **La Vitamine A donnée lors de la 4ème visite en ambulatoire (CNA) :**
    *   `planItemId: "CNA_VISIT4_INITIAL_VITA_SYSTEMATIC"`

## Avantages de cette Convention

*   **Lisibilité Immédiate :** En lisant l'ID, vous savez instantanément où, pourquoi, et quel traitement a été appliqué.
*   **Unicité Garantie :** La combinaison des 4 parties garantit un identifiant unique pour chaque intention de traitement dans votre protocole. Vous pouvez maintenant cibler `PHASE1_INITIAL_AMOX_SYSTEMATIC` pour l'arrêter sans affecter un autre traitement à base d'amoxicilline.
*   **Facilité de Débogage :** Quand vous regarderez la liste des `activeTreatments` d'un patient, vous comprendrez son parcours médical d'un seul coup d'œil.

C'est une manière très robuste de gérer la complexité que vous avez identifiée.
