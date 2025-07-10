import { CORE_CONFIG } from "@/adapter/config/core";
import React from "react";
import { PdfViewer } from "@/components/custom";
const ProtocoleCurrentPageStorageKey = "protocole_current_page";
export interface ProtocoleToolProps {}

export const ProtocoleTool: React.FC<ProtocoleToolProps> = ({}) => {
  return <PdfViewer source={{ url: CORE_CONFIG.protocolePdfUrl }} />;
};
