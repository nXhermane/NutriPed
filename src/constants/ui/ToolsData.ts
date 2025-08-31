export const TOOLS_DATA = [
  {
    name: "Diagnostic",
    desc: "Evalutation nutritionnelle",
    iconName: "Weight",
    code: "diagnostic_tools",
    isQuickAccess: true,
  },
  {
    name: "Courbes",
    desc: "Suivi de croissance",
    iconName: "ChartLine",
    code: "chart_tools",
    isQuickAccess: true,
  },
  {
    name: "Appetite Tests",
    desc: "Test D'appetits",
    iconName: "Milk",
    code: "appetite_test_tools",
    isQuickAccess: false,
  },
  {
    name: "Calculs",
    desc: "Dosage et nutrition",
    iconName: "Calculator",
    code: "calculs_tools",
    isQuickAccess: true,
  },
  {
    name: "Protocoles",
    desc: "Guide de traitement",
    iconName: "BookPlus",
    code: "protocols_tools",
    isQuickAccess: false,
  },
  {
    name: "Tables",
    desc: "Tables de croissance",
    iconName: "Table2",
    code: "tables_tools",
    isQuickAccess: false,
  },
  {
    name: "Collecte Rappide",
    desc: "Collecte rapide de données",
    iconName: "ClipboardPlus",
    code: "fast_data_collection_tool",
    isQuickAccess: false,
  }
] as const;
