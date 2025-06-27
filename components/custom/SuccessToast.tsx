import { Check } from "lucide-react-native";
import { HStack } from "../ui/hstack";
import { Toast, ToastTitle, ToastDescription } from "../ui/toast";
import { VStack } from "../ui/vstack";
import { Icon } from "../ui/icon";

export interface SuccessToastProps {
  id: string;
  title?: string;
  desc?: string;
}
export const SuccessToast: React.FC<SuccessToastProps> = ({
  id,
  title,
  desc,
}) => {
  const toastId = "toast-" + id;
  return (
    <Toast
      nativeID={toastId}
      style={{
        alignSelf: "center",
      }}
      className={
        "w-[95%] overflow-hidden rounded-2xl border border-primary-border/5 bg-background-secondary p-4"
      }
    >
      <HStack className="gap-3">
        <Icon
          as={Check}
          className={
            "h-6 w-6 items-center justify-center rounded-full bg-green-500"
          }
        />

        <VStack className="w-[90%]">
          {title && (
            <ToastTitle className={"text-base font-semibold text-green-400"}>
              {title}
            </ToastTitle>
          )}
          {desc && (
            <ToastDescription className={"mt-1 text-sm text-gray-300"}>
              {desc}
            </ToastDescription>
          )}
        </VStack>
      </HStack>
    </Toast>
  );
};
