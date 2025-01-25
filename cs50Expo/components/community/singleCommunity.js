import { Text, View, StyleSheet, Dimensions, Image, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/FontAwesome';

import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";


const { width, height } = Dimensions.get('screen');

export default function SCommunity(props) {

    const navigation = useNavigation();
    const [status, setStatus] = useState(null);

    //error message
    const [err, SetErr] = useState('');

    useEffect(() => {
        if (props.requested == true) {

            setStatus(202);
        }
    }, [])

    const joinCommunity = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/join-community?communityId=' + props.id)
            if (response.status === 403){
                setStatus(403);
            }
            if (response.status === 202) {
                setStatus(202);
            } else if (response.status === 200) {
                setStatus(200);
            }
            
        } catch (error) {
            console.error(error);
        }
    }

    return (

        <View style={styles.scommunity}>
            <View style={styles.innerCommunity}>
                <TouchableOpacity onPress={(() => {
                    navigation.navigate('CPosts', { id: props.id })
                })}>
                    <View style={{ flexDirection: 'row' }}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                            <View>

                                <View style={{ flexDirection: 'row' }}>
                                    <Image source={ props.communityPfp ? {uri:props.communityPfp} : require('../../images/group.png')} style={styles.innerImage} />

                                    <View style={styles.innerCommunityText}>
                                        <Text style={{ fontWeight: 'bold', fontSize: width / 40 }}>
                                            {props.name}
                                        </Text>


                                        <Text >
                                            Creator : {props.creator}
                                        </Text>
                                        <Text>
                                            Group : {props.memberCount > 1 ? props.memberCount + ' members' : props.memberCount + ' member'}
                                        </Text>
                                    </View>

                                </View>
                            </View>
                            <View style={{ paddingLeft: width / 50 }}>
                                <Icon name={props.isPrivate == true ? 'lock' : 'unlock'} size={width / 20} />
                            </View>
                        </View>



                    </View>
                </TouchableOpacity>
                {props.isMember === false &&
                    <TouchableOpacity onPress={() => {
                        if (status !== 202) {
                            joinCommunity();
                        }
                    }}>
                        <View style={{ alignSelf: 'flex-end', }}>
                            <Text style={{ backgroundColor: status === 200 ? 'green' : status === 202 ? 'gray' : status === 403 ? 'red': 'orange', padding: width / 30, color: 'white', fontWeight: '900', borderRadius: width / 50 }}>
                                {status === 200 ? 'Joined' : status === 202 ? 'Requested' : status===403? 'Banned' : props.isPrivate ? 'Request' : 'Join'
                                }

                            </Text>
                        </View>
                    </TouchableOpacity>
                }
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    scommunity:
    {
        padding: width / 50,
        backgroundColor: 'orange',
        borderRadius: width / 100,
        width: width / 1.1,
        alignSelf: 'center',
        marginTop: width / 50
    },
    innerCommunity: {
        padding: width / 50,
        backgroundColor: 'white',
        flexDirection: 'row',
        borderRadius: width / 20,
        justifyContent: 'space-between'


    },
    innerImage: {
        width: width / 10,
        height: width / 10,
        borderRadius: width / 10
    },
    innerCommunityText: {
        marginLeft: width / 50,
        paddingTop: width / 50

    }
})