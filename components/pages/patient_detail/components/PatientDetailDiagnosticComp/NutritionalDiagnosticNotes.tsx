import React from "react";
import { PatientDetailMedicalRecordSession } from "../PatientDetailMedicalRecord";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { SessionEmpty } from "@/components/pages/home/shared/SessionEmpty";

export interface NutritionalDiagnosticNotesProps {
  notes: { date: string; content: string }[];
}

export const NutritionalDiagnosticNotes: React.FC<
  NutritionalDiagnosticNotesProps
> = ({ notes }) => {
  return (
    <PatientDetailMedicalRecordSession title="Notes du nutritionniste">
      <VStack className="h-fit gap-v-2 px-4">
        {notes.length == 0 ? (
          <>
            <SessionEmpty message="Aucune notes enregistées pour le moment" />
          </>
        ) : (
          notes
            .sort(
              (a, b) =>
                new Date(Number(b.date)).getTime() -
                new Date(Number(a.date)).getTime()
            )
            .map((note, index) => (
              <VStack
                key={note.date + index}
                className="rounded-xl border-l-2 border-l-primary-c_light bg-background-secondary px-3 py-v-3"
              >
                <Text className="font-body text-xs font-normal text-typography-primary_light">
                  {"Note - " + new Date(Number(note.date)).toLocaleString()}
                </Text>
                <Text className="font-body text-sm font-normal text-typography-primary">
                  {note.content}
                </Text>
              </VStack>
            ))
        )}
      </VStack>
    </PatientDetailMedicalRecordSession>
  );
};
