import {
  APPETITE_TEST_PRODUCT_TYPE,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
} from "@/core/nutrition_care";

export const APPETITE_TEST_PRODUCT = [
  {
    type: APPETITE_TEST_PRODUCT_TYPE.IN_POT,
    uiName: "Pot (quantité en grammes)",
    amountUiText: "Quantité consommée (g)",
  },
  {
    type: APPETITE_TEST_PRODUCT_TYPE.IN_SACHET,
    uiName: "Sachet (fraction consommée)",
    amountUiText: "Fraction de sachet consommée",
  },
];

export const APPETITE_TEST_PRODUCT_TAKEN_FRACTION = [
  {
    value: APPETITE_TEST_SACHET_FRACTION_PARTITION.ONE,
    label: "Complète (100%)",
  },
  {
    value: APPETITE_TEST_SACHET_FRACTION_PARTITION.ONE_HALF,
    label: "Moitié (50%)",
  },
  {
    value: APPETITE_TEST_SACHET_FRACTION_PARTITION.ONE_FOURTH,
    label: "Inferieur ou égale au quart (25%)",
  },
  {
    value: APPETITE_TEST_SACHET_FRACTION_PARTITION.THREE_FOURTH,
    label: "Trois-quarts (33%)",
  },
];
