import { FormField } from "@/components/custom/FormField";
import { Button, ButtonText } from "@/components/ui/button";
import { ModalBackdrop, ModalContent, ModalBody, ModalFooter, Modal } from "@/components/ui/modal";
import React, { useState } from "react";
import {  } from "react-native";

export interface SeriesLabelInputModalProps {
  isOpen?: boolean;
  onClose?: (value: { serieLabel: string } | null) => void;
}
export const SeriesLabelInputModal: React.FC<SeriesLabelInputModalProps> = React.memo(
  ({ isOpen, onClose }) => {
    const [serieLabel, setSerieLabel] = useState<string>("");
    const [error, setError] = useState<string | undefined>(undefined);
    return (
      <Modal
        isOpen={isOpen}
        onClose={() => onClose && onClose(null)}
        useRNModal
      >
        <ModalBackdrop />
        <ModalContent className="w-[90%] rounded-xl border-0 border-primary-border/5 bg-background-primary px-3">
          <ModalBody>
            <FormField
              field={{
                type: "text",
                default: "",
                label: "Entrer le nom de la serie de mesures",
                name: "serieLabel",
                helperText: "!! Le nom de la serie de mesures n'est pas modifiable après sa definition."
              }}
              value={serieLabel}
              onChange={(fieldName: string, value: string) => {
                setError(undefined);
                setSerieLabel(value);
              }}
              error={error}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              onPress={() => onClose && onClose(null)}
              variant="outline"
              className="rounded-xl border-[1px] border-primary-border/5 bg-background-secondary"
            >
              <ButtonText className="font-h4 text-sm font-medium text-typography-primary_light">
                Annuler
              </ButtonText>
            </Button>
            <Button
              onPress={() => {
                if (serieLabel.trim() === "") {
                  setError("Le nom de la serie ne peut être vide.");
                  return;
                }
                onClose && onClose({ serieLabel });
                setSerieLabel("");
              }}
              className={`rounded-xl border-[1px] border-primary-border/5 ${error ? "bg-red-500" : "bg-primary-c_light"}`}
            >
              <ButtonText className="font-h4 text-sm font-medium text-typography-primary">
                Enregistrer
              </ButtonText>
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  }
);