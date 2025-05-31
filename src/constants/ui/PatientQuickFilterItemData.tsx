import { PATIENT_STATE } from "./PatientState";
export enum PATIENT_QUICK_FILTER_TAG {
    ALL = 'all',
    RECENT = 'recent',
    ATTENTION = PATIENT_STATE.ATTENTION,
    NEW = PATIENT_STATE.NEW,
    NORMAL = PATIENT_STATE.NORMAL
}
export const PATIENT_QUICK_FILTER_ITEMS = [
    {
        title: "Tous",
        tag: PATIENT_QUICK_FILTER_TAG.ALL,

    },
    {
        title: "Récents",
        tag: PATIENT_QUICK_FILTER_TAG.RECENT,

    },
    {
        title: "Attention",
        tag: PATIENT_QUICK_FILTER_TAG.ATTENTION,

    }
    , {
        title: 'Nouveau',
        tag: PATIENT_QUICK_FILTER_TAG.NEW,


    },
    {
        title: 'Normal',
        tag: PATIENT_QUICK_FILTER_TAG.NORMAL,

    }

]

