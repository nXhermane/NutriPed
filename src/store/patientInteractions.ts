import { AggregateID } from "@/core/shared";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { PATIENT_STATE } from "../constants/ui";
export type Interaction = {
  patientId: AggregateID;
  date: string;
  state: PATIENT_STATE;
  isFirstVisitToPatientDetail: boolean;
};
interface PatientInteractionsState {
  interactions: Interaction[];
}
const initialState: PatientInteractionsState = {
  interactions: [],
};
export const patientInteractionsSlice = createSlice({
  name: "patientInteractions",
  initialState,
  reducers: {
    recordInteraction(state, action: PayloadAction<Interaction>) {
      state.interactions = state.interactions.filter(
        p => p.patientId != action.payload.patientId
      );
      state.interactions.unshift(action.payload);
    },
    deleteInteraction(state, action: PayloadAction<AggregateID>) {
      state.interactions = state.interactions.filter(
        p => p.patientId != action.payload
      );
    },
  },
});

export const { recordInteraction, deleteInteraction } =
  patientInteractionsSlice.actions;
export const patientInteractionReducer = patientInteractionsSlice.reducer;
