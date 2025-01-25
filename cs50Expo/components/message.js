import { Text, StyleSheet, View, Dimensions, Image } from "react-native"

const { width, height } = Dimensions.get('screen');

export default function Message(props) {
    const from = props.message['from'];
    const image_uri = props.message['media']
    return (
        <View style={styles.container}>
            <View style={styles.textWrapper}>
            { image_uri!= undefined && <Image source={{uri:image_uri}} style={from ? styles.image : [styles.image, {alignSelf:'flex-end'}]}/>}

                <Text style={from ? styles.textFrom : [styles.textFrom, styles.textTo]}>
                    {props.message['message']}          <Text style={ styles.time }>{props.message['time']}</Text>
                </Text>
            </View>


        </View>
    )
};

const styles = StyleSheet.create({
    container:
    {
        margin: width / 100,
        position: "relative",

    },
    textFrom:
    {
        backgroundColor: 'blue',
        padding: width / 100,
        color: 'white',
        fontWeight: '700',
        borderRadius: width / 100,
        alignSelf: 'flex-start',
        fontSize: width / 45
    },
    textTo: {
        alignSelf: 'flex-end',
        backgroundColor: 'orange',
    },
    textWrapper:
    {
        width: width/1.1
    },
    time:
    {
        fontSize: width / 50,
        color: '#dddddd'
    },
    timeFrom:
    {
        color: 'orange'
    }, 
    image:
    {
        width : width/4,
        height:width/4
    }
});