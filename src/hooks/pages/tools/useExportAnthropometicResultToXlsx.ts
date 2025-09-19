import { downloadAndCacheFile, loadXlsxTemplate } from "@/utils";
import { AnthropometricCalculatorResultDataType } from "./../../../store";
import { useCallback, useMemo } from "react";
import { CORE_CONFIG } from "@/adapter/config/core";
import { type WorkSheet, utils, write } from "xlsx";
import { Alert } from "react-native";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

export function useExportAnthropometicResultToXlsx() {
  const mapDataToRow = useMemo(
    () =>
      (
        data: AnthropometricCalculatorResultDataType,
        headers: string[]
      ): string[] => {
        const rawData = {
          patient_name: data.name,
          id: data.id,
          sex: data.usedData.sex,
          age_in_day: Math.trunc(data.usedData.age_in_day),
          age_in_month: Math.trunc(data.usedData.age_in_month),
          created_at: new Date(data.createdAt).toDateString(),
          ...data.usedData.anthropometricData.reduce(
            (acc, curVal) => ({
              ...acc,
              [curVal.code]: `${curVal.value} ${curVal.unit}`,
            }),
            {}
          ),
          ...data.result.reduce(
            (acc, curVal) => ({
              ...acc,
              [curVal.code]: `${curVal.value > 4 ? ">4" : curVal.value < -4 ? "<-4" : curVal.value}`,
            }),
            {}
          ),
        };
        const row: string[] = [];
        headers.forEach(key => {
          row.push(String((rawData as any)[key] ?? ""));
        });
        return row;
      },
    []
  );
  const applyTemplateStyles = useMemo(
    () => (newWorksheet: WorkSheet, templateWorksheet: WorkSheet) => {
      if (templateWorksheet["!cols"]) {
        newWorksheet["!cols"] = templateWorksheet["!cols"];
      }
      if (templateWorksheet["!rows"]) {
        newWorksheet["!rows"] = templateWorksheet["!rows"];
      }
    },
    []
  );
  const exportToXlsx = useCallback(
    async (data: AnthropometricCalculatorResultDataType[]) => {
      try {
        const anthropmetricTemplateUri = await downloadAndCacheFile(
          CORE_CONFIG.anthropometricCalculatorResultExportTemplateUrl
        );
        if (!anthropmetricTemplateUri) return null;
        const templateWorkbook = await loadXlsxTemplate(
          anthropmetricTemplateUri
        );
        if (!templateWorkbook) return null;
        const sheetName = templateWorkbook.SheetNames[0];
        const worksheet = templateWorkbook.Sheets[sheetName];
        const templateData = utils.sheet_to_json(worksheet, {
          header: 1,
          defval: "",
        });
        const keys = templateData[0];
        const headers = templateData[1];

        const newData = [headers];
        data.forEach(item => {
          const row = mapDataToRow(item, keys as string[]);
          newData.push(row);
        });
        const newWorksheet = utils.aoa_to_sheet(newData as any);
        applyTemplateStyles(newWorksheet, worksheet);
        const newWorkbook = utils.book_new();
        utils.book_append_sheet(newWorkbook, newWorksheet, sheetName);
        const wbout = write(newWorkbook, {
          type: "base64",
          bookType: "xlsx",
        });
        const fileUri =
          FileSystem.cacheDirectory + "donnees_anthropometrie.malnutrix.xlsx";
        await FileSystem.writeAsStringAsync(fileUri, wbout, {
          encoding: FileSystem.EncodingType.Base64,
        });
        // Vérifier si le partage est disponible
        const isAvailable = await Sharing.isAvailableAsync();
        if (isAvailable) {
          await Sharing.shareAsync(fileUri, {
            mimeType:
              "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            dialogTitle: "Exporter les données anthropométriques",
            UTI: "com.microsoft.excel.xlsx",
          });
        } else {
          Alert.alert(
            "Fichier créé",
            `Le fichier a été créé avec succès dans: ${fileUri}`
          );
        }
      } catch (error) {
        console.error("Erreur lors de la création du fichier:", error);
        Alert.alert("Erreur", "Impossible de créer le fichier Excel");
        return null;
      }
    },
    [applyTemplateStyles, mapDataToRow]
  );
  return exportToXlsx;
}
