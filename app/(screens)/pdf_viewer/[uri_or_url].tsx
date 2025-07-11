import {
  PdfSourceUri,
  PdfSourceUrl,
  PdfViewer,
  PdfViewerHeader,
} from "@/components/pages/pdf_viewer";
import { VStack } from "@/components/ui/vstack";
import { useUI } from "@/src/context";
import { Stack, useLocalSearchParams } from "expo-router";
import React, { useMemo } from "react";

export default function PdfViewerScreen() {
  const params = useLocalSearchParams<{
    name: string;
    uri_or_url: PdfSourceUri | PdfSourceUrl;
    forceDownload: "yes" | "no";
  }>();
  useUI();
  const {
    name,
    uri_or_url,
    forceDownload = "no",
  } = useMemo(() => ({ ...params }), [params]);
  return (
    <React.Fragment>
      <Stack.Screen
        options={{
          headerShown: false,
          animation: "slide_from_bottom",
          // presentation: "transparentModal",
        }}
      />
      <PdfViewerHeader name={name} />
      <VStack className="flex-1 bg-background-primary">
        <PdfViewer
          source={
            uri_or_url.includes(`https`)
              ? { url: uri_or_url as PdfSourceUrl }
              : { uri: uri_or_url as PdfSourceUri }
          }
          forceDownload={forceDownload === "yes"}
        />
      </VStack>
    </React.Fragment>
  );
}
