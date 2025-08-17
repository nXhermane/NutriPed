import { usePediatricApp } from "@/adapter";
import { FormHandler } from "@/components/custom";
import { AggregateID } from "@/core/shared";
import { useToast } from "@/src/context";
import { emptyToUndefined } from "@/utils";
import { useCallback, useRef, useState } from "react";

export function useAddPatientFormHandle() {
    const [error, setError] = useState<string | null>(null)
    const [onSubmit, setOnSubmit] = useState<boolean>(false)
    const [onSuccess, setOnSuccess] = useState<boolean>(false)
    const [addedPatientInfo, setAddedPatientInfo] = useState<{ id: AggregateID, fullname: string } | null>(null)
    const formRef = useRef<FormHandler<any>>(null)
    const toast = useToast()
    const { patientService } = usePediatricApp()


    const submit = useCallback(async () => {
        setOnSubmit(true);
        setError(null)
        setOnSuccess(false)
        const formData = await formRef.current?.submit();
        if (formData) {
            const createPatientData = {
                name: formData.fullName,
                gender: formData.gender,
                birthday: formData.birthDate,
                address: {
                    country: emptyToUndefined(formData.country),
                    city: emptyToUndefined(formData.city),
                    postalCode: emptyToUndefined(formData.postalCode),
                    street: emptyToUndefined(formData.street),
                },
                contact: {
                    email: emptyToUndefined(formData.email),
                    tel: emptyToUndefined(formData.phone),
                },
                parents: {
                    father: emptyToUndefined(formData.fatherName),
                    mother: emptyToUndefined(formData.motherName),
                },
            };
            const result = await patientService.create({ data: createPatientData });
            if ('data' in result) {
                setOnSuccess(true)
                setAddedPatientInfo({
                    id: result.data.id,
                    fullname: createPatientData.name
                })
            } else {
                const _errorContent = JSON.parse(result.content)
                console.error(_errorContent)
                setError(_errorContent)
            }
        }
        setOnSubmit(false);
    }, [patientService,])


    return {
        handle: submit, formRef, onSubmit, onSuccess, error,addedPatientInfo
    }


}