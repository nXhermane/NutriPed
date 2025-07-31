import { usePediatricApp } from "@/adapter";
import { usePatientDetail } from "@/components/pages/patient_detail/context";
import { useCallback, useState } from "react";
import { remapSignDataToClinicalSign, VariableUsageMap } from "../tools";
import { DateManager } from "@/core/shared";

export function useAddClinicalDataToMedicalRecord() {
    const { patient } = usePatientDetail()
    const { medicalRecordService } = usePediatricApp()
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const submit = useCallback(
        async (formData: Record<string, any> | null | undefined, variableUsageMap: VariableUsageMap) => {
            if (!formData) return
            setIsSubmitting(true);
            setIsSuccess(false);
            setError(null);
            setIsSubmitting(false)
            const remappedData = remapSignDataToClinicalSign(formData, variableUsageMap)

            const result = await medicalRecordService.addData({
                medicalRecordId: patient.id,
                data: {
                    clinicalData: remappedData.map((item => ({
                        ...item,
                        recordedAt: DateManager.formatDate(new Date()),
                    })))
                }
            })
            if ('data' in result) {
                setIsSuccess(true)
            }
            else {
                const _errorContent = JSON.parse(result.content)
                console.error(_errorContent)
                setError(_errorContent)
            }
            setIsSubmitting(false)
        },
        []
    );

    return {
        submit, error, isSuccess, isSubmitting
    }
}