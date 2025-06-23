import {
    AnthroSystemCodes,
    GrowthRefChartAndTableCodes,
} from "@/core/constants";
const Age_0_5yUIData = {
    label: "0-5 ans",
    by: "age",
} as const;
const Age_5_10yUIData = {
    label: "5-10 ans",
    by: "age",
} as const;
const Age_5_19yUIData = {
    by: "age",
    label: "5-19 ans",
} as const;
const Age_3m_5yUIData = {
    by: "age",
    label: "3 mois - 5 ans",
} as const;
const Height_65_120cmUIData = {
    by: "height",
    label: "65-120 cm",
} as const;
const Length_45_110cmUIData = {
    by: "length",
    label: "45-110 cm",
} as const;
export const CHART_UI_DATA = {
    [GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART]: Age_0_5yUIData,
    [GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART]: Age_5_10yUIData,
    [GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART]: Age_5_10yUIData,
    [GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART]: Age_5_19yUIData,
    [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART]: Age_5_19yUIData,
    [GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART]: Age_5_19yUIData,
    [GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART]: Age_5_19yUIData,
    [GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART]: Age_3m_5yUIData,
    [GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART]: Height_65_120cmUIData,
    [GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART]: Height_65_120cmUIData,
    [GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART]: Length_45_110cmUIData,
    [GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART]: Length_45_110cmUIData,
} as const;

export const GROWTH_INDICATORS = {
    [AnthroSystemCodes.WFA]: {
        tag: AnthroSystemCodes.WFA,
        label: "Poids pour l'âge",
        icon: "TrendingUp",
        color: "bg-blue-100 text-blue-800",
        borderColor: "border-blue-200",
        charts: {
            [GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART],
            [GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART],
            [GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART],
            [GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART],
        }

        ,
        tableCodes: [],
    },
    [AnthroSystemCodes.HFA]: {
        tag: AnthroSystemCodes.HFA,
        label: "Taille pour l'âge",
        icon: "Ruler",
        color: "bg-green-100 text-green-800",
        borderColor: "border-green-200",
        charts: {
            [GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART],
            [GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART],
            [GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART],
            [GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART],
        }
        ,
        tableCodes: [],
    },
    [AnthroSystemCodes.BMI_FOR_AGE]: {
        tag: AnthroSystemCodes.BMI_FOR_AGE,
        label: "IMC pour l'âge",
        icon: "Activity",
        color: "bg-purple-100 text-purple-800",
        borderColor: "border-purple-200",
        charts: {
            [GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART],
            [GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART],
            [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART],
            [GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART],
        }
        ,
        tableCodes: [],
    },
    [AnthroSystemCodes.WFLH]: {
        tag:AnthroSystemCodes.WFLH,
        label: "Poids pour la taille",
        icon: "Users",
        color: "bg-orange-100 text-orange-800",
        borderColor: "border-orange-200",
        charts: {
            [GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART],
            [GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART],
            [GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART],
            [GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART],
        }
        ,
        tableCodes: [
            GrowthRefChartAndTableCodes.WFH_UNISEX_NCHS_TABLE,
            GrowthRefChartAndTableCodes.WFLH_UNISEX_OMS_TABLE,
        ],
    },
    [AnthroSystemCodes.HC_FOR_AGE]: {
        tag:AnthroSystemCodes.HC_FOR_AGE,
        label: "Périmètre crânien",
        icon: "Brain",
        color: "bg-pink-100 text-pink-800",
        borderColor: "border-pink-200",
        charts:
        {
            [GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART],
            [GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART],
        }
        ,
        tableCodes: [],
    },
    [AnthroSystemCodes.MUAC_FOR_AGE]: {
        tag:AnthroSystemCodes.MUAC_FOR_AGE,
        label: "Périmètre brachial",
        icon: "Zap",
        color: "bg-yellow-100 text-yellow-800",
        borderColor: "border-yellow-200",
        charts: {
            [GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART],
            [GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART],
        }
        ,
        tableCodes: [],
    },
    [AnthroSystemCodes.SSF_FOR_AGE]: {
        tag:AnthroSystemCodes.SSF_FOR_AGE,
        label: "Pli cutané sous-scapulaire",
        icon: "Baby",
        color: "bg-indigo-100 text-indigo-800",
        borderColor: "border-indigo-200",
        charts: {
            [GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART],
            [GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART],
        },
        tableCodes: [],
    },
    [AnthroSystemCodes.TSF_FOR_AGE]: {
        tag:AnthroSystemCodes.TSF_FOR_AGE,
        label: "Pli cutané tricipital",
        icon: "Baby",
        color: "bg-indigo-100 text-indigo-800",
        borderColor: "border-indigo-200",
        charts: {
            [GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART],
            [GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART]: CHART_UI_DATA[GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART],
        },
        tableCodes: [],
    },
} as const 