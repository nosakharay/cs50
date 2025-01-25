import { View, TouchableOpacity, Text, StyleSheet } from "react-native"
import { bodyHeight } from "../layout"
import { useNavigation } from "@react-navigation/native"
// to navigate to and fro DMS and CMS
export default function MSHead(props) {
const navigation = useNavigation();
        return (
            <View style={styles.head}>

                <TouchableOpacity style={props.active === 'DMS' && styles.active} onPress={() => { navigation.navigate('Dms') }}>
                    <Text>
                        Private Chats
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={props.active === 'CMS' && styles.active} onPress={() => { navigation.navigate('Cms') }}>
                    <Text>
                        Community Chats
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }

const styles = StyleSheet.create({
    active: {
        borderBottomWidth: bodyHeight / 200,
        borderBottomColor: 'orange'
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
});
