//This component is what a single post would look like

// Import neccesary modules
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from "react-native";
import Interact from "./postIntereact";
import Icon from "react-native-vector-icons/FontAwesome6";

// Import pfp to show poster's profile photo
import Fpfp from "./fpfp";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get('window')

export default function Post(props) {
    const urli = props.media1;
    const oppfp = props.oppfp || "None";
    const navigation = useNavigation();


    return (
        <>
            <TouchableOpacity onPress={() => { navigation.navigate('PostE', { id: props.id, comments: props.comments, communityName: props.communityName, communityId: props.communityId, communityIsPrivate: props.communityIsPrivate }) }} style={{ backgroundColor: "rgba(250,250,250,0.5)" }}>
                <View style={styles.communityContainer}>
                    <Icon name='people-group' iconSize={width / 100} color={'orange'} />
                    <Text style={styles.communityText}>
                        {props.communityName}
                    </Text>
                    {props.communityIsPrivate && <Icon name="lock" iconSize={width / 100} color={'black'} style={{ paddingLeft: width / 50 }} />}
                </View>
                <View style={styles.post}>
                    <Fpfp uri={oppfp} id={props.opId} userId={props.userId} />
                    <View style={styles.pad}>
                        <View>
                            <Text style={{ fontWeight: "900", color: "gray" }}>
                                {props.display} <Text style={{ color: "orange", fontWeight: '900' }}>{props.distance}</Text>
                            </Text>
                        </View>

                        <View>
                            <Text>
                                @{props.op}
                            </Text>
                        </View>

                        <View style={styles.pad}>
                            <Text style={{ width: width / 1.3, fontSize: width / 25, fontWeight: "600" }}>
                                {props.post}
                            </Text>
                        </View>

                        {
                            urli && <Image source={{ uri: urli }} style={{ width: width - 100, height: height / 3 }} />
                        }
                        <View style={{ marginTop: height / 100 }}>
                            <Interact interact={props.interact == true ? true : false} isShared={props.isShared} allege={props.allege} postID={props.id} likes={props.likes} frowns={props.frowns} ghost_likes={props.ghost_likes} comments={props.comments} shares={props.shares} />
                        </View>
                    </View>

                </View>
                <View style={styles.line}>

                </View>
            </TouchableOpacity>
        </>
    )
}

const styles = StyleSheet.create({
    post: {
        flexDirection: 'row'
    },
    pad: {
        paddingLeft: width / 50,
        paddingBottom: width / 50,
        paddingTop: height / 100
    },
    line: {
        borderBottomWidth: 0.5,
        marginBottom: height / 50,
    },
    communityContainer: {
        padding: width / 30,
        paddingLeft: width / 10,
        flexDirection: "row"
    },
    communityText: {
        color: '#ff8c00',
        marginLeft: width / 50
    }
})