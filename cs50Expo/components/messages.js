// important imports
import { StatusBar } from 'expo-status-bar';
// default components
import { TouchableWithoutFeedback, Image, Dimensions, StyleSheet, TextInput, View, TouchableOpacity, Text, ActivityIndicator, FlatList, KeyboardAvoidingView, Platform, Keyboard } from 'react-native';
// custom components
import Footer from './footer';
import Message from './message';
// hooks
import { useCallback, useEffect, useState } from 'react';
// icons
import Icon from 'react-native-vector-icons/FontAwesome';
// import image picker
import * as ImagePicker from 'expo-image-picker';
// navigator to change screens
import { useNavigation, useFocusEffect } from '@react-navigation/native';
// safe area of screen when rendering
import { SafeAreaView } from 'react-native-safe-area-context';
// file management system to read and send chat media
import * as FileSystem from 'expo-file-system';

// dimensions
const { width, height } = Dimensions.get('window');

export default function Messages(props) {
    // props passed in dictionary during navigation
    const mProps = props.route.params || {};
    // store return from server
    const [data, setData] = useState({});

    //messages 
    const [messages, setMessages] = useState([]);
    // true is data is not yet delivered by server, set to false when delivered
    const [loading, setLoading] = useState(true);
    // keep track of weather or not user hs started typing
    const [isTyping, setIsTyping] = useState(false);
    // text to send back as new message
    const [text, setText] = useState('');
    // image if any
    const [image, setImage] = useState('');

    // web socket
    const [socketObj, setSocket] = useState(null);

    const navigation = useNavigation();

    // Image pick
    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        // check if user canceled
        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // function to load all messages from chat id
    const sendId = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/show/' + mProps['id']);
            const result = await response.json();
            setData(result['other_user_id']);
            setMessages(result['messages'])
            setLoading(false);

        } catch (error) {
            console.error(error);
        }
    }
    // load messages
    useEffect(() => {
        sendId();

    }, []);

    useEffect(() => {
        // hide or show keyboard when user wants to start typing
        const keyboardOn = Keyboard.addListener('keyboardWillShow', () => { setIsTyping(true) });
        const keyboardOff = Keyboard.addListener('keyboardWillHide', () => { setIsTyping(false) });
        // remove hoot after component is closed
        return () => {
            keyboardOn.remove();
            keyboardOff.remove();
        }
    }, []);


    const initSocket = () => {
        // initialize web socket, don't initialize within scope to allow us to call return on it during remount
        // Initialize web socket
        const url = 'ws://192.168.0.4:8000/ws/chat/' + mProps['id'] + '/';
        const ws = new WebSocket(url);
        try {
            // on successful connection
            ws.onopen = () => {
            }

            // handle messages that come back from server
            ws.onmessage = function (e) {
                const data = JSON.parse(e.data);
                setMessages((prevMessages) => [data['message'], ...prevMessages,]);
            };

            // close or shut down by error
            ws.onclose = () => {
                setSocket(null);
            }

            // set socket to be used outside this function
            return ws

        } catch (error) {
            console.error(error)
        }
    }

    useFocusEffect(
        useCallback(
            () => {
                let wsh = initSocket();
                setSocket(wsh);

                return () => {
                    wsh.close();
                };
            }, [])
    )

    // send new message. uri is image uri if any. It is stored in a dynamic variable image
    const sendMessage = async (uri) => {
        // if image, encode to base64 format as pictures cannot be sent over ws like in http
        if (uri) {
            const base64Image = await FileSystem.readAsStringAsync(uri, {
                encoding: FileSystem.EncodingType.Base64,
            });

            // create the form
            const form = {
                'message': text,
                'image': base64Image
            }
            socketObj.send(JSON.stringify({ 'form': form }));

        }
        else {

            // send with image as null
            const form = {
                'message': text,
                'image': null
            }
            socketObj.send(JSON.stringify({ 'form': form }));
        }
        setText('');
        setImage(null);
    };

    // this screen uses it's own layout.
    return (

        <SafeAreaView style={styles.container}>

            <TouchableWithoutFeedback onPress={() => { Keyboard.dismiss() }}>
                <>

                    <View style={{ height: isTyping ? height * 0.4 : Platform.OS === 'android' ? height * 0.82 : height * 0.8 }}>
                        <StatusBar style="auto" />
                        <View>
                            <StatusBar barStyle="dark-content" />
                            <View style={styles.top}>
                                <TouchableOpacity onPress={() => {
                                    navigation.navigate('FProfile', { id: data })
                                    socketObj.close();
                                }}>
                                    <Image source={mProps['oppfp'] !== null ? { uri: mProps['oppfp'] } : require('../images/placeholder-male.jpg')} style={{ width: width / 10, height: width / 10, alignSelf: 'center', borderRadius: width / 10 }} />
                                </TouchableOpacity>
                            </View>
                            <Text style={{ fontSize: width / 15, textAlign: 'center' }}>{mProps['displayName']}</Text>

                        </View>

                        <View style={styles.post}>
                            {loading ? <ActivityIndicator /> :
                                <>
                                    <View style={{ flexDirection: 'column-reverse' }}>

                                        <FlatList data={messages} renderItem={({ item }) => <Message message={item} />} style={{ marginBottom: height / 8 }} inverted={true} />

                                    </View>

                                </>

                            }

                        </View>

                    </View>

                    <View>
                        <View style={{ height: isTyping && height * 0.8 }}>
                            <View style={{ flexDirection: 'row', position: 'relative', top: 0 }}>

                                {image ?
                                    <TouchableOpacity onPress={() => {
                                        pickImage();
                                    }}>
                                        <Image source={{ uri: image }} style={{ width: height / 20, height: height / 20 }} />
                                    </TouchableOpacity>
                                    :
                                    <Icon name='image' size={width / 10} style={{ margin: 'auto' }} onPress={() => {
                                        pickImage();
                                    }} />}
                                <TextInput style={styles.input} onChangeText={setText} value={text} autoFocus={true}/>
                                <Icon name='send' size={width / 10} style={{ margin: 'auto' }} onPress={() => {
                                    sendMessage(image);
                                }} />

                            </View>
                        </View>

                        <View style={styles.bottom} onPress ={()=>{
                            socketObj.close();
                        }}>
                            <Footer active="message" />
                        </View>
                    </View>

                </>
            </TouchableWithoutFeedback>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    post: {
        paddingLeft: width / 50,
        paddingRight: width / 50,
        flexDirection: 'row',
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width,
        height: height * 0.15
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'black',
        height: height * 0.05,
        borderWidth: 1,
        width: width / 1.3,
    },
    inputPressed: {
        marginTop: width
    },
    top: {
        textAlign: 'center'
    }
});
