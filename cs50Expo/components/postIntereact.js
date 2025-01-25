import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity} from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

const iconSize = 20;

export default function Interact(props) {
    const navigation = useNavigation();
    const [likepropsA, setlikepropsA] = useState(props.likes)
    const [frownspropsA, setfrownspropsA] = useState(props.frowns)
    const [ghostspropsA, setghostspropsA] = useState(props.ghost_likes)
    const [sharespropsA, setsharespropsA] = useState(props.shares)
    const [styleAllege, setStyleAllege] = useState(props.allege)
    const [isShared, setIsShared] = useState(props.isShared)
    const [interact, setInteract] = useState(0);


    const allegiance = async (allege) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/allegiance?allege=' + allege + '&postID=' + props.postID)
            if (response.status === 301) {
                navigation.navigate('Login', { err: 'Sign in to', from: 'Profile' })
            }
            if (response.status === 200) {
                const result = await response.json();
                setlikepropsA(result['likes']);
                setfrownspropsA(result['frowns']);
                setghostspropsA(result['ghosts']);
                setsharespropsA(result['shares']);
                setInteract(result['interactions'])
                setStyleAllege(result['allege_now'])
                setIsShared(result['is_shared'])
            }
        } catch (error) {
            console.error(error)
        }
    }

    useEffect(() => {
        if (props.interact == true) {
            allegiance('none')
        } else {
            allegiance('load');
        }
    }, [])

    return (
        <>
            <View style={styles.tray}>


                <View>
                    <TouchableOpacity onPress={() => {
                        allegiance('like');
                    }}>
                        <Icon name="smile" size={iconSize} color={styleAllege == 'like' ? 'green' : 'gray'} style={styles.align} />
                        <Text style={styles.align}>{likepropsA}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        allegiance('frown');
                    }}>
                        <Icon name="frown" size={iconSize} color={styleAllege == 'frown' ? 'red' : 'gray'} style={styles.align} />
                        <Text style={styles.align}>{frownspropsA}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        allegiance('ghost');
                    }}>
                        <Icon name="ghost" size={iconSize} color={styleAllege == 'ghost' ? 'purple' : 'gray'} style={styles.align} />
                        <Text style={styles.align}>{ghostspropsA}</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('PostE', { id: props.postID })
                    }}>
                        <Icon name="comments" size={iconSize} color={'gray'} style={styles.align} />
                        <Text style={styles.align}>{props.comments}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity onPress={() => {
                        allegiance('share');
                    }}>
                        <Icon name="share-alt-square" size={iconSize} color={isShared ? 'blue' : 'gray'} style={styles.align} />
                        <Text style={styles.align}>{sharespropsA}</Text>
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity>
                        <Icon name="chart-bar" size={iconSize} color={'orange'} style={styles.align} />
                        <Text style={styles.align}>{interact}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    )
}

const styles = StyleSheet.create({
    tray: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    align: {
        textAlign: 'center',
    }
})