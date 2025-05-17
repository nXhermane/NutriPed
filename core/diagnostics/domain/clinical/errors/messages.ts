/**
 * @fileoverview Defines error messages and codes for the clinical domain.
 * 
 * Error categories:
 * - VALIDATION: Data validation errors
 * - ANALYSIS: Clinical analysis process errors
 * - REPOSITORY: Data access errors
 * 
 * Each error includes:
 * - path: Error identifier path
 * - code: Unique error code
 * - message: Human readable error description
 */

export const CLINICAL_ERRORS = {
    VALIDATION: {
        MISSING_DATA: {
            path: "VALIDATION.MISSING_DATA",
            code: "CL001",
            message: "Les données cliniques requises sont manquantes"
        },
        INVALID_DATA: {
            path: "VALIDATION.INVALID_DATA",
            code: "CL002",
            message: "Les données cliniques fournies sont invalides"
        },
        INVALID_DATA_TYPE: {
            path: 'VALIDATION.INVALID_DATA_TYPE',
            code: 'CL007',
            message: "Le type de donnée entrée ne corresponds pas au type voulue pas les clinical Ref."
        }
    },
    ANALYSIS: {
        SIGN_NOT_FOUND: {
            path: "ANALYSIS.SIGN_NOT_FOUND",
            code: "CL003",
            message: "Le signe clinique n'a pas été trouvé"
        },
        INVALID_CONDITION: {
            path: "ANALYSIS.INVALID_CONDITION",
            code: "CL004",
            message: "La condition d'évaluation est invalide"
        },
        INTERPRETATION_FAILED: {
            path: "ANALYSIS.INTERPRETATION_FAILED",
            code: "CL005",
            message: "L'interprétation du signe clinique a échoué"
        }
    },
    REPOSITORY: {
        REFERENCE_NOT_FOUND: {
            path: "REPOSITORY.REFERENCE_NOT_FOUND",
            code: "CL006",
            message: "La référence clinique n'a pas été trouvée"
        }
    }
} as const;
