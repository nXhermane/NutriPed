import {
  AnthroSystemCodes,
  GrowthRefChartAndTableCodes,
} from "@/core/constants";

export const TABLE_UI_DATA = {
  [GrowthRefChartAndTableCodes.WFH_UNISEX_NCHS_TABLE]: {
    indicator: {
      tag: AnthroSystemCodes.WFH_UNISEX_NCHS,
      label: "Poids pour taille",
      icon: "Users",
      color: "bg-orange-100 text-orange-800",
      borderColor: "border-orange-200",
    },
    tableStruct: {
      colNumberAfterValue: 4,
      colUiData: [
        {
          title: "100%",
          desc: "Médian",
          key: "median",
          color: "red",
          hightLightColor: "black",
        },
        {
          title: "85%",
          desc: "P. Cible",
          key: "outComeTargetValueNeg",
          color: "yellow",
          hightLightColor: "black",
        },
        {
          title: "80%",
          desc: "Modéré",
          key: "moderateNeg",
          color: "red",
          hightLightColor: "black",
        },
        {
          title: "70%",
          desc: "Sévère",
          key: "severeNeg",
          color: "red",
          hightLightColor: "black",
        },
      ],
    },
  },
  [GrowthRefChartAndTableCodes.WFLH_UNISEX_OMS_TABLE]: {
    indicator: {
      tag: AnthroSystemCodes.WFLH_UNISEX,
      label: "Poids pour taille",
      icon: "Users",
      color: "bg-orange-100 text-orange-800",
      borderColor: "border-orange-200",
    },
    tableStruct: {
      colNumberAfterValue: 6,
      colUiData: [
        {
          title: "0",
          desc: "Médian",
          key: "median",
          color: "#4caf501a",
          hightLightColor: "black",
        },
        {
          title: "-1",
          desc: "Normale",
          key: "normalNeg",
          color: "#80cc821a",
          hightLightColor: "black",
        },
        {
          title: "-1.5",
          desc: "P. Cible",
          key: "outComeTargetValueNeg",
          color: "#9ad69c2a",
          hightLightColor: "black",
        },
        {
          title: "-2",
          desc: "Modéré",
          key: "moderateNeg",
          color: "red",
          hightLightColor: "black",
        },
        {
          title: "-3",
          desc: "Sévère",
          key: "severeNeg",
          color: "red",
          hightLightColor: "black",
        },
        {
          title: "-4",
          desc: "T. Sévère",
          key: "hightSeverNeg",
          color: "red",
          hightLightColor: "black",
        },
      ],
    },
    tableUiHeaderLabel: {
      median: "0",
      normalNeg: "-1",
      outComeTargetValueNeg: "-1.5",
      moderateNeg: "-2",
      severeNeg: "-3",
      hightSeverNeg: "-4",
    },
  },
} as const;
