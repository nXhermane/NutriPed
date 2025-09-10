export const version = "v0.1.4-next";
export const CORE_CONFIG = {
  pediatricDataZipUrl: `https://cdn.jsdelivr.net/gh/nxh-labs/Pediatric_Software_Data_Extraction@${version}/dist/PediatricSoftWareData.zip`,
  protocolesUrl: `https://cdn.jsdelivr.net/gh/nxh-labs/Pediatric_Software_Data_Extraction@${version}/dist/protocoles.json`,
  anthropometricCalculatorResultExportTemplateUrl: `https://raw.githubusercontent.com/nxh-labs/Pediatric_Software_Data_Extraction/${version}/dist/export_anthropometric_result_template.xlsx`,
} as const;
