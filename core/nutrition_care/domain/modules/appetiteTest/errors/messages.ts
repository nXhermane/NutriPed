export const APPETITE_TEST_ERRORS = {
   ENTITY: {
      VALIDATION: {
         NAME_EMPTY: {
            path: "ENTITY.VALIDATION.NAME.EMPTY",
            code: "AT001",
            message: "Appetite test reference name can't be empty.Please change the name and retry.",
         },
      },
   },
   SERVICE: {
      APPETITE_TEST_REF_NOT_FOUND: {
         path: "SERVICE.APPETITE_TEST_REF_NOT_FOUND",
         code: "AT002",
         message: "Appetite test reference not found. Without this is not possible to make appetite test.",
      },
      APPETITE_TEST_RANGE_NOT_FOUND_FOR_THE_GIVEN_WEIGHT: {
         path: "SERVICE.APPETITE_TEST_RANGE_NOT_FOUND_FOR_THE_GIVEN_WEIGHT",
         code: "AT003",
         message: "Appetite test range not found for the given patient weight.",
      },
   },
};
