import React, { useEffect, useState } from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
<<<<<<< HEAD
import { View } from "@/components/ui/view";
import { FlatList, ToastAndroid } from "react-native";
=======
import { Pressable } from "@/components/ui/pressable";
import { View } from "@/components/ui/view";
import { MokedProtocolList } from "@/data";
import { FlatList } from "react-native";
>>>>>>> c3547ac (feat: Update version to v0.0.13-beta, enhance PDF viewer with download progress, and implement protocol download functionality)
import { CardPressEffect, FadeInCardY } from "@/components/custom/motion";
import { Divider } from "@/components/ui/divider";
import { router } from "expo-router";
import { downloadAndCacheFile } from "@/utils";
import { CORE_CONFIG } from "@/adapter/config/core";
import * as FileSystem from "expo-file-system";
import { Fab, FabIcon } from "@/components/ui/fab";
import { ArrowDownCircle } from "lucide-react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useToast } from "@/src/context";
import { PdfSourceUrl } from "../pdf_viewer";

const ProtocoleStoreKey = "protocoles_data";
export interface ProtocoleToolProps {}

export const ProtocoleTool: React.FC<ProtocoleToolProps> = ({}) => {
  const [protocolList, setProtocolList] = useState<
    {
      name: string;
      version: string;
      edition: string;
      url: PdfSourceUrl;
    }[]
  >([]);
  const toast = useToast();
  const [newVersionAvailable, setNewVersionAvailable] =
    useState<boolean>(false);

  const loadFormString = (jsonData: string) => {
    const data = JSON.parse(jsonData);
    setProtocolList(data);
  };
  const downloadProtocole = async () => {
    const fileUri = await downloadAndCacheFile(
      CORE_CONFIG.protocolesUrl,
<<<<<<< HEAD
      false
=======
      false,
      progress => console.log("Progress", progress)
>>>>>>> c3547ac (feat: Update version to v0.0.13-beta, enhance PDF viewer with download progress, and implement protocol download functionality)
    );
    if (fileUri) {
      const readFile = await FileSystem.readAsStringAsync(fileUri, {
        encoding: "utf8",
      });
      await AsyncStorage.setItem(ProtocoleStoreKey, readFile);
      loadFormString(readFile);
      setNewVersionAvailable(false);
    } else {
      toast.show(
        "Error",
        "Erreur lors du téléchargement du protocole.",
        "Vous devez dans un premier temps télecherager les protocoles avants l'utilisation. "
      );
    }
  };
  useEffect(() => {
    const checkNewVersionAsync = async (storeData: string) => {
      const fileUri = await downloadAndCacheFile(
        CORE_CONFIG.protocolesUrl,
        true
      );
      if (fileUri) {
        const readFile = await FileSystem.readAsStringAsync(fileUri, {
          encoding: "utf8",
        });
        if (readFile != storeData) {
          setNewVersionAvailable(true);
        }
      }
    };
    const loadProtocoleList = async () => {
      const storeData = await AsyncStorage.getItem(ProtocoleStoreKey);
      if (storeData) {
        loadFormString(storeData);
        await checkNewVersionAsync(storeData);
      } else {
        await downloadProtocole();
      }
    };

    loadProtocoleList();
  }, []);

<<<<<<< HEAD
  useEffect(() => {
    if (newVersionAvailable)
      ToastAndroid.show(
        "Une nouvelle version du protocole est disponible. Vous pouvez le télécharger en cliquant sur le bouton a droite.",
        5000
      );
  }, [newVersionAvailable]);
=======
>>>>>>> c3547ac (feat: Update version to v0.0.13-beta, enhance PDF viewer with download progress, and implement protocol download functionality)
  return (
    <React.Fragment>
      <ProtocleToolList data={protocolList} />
      {newVersionAvailable && (
<<<<<<< HEAD
        <Fab
          placement="bottom right"
          className="h-12 w-12 bg-primary-c_light"
          onPress={downloadProtocole}
        >
          <View className="absolute right-1 top-1 h-2 w-2 animate-ping rounded-full bg-red-500" />
          <FabIcon as={ArrowDownCircle} className="h-6 w-6 text-white" />
        </Fab>
=======
        <Pressable onPress={downloadProtocole}>
          <Fab
            placement="bottom right"
            className="h-12 w-12 bg-primary-c_light"
          >
            <View className="absolute right-0 top-0 h-2 w-2 animate-ping rounded-full bg-red-500" />
            <FabIcon as={ArrowDownCircle} className="h-6 w-6 text-white" />
          </Fab>
        </Pressable>
>>>>>>> c3547ac (feat: Update version to v0.0.13-beta, enhance PDF viewer with download progress, and implement protocol download functionality)
      )}
    </React.Fragment>
  );
};

export interface ProtocoleToolListProps {
  data: { name: string; version: string; edition: string; url: PdfSourceUrl }[];
}
export const ProtocleToolList: React.FC<ProtocoleToolListProps> = React.memo(
  ({ data }) => {
    return (
      <VStack className="flex-1 bg-background-primary px-4 pt-4">
        <HStack className="">
          <Heading className="font-h3 text-xl font-semibold">
            Liste des protocoles de traitement
          </Heading>
        </HStack>
        <FlatList
          contentContainerClassName="gap-4 pt-4"
          data={data}
          renderItem={({ item, index }) => (
            <FadeInCardY key={index} delayNumber={index * 3}>
              <ProtocoleToolCard data={item} />
            </FadeInCardY>
          )}
        />
      </VStack>
    );
  }
);
export interface ProtocoleToolCardProps {
  data: { name: string; version: string; edition: string; url: PdfSourceUrl };
}
export const ProtocoleToolCard: React.FC<ProtocoleToolCardProps> = React.memo(
  ({ data }) => {
    return (
      <CardPressEffect
        onPress={() => {
          router.navigate({
            pathname: "/(screens)/pdf_viewer/[uri_or_url]",
            params: {
              uri_or_url: data.url,
              name: data.name,
            },
          });
        }}
        onLongPress={() => {
          router.navigate({
            pathname: "/(screens)/pdf_viewer/[uri_or_url]",
            params: {
              uri_or_url: data.url,
              name: data.name,
              forceDownload: "yes",
            },
          });
        }}
      >
        <VStack className="rounded-xl bg-background-secondary px-3 py-3">
          <HStack>
            <Text className="font-h4 text-sm font-medium text-typography-primary">
              {data.name}
            </Text>
          </HStack>
          <Divider className="my-2 h-[1px] w-full bg-primary-border/5" />
          <HStack className="justify-between">
            <HStack>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                Édition :
              </Text>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                {data.edition}
              </Text>
            </HStack>
            <HStack>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                Version:{" "}
              </Text>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                {data.version}
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CardPressEffect>
    );
  }
);
