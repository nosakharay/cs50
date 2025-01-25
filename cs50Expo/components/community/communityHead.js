// Import default components
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
// navigayion for routing
import { useNavigation } from "@react-navigation/native";
// body height for fixed dimensioning across multiple devices
import { bodyHeight } from "../layout";

// head fucntion to navigate between my community and explore plage
    export default  function Head(props) {
        const navigation = useNavigation();
        // What screen is calling funcction. My community or Explore
        const active = props.active

        return (
            <View style={styles.head}>

                <TouchableOpacity style={active === 'MyCommunity' && styles.active} onPress={() => { navigation.navigate('MyCommunity') }}>
                    <Text>
                        My clubs
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={active === 'Explore' && styles.active} onPress={() => { navigation.navigate('Explore') }}>
                    <Text>
                        Clubs near me
                    </Text>
                </TouchableOpacity>

            </View>
        )
    }

const styles = StyleSheet.create({
    // style for navigation bars
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    // decorate active panel
    active: {
        borderBottomWidth: bodyHeight / 200,
        borderBottomColor: 'orange'
    }
});
