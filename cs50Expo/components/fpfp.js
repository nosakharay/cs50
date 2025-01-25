/* Import Dimensions to allow compatibitily
Image to show the image, obviosly.
Stylesheet...
TouchableOpacity for looks and feel
*/
import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

// Export default function to be used out of this file. SHow dp if available or show blank if not
export default function Fpfp(props) {
    const navigation = useNavigation();
    const uri = props.uri == 'None' ? null : props.uri
    const id = props.id;
    const userId = props.userId || 0;



    return (
        <TouchableOpacity onPress={() => {
            {
                // Check if requesting user is signed in user. If they are, show them their profile as editable]
            }
    
            {
                id === userId ?
                navigation.navigate('Profile')
                : navigation.push("FProfile", { id: id });
            }
            return;
        }}>
            <Image source={uri ? { uri: uri } : require('../images/placeholder-male.jpg')} style={styles.image} />
        </TouchableOpacity>
    )
}

// Style sheet
const styles = StyleSheet.create({
    image: {
        width: 40,
        height: 40,
        borderRadius: 25,

    },

})