import { Box } from "@/components/ui/box";
import { Icon } from "@/components/ui/icon";
import {
  IInputFieldProps,
  IInputProps,
  Input,
  InputField,
  InputIcon,
  InputSlot,
} from "@/components/ui/input";
import { Guard } from "@/core/shared";

import { Search, X, XCircle } from "lucide-react-native";
import React from "react";
export interface SearchBarProps extends IInputProps {
  fieldProps?: IInputFieldProps;
}
export const SearchBar: React.FC<SearchBarProps> = ({
  fieldProps,
  className,
  ...props
}) => {
  const valueIsNotEmtpy = !Guard.isEmpty(fieldProps?.value).succeeded;
  return (
    <Box>
      <Input
        className={`h-v-10 rounded-xl border-[0.5px] border-primary-border/10 bg-background-secondary data-[focus=true]:border-primary-c ${className}`}
        {...props}
      >
        <InputSlot className={"pl-3"}>
          <InputIcon
            as={() => (
              <Icon
                as={Search}
                className={"h-5 w-5 text-typography-primary_light/60"}
              />
            )}
          />
        </InputSlot>
        <InputField
          className={"font-body text-sm font-normal text-typography-primary"}
          placeholderClassName={
            "text-typography-primary_light/60 font-body text-base  font-normal "
          }
          {...fieldProps}
        />
        {valueIsNotEmtpy && (
          <InputSlot
            className="pr-3"
            onPress={() => {
              fieldProps?.onChangeText && fieldProps.onChangeText("");
            }}
          >
            <InputIcon
              as={XCircle}
              className={"h-5 w-5 text-typography-primary_light/60"}
            />
          </InputSlot>
        )}
      </Input>
    </Box>
  );
};
