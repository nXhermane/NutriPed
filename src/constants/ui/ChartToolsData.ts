import { AnthroSystemCodes, GrowthRefChartAndTableCodes } from "@/core/constants";

export const GROWTH_INDICATORS = {
    [AnthroSystemCodes.WFA]: {
        label: "Poids pour l'âge",
        icon: "TrendingUp",
        color: 'bg-blue-100 text-blue-800',
        borderColor: 'border-blue-200',
        chartCodes: [GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART, GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART, GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART, GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.HFA]: {
        label: "Taille pour l'âge",
        icon: "Ruler",
        color: "bg-green-100 text-green-800",
        borderColor: "border-green-200",
        chartCodes: [GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART, GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART, GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART, GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.BMI_FOR_AGE]: {
        label: "IMC pour l'âge",
        icon: "Activity",
        color: 'bg-purple-100 text-purple-800',
        borderColor: 'border-purple-200',
        chartCodes: [GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART, GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART, GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART, GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.WFLH]: {
        label: "Poids pour la taille",
        icon: "Users",
        color: "bg-orange-100 text-orange-800",
        borderColor: "border-orange-200",
        chartCodes: [GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART, GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART, GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART, GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART],
        tableCodes: [GrowthRefChartAndTableCodes.WFH_UNISEX_NCHS_TABLE, GrowthRefChartAndTableCodes.WFLH_UNISEX_OMS_TABLE]
    },
    [AnthroSystemCodes.HC_FOR_AGE]: {
        label: "Périmètre crânien",
        icon: "Brain",
        color: "bg-pink-100 text-pink-800",
        borderColor: "border-pink-200",
        chartCodes: [GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART, GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.MUAC_FOR_AGE]: {
        label: "Périmètre brachial",
        icon: "Zap",
        color: "bg-yellow-100 text-yellow-800",
        borderColor: "border-yellow-200",
        chartCodes: [GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART, GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.SSF_FOR_AGE]: {
        label: "Pli cutané sous-scapulaire",
        icon: "Baby",
        color: "bg-indigo-100 text-indigo-800",
        borderColor: "border-indigo-200",
        chartCodes: [GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART, GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART],
        tableCodes: []
    },
    [AnthroSystemCodes.TSF_FOR_AGE]: {
        label: "Pli cutané tricipital",
        icon: 'Baby',
        color: "bg-indigo-100 text-indigo-800",
        borderColor: 'border-indigo-200',
        chartCodes: [GrowthRefChartAndTableCodes.TSF_BOYS_3M_5Y_CHART, GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART],
        tableCodes: []
    }
}
export const CHART_ORDORED = [
    {
        label: "0-5 ans",
        charts: [
            GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART,
            GrowthRefChartAndTableCodes.BMIAGE_BOYS_0_5_CHART,
            GrowthRefChartAndTableCodes.BMIAGE_GIRLS_0_5_CHART,
            GrowthRefChartAndTableCodes.HCFA_BOYS_0_5_CHART,
            GrowthRefChartAndTableCodes.HCFA_GIRLS_0_5_CHART,
            GrowthRefChartAndTableCodes.HFA_BOYS_0_5_CHART,
            GrowthRefChartAndTableCodes.HFA_GIRLS_0_5_CHART,
            GrowthRefChartAndTableCodes.WFA_BOYS_0_5_CHART,
            GrowthRefChartAndTableCodes.WFA_GIRLS_0_5_CHART,
        ],
        by: "age"
    },
    {
        label: "5-10 ans",
        charts: [
            GrowthRefChartAndTableCodes.WFA_BOYS_5_10_CHART,
            GrowthRefChartAndTableCodes.WFA_GIRLS_5_10_CHART,
        ],
        by: "age"
    },
    {
        label: "5-19 ans",
        charts: [
            GrowthRefChartAndTableCodes.BMIAGE_BOYS_5_19_CHART,
            GrowthRefChartAndTableCodes.BMIAGE_GIRLS_5_19_CHART,
            GrowthRefChartAndTableCodes.HFA_BOYS_5_19_CHART,
            GrowthRefChartAndTableCodes.HFA_GIRLS_5_19_CHART,
        ],
        by: "age"
    },
    {
        label: "3 mois - 5 ans",
        charts: [
            GrowthRefChartAndTableCodes.MUAC_BOYS_3M_5Y_CHART,
            GrowthRefChartAndTableCodes.MUAC_GIRLS_3M_5Y_CHART,
            GrowthRefChartAndTableCodes.SSF_BOYS_3M_5Y_CHART,
            GrowthRefChartAndTableCodes.SSF_GIRLS_3M_5Y_CHART,
            GrowthRefChartAndTableCodes.TSF_GIRLS_3M_5Y_CHART,
        ],
        by: "age"
    },
    {
        label: "65-120 cm",
        charts: [
            GrowthRefChartAndTableCodes.WFH_BOYS_65_120_CHART,
            GrowthRefChartAndTableCodes.WFH_GIRLS_65_120_CHART
        ],
        by: "height"
    },
    {
        label: "45-110 cm",
        charts: [
            GrowthRefChartAndTableCodes.WFL_BOYS_45_110_CHART,
            GrowthRefChartAndTableCodes.WFL_GIRLS_45_110_CHART
        ],
        by: "length"
    }
]

