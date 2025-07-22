export const GROWTH_INDICATOR_ERRORS = {
  INTERPRETATION: {
    NOT_FOUND: {
      path: "INTERPRETATION.NOT_FOUND",
      code: "GI001",
      message: "L'interprétation n'est pas trouvée pour ce z-score",
    },
    INVALID_RANGE: {
      path: "INTERPRETATION.INVALID_RANGE",
      code: "GI002",
      message: "La plage d'interprétation n'est pas valide",
    },
  },
  CHART: {
    NOT_AVAILABLE: {
      path: "CHART.NOT_AVAILABLE",
      code: "GI003",
      message: "Le graphique de référence n'est pas disponible",
    },
    INVALID_DATA: {
      path: "CHART.INVALID_DATA",
      code: "GI004",
      message: "Les données du graphique sont invalides",
    },
  },
  CALCULATION: {
    STRATEGY_NOT_FOUND: {
      path: "CALCULATION.STRATEGY_NOT_FOUND",
      code: "GI005",
      message: "La stratégie de calcul n'est pas disponible",
    },
    INVALID_RESULT: {
      path: "CALCULATION.INVALID_RESULT",
      code: "GI006",
      message: "Le calcul a produit un résultat invalide",
    },
  },
} as const;

export const ANTHROPOMETRIC_MEASURE_ERROR = {
  VALIDATION: {
    INVALID_UNIT: {
      path: "VALIDATION.INVALID_UNIT",
      code: "AM001",
      message:
        "L'unité utilisé pour la mesure anthropometric n'est pas valide.",
    },
    UNIT_CONVERTION_SERVICE_ERROR: {
      path: 'VALIDATION.UNIT_CONVERTION_SERVICE_ERROR',
      code: 'AM004',
      message: "Le service de convertion d'unité a declenché une erreur lors de la convertion des valeurs anthropometriques dans leurs default unit."
    },
    INVALID_VALUE: {
      path: "VALIDATION.INVALID_VALUE",
      code: "AM002",
      message: "La valeur de la mesure anthropometric est invalide.",
    },
    INVALID_NAME: {
      path: "VALIDATION.INVALID_NAME",
      code: "AM003",
      message:
        "Le nom de la mesure anthropometric doit être valide.Verifiez si le nom n'est pas vide.",
    },
  },
} as const;
