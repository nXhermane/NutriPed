import { Box } from "@/components/ui/box";
import { MokedPatientList } from "@/data";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, ScrollView } from "react-native";
import {
  PatientCard,
  PatientCardInfo,
  PatientCardProps,
  PatientCardSkeleton,
} from "../commun";
import { SessionEmpty } from "../home/shared/SessionEmpty";
import { Fab, FabIcon } from "@/components/ui/fab";
import { UserPlus } from "lucide-react-native";
import { ActionBtnSession } from "./ActionsSession";
import { AddPatientBottomSheet } from "./AddPatientBottomSheet";
import { useDispatch, useSelector } from "react-redux";
import { usePediatricApp } from "@/adapter";
import { AggregateID, Message } from "@/core/shared";
import { PATIENT_STATE } from "@/src/constants/ui";
import { AppDispatch, Interaction } from "@/src/store";
import { recordUiState } from "@/src/store/uiState";
import { DeletePatientBottomSheet } from "./DeletePatientBottomSheet";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
type SelectedPatient = {
  name: string;
  id: AggregateID;
};
export interface PatientListSessionProps {
  useMoked?: boolean;
}
export const PatientListSession: React.FC<PatientListSessionProps> = ({
  useMoked = false,
}) => {
  const [onLoading, setOnLoading] = useState<boolean>(false);
  const [hideFab, setHideFab] = useState<boolean>(false);
  const [patientList, setPatientList] = useState<PatientCardInfo[]>([]);
  const [selectedItem, setSelectedItem] = useState<SelectedPatient[]>([]);
  const [showPatientForm, setShowPatientForm] = useState<boolean>(false);
  const [showConfirmDeletionAction, setShowConfirmDeletionAction] =
    useState<boolean>(false);
  const updatePatientList = useSelector(
    (state: any) => state.uiReducer.refreshPatientList
  );
  const patientInteractionList: Interaction[] = useSelector(
    (state: any) => state.patientInteractionReducer.interactions
  );
  const dispatch = useDispatch<AppDispatch>();
  const { patientService } = usePediatricApp();

  useEffect(() => {
    // if (useMoked) {
    //   setPatientList(
    //     MokedPatientList.concat(MokedPatientList).concat(MokedPatientList)
    //   );
    // }
  }, [useMoked]);

  useEffect(() => {
    const getPatientList = async () => {
      setOnLoading(true);
      const patients = await patientService.get({});
      const lists: PatientCardInfo[] = [];
      if (!(patients instanceof Message)) {
        for (const patientDto of patients.data) {
          lists.push({
            birthday: patientDto.birthday,
            name: patientDto.name,
            createdAt: patientDto.registrationDate,
            status:
              patientInteractionList.find(
                interaction => interaction.patientId === patientDto.id
              )?.state || PATIENT_STATE.NORMAL,
            id: patientDto.id,
          });
        }
      }
      setPatientList(lists);
      dispatch(recordUiState({ type: "PATIENT_REFRESHED" }));
      setOnLoading(false);
    };
    getPatientList();
  }, [updatePatientList]);

  const handleDeleteAction = () => {
    setShowConfirmDeletionAction(true);
  };

  return (
    <Box className="h-full max-h-[65%]">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="gap-3 py-1 pb-v-10"
        onMomentumScrollEnd={() => setHideFab(false)}
        onScroll={() => setHideFab(true)}
      >
        {onLoading ? (
          new Array(10)
            .fill(0)
            .map((_, index) => <PatientCardSkeleton key={index} />)
        ) : patientList.length === 0 ? (
          <SessionEmpty
            message={"Aucun patient pour le moment.Veillez ajouter un patient."}
            iconName={"UserLock"}
          />
        ) : (
          patientList.map((item, index) => (
            <PatientCard
              name={item.name}
              createdAt={item.createdAt}
              status={item.status as PatientCardProps["status"]}
              key={index}
              birthday={item.birthday}
              nextVisitDate={item.nextVisitDate}
              enableSelection
              enableQuickSelection={selectedItem.length >= 1}
              scaled={false}
              selected={!!selectedItem.find(patient => item.id === patient.id)}
              onChange={(value: boolean) => {
                setSelectedItem(prev => {
                  const findedIndex = prev.findIndex(
                    selectedPatient => selectedPatient.id === item.id
                  );
                  if (findedIndex === -1 && value) {
                    return [
                      ...prev,
                      { id: item.id as AggregateID, name: item.name },
                    ];
                  }
                  return prev.filter(
                    selectedPatient => selectedPatient.id != item.id
                  );
                });
              }}
            />
          ))
        )}
      </ScrollView>
      {!hideFab && selectedItem.length === 0 && (
        <Fab
          placement="bottom right"
          className="-mr-2 mb-4 h-11 w-11 bg-primary-c"
          onPress={() => setShowPatientForm(true)}
        >
          <FabIcon as={UserPlus} className="h-6 w-6 text-typography-primary" />
        </Fab>
      )}
      <ActionBtnSession
        isVisible={selectedItem.length != 0}
        actions={[
          {
            icon: "Share2",
            toolTip: "Partager",
            classNameColor: "bg-violet-500",
          },
          {
            icon: "ScanEye",
            toolTip: "Voir",
            classNameColor: "bg-blue-500",
          },
          {
            icon: "Trash2",
            toolTip: "Supprimer",
            classNameColor: "bg-red-500",
            onPress: handleDeleteAction,
          },
        ]}
      />
      <AddPatientBottomSheet
        isOpen={showPatientForm}
        onClose={() => setShowPatientForm(false)}
      />
      <DeletePatientBottomSheet
        isOpen={showConfirmDeletionAction}
        selectedPatients={selectedItem}
        onClose={() => setShowConfirmDeletionAction(false)}
        onDeleteSucceed={() => setSelectedItem([])}
      />
    </Box>
  );
};
