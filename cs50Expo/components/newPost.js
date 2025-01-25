import { Dimensions, StyleSheet, TextInput, View, TouchableOpacity, Text, Image, ScrollView } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import Layout, { bodyHeight, bodyWidth } from './layout';



const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function NewPost() {

    const [text, setText] = useState('');
    const [image1, setImage1] = useState(null);
    const [image2, setImage2] = useState(null);
    const [image3, setImage3] = useState(null);
    const [image4, setImage4] = useState(null);
    const [community, setCommunity] = useState(null);
    const [commName, setCommName] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [data, setData] = useState(null);
    const navigation = useNavigation();
    const [err, setErr] = useState('');
    const [msgColor, setMsgColor] = useState('red');
    const [isPrivate, setIsPrivate] = useState(true);


    const get_communities = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/new-post');
            const result = await response.json();
            setIsLoading(false);
            setData(result);
            if (response.status === 301) {
                navigation.navigate('Login', { err: result['err'], from: 'New Post' })
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        get_communities();
    }, []);


    if (text.length > 500) {
        setText(text.slice(0, 500));
    }

    const pickImage = async (which) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });




        if (!result.canceled) {
            if (which == 1) {
                setImage1(result.assets[0].uri);
            }
            if (which == 2) {
                setImage2(result.assets[0].uri);
            }
            if (which == 3) {
                setImage3(result.assets[0].uri);
            }
            if (which == 4) {
                setImage4(result.assets[0].uri);
            }
        }
    };


    // Send new post to server

    //declare function
    const sendPost = async () => {
        setErr('Processing');
        setMsgColor('green');
        // get csrf token
        const csrf = data['csrf'];


        if (!community) {
            setErr('No community selected');
            setMsgColor('red');
            return;
        }

        // make new form
        const form = new FormData();
        // check for images and append to form if available
        function append_images(image_uri, num) {
            if (image_uri) {
                form.append('image' + num, {
                    uri: image_uri,
                    type: 'image/jpg',
                    name: image_uri
                });
            }
        }
        append_images(image1, 1);
        append_images(image2, 2);
        append_images(image3, 3);
        append_images(image4, 4);
        // append text if available 
        form.append('post', text.split(0, 500));
        // append community
        form.append('commId', community);
        form.append('isPrivate', isPrivate);
        // try to send post to server with post method
        try {

            // create and send post
            const response = await fetch('http:192.168.0.4:8000/chat/new-post',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf
                    },
                    body: form
                }
            );
            // process response
            const result = await response.json();
            //if error
            if (response.status == 201) {
                // process error
                setErr(result['err']);
                setMsgColor('red');
                // if success
            }
            if (response.status == 200) {
                // redirect to post
                navigation.navigate('PostE', { id: result['post_id'], communityName: commName });
            }

        }
        // catch unplanned errors
        catch (error) {
            console.error(error)
        };
    };
    return (

        <Layout>
            <ScrollView style={{ height: bodyHeight }}>
                {
                    err !== "" &&
                    <Text style={{ textAlign: 'center', color: msgColor, fontSize: width / 20 }}>{err}</Text>

                }
                <View style={styles.post}>

                    <View style={{ padding: width / 50, backgroundColor: 'orange', alignSelf: 'flex-end', borderRadius: width / 70 }}>
                        <TouchableOpacity onPress={() => {
                            sendPost();
                        }}>
                            <Text style={{ alignSelf: "flex-end", textAlign: 'right', color: 'white', fontWeight: '900' }}>

                                Post
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: "space-evenly" }}>

                        {image1 ?
                            <TouchableOpacity onPress={() => {
                                pickImage(1)
                            }}>
                                <Image source={{ uri: image1 }} style={styles.imageS} onPress={() => {
                                    pickImage(1)
                                }} />
                            </TouchableOpacity>

                            : <Icon name='image' size={width / 10} color={'orange'} onPress={() => {
                                pickImage(1);
                            }} />}

                        {image2 ?
                            <TouchableOpacity onPress={() => {
                                pickImage(2)
                            }}>
                                <Image source={{ uri: image2 }} style={styles.imageS} onPress={() => {
                                    pickImage(2)
                                }} />
                            </TouchableOpacity>

                            : <Icon name='image' size={width / 10} color={'orange'} onPress={() => {
                                pickImage(2);
                            }} />}

                        {image3 ?
                            <TouchableOpacity onPress={() => {
                                pickImage(3)
                            }}>
                                <Image source={{ uri: image3 }} style={styles.imageS} onPress={() => {
                                    pickImage(3)
                                }} />
                            </TouchableOpacity>

                            : <Icon name='image' size={width / 10} color={'orange'} onPress={() => {
                                pickImage(3);
                            }} />}

                        {image4 ?
                            <TouchableOpacity onPress={() => {
                                pickImage(4)
                            }}>
                                <Image source={{ uri: image4 }} style={styles.imageS} onPress={() => {
                                    pickImage(4)
                                }} />
                            </TouchableOpacity>

                            : <Icon name='image' size={width / 10} color={'orange'} onPress={() => {
                                pickImage(4);
                            }} />}

                    </View>


                    <View>
                        <View style={{ height: bodyHeight / 4 }}>
                            <View>
                                <TextInput style={styles.input} multiline={true} placeholder="What's happening?" onChangeText={text.length < 501 && setText} value={text} />
                            </View>

                        </View>
                        <View style={{ flexDirection: 'row', width: bodyWidth * 0.9, justifyContent: 'space-between' }}>
                            <View style={{ alignSelf: "flex-start" }}>
                                <Text style={{ fontWeight: 500, fontSize: width / 30, marginTop: height / 50 }}>
                                    {text.length}/500
                                </Text>
                            </View>

                            <View style={{ flexDirection: "row-reverse", alignSelf: 'flex-end' }}>
                                <View>
                                    <Text>{community ? commName : "No community selected"}</Text>
                                </View>
                                <Text>
                                    <Icon name='group' size={width / 20} color={'orange'} style={{ margin: width / 50 }} />
                                </Text>

                            </View>
                        </View>

                    </View>

                    <View>
                        <Text style={styles.title}>
                            Privacy:

                        </Text>

                        <TouchableOpacity onPress={() => {
                            isPrivate ? setIsPrivate(false) : setIsPrivate(true);
                        }}>

                            <Icon name={isPrivate ? 'toggle-on' : 'toggle-off'} size={width / 10} style={{ color: isPrivate ? 'orange' : 'gray' }} />
                        </TouchableOpacity>
                        <Text style={{ color: 'blue' }}>
                            {isPrivate ? 'Only members of your community can view this post' : 'Anyone can view this post.'}
                        </Text>
                    </View>

                    <View>
                        {!isLoading &&
                            <View>

                                {
                                    data['comm_info'].map((item) =>
                                        <View key={item.comm_id}>
                                            <TouchableOpacity onPress={() => {
                                                setCommunity(item.comm_id);
                                                setCommName(item.name);
                                            }}>
                                                <View style={{ flexDirection: "row", margin: width / 90 }}>
                                                    <View >
                                                        <Text style={{ fontSize: width / 15 }}>{item.name}</Text>
                                                    </View>
                                                    <View style={{ paddingLeft: width / 50 }}>
                                                        {community == item.comm_id ?
                                                            <Icon name='toggle-on' color={'green'} size={width / 15} /> :

                                                            <Icon name='toggle-off' color={'gray'} size={width / 15} />
                                                        }
                                                    </View>
                                                </View>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        }
                    </View>
                </View>
            </ScrollView>
        </Layout>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    post: {
        padding: width / 50,
    },

    input: {
        width: width / 1.1,
        fontSize: width / 20
    },
    imageS:
    {
        width: width / 10,
        height: width / 10
    },
    title:
    {
        fontWeight: '900', fontSize: height / 50, marginTop: height / 50
    }
});
