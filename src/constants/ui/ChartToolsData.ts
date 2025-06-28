import {
  AnthroSystemCodes,
  DAY_IN_MONTHS,
  DAY_IN_YEARS,
  GrowthRefChartAndTableCodes,
} from "@/core/constants";
import { ValueOf } from "@/utils";
const AgeInDay0 = 0
const AgeInDay6m = 6 * DAY_IN_MONTHS
const AgeInDay3m = 3 * DAY_IN_MONTHS
const AgeInDay1y = 1 * DAY_IN_YEARS
const AgeInDay2y = 2 * DAY_IN_YEARS
const AgeInDay5y = 5 * DAY_IN_YEARS
const AgeInDay7_5y = (7 * DAY_IN_YEARS) - (DAY_IN_YEARS / 2)
const AgeInDay10y = 10 * DAY_IN_YEARS
const AgeInDay15y = 15 * DAY_IN_YEARS
const AgeInDay19y = 19 * DAY_IN_YEARS
const generateXAxisValue = (ageInDay: number) => {
  return {
    ageInDay: ageInDay,
    ageInMonth: ageInDay / DAY_IN_MONTHS,
    ageInYear: ageInDay / DAY_IN_YEARS
  }
}
const DisplayRange_0_6m = {
  label: '0 - 6 mois',
  range: [
    generateXAxisValue(AgeInDay0),
    generateXAxisValue(AgeInDay6m)
  ]
} as const

const DisplayRange_0_2y = {
  label: "0 - 2 ans", range: [
    generateXAxisValue(AgeInDay0),
    generateXAxisValue(AgeInDay2y)
  ]
} as const
const DisplayRange_3m_2y = {
  label: '3 mois - 2 ans',
  range: [generateXAxisValue(AgeInDay3m), generateXAxisValue(AgeInDay2y)]
} as const
const DisplayRange_6m_2y = {
  label: "6 mois - 2 ans", range: [
    generateXAxisValue(AgeInDay6m),
    generateXAxisValue(AgeInDay2y)
  ]
} as const
const DisplayRange_2y_5y = {
  label: "2 - 5 ans",
  range: [generateXAxisValue(AgeInDay2y), generateXAxisValue(AgeInDay5y)]
} as const
const DisplayRange_5y_7_5y = {
  label: '5 - 7,5 ans',
  range: [generateXAxisValue(AgeInDay5y), generateXAxisValue(AgeInDay7_5y)]
} as const
const DisplayRange_7_5y_10y = {
  label: '7,5 - 10 ans',
  range: [generateXAxisValue(AgeInDay7_5y), generateXAxisValue(AgeInDay10y)]
} as const
const DisplayRange_5y_10y = {
  label: '5 - 10 ans',
  range: [generateXAxisValue(AgeInDay5y), generateXAxisValue(AgeInDay10y)]
} as const

const DisplayRange_10y_19y = {
  label: '10 - 19 ans',
  range: [generateXAxisValue(AgeInDay10y), generateXAxisValue(AgeInDay19y)]
} as const
const DisplayRange_5y_15y = {
  label: '5 - 15 ans',
  range: [generateXAxisValue(AgeInDay5y), generateXAxisValue(AgeInDay15y)]
} as const

const Age_0_5yUIData = {
  label: "0-5 ans",
  by: "age",
  defaultDisplayMode: "months",
  availableDisplayMode: ["years", "months"],
  availableDisplayRange: [DisplayRange_0_6m, DisplayRange_0_2y, DisplayRange_2y_5y]
} as const;
const Age_5_10yUIData = {
  label: "5-10 ans",
  by: "age",
  defaultDisplayMode: "years",
  availableDisplayMode: ["years"],
  availableDisplayRange: [DisplayRange_5y_7_5y, DisplayRange_7_5y_10y]
} as const;
const Age_5_19yUIData = {
  by: "age",
  label: "5-19 ans",
  defaultDisplayMode: "years",
  availableDisplayMode: ["years"],
  availableDisplayRange: [DisplayRange_5y_10y, DisplayRange_10y_19y, DisplayRange_5y_15y]
} as const;
const Age_3m_5yUIData = {
  by: "age",
  label: "3 mois - 5 ans",
  defaultDisplayMode: "months",
  availableDisplayMode: ["years", "months"],
  availableDisplayRange: [DisplayRange_3m_2y, DisplayRange_2y_5y]
} as const;
const Height_65_120cmUIData = {
  by: "height",
  label: "65-120 cm",
  defaultDisplayMode: "height",
  availableDisplayMode: ["height"],
  availableDisplayRange: []
} as const;
const Length_45_110cmUIData = {
  by: "length",
  label: "45-110 cm",
  defaultDisplayMode: "length",
  availableDisplayMode: ["length"],
  availableDisplayRange: []
} as const;


export const LengthHeightMode = ["height", "length"] as const
export type ChartUiDataType = ValueOf<typeof CHART_UI_DATA>;

export type IndicatorUIType = ValueOf<typeof GROWTH_INDICATORS>;

type AllDisplayModes<T> = T extends {
  availableDisplayMode: readonly (infer U)[];
}
  ? U
  : never;
export type DisplayMode = AllDisplayModes<ChartUiDataType>;
export const AxisLabel = {
  weight: "kg",
  length: "cm",
  height: "cm",
  lenhei: "cm",
  age_month: "m",
  age_day: "d",
  age_years: "y",
  muac: "cm",
  hc: "cm",
  ssf: "mm",
  tsf: "mm",
  bmi: `kg/m${String.fromCharCode(178)}`,
};

export const CHART_UI_DATA = {
  [GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.bmi,
  },
  [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.bmi,
  },
  [GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.hc,
  },
  [GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.hc,
  },
  [GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.lenhei,
  },
  [GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.lenhei,
  },
  [GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART]: {
    ...Age_0_5yUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART]: {
    ...Age_5_10yUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART]: {
    ...Age_5_10yUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART]: {
    ...Age_5_19yUIData,
    yAxisLabel: AxisLabel.bmi,
  },
  [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART]: {
    ...Age_5_19yUIData,
    yAxisLabel: AxisLabel.bmi,
  },
  [GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART]: {
    ...Age_5_19yUIData,
    yAxisLabel: AxisLabel.height,
  },
  [GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART]: {
    ...Age_5_19yUIData,
    yAxisLabel: AxisLabel.height,
  },
  [GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.muac,
  },
  [GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.muac,
  },
  [GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.ssf,
  },
  [GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.ssf,
  },
  [GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.tsf,
  },
  [GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART]: {
    ...Age_3m_5yUIData,
    yAxisLabel: AxisLabel.tsf,
  },
  [GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART]: {
    ...Height_65_120cmUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART]: {
    ...Height_65_120cmUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART]: {
    ...Length_45_110cmUIData,
    yAxisLabel: AxisLabel.weight,
  },
  [GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART]: {
    ...Length_45_110cmUIData,
    yAxisLabel: AxisLabel.weight,
  },
} as const;

export const GROWTH_INDICATORS = {
  [AnthroSystemCodes.WFA]: {
    tag: AnthroSystemCodes.WFA,
    label: "Poids pour l'âge",
    icon: "TrendingUp",
    color: "bg-blue-100 text-blue-800",
    borderColor: "border-blue-200",
    charts: {
      [GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART],
      [GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART],
      [GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART],
      [GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART],
    },

    tableCodes: [],
  },
  [AnthroSystemCodes.HFA]: {
    tag: AnthroSystemCodes.HFA,
    label: "Taille pour l'âge",
    icon: "Ruler",
    color: "bg-green-100 text-green-800",
    borderColor: "border-green-200",
    charts: {
      [GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART],
      [GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART],
      [GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART],
      [GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART],
    },
    tableCodes: [],
  },
  [AnthroSystemCodes.BMI_FOR_AGE]: {
    tag: AnthroSystemCodes.BMI_FOR_AGE,
    label: "IMC pour l'âge",
    icon: "Activity",
    color: "bg-purple-100 text-purple-800",
    borderColor: "border-purple-200",
    charts: {
      [GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART],
      [GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART],
      [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART],
      [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART],
    },
    tableCodes: [],
  },
  [AnthroSystemCodes.WFLH]: {
    tag: AnthroSystemCodes.WFLH,
    label: "Poids pour la taille",
    icon: "Users",
    color: "bg-orange-100 text-orange-800",
    borderColor: "border-orange-200",
    charts: {
      [GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART],
      [GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART],
      [GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART],
      [GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART],
    },
    tableCodes: [
      GrowthRefChartAndTableCodes.WFH_UNISEX_NCHS_TABLE,
      GrowthRefChartAndTableCodes.WFLH_UNISEX_OMS_TABLE,
    ],
  },
  [AnthroSystemCodes.HC_FOR_AGE]: {
    tag: AnthroSystemCodes.HC_FOR_AGE,
    label: "Périmètre crânien",
    icon: "Brain",
    color: "bg-pink-100 text-pink-800",
    borderColor: "border-pink-200",
    charts: {
      [GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART],
      [GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART],
    },
    tableCodes: [],
  },
  [AnthroSystemCodes.MUAC_FOR_AGE]: {
    tag: AnthroSystemCodes.MUAC_FOR_AGE,
    label: "Périmètre brachial",
    icon: "Zap",
    color: "bg-yellow-100 text-yellow-800",
    borderColor: "border-yellow-200",
    charts: {
      [GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART],
      [GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART],
    },
    tableCodes: [],
  },
  [AnthroSystemCodes.SSF_FOR_AGE]: {
    tag: AnthroSystemCodes.SSF_FOR_AGE,
    label: "Pli cutané sous-scapulaire",
    icon: "Baby",
    color: "bg-indigo-100 text-indigo-800",
    borderColor: "border-indigo-200",
    charts: {
      [GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART],
      [GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART],
    },
    tableCodes: [],
  },
  [AnthroSystemCodes.TSF_FOR_AGE]: {
    tag: AnthroSystemCodes.TSF_FOR_AGE,
    label: "Pli cutané tricipital",
    icon: "Baby",
    color: "bg-indigo-100 text-indigo-800",
    borderColor: "border-indigo-200",
    charts: {
      [GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART],
      [GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART]:
        CHART_UI_DATA[GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART],
    },
    tableCodes: [],
  },
} as const;
