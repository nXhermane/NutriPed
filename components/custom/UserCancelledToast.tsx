import { X } from "lucide-react-native";
import { HStack } from "../ui/hstack";
import { Toast, ToastTitle, ToastDescription } from "../ui/toast";
import { VStack } from "../ui/vstack";
import { Icon } from "../ui/icon";

export interface UserCancelledToastProps {
  id: string;
  title?: string;
  desc?: string;
}

export const UserCancelledToast: React.FC<UserCancelledToastProps> = ({
  id,
  title = "Connexion annulée",
  desc = "Vous avez annulé la connexion Google."
}) => {
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
          as={X}
          className={
            "h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-white dark:bg-gray-500"
          }
        />

        <VStack className="flex-1">
          {title && (
            <ToastTitle
              className={
                "text-base font-semibold text-gray-700 dark:text-gray-400"
              }
            >
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
