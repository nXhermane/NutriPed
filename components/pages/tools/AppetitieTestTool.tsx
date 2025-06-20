import { FormField } from "@/components/custom/FormField";
import { Box } from "@/components/ui/box";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { Divider } from "@/components/ui/divider";
import { Grid, GridItem } from "@/components/ui/grid";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Input, InputField } from "@/components/ui/input";
import { IPressableProps, Pressable } from "@/components/ui/pressable";
import {
  Radio,
  RadioGroup,
  RadioIcon,
  RadioIndicator,
  RadioLabel,
} from "@/components/ui/radio";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectScrollView,
  SelectTrigger,
} from "@/components/ui/select";
import { Text } from "@/components/ui/text";
import { VStack } from "@/components/ui/vstack";
import { APPETITE_TEST_PRODUCT_TYPE } from "@/core/constants";
import {
  APPETITE_TEST_RESULT_CODES,
  APPETITE_TEST_SACHET_FRACTION_PARTITION,
  AppetiteTestResultDto,
  EvaluateAppetiteRequest,
} from "@/core/nutrition_care";
import {
  TakenAmountOfPot,
  TakenAmountInSachet,
} from "@/core/nutrition_care/domain/modules/appetiteTest/models/valueObjects/AppetiteTestData";
import {
  APPETITE_TEST_PRODUCT,
  APPETITE_TEST_PRODUCT_TAKEN_FRACTION,
} from "@/src/constants/ui";
import { useToast } from "@/src/context";
import { useAppetiteTest } from "@/src/hooks";
import { ChevronDownIcon, Circle, X } from "lucide-react-native";
import React, { ReactNode, useEffect, useState } from "react";
import { ScrollView } from "react-native";

export interface AppetiteTestToolProps {}

export const AppetiteTestTool: React.FC<AppetiteTestToolProps> = () => {
  const [appetiteTestData, setAppetiteTestData] =
    useState<EvaluateAppetiteRequest>({
      givenProductType: APPETITE_TEST_PRODUCT_TYPE.IN_POT,
      patientWeight: 0,
      takenAmount: {
        takenFraction: APPETITE_TEST_SACHET_FRACTION_PARTITION.ONE_THIRD,
      },
    });
  const toast = useToast();
  const { error, onSubmit, submit, result } = useAppetiteTest();
  useEffect(() => {
    if (error)
      toast.show(
        "Error",
        "Erreur lors du test",
        "Veillez verifier les données entrées et reessayer"
      );
  }, [error]);
  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      <VStack className="gap-4 px-4 pb-8">
        <AppetiteTestToolHeader />
        <AppetiteTestProductSession
          value={appetiteTestData.givenProductType}
          onChange={(type: APPETITE_TEST_PRODUCT_TYPE) => {
            setAppetiteTestData(prev => ({ ...prev, givenProductType: type }));
          }}
          onAmountChange={amount => {
            setAppetiteTestData(prev => ({ ...prev, takenAmount: amount }));
          }}
          amount={appetiteTestData.takenAmount}
        />
        <AppetiteTextAnthroDataSession
          value={{ weight: appetiteTestData.patientWeight }}
          onChange={data =>
            setAppetiteTestData(prev => ({
              ...prev,
              patientWeight: data.weight,
            }))
          }
        />
        <Button
          className={`h-v-10 rounded-xl bg-primary-c_light ${error && "bg-red-500"}`}
          onPress={async () => submit(appetiteTestData)}
        >
          {onSubmit && <ButtonSpinner />}
          {error && <Icon as={X} />}
          <ButtonText className={"font-h4 font-medium text-typography-primary"}>
            Caluler le résultat du test
          </ButtonText>
        </Button>
        {result && <AppetiteTestResultComponent result={result} />}
      </VStack>
    </ScrollView>
  );
};

const AppetiteTestToolHeader = () => {
  return (
    <HStack className="px-4 py-2">
      <Heading
        className={"font-h2 text-xl font-semibold text-typography-primary"}
      >
        Test D'appetis
      </Heading>
    </HStack>
  );
};
interface AppetiteTestSessionProps {
  title?: string;
  children?: ReactNode;
  className?: string;
}
const AppetiteTestSession: React.FC<AppetiteTestSessionProps> = ({
  children,
  title,
  className,
}) => {
  return (
    <VStack
      className={
        "h-fit w-[100%] rounded-2xl border-primary-border/10 bg-background-primary px-3 py-4"
      }
    >
      <HStack>
        {title && (
          <Text className={"font-h4 text-base text-typography-primary"}>
            {title}
          </Text>
        )}
      </HStack>
      <Box className={className}>{children}</Box>
    </VStack>
  );
};

export interface AppetiteTestProductProps {
  onChange: (productType: APPETITE_TEST_PRODUCT_TYPE) => void;
  value: APPETITE_TEST_PRODUCT_TYPE;
  onAmountChange: (amount: TakenAmountOfPot | TakenAmountInSachet) => void;
  amount: TakenAmountOfPot | TakenAmountInSachet;
}
export const AppetiteTestProductSession: React.FC<AppetiteTestProductProps> = ({
  value,
  onChange,
  onAmountChange,
  amount,
}) => {
  const [currentProduct, setCurrentProduct] = useState<
    (typeof APPETITE_TEST_PRODUCT)[number] | null
  >(null);

  useEffect(() => {
    const product = APPETITE_TEST_PRODUCT.find(
      product => product.type === value
    );
    setCurrentProduct(product as (typeof APPETITE_TEST_PRODUCT)[number]);
  }, [value]);
  return (
    <AppetiteTestSession title="Type de produit donné" className="pt-2">
      <RadioGroup
        value={value}
        onChange={type => {
          onChange(type);
        }}
      >
        {APPETITE_TEST_PRODUCT.map(item => (
          <Radio
            key={item.type}
            value={item.type}
            className={`mt-2 rounded-2xl p-3 ${value === item.type ? "border-primary-c_light/50 bg-primary-c_light/20" : "border-primary-border/20 bg-background-secondary"}`}
          >
            <RadioIndicator
              className={`h-4 w-4 ${value === item.type && "border-primary-border/50"}`}
            >
              <RadioIcon
                as={Circle}
                className={"bg-primary-c_light text-primary-c_light"}
              />
            </RadioIndicator>
            <RadioLabel className="font-h4 text-sm text-typography-primary">
              {item.uiName}
            </RadioLabel>
          </Radio>
        ))}
      </RadioGroup>
      {currentProduct && (
        <VStack
          className={
            "mt-4 rounded-2xl border-l-4 border-primary-c_light bg-background-secondary px-3 py-3"
          }
        >
          <Text className={"mb-3 font-h4 text-base text-typography-primary"}>
            {currentProduct.amountUiText}
          </Text>
          {currentProduct.type === APPETITE_TEST_PRODUCT_TYPE.IN_POT && (
            <Input className="h-v-9 rounded-xl border-0 bg-background-primary data-[focus=true]:border-primary-c_light">
              <InputField
                className="align-center font-body leading-10"
                placeholderClassName="text-sm font-light text-typography-primray_light "
                placeholder="Ex: 120"
                keyboardType="numeric"
                onChangeText={val => {
                  const quantity = Number(val);
                  if (isNaN(quantity)) return;
                  if (quantity < 0) return;
                  onAmountChange({ takenQuantity: quantity });
                }}
                value={String((amount as TakenAmountOfPot).takenQuantity || 0)}
              />
            </Input>
          )}
          {currentProduct.type === APPETITE_TEST_PRODUCT_TYPE.IN_SACHET && (
            <Select
              selectedValue={(amount as TakenAmountInSachet).takenFraction}
              onValueChange={arg => {
                onAmountChange({ takenFraction: arg } as TakenAmountInSachet);
              }}
            >
              <SelectTrigger className="h-v-10 justify-between rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c">
                <SelectInput
                  className="font-body text-base font-normal text-typography-primary/80"
                  placeholderClassName={
                    "text-base font-body text-typography-primary_light"
                  }
                  placeholder={"Sélectionner une fraction"}
                />
                <SelectIcon
                  as={ChevronDownIcon}
                  className={"mr-2 h-5 w-5 text-typography-primary_light"}
                />
              </SelectTrigger>
              <SelectPortal>
                <SelectBackdrop />
                <SelectContent
                  className={"max-h-[85vh] bg-background-secondary"}
                >
                  <SelectDragIndicatorWrapper>
                    <SelectDragIndicator
                      className={"h-v-1 w-5 rounded-sm border-0"}
                    />
                  </SelectDragIndicatorWrapper>
                  <SelectScrollView>
                    {APPETITE_TEST_PRODUCT_TAKEN_FRACTION.map((item, index) => (
                      <SelectItem
                        key={index}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </SelectScrollView>
                </SelectContent>
              </SelectPortal>
            </Select>
          )}
        </VStack>
      )}
    </AppetiteTestSession>
  );
};
type AnthroData = {
  weight: number;
};
export interface AppetiteTextAnthroDataProps {
  value: AnthroData;
  onChange: (data: AnthroData) => void;
}
export const AppetiteTextAnthroDataSession: React.FC<
  AppetiteTextAnthroDataProps
> = ({ onChange, value }) => {
  return (
    <AppetiteTestSession title="Poids du patient (kg)">
      <Input className="mt-3 h-v-9 rounded-xl border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c_light">
        <InputField
          className="align-center font-body leading-10"
          placeholderClassName="text-sm font-light text-typography-primray_light "
          placeholder="Ex: 8.5"
          keyboardType="numeric"
          value={String(value.weight || 0)}
          onChangeText={val => {
            const num = Number(val);
            if (isNaN(num)) return;
            if (num < 0) return;
            if (num > 70) return;
            onChange({ weight: num });
          }}
        />
      </Input>
    </AppetiteTestSession>
  );
};
interface AppetiteTestResultComponentProps {
  result?: AppetiteTestResultDto;
  code?: string;
}
const AppetiteTestResultComponent: React.FC<
  AppetiteTestResultComponentProps
> = ({ result, code }) => {
  if (!result) return null;

  return (
    <VStack
      className={`mt-4 rounded-2xl border-[1px] border-blue-500/20 bg-blue-500/10 ${result.result === APPETITE_TEST_RESULT_CODES.BAD && "border-red-500/20 bg-red-500/10"} ${result.result === APPETITE_TEST_RESULT_CODES.GOOD && "border-green-500/20 bg-green-500/10"} px-4 py-v-4`}
    >
      <Heading
        className={`font-h2 font-semibold text-blue-500 ${result.result === APPETITE_TEST_RESULT_CODES.BAD && "text-red-500"} ${result.result === APPETITE_TEST_RESULT_CODES.GOOD && "text-green-500"} `}
      >
        Résultat du test
      </Heading>
      {code && (
        <HStack className={"h-v-10 items-center justify-between"}>
          <Text
            className={"font-body text-lg font-normal text-typography-primary"}
          >
            Code du text:
          </Text>
          <Text className="font-body text-lg font-normal uppercase text-typography-primary">
            {code}
          </Text>
        </HStack>
      )}
      <Divider className="h-[1px]" />
      <HStack className={"h-v-10 items-center justify-between"}>
        <Text
          className={"font-body text-lg font-normal text-typography-primary"}
        >
          Résultat:
        </Text>
        <Text className="font-body text-lg font-normal uppercase text-typography-primary">
          {result.result === APPETITE_TEST_RESULT_CODES.BAD
            ? "Faible"
            : result.result === APPETITE_TEST_RESULT_CODES.GOOD
              ? "Bon"
              : "Non Valid"}
        </Text>
      </HStack>
    </VStack>
  );
};
