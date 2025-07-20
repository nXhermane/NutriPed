import { Guard, Sex } from "@/core/shared";
import {
  GrowthChartListOrderedByIndicatorType,
  useFuseSearch,
  useGrowthChartsOrderedByIndicator,
} from "@/src/hooks";
import React, { useEffect, useMemo } from "react";
import { ChartToolsSession } from "./ChartToolsSession";
import { SectionList } from "react-native";
import { ChartCard } from "./ChartCard";
import { ChartListSessionHeader } from "./ChartListSessionHeader";
import { Box } from "@/components/ui/box";
import { router } from "expo-router";
import { useToast } from "@/src/context";
import { FadeInCardY } from "@/components/custom/motion";
import { Loading } from "@/components/custom";

export interface ChartListSessionProps {
  searchOptions: { searchText: string; filterTag: string };
}
export const ChartListSession: React.FC<ChartListSessionProps> = ({
  searchOptions,
}) => {
  const { data, error, isLoading } = useGrowthChartsOrderedByIndicator();
  const toast = useToast();
  const filterResultCallback = useMemo(() => {
    return (list: GrowthChartListOrderedByIndicatorType) => {
      if (
        searchOptions.filterTag.trim() === "all" ||
        Guard.isEmpty(searchOptions.filterTag).succeeded
      )
        return list;
      const filterdResult = list.filter(
        value => value.indicator.tag === searchOptions.filterTag
      );
      return filterdResult;
    };
  }, [searchOptions.filterTag]);

  const result = useFuseSearch({
    list: data || [],
    options: {
      keys: ["indicator.tag", "data.chart.name"],
      threshold: 0.3, // ajustable : plus bas = plus strict
      ignoreLocation: true, // ne tient pas compte de la position du texte
      includeScore: true,
      useExtendedSearch: true,
    },
    filterResultCallback,
    searchParams: !Guard.isEmpty(searchOptions.searchText).succeeded
      ? {
          pattern: {
            $and: [
              {
                $path: ["data", "chart.name"],
                $val: searchOptions.searchText,
              },
            ],
          },
        }
      : undefined,
  });

  useEffect(() => {
    if (error)
      toast.show(
        "Error",
        "Erreur de chargement",
        "Erreur lors du chargement des courbes de croissance. Veillez reessayer"
      );
  }, [error]);

  if (!data || isLoading) return <Loading />;

  return (
    <React.Fragment>
      <ChartToolsSession className="px-2">
        <SectionList
          sections={result || []}
          showsVerticalScrollIndicator={false}
          initialNumToRender={10}
          maxToRenderPerBatch={10}
          windowSize={5}
          removeClippedSubviews
          renderItem={({ item, section: { indicator }, index }) => {
            return (
              <FadeInCardY key={item.chart.code} delayNumber={index + 1}>
                <ChartCard
                  key={item.chart.code}
                  name={item.chart.name}
                  indicator={indicator}
                  sex={item.chart.sex as Sex}
                  standard={item.chart.standard}
                  updatedAt={item.chart.updatedAt}
                  uiData={item.uiData}
                  onPress={() => {
                    router.navigate({
                      pathname: "/(screens)/chart_detail/[code]",
                      params: {
                        code: item.chart.code,
                        indicatorCode: indicator.tag,
                      },
                    });
                  }}
                />
              </FadeInCardY>
            );
          }}
          renderSectionHeader={({ section: { indicator } }) => {
            return (
              <ChartListSessionHeader
                key={indicator.tag}
                indicator={indicator}
              />
            );
          }}
          ItemSeparatorComponent={() => <Box className={"h-v-4"} />}
        />
      </ChartToolsSession>
    </React.Fragment>
  );
};
