import { AggregateID } from "@/core/shared"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
export type UI_STATE = {
   refreshPatientList: boolean
}

export const initialState: UI_STATE = {
   refreshPatientList: false
}

export interface UI_STATE_ACTION<T = any> {
   type: 'PATIENT_ADDED' | 'PATIENT_REFRESHED' | 'PATIENT_DELETED'

}
export const uiSlice = createSlice({
   name: 'ui_state',
   initialState,
   reducers: {
      recordUiState(state, action: PayloadAction<UI_STATE_ACTION>) {
         switch (action.payload.type) {
            case 'PATIENT_ADDED':
               return { ...state, refreshPatientList: true }
            case 'PATIENT_DELETED':
               return { ...state, refreshPatientList: true }
            case 'PATIENT_REFRESHED':
               return { ...state, refreshPatientList: false }
            default:
               return state
         }
      }
   }
})

export const { recordUiState } = uiSlice.actions
export const uiReducer = uiSlice.reducer
