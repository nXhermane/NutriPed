import { usePediatricApp } from "@/adapter";
import { GetMedicineRequest, MedicineDto } from "@/core/nutrition_care";
import { useEffect, useState } from "react";

export function useMedicines(req?: GetMedicineRequest) {
    const { nutritionCareServices: { medicine } } = usePediatricApp()
    const [medicineList, setMedicineList] = useState<MedicineDto[]>([])
    const [error, setError] = useState<string | null>(null)
    const [onLoading, setOnLoading] = useState<boolean>(false)

    useEffect(() => {
        const getMedicines = async () => {
            setError(null)
            setOnLoading(true)
            const result = await medicine.get(req ? req : {})
            if ('data' in result) {
                setMedicineList(result.data)
            } else {
                console.error(JSON.parse(result.content))
                setError(JSON.parse(result.content))
            }
            setOnLoading(false)
        }
        getMedicines()
    }, [req, medicine])

    return { data: medicineList, onLoading, error }
}