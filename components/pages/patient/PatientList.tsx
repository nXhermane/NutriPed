import { Box } from "@/components/ui/box";
import { MokedPatientList } from "@/data";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList, ScrollView } from "react-native";
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
import { PATIENT_QUICK_FILTER_TAG, PATIENT_STATE } from "@/src/constants/ui";
import { AppDispatch, Interaction } from "@/src/store";
import { recordUiState } from "@/src/store/uiState";
import { DeletePatientBottomSheet } from "./DeletePatientBottomSheet";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton, SkeletonText } from "@/components/ui/skeleton";
import { router } from "expo-router";
import { usePatientList } from "@/src/hooks";
import Fuse from "fuse.js";
type SelectedPatient = {
  name: string;
  id: AggregateID;
};
export interface PatientListSessionProps {
  searchText: string;
  useMoked?: boolean;
  filterTag: PATIENT_QUICK_FILTER_TAG;
}
export const PatientListSession: React.FC<PatientListSessionProps> = ({
  useMoked = false,
  searchText,
  filterTag,
}) => {
  const [hideFab, setHideFab] = useState<boolean>(false);
  const [selectedItem, setSelectedItem] = useState<SelectedPatient[]>([]);
  const [showPatientForm, setShowPatientForm] = useState<boolean>(false);
  const [showConfirmDeletionAction, setShowConfirmDeletionAction] =
    useState<boolean>(false);
  const { onLoading, patientList } = usePatientList(filterTag);
  const fuse = new Fuse(patientList, {
    keys: ["name"],
    threshold: 0.3, // ajustable : plus bas = plus strict
    ignoreLocation: true, // ne tient pas compte de la position du texte
    includeScore: true,
  });

  const filteredList = searchText
    ? fuse.search(searchText).map(result => result.item)
    : patientList;
  const handleDeleteAction = () => {
    setShowConfirmDeletionAction(true);
  };

  return (
    <Box className="h-full max-h-[65%]">
      <FlatList
        className={"pt-3"}
        initialNumToRender={10}
        data={filteredList}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        renderItem={({ item }) => (
          <PatientCard
            name={item.name}
            createdAt={item.createdAt}
            status={item.status as PatientCardProps["status"]}
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
            onPress={() => {
              item.id &&
                router.push({
                  pathname: "/(screens)/patient_detail/[id]",
                  params: { id: item.id as string },
                });
            }}
          />
        )}
        ListEmptyComponent={() => (
          <SessionEmpty
            message={"Aucun patient pour le moment.Veillez ajouter un patient."}
            iconName={"UserLock"}
          />
        )}
        ItemSeparatorComponent={() => <Box className={"h-v-3"} />}
        showsVerticalScrollIndicator={false}
      />

      {!hideFab && selectedItem.length === 0 && (
        <Fab
          placement="bottom right"
          className="-mr-2 mb-4 h-11 w-11 bg-primary-c_light"
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

// onLoading ? (
//           new Array(10)
//             .fill(0)
//             .map((_, index) => <PatientCardSkeleton key={index} />)
//         )
