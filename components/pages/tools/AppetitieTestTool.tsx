import { Box } from "@/components/ui/box"
import { Text } from "@/components/ui/text"

export interface AppetiteTestToolProps {

}

export const AppetiteTestTool: React.FC<AppetiteTestToolProps> = () => { 
    return <Box>
        <Text>
            This is the Appetite Test Tool. It is used to assess a patient's appetite and nutritional needs.
        </Text>
    </Box>
}