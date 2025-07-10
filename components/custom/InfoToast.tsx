import { Check, InfoIcon } from "lucide-react-native";
import { HStack } from "../ui/hstack";
import { Toast, ToastTitle, ToastDescription } from "../ui/toast";
import { VStack } from "../ui/vstack";
import { Icon } from "../ui/icon";

export interface InfoToastProps {
  id: string;
  title?: string;
  desc?: string;
}
export const InfoToast: React.FC<InfoToastProps> = ({ id, title, desc }) => {
  const toastId = "toast-" + id;
  return (
    <Toast
      nativeID={toastId}
      style={{
        alignSelf: "center",
      }}
      className={
        "elevation-sm w-[95%] overflow-hidden rounded-2xl border border-primary-border/5 bg-background-secondary p-4"
      }
    >
      <HStack className="gap-3">
        <Icon
          as={InfoIcon}
          className={
            "h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white"
          }
        />

        <VStack className="w-[90%]">
          {title && (
            <ToastTitle className={"text-base font-semibold text-blue-400"}>
              {title}
            </ToastTitle>
          )}
          {desc && (
            <ToastDescription
              className={
                "mt-1 text-sm text-typography-primary_light dark:text-gray-300"
              }
            >
              {desc}
            </ToastDescription>
          )}
        </VStack>
      </HStack>
    </Toast>
  );
};
