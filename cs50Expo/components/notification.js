import { View, Text, Dimensions, StyleSheet, TouchableOpacity } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";
import IconA from "react-native-vector-icons/AntDesign";

import Fpfp from "./fpfp";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('screen');
export default function Notification(props) {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => {
            navigation.navigate("PostE", { id: props.postId })
        }}
            style={{ margin: height / 200, width: width * 0.9 }}
        >
            <View style={[styles.notif, { backgroundColor: props.isSeen ? "white" : "rgba(225,165,0,0.1)" }]}>
                <View style={styles.notifContainer}>
                    {props.type === "rejected-join" &&
                        <Icon name="handshake-slash" color='grey' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {props.type === "accepted-join" &&
                        <Icon name="handshake" color='teal' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {props.type === 'liked-post' &&
                        <Icon name="smile" color='green' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'liked-comment' &&
                        <IconA name='like1' color='blue' size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'commented' &&
                        <Icon name="comment-dots" color={'orange'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'disliked-post' &&
                        <Icon name="frown" color={'red'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'ghost-liked' &&
                        <Icon name="ghost" color={'purple'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'shared' &&
                        <Icon name="share-alt-square" color={'blue'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'is_mod' &&
                        <Icon name="user-cog" color={'blue'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'not_mod' &&
                        <Icon name="user-cog" color={'gray'} size={height / 50} style={{ textAlign: 'center' }} />
                    }
                    {
                        props.type === 'banned' &&
                        <Icon name="ban" color={'red'} size={height / 50} style={{ textAlign: 'center' }} />                  
                    }
                                        {
                        props.type === 'unban' &&
                        <Icon name="user-plus" color={'green'} size={height / 50} style={{ textAlign: 'center' }} />                  
                    }
                </View>
                <View>
                    <Fpfp uri={props.pfp} id={props.userId} />
                    <Text style={styles.text}>
                        {props.displayName} {props.message}
                    </Text>
                    <Text style={styles.notifPost}>
                        {props.post}
                    </Text>

                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    notif: {
        flexDirection: 'row',
        marginBottom: height / 50,
        borderColor: 'orange',
        borderTopWidth: height / 1000,
        borderBottomWidth: height / 1000,
        padding: height / 100

    },
    notifContainer:
    {
        width: width / 15,
        margin: width / 100
    },
    text:
    {
        fontSize: width / 30,
        fontWeight: 'bold',
        width: width *0.8
    },
    notifPost:
    {
        marginTop: height / 100,
        width: width / 1.3
    }
})