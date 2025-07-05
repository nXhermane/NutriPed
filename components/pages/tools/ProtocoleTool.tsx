import { CORE_CONFIG } from "@/adapter/config/core";
import React, { useEffect, useRef, useState } from "react";
import { Dimensions } from "react-native";
import Pdf from "react-native-pdf";
import * as FileSystem from "expo-file-system";
import { useToast, useUI } from "@/src/context";
import * as Sharing from "expo-sharing";
import * as IntentLauncher from "expo-intent-launcher";
import * as Linking from "expo-linking";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { VStack } from "@/components/ui/vstack";
import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ExternalLink, LineChart } from "lucide-react-native";
import { Box } from "@/components/ui/box";
const ProtocoleCurrentPageStorageKey = "protocole_current_page";
export interface ProtocoleToolProps {}

export const ProtocoleTool: React.FC<ProtocoleToolProps> = ({}) => {
  const [isDownload, setIsDownload] = useState<boolean>(false);
  const [uri, setUri] = useState<string>("");
  const { colorMode } = useUI();
  const [initialPage, setInitialPage] = useState<number>(0);
  const [readProgress, setReadProgress] = useState<number>(0);
  const currentPageNumber = useRef(0);
  const toast = useToast();

  useEffect(() => {
    if (!isDownload) {
      downloadPDF(CORE_CONFIG.protocolePdfUrl)
        .then(async uri => {
          if (uri) {
            setUri(uri);
            const _currentPage = await AsyncStorage.getItem(
              ProtocoleCurrentPageStorageKey
            );
            if (_currentPage) {
              const $currentPage = JSON.parse(_currentPage);
              setInitialPage($currentPage.currentPageNumber);
              currentPageNumber.current = $currentPage.currentPageNumber;
            }
            setIsDownload(true);
          }
        })
        .catch(e => {
          console.log(e);
        });
    }
    const onUnMount = async () => {
      await AsyncStorage.setItem(
        ProtocoleCurrentPageStorageKey,
        JSON.stringify({ currentPageNumber: currentPageNumber.current })
      );
    };
    return () => {
      onUnMount();
    };
  }, []);

  if (!isDownload)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
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
          source={{ uri }}
          onLoadComplete={(numberOfPages, filePath, size) => {
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
              "Une erreur s'est producte lors du chargement du protocole de traitement"
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
};

const downloadPDF = async (pdfUrl: string) => {
  try {
    const fileUri = FileSystem.documentDirectory + "protocole.pdf";
    const { exists } = await FileSystem.getInfoAsync(fileUri);
    if (exists) return fileUri;
    const downloadResult = await FileSystem.downloadAsync(pdfUrl, fileUri);

    console.log("PDF téléchargé:", downloadResult.uri);
    return downloadResult.uri;
  } catch (error) {
    console.error("Erreur téléchargement:", error);
  }
};
