import { VStack } from "@/components/ui/vstack"
import { SessionHeader } from "./shared/SessionHeader"
import { HStack } from "@/components/ui/hstack"




export const QuickAccessSession = ()=> {
    return <VStack>
        <SessionHeader title="Quick Access" actionName="See more" onActionPress={()=> console.warn("Implement navigate to utils session")}/>
            <HStack>

            </HStack>
    </VStack>
}