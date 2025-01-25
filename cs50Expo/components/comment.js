import { Text, View, StyleSheet } from "react-native"
import Fpfp from "./fpfp"

import { bodyWidth, baseFontSize, bodyHeight } from "./layout"

export default function Comment(props) {
    return (
        < >
            <View style={styles.container}>
                <View style={styles.commentHead}>
                    <Fpfp uri={props.comment['pfp']} />
                    <View style={{alignSelf:'flex-end', paddingLeft:bodyWidth*0.02}}>
                        <Text style={{color:'orange', fontWeight:'900'}}>
                            {props.comment['display_name']}
                        </Text>
                        <Text>
                            @{props.comment['user_name']}
                        </Text>
                    </View>
                </View>
                <View style={{ flexDirection: "row" }}>
                    <Text style={styles.comment}>
                        {props.comment['comment']}
                    </Text>
                    <Text >
                        {props.comment['time']}
                    </Text>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    commentHead:
    {
        flexDirection: 'row'
    },
    comment:
    {
        fontSize: baseFontSize *4,
        width: bodyWidth *0.6,
        marginLeft: bodyHeight*0.1,

    },
    container:{
        marginTop:bodyHeight/100,
        marginBottom : bodyHeight/ 100
    }

})