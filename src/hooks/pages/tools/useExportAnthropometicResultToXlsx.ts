import { downloadAndCacheFile, loadXlsxTemplate } from "@/utils";
import { AnthropometricCalculatorResultDataType } from "./../../../store";
import { useCallback } from "react";
import { CORE_CONFIG } from "@/adapter/config/core";
import XLSX from 'xlsx'

export function useExportAnthropometicResultToXlsx() {

    const exportToXlsx = useCallback(async (data: AnthropometricCalculatorResultDataType[]) => {
        try {
            const anthropmetricTemplateUri = await downloadAndCacheFile(CORE_CONFIG.anthropometricCalculatorResultExportTemplateUrl)
            if (!anthropmetricTemplateUri) return null
            const templateWorkbook = await loadXlsxTemplate(anthropmetricTemplateUri);
            if (!templateWorkbook) return null;
            const sheetName = templateWorkbook.SheetNames[0];
            console.log(sheetName)
            const worksheet = templateWorkbook.Sheets[sheetName];
            console.log(worksheet)
            const templateData = XLSX.utils.sheet_to_json(worksheet, {
                header: 1,
                defval: ''
            });
            console.log(templateData)
        } catch (e) {

        }
    }, [])


    return exportToXlsx
}