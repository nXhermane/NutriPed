import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { Icon } from "@/components/ui/icon";
import { Pressable } from "@/components/ui/pressable";
import { Trash, Plus } from "lucide-react-native";
import React from "react";

export interface MeasurementSeriesHeaderProps {
    onAddSeries: () => void
    onDeleteSeries: () => void
}


export const MeasurementSeriesHeader: React.FC<MeasurementSeriesHeaderProps> = ({ onAddSeries, onDeleteSeries }) => {

    return (<HStack className="items-center justify-between">
        <Heading className="font-h4 text-base font-medium text-typography-primary">
            Series
        </Heading>
        <HStack className="gap-2">
            <Pressable
                className="rounded-full bg-red-500"
                onPress={onDeleteSeries}
            >
                <Icon as={Trash} className={"m-1 h-5 w-5"} />
            </Pressable>
            <Pressable
                className="rounded-full bg-primary-c_light p-1"
                onPress={onAddSeries}
            >
                <Icon as={Plus} className={"h-5 w-5"} />
            </Pressable>
        </HStack>
    </HStack>)
} 