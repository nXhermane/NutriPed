import { FormField } from "@/components/custom/FormField";
import { Button, ButtonText } from "@/components/ui/button";
import {
  Modal,
  ModalBackdrop,
  ModalBody,
  ModalContent,
  ModalFooter,
} from "@/components/ui/modal";
import React, { useState } from "react";

export interface AnthropometricCalculatorSavingLabelModalProps {
  isOpen?: boolean;
  onClose?: (value: { label: string } | null) => void;
}

export const AnthropometricCalculatorSavingLabelModal: React.FC<AnthropometricCalculatorSavingLabelModalProps> =
  React.memo(({ isOpen, onClose }) => {
    const [label, setLabel] = useState<string>("");
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
                label:
                  "Entrer le nom sous lequel vous voulez enregister le resultat.",
                name: "label",
                helperText:
                  "!! Le nom sous lequel est enregisté un resultat n'est pas modifiable après sa définition",
              }}
              value={label}
              onChange={(fieldName: string, value: string) => {
                setError(undefined);
                setLabel(value);
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
                if (label.trim() === "") {
                  setError(
                    "Le nom d'enregistrement du resultat ne peut être vide."
                  );
                  return;
                }
                onClose && onClose({ label });
                setLabel("");
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
  });
