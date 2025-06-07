import { AggregateID } from "@/core/shared"
import { createSlice, PayloadAction } from "@reduxjs/toolkit"
type Interaction = {
    patientId: AggregateID
    date: string 
}
interface PatientInteractionsState {
    interactions: Interaction[]
}
export const initialState: PatientInteractionsState = {
    interactions: []
}
export const patientInteractionsSlice = createSlice({
    name: 'patientInteractions',
    initialState,
    reducers: {
        recordInteraction(state, action: PayloadAction<Interaction>) {
            state.interactions = state.interactions.filter(p => p.patientId != action.payload.patientId)
            state.interactions.unshift(action.payload)
        }
    }
})

export const {recordInteraction} = patientInteractionsSlice.actions
export const reducer = patientInteractionsSlice.reducer
