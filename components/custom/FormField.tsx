import React, { useEffect, useState } from "react";
import {
  FormControl,
  FormControlError,
  FormControlErrorIcon,
  FormControlErrorText,
  FormControlHelper,
  FormControlHelperText,
  FormControlLabel,
  FormControlLabelText,
} from "../ui/form-control";
import {
  AlertCircleIcon,
  CheckIcon,
  ChevronDown,
  ChevronDownIcon,
  ChevronUp,
  Circle,
  EyeIcon,
  EyeOff,
} from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Textarea, TextareaInput } from "../ui/textarea";
import { Text } from "../ui/text";
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
} from "../ui/select";
import {
  RadioGroup,
  RadioIndicator,
  RadioLabel,
  Radio,
  RadioIcon,
} from "../ui/radio";
import {
  Checkbox,
  CheckboxGroup,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from "../ui/checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useUI } from "@/src/context";
import { HStack } from "../ui/hstack";

type CommonFieldProps = {
  label: string;
  name: string;
  helperText?: string;
  isReadOnly?: boolean;
  isDisable?: boolean;
  isRequire?: boolean;
};

type TextField = CommonFieldProps & {
  type: "text" | "password" | "textarea";
  placeholder?: string;
  default: string;
};
type NumberField = CommonFieldProps & {
  type: "number";
  placeholder?: string;
  default: number;
  minValue?: number;
  maxValue?: number;
};

type SelectField = CommonFieldProps & {
  type: "select";
  selectOptions: { label: string; value: string }[];
  placeholder?: string;
  default: string;
};

type RadioField = CommonFieldProps & {
  type: "radio";
  radioOptions: { label: string; value: string }[];
  default: string;
};

type CheckBoxField = CommonFieldProps & {
  type: "checkbox";
  checkBoxOptions: { label: string; value: string }[];
  default: string[];
};

type DateField = CommonFieldProps & {
  type: "date";
  mode: "date" | "countdown" | "time";
  default: string;
  placeholder?: string;
  maxDate?: Date;
  minDate?: Date;
};

type QuantityField = CommonFieldProps & {
  type: "quantity";
  placeholder?: string;
  maxValue?: number;
  minValue?: number;
  unitOptions: { unit: string; label: string; convertionFactor: number }[];
  defaultUnit: { unit: string; label: string; convertionFactor: number };
  default: { unit: string; value: number };
};

export type IField =
  | TextField
  | NumberField
  | SelectField
  | RadioField
  | CheckBoxField
  | DateField
  | QuantityField;

export interface FormFieldProps<T> {
  field: IField;
  value?: T;
  onChange?: (fieldName: string, value: T) => void;
  error?: string;
}

export const FormField = <T,>({
  field,
  value,
  onChange,
  error,
}: FormFieldProps<T>) => {
  const [isInvalid, setIsInvalid] = useState<boolean>(false);
  const { colorMode } = useUI();
  const [visible, setVisible] = useState<boolean>(false);
  const [dateValue, setDateValue] = useState<Date>(new Date());
  const [currentQuantityUnit, setCurrentQuantityUnit] = useState<{
    unit: string;
    label: string;
    convertionFactor: number;
  }>({} as any);
  const [currentQuantityValue, setCurrentQuantityValue] = useState<number>(0);

  // Fonction utilitaire pour convertir une chaîne avec virgule en nombre
  const parseNumberFromString = (str: string): number => {
    return Number(str.replace(/,/g, "."));
  };

  // Fonction utilitaire pour formater un nombre avec des virgules
  const formatNumberWithComma = (num: number): string => {
    return num.toString().replace(/\./g, ",");
  };

  // Fonction pour valider et nettoyer l'entrée numérique
  const validateAndCleanNumberInput = (input: string): string => {
    // Remplace les points par des virgules pour la cohérence
    let cleaned = input.replace(/\./g, ",");

    // Supprime tous les caractères non numériques sauf la virgule et le signe moins
    cleaned = cleaned.replace(/[^0-9,-]/g, "");

    // S'assure qu'il n'y a qu'une seule virgule
    const commaCount = (cleaned.match(/,/g) || []).length;
    if (commaCount > 1) {
      const firstCommaIndex = cleaned.indexOf(",");
      cleaned =
        cleaned.substring(0, firstCommaIndex + 1) +
        cleaned.substring(firstCommaIndex + 1).replace(/,/g, "");
    }

    return cleaned;
  };

  const handleChange = (_value: T) => {
    if (onChange) {
      if (field.type === "number") {
        const cleanedValue = validateAndCleanNumberInput(_value as string);
        const numericValue = parseNumberFromString(cleanedValue);
        if (field.minValue && numericValue < field.minValue) {
          onChange(field.name, field.minValue as T);
          return;
        }
        if (field.maxValue && field.maxValue > numericValue) {
          onChange(field.name, field.maxValue as T);
        }
        onChange(field.name, numericValue as T);
      } else {
        onChange(field.name, _value);
      }
    }
  };

  const handleQuantityChangeHandle = (
    _value: number,
    prevUnit: string,
    nextUnit: string
  ) => {
    if (field.type == "quantity") {
      if (prevUnit != nextUnit) {
        const availableUnits = field.unitOptions;
        const nextUnitInfo = availableUnits.find(val => val.unit === nextUnit);
        const prevUnitInfo = availableUnits.find(val => val.unit === prevUnit);
        if (prevUnitInfo && nextUnitInfo) {
          const baseValue = _value * prevUnitInfo.convertionFactor;
          const nextValue = baseValue / nextUnitInfo.convertionFactor;
          setCurrentQuantityUnit(nextUnitInfo);
          setCurrentQuantityValue(nextValue);
        }
      }
      if (currentQuantityValue != _value) {
        const baseValue = currentQuantityUnit.convertionFactor * _value;
        const defaultUnitValue = baseValue / field.defaultUnit.convertionFactor;
        const minValue = field?.minValue || 0;
        const maxValue = field?.maxValue || Infinity;
        const matchedValue =
          defaultUnitValue <= minValue
            ? minValue
            : defaultUnitValue >= maxValue
              ? maxValue
              : defaultUnitValue;
        const currentUnitValue =
          ((isNaN(matchedValue) ? minValue : matchedValue) *
            field.defaultUnit.convertionFactor) /
          currentQuantityUnit.convertionFactor;
        setCurrentQuantityValue(currentUnitValue);
        onChange &&
          onChange(field.name, {
            code: field.name,
            value: defaultUnitValue,
            unit: field.defaultUnit.unit,
          } as T);
      }
    }
  };

  // Gestionnaire spécifique pour les champs numériques
  const handleNumberChange = (text: string) => {
    const cleanedText = validateAndCleanNumberInput(text);

    handleChange(cleanedText as T);
  };

  // Gestionnaire spécifique pour les champs quantity
  const handleQuantityTextChange = (text: string) => {
    const cleanedText = validateAndCleanNumberInput(text);
    const numericValue = parseNumberFromString(cleanedText);
    handleQuantityChangeHandle(
      numericValue,
      currentQuantityUnit.unit,
      currentQuantityUnit.unit
    );
  };

  useEffect(() => {
    if (field.type === "date") {
      if (field.mode === "date") {
        setDateValue(new Date((value as string) || field.default));
      } else if (field.mode === "time") {
        const date = new Date();
        const [hours, minutes] = ((value as string) || field.default)
          .split(":")
          .map(Number);
        date.setHours(hours);
        date.setMinutes(minutes);
        date.setSeconds(0);
        date.setMilliseconds(0);
      }
    }
  }, [value, field.default]);

  if (field.type === "quantity") {
    useEffect(() => {
      setCurrentQuantityUnit(field.defaultUnit);
    }, [field?.defaultUnit]);
    useEffect(() => {
      if (value === undefined) {
        setCurrentQuantityValue(0);
      }
    }, [value]);
  }

  const renderForm = () => {
    switch (field.type) {
      case "quantity": {
        return (
          <React.Fragment>
            <Input className="h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c">
              <InputField
                type={"text"}
                className="font-body text-base font-normal text-typography-primary/80"
                placeholderClassName={
                  "text-base font-body text-typography-primary_light"
                }
                placeholder={field.placeholder}
                keyboardType={"numeric"}
                onChangeText={handleQuantityTextChange}
                value={formatNumberWithComma(currentQuantityValue)}
              />
              <InputSlot
                onPress={() => setVisible(true)}
                className={"h-[100%] w-20"}
              >
                <Select
                  selectedValue={
                    (currentQuantityUnit?.unit as string) || field.default.unit
                  }
                  onValueChange={unit =>
                    handleQuantityChangeHandle(
                      currentQuantityValue,
                      currentQuantityUnit.unit,
                      unit
                    )
                  }
                  onClose={() => setVisible(false)}
                  className={
                    "h-[100%] w-[100%] border-[1px] border-primary-border/5"
                  }
                >
                  <SelectTrigger className={"h-[100%] w-[100%] border-0"}>
                    <HStack
                      className={
                        "h-[100%] w-[100%] items-center justify-end gap-1 pr-2"
                      }
                    >
                      <Text className={"font-light text-sm"}>
                        {currentQuantityUnit?.label}
                      </Text>
                      <InputIcon
                        as={visible ? ChevronUp : ChevronDown}
                        className={"h-4 w-4 text-typography-primary_light"}
                      />
                    </HStack>
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
                        {field.unitOptions.map((item, index) => (
                          <SelectItem
                            key={index}
                            label={item.label}
                            value={item.unit}
                            className={`rounded-lg`}
                            textStyle={{
                              className: `font-body font-normal text-typography-primary`,
                            }}
                          />
                        ))}
                      </SelectScrollView>
                    </SelectContent>
                  </SelectPortal>
                </Select>
              </InputSlot>
            </Input>
          </React.Fragment>
        );
      }
      case "date": {
        return (
          <React.Fragment>
            <Input className="h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c">
              <InputField
                type={"text"}
                placeholderClassName={
                  "text-base font-body text-typography-primary_light"
                }
                placeholder={field.placeholder}
                value={(value as string) || field.default}
              />
              <InputSlot
                onPress={() => setVisible(!visible)}
                className={"mr-2"}
              >
                <InputIcon
                  as={visible ? ChevronUp : ChevronDown}
                  className={"h-5 w-5 text-typography-primary_light"}
                />
              </InputSlot>
            </Input>
            {visible && (
              <DateTimePicker
                mode={field.mode}
                themeVariant={colorMode}
                maximumDate={field.maxDate}
                minimumDate={field.minDate}
                value={dateValue}
                onChange={(event, _value) => {
                  if (_value) {
                    const date = new Date(_value);
                    if (field.mode === "time") {
                      const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                      handleChange(time as T);
                    } else if (field.mode != "countdown") {
                      handleChange(date.toISOString().split("T")[0] as T);
                    } else {
                    }
                  }
                  setVisible(false);
                }}
              />
            )}
          </React.Fragment>
        );
      }
      case "checkbox": {
        const isVertical =
          field.checkBoxOptions.length > 2 ||
          field.checkBoxOptions.some(opt => opt.label.length > 10);
        return (
          <CheckboxGroup
            value={(value as string[]) || field.default}
            className={`${isVertical ? "flex flex-col gap-2" : "flex-row gap-5"}`}
            onChange={handleChange}
          >
            {field.checkBoxOptions.map((item, index) => (
              <Checkbox key={index} value={item.value}>
                <CheckboxIndicator
                  className={"h-4 w-4 border-typography-primary_light"}
                >
                  <CheckboxIcon as={CheckIcon} />
                </CheckboxIndicator>
                <CheckboxLabel>{item.label}</CheckboxLabel>
              </Checkbox>
            ))}
          </CheckboxGroup>
        );
      }
      case "radio": {
        const isVertical =
          field.radioOptions.length > 2 ||
          field.radioOptions.some(opt => opt.label.length > 10);
        return (
          <RadioGroup
            value={(value as string) || field.default}
            className={`${isVertical ? "flex flex-col gap-2" : "flex-row gap-5"}`}
            onChange={handleChange}
          >
            {field.radioOptions.map((item, index) => (
              <Radio key={index} value={item.value}>
                <RadioIndicator
                  className={"h-4 w-4 border-typography-primary_light"}
                >
                  <RadioIcon
                    as={Circle}
                    className="bg-primary-c_light text-primary-c_light"
                  />
                </RadioIndicator>
                <RadioLabel
                  className={"font-body text-sm text-typography-primary_light"}
                >
                  {item.label}
                </RadioLabel>
              </Radio>
            ))}
          </RadioGroup>
        );
      }
      case "select":
        return (
          <Select
            selectedValue={(value as string) || field.default}
            onValueChange={arg => handleChange(arg as T)}
          >
            <SelectTrigger className="h-v-10 justify-between rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c">
              <SelectInput
                className="font-body text-base font-normal text-typography-primary/80"
                placeholderClassName={
                  "text-base font-body text-typography-primary_light"
                }
                placeholder={field.placeholder}
                value={
                  field.selectOptions.find(
                    item =>
                      item.value === value ||
                      (!value && item.value === field.default)
                  )?.label
                }
              />
              <SelectIcon
                as={ChevronDownIcon}
                className={"mr-2 h-5 w-5 text-typography-primary_light"}
              />
            </SelectTrigger>
            <SelectPortal>
              <SelectBackdrop />
              <SelectContent className={"max-h-[85vh] bg-background-secondary"}>
                <SelectDragIndicatorWrapper>
                  <SelectDragIndicator
                    className={"h-v-1 w-5 rounded-sm border-0"}
                  />
                </SelectDragIndicatorWrapper>
                <SelectScrollView>
                  {field.selectOptions.map((item, index) => (
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
        );
      case "textarea":
        return (
          <Textarea
            className={
              "h-v-22 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c"
            }
          >
            <TextareaInput
              className="items-start text-start align-text-top font-body text-base font-normal text-typography-primary/80"
              placeholderClassName={
                "text-base font-body text-typography-primary_light"
              }
              placeholder={field.placeholder}
              value={(value as string) || field.default}
              keyboardType="default"
              style={{ textAlignVertical: "top" }}
              onChangeText={(text: string) => handleChange(text as T)}
            />
          </Textarea>
        );
      case "password":
        return (
          <Input
            className={
              "h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c"
            }
          >
            <InputField
              type={visible ? "text" : field.type}
              className="font-body text-base font-normal text-typography-primary/80"
              placeholderClassName={
                "text-base font-body text-typography-primary_light"
              }
              placeholder={field.placeholder}
              value={(value as string) || field.default}
              onChangeText={(text: string) => handleChange(text as T)}
            />
            <InputSlot onPress={() => setVisible(!visible)} className={"mr-2"}>
              <InputIcon
                as={visible ? EyeOff : EyeIcon}
                className={"h-5 w-5 text-typography-primary_light"}
              />
            </InputSlot>
          </Input>
        );

      case "number":
        return (
          <Input
            className={
              "h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c"
            }
          >
            <InputField
              type="text"
              className="font-body text-base font-normal text-typography-primary/80"
              placeholderClassName={
                "text-base font-body text-typography-primary_light font-normal"
              }
              placeholder={field.placeholder}
              value={
                typeof value === "number"
                  ? formatNumberWithComma(value)
                  : (value as string) || (field.default as any)
              }
              keyboardType="numeric"
              onChangeText={handleNumberChange}
            />
          </Input>
        );

      default:
        return (
          <Input
            className={
              "h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c"
            }
          >
            <InputField
              type={field.type}
              className="font-body text-base font-normal text-typography-primary/80"
              placeholderClassName={
                "text-base font-body text-typography-primary_light font-normal"
              }
              placeholder={field.placeholder}
              value={(value as any) || field.default}
              keyboardType="default"
              onChangeText={text => handleChange(text as T)}
            />
          </Input>
        );
    }
  };

  useEffect(() => {
    if (error) setIsInvalid(true);
    else setIsInvalid(false);
  }, [error]);

  return (
    <FormControl
      isInvalid={isInvalid}
      isDisabled={field.isDisable}
      isReadOnly={field.type === "date" ? true : field.isReadOnly}
      className={"w-full gap-2 py-2"}
    >
      <FormControlLabel className="m-0">
        <FormControlLabelText
          className={"font-body text-xs font-normal text-typography-primary"}
        >
          {field.label}{" "}
          {field.isRequire && <Text className="text-red-400">*</Text>}
        </FormControlLabelText>
      </FormControlLabel>

      {renderForm()}

      {field.helperText && (
        <FormControlHelper>
          <FormControlHelperText className="font-body text-2xs font-normal">
            {field.helperText}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText className={"font-body text-2xs font-normal"}>
          {error}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};
