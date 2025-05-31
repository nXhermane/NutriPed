import { CardPressEffect } from "@/components/custom/motion";
import { Avatar, AvatarFallbackText } from "@/components/ui/avatar";
import { BadgeText, Badge } from "@/components/ui/badge";
import { Center } from "@/components/ui/center";
import { HStack } from "@/components/ui/hstack";
import { VStack } from "@/components/ui/vstack";
import { Text } from "@/components/ui/text";
import { useEffect, useState } from "react";
import { PATIENT_STATE } from "@/src/constants/ui";
import { HumanDateFormatter } from "@/utils";


export interface PatientCardProps {
    name: string;
    createdAt: string;
    status: PATIENT_STATE
    birthday: string
    nextVisitDate?: string
    onPress?: () => void;
    onChange?: (value: boolean) => void
    selected?: boolean
    enableSelection?: boolean
    scaled?: boolean
    translate?: boolean
}
export const PatientCard: React.FC<PatientCardProps> = ({
    name,
    createdAt,
    status,
    onPress = () => void 0,
    onChange = (value: boolean) => void 0,
    selected = false,
    enableSelection = false,
    birthday,
    nextVisitDate, scaled=true , translate = undefined


}) => {
    const [isSelected, setIsSelected] = useState<boolean>(false)
    const statusBackground =
        status == PATIENT_STATE.NEW
            ? "bg-info-100"
            : status == PATIENT_STATE.ATTENTION
                ? "bg-warning-100"
                : "bg-success-100";
    const handleLongPress = () => {
        if (!enableSelection) return
        const _value = !isSelected
        setIsSelected(_value)
        onChange && onChange(_value)
    }
    useEffect(() => {
        setIsSelected(selected)
    }, [selected])
    return (
        <CardPressEffect
            scaled={scaled}
            translate={translate ? "y" : undefined}
            className=""
            onPress={onPress}
            onLongPress={handleLongPress}
        >
            <HStack
                className={
                    `elevation-sm h-v-16 items-center gap-2 rounded-xl ${isSelected ? "bg-primary-c/10 border-[1px] border-primary-c" : "bg-background-secondary "} px-2`
                }
            >
                <Center>
                    <Avatar className={`h-9 w-9 ${statusBackground}`}>
                        <AvatarFallbackText className={"font-h2 text-typography-primary"}>
                            {name}
                        </AvatarFallbackText>
                    </Avatar>
                </Center>

                <VStack>
                    <Text className={"font-h4 text-sm text-typography-primary"}>
                        {name}
                    </Text>
                    <Text className={"font-light text-2xs text-typography-primary_light"}>
                        {HumanDateFormatter.toAge(birthday)} - {HumanDateFormatter.toFollowUpDate(createdAt)}
                    </Text>
                </VStack>
                <Center className={"absolute right-2 gap-1"}>
                    <Badge
                        className={`${statusBackground} h-v-4 items-center rounded-lg p-0 px-2`}
                    >
                        <BadgeText className={"font-light text-2xs normal-case"}>
                            {status}
                        </BadgeText>
                    </Badge>
                    {nextVisitDate && <Text className={"font-light text-2xs text-typography-primary_light"}>RDV: {HumanDateFormatter.toRelativeDate(nextVisitDate, true)} </Text>}
                </Center>
            </HStack>
        </CardPressEffect>
    );
};
