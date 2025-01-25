// Import neccessary modules
import { View, StyleSheet, TouchableOpacity, Image, Dimensions} from "react-native";
// Import custom component Pfp
import Pfp from './pfp'
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";

const {width, height} = Dimensions.get('window');
// Button to eneble signed in users to add new community posts
function New(){
    return (
            <Image source = {require('../images/new.png')} style={styles.image}/>
    )
}




// Default function for Top.
export default function Top(props) {
    const [pfp, setPfp] = useState(null);
    const navigation = useNavigation();
    const uri = props.uri || 'None';

    // get pfp for this user
    const getPfp = async()=>{
        try {
            const resp = await fetch('http://192.168.0.4:8000/api-person/get-pfp');
            if( resp.status === 200){
                const result = await resp.json();
                setPfp(result['pfp'])
            }
        
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(()=>{
        getPfp();
    }, []);

    return (

        <View style={{alignSelf:'center'}}>
        <View style={styles.container} >
            <TouchableOpacity>
            <Pfp uri = {pfp}/>
            </TouchableOpacity>
            <Image source={require('../images/logo.png')} style={styles.image}/>
            <TouchableOpacity onPress={()=>{
                navigation.navigate('New Post');
            }}>
            <New/>
            </TouchableOpacity>
        </View>
        </View>
    )
}

// Style sheet
const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width : width -(width/10),
    },
    image : {
        width : 40,
        height : 40,
        borderRadius : 25,

    },
})