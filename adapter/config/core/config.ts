export const version = "v0.0.12-beta";
export const CORE_CONFIG = {
  pediatricDataZipUrl: `https://cdn.jsdelivr.net/gh/nxh-labs/Pediatric_Software_Data_Extraction@${version}/dist/PediatricSoftWareData.zip`,
  protocolePdfUrl: `https://cdn.jsdelivr.net/gh/nxh-labs/Pediatric_Software_Data_Extraction@${version}/dist/protocole.pdf`,
  anthropometricCalculatorResultExportTemplateUrl: `https://raw.githubusercontent.com/nxh-labs/Pediatric_Software_Data_Extraction/${version}/dist/export_anthropometric_result_template.xlsx`
} as const;
// `