import { VStack } from "@/components/ui/vstack";
import React, { PropsWithChildren, useEffect, useState } from "react";
import { GrowthReferenceTableDto, TableDataDto } from "@/core/evaluation";
import {
  BottomSheet,
  BottomSheetBackdrop,
  BottomSheetContent,
  BottomSheetDragIndicator,
  BottomSheetPortal,
  BottomSheetTrigger,
} from "@/components/ui/bottomsheet";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { ChevronUp } from "lucide-react-native";
import colors from "tailwindcss/colors";
import { useUI } from "@/src/context";
import {
  Table,
  TableBody,
  TableData,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TABLE_UI_DATA } from "@/src/constants/ui";
import { Box } from "@/components/ui/box";
import { FlatList, ScrollView } from "react-native";

export interface GrowthReferenceTableProps {
  growthTableData: GrowthReferenceTableDto;
}

export const GrwothReferenceTable: React.FC<GrowthReferenceTableProps> = ({
  growthTableData,
}) => {
  const { colorMode } = useUI();

  const [tableStruct, setTableStruct] =
    useState<
      (typeof TABLE_UI_DATA)[keyof typeof TABLE_UI_DATA]["tableStruct"]
    >();

  useEffect(() => {
    if (growthTableData) {
      setTableStruct(
        TABLE_UI_DATA[growthTableData.code as keyof typeof TABLE_UI_DATA]
          .tableStruct
      );
    }
  }, [growthTableData]);

  return (
    <BottomSheet>
      <VStack className="bg-background-primary p-4">
        <BottomSheetTrigger>
          <HStack className="h-v-10 items-center justify-center gap-4 rounded-xl border-[0.1px] border-primary-c_light">
            <VStack className="gap-0">
              <Icon as={ChevronUp} className="text-primary-c_light" />
              <Icon as={ChevronUp} className="text-primary-c_light/70" />
            </VStack>
            <Text className="font-h4 font-medium text-primary-c_light">
              Afficher la table
            </Text>
            <VStack className="gap-0">
              <Icon as={ChevronUp} className="text-primary-c_light" />
              <Icon as={ChevronUp} className="text-primary-c_light/70" />
            </VStack>
          </HStack>
        </BottomSheetTrigger>
      </VStack>
      <BottomSheetPortal
        snapPoints={["75%", "90%"]}
        enableContentPanningGesture={false}
        backdropComponent={BottomSheetBackdrop}
        handleIndicatorStyle={{
          backgroundColor:
            colorMode === "light" ? colors.gray["300"] : colors.gray["500"],
        }}
        handleComponent={props => <BottomSheetDragIndicator {...props} />}
        backgroundComponent={props => {
          return (
            <VStack
              {...props}
              className="rounded-2xl bg-background-secondary"
            />
          );
        }}
      >
        <BottomSheetContent className="bg-background-secondary">
          <ScrollView
            // className={"h-[90vh]"}
            contentContainerClassName={""}
            showsVerticalScrollIndicator={false}
            horizontal
          >
            <Table className="">
              <TableHeader>
                <TableRow>
                  <TableHead className="w-40 gap-0 px-0">
                    <Text className="text-center font-h4 text-xs font-medium text-typography-primary">
                      Taille
                    </Text>
                    <Text className="text-center font-body text-2xs font-normal text-typography-primary_light">
                      {"\n(cm)"}
                    </Text>
                  </TableHead>
                  {tableStruct?.colUiData?.map((colData, index) => (
                    <TableHead
                      className="text-center font-h4 text-xs font-medium text-typography-primary"
                      key={index}
                    >
                      {colData.title}
                      <Text className="text-center font-body text-2xs font-normal text-typography-primary_light">
                        {`\n${colData.desc}`}
                      </Text>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                <FlatList
                  initialNumToRender={10}
                  maxToRenderPerBatch={10}
                  windowSize={5}
                  // removeClippedSubviews
                  className={"h-[80vh]"}
                  data={growthTableData?.data}
                  keyExtractor={item => item.value.toString()}
                  renderItem={({ item: data, index }) => {
                    return (
                      <AminatedTableRow
                        data={data}
                        tableStruct={tableStruct as any}
                        key={data.value}
                        isHightLight={index % 2 === 0}
                      />
                    );
                  }}
                />
                {/* {growthTableData?.data.map(data => {})} */}
              </TableBody>
            </Table>
          </ScrollView>
        </BottomSheetContent>
      </BottomSheetPortal>
    </BottomSheet>
  );
};

export interface AnimatedTableRowProps extends PropsWithChildren {
  data: TableDataDto;
  tableStruct: (typeof TABLE_UI_DATA)[keyof typeof TABLE_UI_DATA]["tableStruct"];
  isHightLight?: boolean;
}
export const AminatedTableRow: React.FC<AnimatedTableRowProps> = ({
  data,
  tableStruct,
  isHightLight = false,
}) => {
  return (
    <TableRow
    //  className={` ${isHightLight ? "border-y border-primary-c_light bg-background-secondary" : ""}`}
    >
      <TableData useRNView={true} className="px-0">
        <Box className="">
          <Text className="text-center">
            {data.value.toString().split(".").join(",")}
          </Text>
        </Box>
      </TableData>
      {tableStruct?.colUiData.map(({ key }) => {
        return (
          <TableData
            key={key}
            className={`${key === "median" ? "bg-green-600/30" : key === "normalNeg" ? "bg-green-500/30" : key === "outComeTargetValueNeg" ? "bg-green-300/30" : key === "moderateNeg" ? "bg-yellow-300/30" : key === "severeNeg" ? "bg-red-400/30" : "bg-red-500/30"}`}
          >
            {data[key].toString().split(".").join(",")}
          </TableData>
        );
      })}
    </TableRow>
  );
};
