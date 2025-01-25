// all imports
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Image, ActivityIndicator } from 'react-native';
import {  useNavigation } from '@react-navigation/native';
import {  useState, useContext, useEffect } from 'react';
// Layout and dimensioning
import Layout, { bodyHeight, baseFontSize, bodyWidth } from './layout';
import FIcon from 'react-native-vector-icons/FontAwesome'
// Custom component. The head bar to navigate between community chat and private chat
import MSHead from './messaging/messaging';
import { GeneralContext } from './globalContext';

// origin of all fonts. All font sizes are mathematical functions of this number. Change this to change all font size

// profile image size. height, width, border radius
const imageSize = baseFontSize * 10;



// A single community chat object
const SingleCommunityChat = (props) => {

    const navigation = useNavigation();

    return (
        <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between' }} onPress={() => {
            navigation.navigate('CMessages', { commId: props.commId });

        }}>
            <View>
                {
                    // show community pfp and nme size by side
                }
                <TouchableOpacity onPress={() => {
                    navigation.navigate('CMessages', { commId: props.commId });
                }}>
                    <View style={{ flexDirection: 'row', marginBottom: bodyHeight / 50 }}>
                        <Image source={props.communityPfp ? { uri: props.communityPfp } : require('../images/group.png')} style={styles.image} />
                        {
                            // give small spacing between text border
                            // set community name display font size to base font size divided by 1.5
                        }
                        <View style={{ flexDirection: 'column', padding: bodyWidth / 50 }}>
                            <Text style={{ fontSize: baseFontSize * 3, fontWeight: '900' }}>
                                {props.name}
                            </Text>
                            <Text>
                                {props.lastText === null ?

                                    <FIcon name='image' size={baseFontSize * 5} color={'orange'} />

                                    : props.lastText}
                            </Text>
                        </View>
                    </View>
                </TouchableOpacity>
            </View>

            <View>
                <Text style={{ color: 'gray', fontSize: baseFontSize * 3 }}>
                    {props.item.time}
                </Text>
            </View>
        </TouchableOpacity>
    )
}

const CommunityChat = () => {
    const navigation = useNavigation();
    // check if community is still loading
    const [loading, setLoading] = useState(true);
    // comm lsit of last texts and time send
    const {comm, communityChatList, setCCL} = useContext(GeneralContext);

    const getChatList = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/community-chat');
            const result = await response.json()
            setCCL(result['comm_list']);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    }

    //useFocusEffect(
       // useCallback(() => {
        //    getChatList();
      //  }, [])
    //)

    useEffect(()=>{
        getChatList();

    } , []);


    return (
        <View style={{ height: bodyHeight }}>
            <>
                {loading ? <ActivityIndicator /> :
                    <>
                        <MSHead active='CMS' />

                        {
                            // Entire body section. Paadding on left and right for styling
                        }
                        <View style={{ paddingLeft: bodyWidth / 100, paddingRight: bodyWidth / 100 }}>
                            {
                                // Make height body height to allow scroll on multiple devices
                            }
                            <View style={{ height: bodyHeight }}>
                                <View>
                                    <Text style={{ fontSize: baseFontSize * 4 }}>
                                        Warning: Community chats are public. Please keep personal information, such as your address and contact details, private.
                                    </Text>
                                </View>
                                {
                                    // list of communities
                                }
                                <View>

                                    <FlatList data={communityChatList} renderItem={({ item }) =>

                                        <View>
                                            <SingleCommunityChat name={item['community_name']} commId={item['community_id']} lastText={comm.find((_)=> _['comm_id'] === item['community_id'] )!== undefined ? comm.find((_)=>_['comm_id'] === item['community_id'] )['last_text'] : item['community_last_text']} communityPfp={item['community_pfp']} item={item} />
                                        </View>
                                    }
                                    />
                                </View>
                            </View>
                        </View>
                    </>
                }
            </>
        </View>
    )
}

export default function Cms() {

    return (
        <Layout>
            <View style={{ height: bodyHeight }}>
                <CommunityChat />
            </View>
        </Layout>

    );
}

const styles = StyleSheet.create({

    head: {
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    active: {
        borderBottomWidth: bodyHeight / 200,
        borderBottomColor: 'orange'
    },
    image:
    {
        width: imageSize, height: imageSize, borderRadius: imageSize
    }
});
