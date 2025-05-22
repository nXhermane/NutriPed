export const CORE_SERVICE_ERRORS = {
  NUTRITIONAL_ASSESSMENT: {
    NEEDED_VARIABLE_GENERATION_FAILED: {
      path: "NUTRITIONAL_ASSESSMENT.NEEDED_VARIABLE_GENERATION_FAILED",
      code: "CS001",
      message:
        "La generation de variables dont a besoin le NutritionalAssessment pour faire le diagnostic a échoué",
    },
    DIAGNOSTIC_RULE_REPO_ERROR: {
      path: "NUTRITIONAL_ASSESSMENT.DIAGNOSTIC_RULE_REPO_ERROR",
      code: "CS002",
      message:
        "L'erreur lors de la recuperation des regles de diagnostic global",
    },
  },
  NUTRITIONAL_DIAGNOSTIC_FACTORY: {
    PATIENT_NOT_FOUND: {
      path: "NUTRITIONAL_DIAGNOSTIC_FACTORY.PATIENT_NOT_FOUND",
      code: "CS003",
      message:
        "Le patient pour lequel le diagnostic nutritionnel veut etre poser n'existe pas dans le systeme.",
    },
    CREATION_FAILED: {
      path: "NUTRITIONAL_DIAGNOSTIC_FACTORY.CREATION_FAILED",
      code: "CS004",
      message: "La creation de diagnostic nutritionnel a echoué",
    },
  },
};
