import { FormHandler } from "@/components/custom";
import { VStack } from "@/components/ui/vstack";
import {
  AnthroSystemCodes,
  GrowthRefChartAndTableCodes,
  GrowthReferenceChartDto,
  IndicatorDto,
} from "@/core/diagnostics";
import {
  useMeasurementSeriesManager,
  useDynamicFormSchemaForIndicator,
  SelectedChartMeasurementSerie,
} from "@/src/hooks";
import React, { useEffect, useRef } from "react";
import { MeasurementSeriesList } from "./MeasurementSeriesList";
import { SeriesLabelInputModal } from "./SeriesLabelInputModal";
import { PatientMeasurementForm } from "./PatientMeasurementForm";
import { MeasurementSeriesHeader } from "./MeasurementSeriesHeader";
import { FadeInCardY } from "@/components/custom/motion";
import { Center } from "@/components/ui/center";
import { Spinner } from "@/components/ui/spinner";
import colors from "tailwindcss/colors";
import { Sex } from "@/core/shared";

export interface PatientMeasurementPanelProps {
  growthChartDto: GrowthReferenceChartDto;
  indicatorDto: IndicatorDto;
  onSelectedSeriesChange?: (
    selectedSeries: SelectedChartMeasurementSerie[]
  ) => void;
}

export const PatientMeasurementPanel: React.FC<
  PatientMeasurementPanelProps
> = ({ growthChartDto, indicatorDto, onSelectedSeriesChange }) => {
  const schema = useDynamicFormSchemaForIndicator(indicatorDto);

  const {
    closeSeriesLabelModal,
    handleSeriesAction,
    isSeriesLabelModalOpen,
    selectedSerie,
    measurementSeries,
    selectedSeries,
  } = useMeasurementSeriesManager(
    growthChartDto?.code as GrowthRefChartAndTableCodes,
    growthChartDto?.sex as Sex,
    indicatorDto?.code
  );
  const dynamicFormRef = useRef<FormHandler<any> | null>(null);

  const handleSubmitAddForm = async () => {
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const result = await handleSeriesAction("addMeasure")(data as any);
      if (result) dynamicFormRef.current?.reset();
    }
  };
  const handleAddSeries = async () => {
    handleSeriesAction("new")({} as any);
  };
  const handleDeleteSerieAction = async () => {
    if (selectedSerie === null) await handleSeriesAction("delete")({} as any);
    else handleSeriesAction("deleteSerie")(selectedSerie.serieId as any);
  };
  useEffect(() => {
    onSelectedSeriesChange && onSelectedSeriesChange(selectedSeries);
  }, [selectedSeries]);

  if (!growthChartDto)
    return (
      <Center className="flex-1 bg-background-primary">
        <Spinner size={"large"} color={colors.blue["600"]} />
      </Center>
    );

  return (
    <React.Fragment>
      <VStack>
        <VStack>
          <FadeInCardY delayNumber={2}>
            <PatientMeasurementForm
              onSubmit={handleSubmitAddForm}
              formRef={dynamicFormRef}
              schema={schema}
              submitBtnLabel="Ajouter mesure"
              submitBtnRightIcon="Plus"
            />
          </FadeInCardY>
        </VStack>
        <FadeInCardY delayNumber={3}>
          <SeriesLabelInputModal
            isOpen={isSeriesLabelModalOpen}
            onClose={closeSeriesLabelModal}
          />
        </FadeInCardY>
        <FadeInCardY delayNumber={4}>
          <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
            <MeasurementSeriesHeader
              onAddSeries={handleAddSeries}
              onDeleteSeries={handleDeleteSerieAction}
            />
            <MeasurementSeriesList
              series={measurementSeries}
              selectedSerie={selectedSerie?.serieId}
              multipleSeries={selectedSeries.map(serie => ({
                serieId: serie.id,
              }))}
              onMultipleSerieSelection={(serieId: string) =>
                handleSeriesAction("multipleSelection")({ serieId } as any)
              }
              onChooseAction={value =>
                handleSeriesAction("choose")({ serieId: value.serieId } as any)
              }
              onDeleteMeasureAction={(measureId: string) => {
                handleSeriesAction("deleteMeasure")(measureId as any);
              }}
              neededMeasureCodes={
                indicatorDto?.neededMeasureCodes as AnthroSystemCodes[]
              }
            />
          </VStack>
        </FadeInCardY>
      </VStack>
    </React.Fragment>
  );
};
