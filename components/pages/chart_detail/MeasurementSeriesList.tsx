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

export interface MeasurementSeriesListProps {
  series: ChartMeasurementSerie[];
  onChooseAction?: (value: { serieId: string }) => void;
  onDeleteMeasureAction?: (measureId: string) => void;
  selectedSerie?: string;
  neededMeasureCodes?: AnthroSystemCodes[];
}

export const MeasurementSeriesList: React.FC<MeasurementSeriesListProps> =
  React.memo(
    ({
      series = [],
      onChooseAction,
      selectedSerie,
      neededMeasureCodes = [],
      onDeleteMeasureAction,
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
                className={`rounded-xl ${selectedSerie === serie.id ? "border-[1px] border-blue-500/50" : ""}`}
              >
                <AccordionHeader>
                  <AccordionTrigger
                    onLongPress={() =>
                      onChooseAction && onChooseAction({ serieId: serie.id })
                    }
                  >
                    {({ isExpanded }: any) => {
                      return (
                        <>
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
