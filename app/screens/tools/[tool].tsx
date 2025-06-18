import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useLocalSearchParams } from "expo-router";

const Tool = () => {
  const { tool } = useLocalSearchParams<{ tool: string }>();
  console.log(tool);
  return (
    <Box>
      <Text>Tools</Text>
    </Box>
  );
};
export default Tool;
