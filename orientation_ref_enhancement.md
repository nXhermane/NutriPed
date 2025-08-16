# Raffinement du Modèle `OrientationReference`

Vous avez identifié un point crucial : l'orientation d'un patient n'est pas une finalité, c'est le **point de départ** d'une prise en charge spécifique. Le modèle de données doit refléter cela.

Votre suggestion est donc la bonne : la référence d'orientation (`OrientationReference`) doit contenir une référence vers la première phase de soin à appliquer.

## 1. Le Modèle `OrientationReference` Mis à Jour

Nous ajoutons simplement une propriété `initialPhaseCode` à l'interface existante.

```typescript
export interface OrientationReference {
  /** Le code unique de l'orientation (ex: "ORIENTATION_CNT"). */
  code: string;

  /** Le nom lisible de l'orientation. */
  name: string;

  /** La liste des critères d'admission pour cette orientation. */
  admissionCriteria: PhaseCriterion[]; // On peut réutiliser la même structure que pour les phases

  /**
   * NOUVEAU: Le code de la phase de soin qui doit être démarrée
   * si cette orientation est choisie.
   */
  initialPhaseCode: CARE_PHASE_CODES;
}
```

## 2. Exemple Concret en JSON pour l'Orientation "CNT"

Voici à quoi ressemblerait votre fichier de référence pour l'orientation en hospitalisation.

```json
{
  "code": "ORIENTATION_CNT",
  "name": "Orienté vers le Centre Nutritionnel Thérapeutique (CNT)",
  "admissionCriteria": [
    {
      "description": "Le test de l'appétit est un échec",
      "condition": { "value": "appetite_test_result == 'NEGATIVE'" }
    },
    {
      "description": "Présence d'oedèmes",
      "condition": { "value": "edema > 0" }
    },
    {
      "description": "Présence de complications médicales",
      "condition": { "value": "complications_number > 0" }
    }
  ],
  "initialPhaseCode": "cnt_phase_aiguë"
}
```

## 3. Comment l'Utiliser dans le Cas d'Utilisation d'Admission

Le `AdmitPatientUseCase` devient le chef d'orchestre qui utilise cette nouvelle information pour lier les deux modules.

```pseudocode
function AdmitPatientUseCase.execute(request):

  // 1. Obtenir le contexte du patient à partir de la requête de l'UI
  let context = patientStateEvaluatorService.generateContext(request);

  // 2. Appeler le service d'orientation pour obtenir la décision
  let orientationRef = orientationService.orient(context);
  // Le service retourne maintenant l'objet OrientationReference complet

  if (orientationRef == null) {
    return Error("Impossible de déterminer l'orientation.");
  }

  // 3. Créer la session de soins
  let session = patientCareSessionFactory.create({
    patientId: request.patientId,
    orientationCode: orientationRef.code
    // ... autres données initiales
  });

  // 4. Démarrer la phase de soin initiale en utilisant le nouveau champ !
  // On passe le code de la phase initiale au service de gestion des phases.
  phaseManagementService.startInitialPhase(session, orientationRef.initialPhaseCode);
  // Ce service se chargera de créer la première entité CarePhase
  // et d'appliquer les traitements initiaux (F-75, etc.) via le TreatmentManagementService.

  // 5. Sauvegarder la session maintenant complète
  repo.save(session);

  return session.id;
```

Cette modification rend le flux de données logique et fluide : la sortie du module d'orientation devient l'entrée directe du module de gestion des phases. C'est une excellente amélioration pour la robustesse de votre architecture.
