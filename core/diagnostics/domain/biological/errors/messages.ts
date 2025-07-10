export const BIOLOGICAL_SERVICE_ERRORS = {
  VALIDATION: {
    REFERENCE_NOT_FOUND: {
      path: "VALIDATION.REFERENCE_NOT_FOUND",
      code: "BI001",
      message:
        "Le resultat de test biologique n'est pas supporter par le systeme. Puisque la reference manque.",
    },
    INVALID_DATA: {
      path: "VALIDATION.INVALID_DATA",
      code: "BI002",
      message: "Le resultat de test biologique est invalide.",
    },
    DATA_LEN_NOT_EQ_REFERENCE_LEN: {
      path: "VALIDATION.DATA_LEN_NOT_EQ_REFERENCE_LEN",
      code: "BI003",
      message: "Les resultats de test n'ont pas de references respectifs.",
    },
    INVALID_DATA_UNIT: {
      path: "VALIDATION.INVALID_DATA_UNIT",
      code: "BI004",
      message: "L'unite du resultats de test n'est pas supporté.",
    },
  },
  INTERPRETATION: {
    ADAPTED_RANGE_NOT_FOUND: {
      path: "INTERPRETATION.ADAPTED_RANGE_NOT_FOUND",
      code: "BIOO4",
      message:
        "La valeur de reference de l'analyse biologique adaptée a ce patient n'est pas trouvée.",
    },
    BIOCHEMICAL_REF_NOT_FOUND: {
      path: "INTERPRETATION.BIOCHEMICAL_REF_NOT_FOUND",
      code: "BI005",
      message: "La valeur de reference du test biologique n'est pas trouvée.",
    },
    INTERPRETATION_ERROR: {
      path: "INTERPRETATION.INTERPRETATION_ERROR",
      code: "BI006",
      message: "Erreur lors de l'interpretation des tests biologiques.",
    },
  },
} as const;
