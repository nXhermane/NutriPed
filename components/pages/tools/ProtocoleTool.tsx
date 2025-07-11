import React from "react";
import { VStack } from "@/components/ui/vstack";
import { HStack } from "@/components/ui/hstack";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { MokedProtocolList } from "@/data";
import { FlatList } from "react-native";
import { CardPressEffect, FadeInCardY } from "@/components/custom/motion";
import { Divider } from "@/components/ui/divider";
import { router } from "expo-router";
export interface ProtocoleToolProps {}

export const ProtocoleTool: React.FC<ProtocoleToolProps> = ({}) => {
  return <ProtocleToolList data={MokedProtocolList} />;
};

export interface ProtocoleToolListProps {
  data: (typeof MokedProtocolList)[number][];
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
  data: (typeof MokedProtocolList)[number];
}
export const ProtocoleToolCard: React.FC<ProtocoleToolCardProps> = React.memo(
  ({ data }) => {
    return (
      <CardPressEffect
        onPress={() => {
          router.navigate({
            pathname: "/(screens)/pdf_viewer/[uri_or_url]",
            params: {
              uri_or_url: data.source.url,
              name: data.name,
            },
          });
        }}
        onLayout={() => {
          router.navigate({
            pathname: "/(screens)/pdf_viewer/[uri_or_url]",
            params: {
              uri_or_url: data.source.url,
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
                2015
              </Text>
            </HStack>
            <HStack>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                Télechargé depuis :
              </Text>
              <Text
                className={
                  "font-body text-2xs font-normal text-primary-border/50"
                }
              >
                2015
              </Text>
            </HStack>
          </HStack>
        </VStack>
      </CardPressEffect>
    );
  }
);
