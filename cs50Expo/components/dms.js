import { Dimensions, StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback, useContext, useState } from 'react';
import Chat from './chat';
import Layout, { bodyHeight } from './layout';
import MSHead from './messaging/messaging';
import { GeneralContext } from './globalContext';
// Get dimensions for user phone screen
const { width, height } = Dimensions.get('window');


export default function Dms(props) {
    const navigation = useNavigation();
    const [isLoading, setLoading] = useState(true);
    // store id of read chats
    const { unRead, chatList, setChatList } = useContext(GeneralContext);

    // start point of swipe on chat objects
    const [start, setStart] = useState([0, 0]);
    // end point of swipe
    const [end, setEnd] = useState([0, 0]);

    // id of chat being swiped
    const [chatId, setChatId] = useState(null);
    // name of user whose chat is being deleted
    const [name, setName] = useState(null);

    // Animate swiping 
    const [swipeValue, setSwipeValue] = useState(0);

    // show delet box
    const [showDelBox, SetShowDelBox] = useState(false);

    const [csrf, setCsrf] = useState(null);

    // delete chat function
    const deletChat = async (_chatId) => {

        const form = new FormData();

        form.append('chatId', _chatId);
        // delete chat from server
        try {
            const response = await fetch("http:192.168.0.4:8000/chat/delete-chat",
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf
                    },
                    body: form
                }
            );
            if (response.status === 204) {
                SetShowDelBox(false);
                setChatId(null);
                setName(null)
                get_chats();
            }

        } catch (error) {
            console.error(error)
        }

    };

    // get all chats
    const get_chats = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/')
            const result = await response.json()
            setChatList(result['chats']);

            setLoading(false);
            setCsrf(result['csrf'])

            // redirect not authenticated users
            if (response.status === 301) {
                navigation.navigate("Login", { err: result['err'], from: 'Dms' })
            }
        } catch (error) {
            console.error(error);
        }
    };

    const DeleteConfirmation = () => {

        return (
            <View style={{ width: width / 1.5, backgroundColor: 'orange', padding: width / 20, borderRadius: width / 25, borderTopLeftRadius: 0 }}>
                <Text style={{ color: 'white', fontSize: height / 50 }}>
                    Are you sure you want to delete your chat with {name}? This action cannot be undone.
                </Text>
                <Text style={{ color: 'red', fontSize: height / 60 }}>
                    Note: Chats are deleted for both users.
                </Text>
                <View style={{ flexDirection: 'row', width: width / 3, justifyContent: 'space-evenly', alignSelf: 'center' }}>
                    <TouchableOpacity onPress={() => {

                        deletChat(chatId);
                    }}>
                        <Text style={[{ backgroundColor: 'red' }, styles.button]}>
                            Delete
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        SetShowDelBox(false);
                    }}>
                        <Text style={[{ backgroundColor: 'blue' }, styles.button]}>
                            Back
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    };

useFocusEffect(
    useCallback(()=>{
        get_chats();
    }, [])
)
    return (
        <>
            <Layout>
                <View style={{ height: bodyHeight }}>

                    <MSHead active='DMS' />
                    <View>
                        {isLoading ? <ActivityIndicator /> :
                            <FlatList data={chatList} renderItem={({ item }) =>
                                <View

                                    style={{ marginLeft: chatId === item['chat']['id'] ? -swipeValue : 0 }}
                                    onTouchStart={(e) => {
                                        setChatId(item['chat']['id'])
                                        setName(item['other_user']['display_name'])
                                        setStart([e.nativeEvent['pageX'], e.nativeEvent['pageY']]);
                                    }}

                                    onTouchMove={(e) => {
                                        setEnd([e.nativeEvent['pageX'], e.nativeEvent['pageY']]);
                                        setSwipeValue(start[0] - end[0]);
                                    }}

                                    onTouchEnd={(e) => {

                                        const navigateToChat = () => {
                                            navigation.navigate('Messages', { id: item['chat']['id'], displayName: item['other_user']['display_name'], oppfp: item['other_user']['pfp'] })

                                        }

                                        const handleSwipe = () => {
                                            swipeValue > width / 3 ? SetShowDelBox(true)
                                                :
                                                navigateToChat();
                                        };
                                        handleSwipe();
                                        setSwipeValue([0, 0])
                                    }}


                                >
                                    <TouchableOpacity>
                                        {
                                            // render chat.. If isREad contains an object whose id is chat, use websocket to sync communication.
                                        }
                                        <Chat isRead={unRead.some(_item=> _item['chat_id'] === item['chat']['id']) ? false : true} displayName={item['other_user']['display_name']} pfp={item['other_user']['pfp']} id={item['other_user']['id']} time={unRead.find(_item => _item['chat_id'] === item['chat']['id']) !== undefined? unRead.find(_item => _item['chat_id'] === item['chat']['id'])['time']: item['chat']['time'] } lastText={unRead.find(_item => _item['chat_id'] === item['chat']['id']) !== undefined? unRead.find(_item => _item['chat_id'] === item['chat']['id'])['last_text']: item['chat']['last_text'] } />
                                    </TouchableOpacity>
                                </View>
                            }
                            />
                        }

                    </View>
                </View>
            </Layout>

            {
                // Delete confirmation
            }
            <View style={[{ display: showDelBox ? 'block' : 'none' }, styles.deletChat]}>
                <DeleteConfirmation />
            </View>
        </>
    );
}

const styles = StyleSheet.create({

    deletChat: {
        position: 'absolute',
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        width: width,
        height: height,
        backgroundColor: 'rgba(225,225,225,0.5)'
    },
    button:
    {
        color: 'white', padding: width / 100, borderRadius: width / 50, fontSize: height / 50, marginTop: height / 50
    }
});
