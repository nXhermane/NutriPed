import { VStack } from "@/components/ui/vstack";
import React from "react";
import { InitPatientRootSecure } from "./InitPatient";
import { useNutritionalDiagnostic } from "@/src/hooks";
import { Loading } from "@/components/custom";
import { InitPatientDiagnosticRoot } from "./PatientDetailDiagnostic/InitPatientDiagnostic";
import { ScrollView } from "react-native";

export interface PatientDetailDiagnosticProps {}

const PatientDetailDiagnosticComponent: React.FC<
  PatientDetailDiagnosticProps
> = ({}) => {
  const { data, error, onLoading } = useNutritionalDiagnostic();
   console.log(JSON.stringify(data))
  if (onLoading) return <Loading />;

  return (
    <React.Fragment>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-v-14"
      >
        <VStack className="flex-1 bg-background-primary"></VStack>
      </ScrollView>
    </React.Fragment>
  );
};

export const PatientDetailDiagnostic: React.FC<
  PatientDetailDiagnosticProps
> = props => {
  return (
    <InitPatientRootSecure>
      <InitPatientDiagnosticRoot>
        <PatientDetailDiagnosticComponent {...props} />
      </InitPatientDiagnosticRoot>
    </InitPatientRootSecure>
  );
};
