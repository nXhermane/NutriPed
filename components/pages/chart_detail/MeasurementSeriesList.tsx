import {
  Accordion,
  AccordionContent,
  AccordionHeader,
  AccordionIcon,
  AccordionItem,
  AccordionTitleText,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChartMeasurementSerie } from "@/src/store";
import { ChevronUp, ChevronDown } from "lucide-react-native";
import React from "react";
import { AnthroSystemCodes } from "@/core/constants";
import { MeasurementItem } from "./MeasurementItem";
import { FadeInCardY } from "@/components/custom/motion";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Divider } from "@/components/ui/divider";
import { Text } from "@/components/ui/text";
import { HumanDateFormatter } from "@/utils";
export interface MeasurementSeriesListProps {
  series: ChartMeasurementSerie[];
  onChooseAction?: (value: { serieId: string }) => void;
  onDeleteMeasureAction?: (measureId: string) => void;
  selectedSerie?: string;
  neededMeasureCodes?: AnthroSystemCodes[];
  multipleSeries: { serieId: string }[];
  onMultipleSerieSelection: (serieId: string) => void;
}

export const MeasurementSeriesList: React.FC<MeasurementSeriesListProps> =
  React.memo(
    ({
      series = [],
      onChooseAction,
      selectedSerie,
      neededMeasureCodes = [],
      onDeleteMeasureAction,
      multipleSeries,
      onMultipleSerieSelection,
    }) => {
      return (
        <Accordion className="gap-3 bg-transparent">
          {[...series]
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime()
            )
            .map(serie => (
              <AccordionItem
                value={serie.id}
                key={serie.id}
                className={`rounded-xl ${selectedSerie === serie.id ? "border-[1px] border-blue-500/50" : ""} ${multipleSeries.findIndex(s => s.serieId === serie.id) != -1 ? "border-primary-c_light border-[1px]" : ""} `}
              >
                <AccordionHeader className="">
                  <AccordionTrigger
                    onLongPress={() =>
                      onChooseAction && onChooseAction({ serieId: serie.id })
                    }
                    onPress={() =>
                      onMultipleSerieSelection &&
                      onMultipleSerieSelection(serie.id)
                    }
                  >
                    {({ isExpanded }: any) => {
                      return (
                        <>
                          <VStack className="w-full">
                            <HStack>
                              <AccordionTitleText
                                className={`font-h4 text-lg font-medium`}
                              >
                                {serie.label}
                              </AccordionTitleText>
                              {isExpanded ? (
                                <AccordionIcon as={ChevronUp} />
                              ) : (
                                <AccordionIcon as={ChevronDown} />
                              )}
                            </HStack>
                            <Divider className="h-[1px] bg-primary-border/5" />
                            <HStack className="justify-between pt-3">
                              <Text className="font-body text-2xs font-normal text-primary-border/50">
                                Mise à jour:{" "}
                                {HumanDateFormatter.toRelativeDate(
                                  serie.updatedAt
                                )}
                              </Text>
                              <Text className="font-body text-2xs font-normal text-primary-border/50">
                                {serie.data.length} mesures
                              </Text>
                            </HStack>
                          </VStack>
                        </>
                      );
                    }}
                  </AccordionTrigger>
                </AccordionHeader>
                <AccordionContent>
                  {serie.data.map((item, index) => (
                    <FadeInCardY key={item.id} delayNumber={index + 2}>
                      <MeasurementItem
                        key={item.id}
                        data={item.data}
                        result={item.results}
                        id={item.id}
                        neededMeasureCodes={neededMeasureCodes}
                        onDeleteMeasureAction={() => {
                          onDeleteMeasureAction &&
                            onDeleteMeasureAction(item.id);
                        }}
                      />
                    </FadeInCardY>
                  ))}
                </AccordionContent>
              </AccordionItem>
            ))}
        </Accordion>
      );
    }
  );
