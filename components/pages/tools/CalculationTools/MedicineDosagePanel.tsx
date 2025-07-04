import React, { useState } from "react";
import { MedicineList } from "./MedicineList";
import { MedicineDetailBottomSheet } from "./MedicineDetailBottomSheet";
import { MedicineDto } from "@/core/nutrition_care";

export const MedicineDosagePanel = () => {
  const [selectedMedicine, setSelectedMedicine] = useState<MedicineDto | null>(
    null
  );
  return (
    <React.Fragment>
      <MedicineList
        onMedicineChoosed={medicine => {
          setSelectedMedicine(medicine);
        }}
      />
      {selectedMedicine && (
        <MedicineDetailBottomSheet
          isOpen={selectedMedicine != null}
          medicineDto={selectedMedicine}
        />
      )}
    </React.Fragment>
  );
};
