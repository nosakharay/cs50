// system components
import { ActivityIndicator, Text } from "react-native";
// base font size to inherit from
import { baseFontSize } from "../layout";

// Display this while running calculations
export default function Searching() {
    return (
        <>
            <ActivityIndicator />
            <Text style={{ fontSize: baseFontSize * 10 }}>
                Search time depends on your device gps settings...
            </Text>
        </>
    );
}