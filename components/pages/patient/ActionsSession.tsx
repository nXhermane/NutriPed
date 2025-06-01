import { CardPressEffect } from "@/components/custom/motion"
import { HStack } from "@/components/ui/hstack"
import { Icon } from "@/components/ui/icon"
import { Pressable } from "@/components/ui/pressable"
import { icons } from "lucide-react-native"
import React from "react"

export interface ActionBtnSessionProps {
    // actions: ActionBtnProps[]
}
export const ActionBtnSession = () => {
    return <HStack className={"absolute h-v-20 w-full bottom-0 items-center px-8 justify-between"}>

        <ActionBtn icon={"Share2"} toolTip="Supprimer" classNameColor={"bg-violet-500"} />
        <ActionBtn icon={"ScanEye"} toolTip="Supprimer" classNameColor={"bg-blue-500"} />
        <ActionBtn icon={"Trash2"} toolTip="Supprimer" classNameColor={"bg-red-500"} />
    </HStack>
}

export interface ActionBtnProps {
    toolTip: string
    icon: keyof typeof icons
    onPress?: () => void
    classNameColor?: string
}
export const ActionBtn: React.FC<ActionBtnProps> = ({
    onPress = () => void 0,
    classNameColor = "", toolTip, icon
}) => {
    const LucideIcon = icons[icon]
    return <CardPressEffect onPress={onPress} className={`p-1 items-center justify-center ${classNameColor} h-10 w-10 rounded-full`}>
        <Icon as={LucideIcon} className={"text-typography-primary h-6 w-6"} />
    </CardPressEffect>


}