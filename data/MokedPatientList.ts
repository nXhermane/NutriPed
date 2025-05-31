import { PATIENT_STATE } from "@/src/constants/ui";

export const MokedPatientList = [
  {
    name: "Lucas Martin",
    createdAt: "12/04/2025",
    status: PATIENT_STATE.NORMAL,
    birthday: '12/06/2007',
    nextVisitDate: '01/06/2025'
  },
  {
    name: "Thomas Dupuis",
    createdAt: "02/05/2025",
    status: PATIENT_STATE.NEW,
    birthday: '02/05/2019',
    nextVisitDate: '03/06/2025'
  },
  {
    name: "Sarah Bouaziz",
    createdAt: "28/03/2025",
    status: PATIENT_STATE.ATTENTION,
    birthday: '02/05/2023',
    nextVisitDate: '05/07/2025'
  },
];