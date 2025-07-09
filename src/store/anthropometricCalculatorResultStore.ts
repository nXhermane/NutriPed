import { GrowthIndicatorValueDto } from "@/core/diagnostics"
import { Sex } from "@/core/shared"
import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit"


export type AnthropometricCalculatorResultDataType = {
    name: string
    id: string
    usedData: {
        age_in_month: number
        age_in_day: number
        sex: Sex,
        anthropometricData: { unit: string, code: string, value: number }[]
    }
    result: GrowthIndicatorValueDto[]
    createdAt: string
}
export type AnthropometricCalculatorResultHistory = {
    histories: AnthropometricCalculatorResultDataType[]
}

type AddAnthropometricCalculatorResultData = {
    name: string,
    usedData: AnthropometricCalculatorResultDataType['usedData']
    result: GrowthIndicatorValueDto[]
}


const initialState: AnthropometricCalculatorResultHistory = {
    histories: []
}

export const anthropometricCalculatorSlice = createSlice({
    name: "anthropometricCalculatorResultHistory",
    initialState,
    reducers: {
        addAnthropometricCalculatorResult(state, action: PayloadAction<AddAnthropometricCalculatorResultData>) {
            state.histories.push({
                createdAt: new Date().toISOString(),
                id: nanoid(),
                name: action.payload.name,
                result: action.payload.result,
                usedData: action.payload.usedData
            })
        },
        deleteAnthropometricCalculatorResult(state, action: PayloadAction<{ id: string }>) {
            const resultIndex = state.histories.findIndex(result => result.id === action.payload.id)
            if (resultIndex != -1) state.histories.splice(resultIndex, 1)
        }
    }
})

export const { addAnthropometricCalculatorResult, deleteAnthropometricCalculatorResult } = anthropometricCalculatorSlice.actions
export const anthropometricCalculatorResultReducer = anthropometricCalculatorSlice.reducer