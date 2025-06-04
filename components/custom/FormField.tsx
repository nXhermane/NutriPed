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
  CircleIcon,
  EyeIcon,
  EyeOff,
} from "lucide-react-native";
import { Input, InputField, InputIcon, InputSlot } from "../ui/input";
import { Textarea, TextareaInput } from "../ui/textarea";
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
type CommonFieldProps = {
  label: string;
  name: string;
  helperText?: string;
  isReadOnly?: boolean;
  isDisable?: boolean;
  isRequire?: boolean;
};
type TextField = CommonFieldProps & {
  type: "text" | "password" | "number" | "textarea";
  placeholder?: string;
  default: string;
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
export type IField =
  | TextField
  | SelectField
  | RadioField
  | CheckBoxField
  | DateField;
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
  const handleChange = (value: T) => {
    onChange &&
      onChange(
        field.name,
        field.type === "number" ? (Number(value) as T) : value
      );
  };
  const [dateValue, setDateValue] = useState<Date>(new Date());
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
  const renderForm = () => {
    switch (field.type) {
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
                      console.log(date);
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
              <Checkbox value={item.value}>
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
                  grid-cols-2
                >
                  <RadioIcon as={CircleIcon} />
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
                placeholderClassName={
                  "text-base font-body text-typography-primary_light"
                }
                placeholder={field.placeholder}
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
              placeholderClassName={
                "text-base font-body text-typography-primary_light"
              }
              placeholder={field.placeholder}
              value={(value as string) || field.default}
              keyboardType="default"
              className={"items-start text-start align-text-top"}
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

      default:
        return (
          <Input
            className={
              "h-v-10 rounded-lg border-[1px] border-primary-border/5 bg-background-secondary data-[focus=true]:border-primary-c"
            }
          >
            <InputField
              type={field.type === "number" ? "text" : field.type}
              placeholderClassName={
                "text-base font-body text-typography-primary_light"
              }
              placeholder={field.placeholder}
              value={(value as any) || field.default}
              keyboardType={field.type === "number" ? "numeric" : "default"}
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
      isRequired={field.isRequire}
      isInvalid={isInvalid}
      isDisabled={field.isDisable}
      isReadOnly={field.type === "date" ? true : field.isReadOnly}
      className={"w-full gap-2 py-2"}
    >
      <FormControlLabel className="m-0">
        <FormControlLabelText
          className={"font-body text-sm text-typography-primary"}
        >
          {field.label}
        </FormControlLabelText>
      </FormControlLabel>

      {renderForm()}

      {field.helperText && (
        <FormControlHelper>
          <FormControlHelperText className="text-xs">
            {field.helperText}
          </FormControlHelperText>
        </FormControlHelper>
      )}
      <FormControlError>
        <FormControlErrorIcon as={AlertCircleIcon} />
        <FormControlErrorText className={"text-xs"}>
          {error}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  );
};
