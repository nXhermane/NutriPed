

export enum ClinicalSignRefDataCategory {
    VITAL_SIGN = 'vitals',
    OBERVATION = 'observation',
    CLINICAL_DATA = 'clinical_data',
    QUESTION = 'questions',
    DEMOGRAPHIC = "demograpthics",
    OTHER = 'other'
}


export const ClinicalRefCategoryUiData = {
    [ClinicalSignRefDataCategory.VITAL_SIGN]: {
        prefixs: ['vital_sign_'],
        uiText: "Signes Vitaux",
        priority: 2
    },
    [ClinicalSignRefDataCategory.OBERVATION]: {
        prefixs: ['observation_'],
        uiText: 'Observations cliniques',
        priority: 3
    },
    [ClinicalSignRefDataCategory.CLINICAL_DATA]: {
        prefixs: ['data_'],
        uiText: 'Données cliniques',
        priority: 4
    },
    [ClinicalSignRefDataCategory.QUESTION]: {
        prefixs: ['question_'],
        uiText: "Questions Spécifiques",
        priority: 5
    },
    [ClinicalSignRefDataCategory.DEMOGRAPHIC]: {
        prefixs: "age_",
        uiText: "Informations Patient",
        priority: 1
    },
    [ClinicalSignRefDataCategory.OTHER]: {
        prefixs: ["other_"],
        uiText: 'Autres',
        priority: 6
    }
} as const 