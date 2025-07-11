import { useToast, useUI } from "@/src/context";
import { downloadAndCacheFile } from "@/utils";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useMemo } from "react";
import { Center } from "../../ui/center";
import { Spinner } from "../../ui/spinner";
import { Text } from "../../ui/text";
import colors from "tailwindcss/colors";
import { Fab, FabIcon } from "../../ui/fab";
import * as FileSystem from "expo-file-system";
import * as IntentLauncher from "expo-intent-launcher";
import { ExternalLink } from "lucide-react-native";
import { VStack } from "../../ui/vstack";
import { Progress, ProgressFilledTrack } from "../../ui/progress";
import Pdf from "react-native-pdf";
import { Linking } from "react-native";

const PdfCurrentPageStorageKey = (uri: string) => `${uri}_current_page`;
export type PdfSourceUri = `file:///${string}.pdf`;
export type PdfSourceUrl = `https://${string}.pdf`;
export interface PdfViewerProps {
  source: { uri: PdfSourceUri } | { url: PdfSourceUrl };
  forceDownload?: boolean;
}

function PdfViewerComponent({ source, forceDownload }: PdfViewerProps) {
  const [isDownload, setIsDownload] = React.useState<boolean>(false);
  const [uri, setUri] = React.useState<string>("");
  const { colorMode } = useUI();
  const [initialPage, setInitialPage] = React.useState<number>(0);
  const [readProgress, setReadProgress] = React.useState<number>(0);
  const [downloadProgress, setDownloadProgress] = React.useState<number>(0);
  const currentPageNumber = React.useRef(0);
  const toast = useToast();

  React.useEffect(() => {
    const onUri = async (uri: string) => {
      const info = await FileSystem.getInfoAsync(uri);
      if (!(info.exists || (info as any).size > 0)) {
        toast.show(
          "Error",
          "Fichier invalide",
          "Le fichier semble vide ou corrompu."
        );
        return;
      }
      setUri(uri);
      const _currentPage = await AsyncStorage.getItem(
        PdfCurrentPageStorageKey(uri)
      );
      if (_currentPage) {
        const $currentPage = JSON.parse(_currentPage);
        setInitialPage($currentPage.currentPageNumber);
        currentPageNumber.current = $currentPage.currentPageNumber;
      }
      setIsDownload(true);
    };
    const loadFileAsync = async () => {
      if (!isDownload) {
        if ("uri" in source) {
          onUri(source.uri);
          return;
        } else {
          const uri = await downloadAndCacheFile(
            source.url,
            forceDownload,
            setDownloadProgress
          );
          if (uri) {
            onUri(uri);
          } else {
            toast.show(
              "Error",
              "Erreur de téléchargement",
              "Une Erreur s'est producte lors du téléchargement. Veillez vous s'assurer que votre connexion internet est activée."
            );
          }
        }
      }
    };
    loadFileAsync();
    const onUnMount = async () => {
      await AsyncStorage.setItem(
        PdfCurrentPageStorageKey(uri),
        JSON.stringify({ currentPageNumber: currentPageNumber.current })
      );
    };
    return () => {
      onUnMount();
    };
  }, [source, forceDownload]);

  if (!isDownload || !uri)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
        <Text className="mt-4 font-body text-sm font-normal text-typography-primary_light">
          Téléchargement en cours...
        </Text>
        <Progress
          className="mt-3 h-v-1 w-64 bg-background-secondary"
          value={downloadProgress * 100}
        >
          <ProgressFilledTrack className="rounded-full bg-blue-600" />
        </Progress>
      </Center>
    );

  return (
    <React.Fragment>
      <Fab
        placement="bottom right"
        className="h-12 w-12 bg-primary-c_light"
        onPress={async () => {
          const contentUri = await FileSystem.getContentUriAsync(uri);
          await IntentLauncher.startActivityAsync(
            "android.intent.action.VIEW",
            {
              data: contentUri,
              type: "application/pdf",
              flags: 1,
            }
          );
        }}
      >
        <FabIcon
          as={ExternalLink}
          className="h-6 w-6 text-typography-primary"
        />
      </Fab>
      <VStack className="h-full w-full bg-background-primary">
        <Progress
          value={readProgress}
          orientation="horizontal"
          className="h-v-1 rounded-none bg-background-secondary"
        >
          <ProgressFilledTrack className="rounded-none bg-primary-c_light" />
        </Progress>

        <Pdf
          enableAnnotationRendering={true}
          enableAntialiasing={true}
          enableDoubleTapZoom={true}
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
          trustAllCerts={true}
          source={{ uri }}
          onLoadComplete={(numberOfPages, filePath, size, tableContent) => {
            // console.log("Table content",tableContent)
            // console.log(`Number of pages: ${numberOfPages}`);
          }}
          onPageChanged={(page, numberOfPages) => {
            currentPageNumber.current = page;
            setReadProgress((page / numberOfPages) * 100);
          }}
          onError={error => {
            console.error(error);
            toast.show(
              "Error",
              "Erreur technique",
              "Une erreur s'est producte lors du chargement du document."
            );
          }}
          onPressLink={uri => {
            Linking.openURL(uri);
          }}
          style={{
            flex: 1,
            backgroundColor: colorMode === "light" ? "#f9f9f9" : "#121212",
            height: 200,
          }}
          page={initialPage}
        />
      </VStack>
    </React.Fragment>
  );
}

export const PdfViewer = React.memo(PdfViewerComponent);
