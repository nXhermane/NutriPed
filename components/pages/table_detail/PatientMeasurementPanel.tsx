import { FadeInCardY } from "@/components/custom/motion";
import {
  GrowthIndicatorValueDto,
  GrowthReferenceTableDto,
  IndicatorDto,
} from "@/core/evaluation";
import {
  useDynamicFormSchemaForIndicator,
  useGrowthIndicatorValueGeneratorForTable,
} from "@/src/hooks";
import React, { useRef, useState } from "react";
import { PatientMeasurementForm } from "../chart_detail";
import { FormHandler } from "@/components/custom";
import { useToast } from "@/src/context";
import { TableInterpretationResult } from "./TableInterpretationResult";

export interface PatientMeasurementPanelProps {
  indicatorDto: IndicatorDto;
}

export const PatientMeasurementPanel: React.FC<
  PatientMeasurementPanelProps
> = ({ indicatorDto }) => {
  const toast = useToast();
  const schema = useDynamicFormSchemaForIndicator(indicatorDto);
  const { submit } = useGrowthIndicatorValueGeneratorForTable(
    indicatorDto?.code
  );
  const dynamicFormRef = useRef<FormHandler<any> | null>(null);
  const [growthIndicatorValue, setGrowthIndicatorValue] =
    useState<GrowthIndicatorValueDto | null>(null);

  const handleSubmitForm = async () => {
    setGrowthIndicatorValue(null);
    const data = await dynamicFormRef.current?.submit();
    if (data) {
      const result = await submit(data as any);
      if (result) {
        setGrowthIndicatorValue(result.growthIndicatorValue);
        console.log(result.growthIndicatorValue);
      } else {
        toast.show(
          "Error",
          "Erreur lors de la determination du zscore.",
          "Veillez verifier si la taille que vous avez entrer et comprise entre 45cm et 120cm pour la table OMS et entre 120cm et 171cm pour la table NCHS"
        );
      }
    }
  };
  return (
    <React.Fragment>
      <FadeInCardY delayNumber={2}>
        <PatientMeasurementForm
          onSubmit={handleSubmitForm}
          formRef={dynamicFormRef}
          schema={schema}
          submitBtnLabel="Determiner le zscore"
          submitBtnRightIcon="Activity"
        />
      </FadeInCardY>
      {growthIndicatorValue && (
        <FadeInCardY delayNumber={3}>
          <TableInterpretationResult
            indicatorValue={growthIndicatorValue}
            indicatorName={indicatorDto?.name}
          />
        </FadeInCardY>
      )}
    </React.Fragment>
  );
};
