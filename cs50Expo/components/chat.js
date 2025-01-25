import { Text, View, StyleSheet, Dimensions } from "react-native";
import Fpfp from "./fpfp";
import FIcon from 'react-native-vector-icons/FontAwesome'
import { baseFontSize } from "./layout";

// get dmensions
const { width, height } = Dimensions.get('screen')

// Default function
export default function Chat(props) {

    // This is a single chat object rendering
    return (
        <View style={ styles.container}>
            <View style={styles.row}>
                <View>
                <Fpfp uri = {props.pfp} id = {props.id}/>
                </View>
                <View style={styles.content}>
                    <Text style={styles.displayName}>
                        {props.displayName}
                    </Text>
                    {
                        // Highlighting unread messages
                    }
                    <Text style={ props.isRead ? styles.lastText :  [styles.lastText,  {fontWeight:'900', color:'orange'}]}>
                        {props.lastText !== null ? props.lastText :<FIcon name='image' size={baseFontSize * 5} color={'orange'} />}
                    </Text>
                </View>
                <View style={{margin:'auto'}}>
                    <Text style={ props.isRead ? styles.time : {fontWeight:'900'} }>{!props.isRead && <FIcon name="circle" color={'orange'} size={ baseFontSize *2}/>}     {props.time}</Text>
                </View>
            </View>
        </View>
    )
};

const styles = StyleSheet.create({
    container:
    {
        margin: width / 50
    },
    displayName:
    {
        fontWeight: '900',
        fontSize: width / 30
    },
    lastText: {
        color: '#5A5A5A',
        fontSize: width / 35
    },
    row:
    {
        flexDirection:'row',
        width:width
    },
    time :
    {
        color:'#5A5A5A'

    },
    content:
    {
        width:width/2,
        paddingLeft:width/50
    }
});