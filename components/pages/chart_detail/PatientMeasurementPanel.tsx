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
} from "@/src/hooks";
import React, { useRef } from "react";
import { MeasurementSeriesList } from "./MeasurementSeriesList";
import { SeriesLabelInputModal } from "./SeriesLabelInputModal";
import { GrowthReferenceChart } from "./GrowthReferenceChart";
import { PatientMeasurementForm } from "./PatientMeasurementForm";
import { MeasurementSeriesHeader } from "./MeasurementSeriesHeader";

export interface PatientMeasurementPanelProps {
  growthChartDto: GrowthReferenceChartDto;
  indicatorDto: IndicatorDto;
}

export const PatientMeasurementPanel: React.FC<PatientMeasurementPanelProps> = ({
  growthChartDto,
  indicatorDto,
}) => {
  const schema = useDynamicFormSchemaForIndicator(indicatorDto);

  const {
    closeSeriesLabelModal,
    handleSeriesAction,
    isSeriesLabelModalOpen,
    selectedSerie,
    measurementSeries,
  } = useMeasurementSeriesManager(
    growthChartDto?.code as GrowthRefChartAndTableCodes
  );
  const dynamicFormRef = useRef<FormHandler<any> | null>(null);

  const handleSubmitAddForm = async () => {
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const result = handleSeriesAction("addMeasure")(data as any);
      if (result) dynamicFormRef.current?.reset();
    }
  };
  const handleAddSeries = async () => {
    await handleSeriesAction("new")({} as any);
  };
  const handleDeleteSerieAction = async () => {
    if (selectedSerie === null) await handleSeriesAction("delete")({} as any);
    else handleSeriesAction("deleteSerie")(selectedSerie.serieId as any);
  };

  return (
    <React.Fragment>
      <PatientMeasurementForm onSubmit={handleSubmitAddForm} formRef={dynamicFormRef} schema={schema} />
      <SeriesLabelInputModal
        isOpen={isSeriesLabelModalOpen}
        onClose={closeSeriesLabelModal}
      />
      <VStack className="m-4 gap-4 rounded-xl bg-background-secondary px-3 py-3">
        <MeasurementSeriesHeader onAddSeries={handleAddSeries} onDeleteSeries={handleDeleteSerieAction} />
        <MeasurementSeriesList
          series={measurementSeries}
          selectedSerie={selectedSerie?.serieId}
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
      <GrowthReferenceChart />
    </React.Fragment>
  );
};
