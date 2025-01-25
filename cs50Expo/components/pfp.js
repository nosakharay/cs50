/* Import Dimensions to allow compatibitily
Image to show the image, obviosly.
Stylesheet...
TouchableOpacity for looks and feel
*/
import { useNavigation } from "@react-navigation/native"
import { Image, StyleSheet, TouchableOpacity } from "react-native"

// Export default function to be used out of this file. SHow dp if available or show blank if not
export default function Pfp(props){
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={()=>{navigation.navigate("Profile")}}>
        <Image source={props.uri !== null ? {uri : props.uri} : require('../images/placeholder-male.jpg')} style={styles.image}/>  
        </TouchableOpacity>
    )
}

// Style sheet
const styles = StyleSheet.create({
    image : {
        width : 40,
        height : 40,
        borderRadius : 25,

    },

})