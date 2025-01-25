// system compnents
import { StyleSheet, View, Image, ActivityIndicator, Text, TouchableOpacity, FlatList, TextInput, ScrollView } from 'react-native';

// manage state and force rendering upon state update
import { useCallback, useContext, useEffect, useState } from 'react';

// navigation from screen to screen
import { useFocusEffect, useNavigation } from '@react-navigation/native';

// custom component Post to define how a single post is displayed.
import Post from './post';

// Fontawesome Icons using react native vector icons
import Icon from 'react-native-vector-icons/FontAwesome';

// image picker
import * as ImagePicker from 'expo-image-picker';

// layout and dimensioning
import Layout, { baseFontSize, bodyHeight, bodyWidth } from './layout';
import { GeneralContext } from './globalContext';

// This is the size used to describe all icons, can be exactly this or relative to this(ie math has been done on it with this value)
// The idea is to be able to change all icon size by just changing this value
const iconSize = baseFontSize * 4

export default function Profile() {
    // socket
    const {socket, setSignedIn} = useContext(GeneralContext)

    // data from server and loading state
    const [data, setData] = useState([]);
    const [isLoading, setIsloading] = useState(true);

    // navigation
    const navigation = useNavigation();

    // bio is set after data is loading.
    const [bio, setBio] = useState('');
    // know when bio is being edited. To better help manipulate our keyboard hooks
    const [editBio, setEditBio] = useState(false);

    // holds new bio while backend processes bio. Set bio to new bio on succes and back to bio on failure
    const [newBio, setNewBio] = useState('');

    // this displays the bio in highlighing while it is being changed on the server side
    const [processingBio, setProcessingBio] = useState(false);

    // image to change profile picture to. Has an onpress that opens a gallery
    const [image, setImage] = useState(null);

    // blur image while it is being changed server side
    const [processingImage, setProcessingImage] = useState(false);

    // display name being edited?
    const [editDN, setEditDN] = useState(false);

    // nholds new display name while backend tries to change display name
    // sets to display name on success
    const [newDN, setNewDN] = useState('');

    // DIsplay name. Set by data load success. set to newDN on succesful change
    const [displayName, setDisplayName] = useState('');

    // function to pick a new profile photo
    // the photo must come in a box 1x1 ratio. On succesful select, auto change photo
    // on cancel, do nothing.
    // On select, the photo is stored in result.assets[0].uri
    const pickNewPfp = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1
        })
        if (!result.canceled) {
            // blur image while it is being processed by the updatePerson func
            setProcessingImage(true);
            // error avoiding. Wait a second to set image
            setTimeout(() => {
                updatePerson('pfp', result.assets[0].uri);
            }, 1000);
        }
    }
    // logs out user and returns them to home
    function logout() {
        try {
            const response = fetch('http://192.168.0.4:8000/api-person/logout');
            navigation.navigate('Posts')
        }
        catch (error) {
            console.error(error)
        }
    }

    // Tries to get all info on user from server as long as they're authenticated. If they're not, redirect them to the login screen
    const get_details = async () => {

        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/person?format=json');
            if (response.status === 301) {
                const errorMsg = await response.json();
                navigation.navigate('Login', { err: 'Sign in to continue', from: 'Profile' });
                return;
            }
            // on success, save data, set bio and display name
            const data = await response.json();
            setData(data);
            setBio(data['bio']);
            setDisplayName(data['display_name']);
            data['pfp'] && setImage(data['pfp']); // set image to current profile picture on sevrer side IF it exists

        }
        catch (error) {
            console.error(error)
        } finally {

            // when all data is loading, allow rendering 
            setIsloading(false);
        }
    }

    // change person dedails. 
    // takes a which parameter that tells the program what detail you want to edit. Allowable values as pfp, bio, displayName
    const updatePerson = async (which, path) => {
        // csrf returned with initial load. This is a post request and must be protected against cross site forgery
        const csrf = data['csrf']
        // create new form and apppend valid data
        const form = new FormData();
        const newImage = path;
        if (which === 'bio') {
            form.append('bio', newBio);
        }

        if (which === 'pfp') {
            form.append('pfp', {
                uri: newImage,
                type: 'image/jpeg',
                name: 'pfp.jpg'

            });
        }
        if (which == 'displayName') {
            form.append('displayName', newDN);
        }

        form.append('which', which)

        // try to send data as form with csrf token in header. on success, make changes
        try {

            const response = await fetch('http://192.168.0.4:8000/api-person/update-person',
                {
                    method: 'POST',
                    headers:
                    {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf,
                    },
                    body: form
                }
            );
            const res = await response.json();
            if (response.status === 200 && which === 'bio') {
                setProcessingBio(false);
            }
            if (response.status === 200 && which == 'pfp') {
                setTimeout(() => {

                    setImage(res['pfp']);
                    setProcessingImage(false);
                }, 1000)
            }
            if (response.status === 200 && which === 'displayName') {
                setTimeout(() => {
                    setDisplayName(newDN);
                }, 1000);
            }

        } catch (error) {
            console.error(error);
        }
    };
    // while display name is being edited, this snippet makes sure user can't have more than 30 chars in their display name.
    if (newDN.length > 30) {
        setNewDN(newDN.slice(0, 30))
    }

    useFocusEffect(
        useCallback(()=>{
            get_details();
        }, [])
    )



    return (
        <Layout>
            <ScrollView style={{ height: bodyHeight }}>
                {isLoading ?

                    <ActivityIndicator

                    /> :
                    <>
                        <View>
                            <View style={styles.post}>
                                {
                                    // show image if it exist, else display play holder
                                }
                                <Image source={image !== null ? { uri: image } : require('../images/placeholder-male.jpg')} style={processingImage ? [styles.imageBlur, styles.pfp] : styles.pfp} />
                                {
                                    // image icon with onPress func to pick a new pfp and set it for user
                                }
                                <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => { pickNewPfp(); }}>
                                    <Icon name='image' size={iconSize} color={'orange'} style={{ alignSelf: 'flex-start' }} />
                                </TouchableOpacity>
                                {
                                    // if edit bio has been triggered, hide bio and show form for user to fill in new bio
                                    // change button runs the updatePerson func to go to server to attempt change
                                    // close displays the bio unchanged 
                                }
                                {
                                    editBio ? <TouchableOpacity style={styles.bio}>
                                        <View>
                                            <TextInput multiline={true} style={styles.input} placeholder='Enter new bio' value={newBio} onChangeText={setNewBio} />
                                            <View style={{ flexDirection: 'row' }}>
                                                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                    setProcessingBio(true);
                                                    setBio(newBio);
                                                    setEditBio(false);
                                                    updatePerson('bio', newBio);
                                                }}>
                                                    <Text style={styles.changeButton}>
                                                        Change
                                                    </Text>
                                                </TouchableOpacity>
                                                <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                    setEditBio(false);
                                                }}>
                                                    <Text style={[styles.changeButton, { backgroundColor: 'red' }]}>
                                                        Close
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </TouchableOpacity> :



                                        <ScrollView style={styles.bioContainer}>
                                            {
                                                // If they're not currently trying to edit their bio, show bio in a scrollview
                                                // community users are allowed bio of 200 characters.
                                            }
                                            <Text style={processingBio === false ? [styles.bio, { color: 'black' }] : [styles.bio, { color: 'gray' }]}>
                                                {bio}    <TouchableOpacity onPress={() => { setNewBio(''); setEditBio(true); }}><Icon name='edit' size={iconSize} color={'orange'} /></TouchableOpacity>
                                            </Text>

                                        </ScrollView>
                                }

                            </View>
                            <View style={{ marginLeft: bodyWidth / 20 }}>
                                {editDN ?
                                    <>

                                        <TextInput multiline={true} style={styles.input} onChangeText={newDN.length < 31 && setNewDN} value={newDN} />
                                        <View style={{ flexDirection: 'row' }}>
                                            {
                                                // Close and change buttons
                                            }
                                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                updatePerson('displayName', newDN);
                                                setEditDN(false);
                                            }}>
                                                <Text style={[styles.changeButton, { alignSelf: 'flex-start' }]}>Change</Text>
                                            </TouchableOpacity>

                                            <TouchableOpacity style={{ alignSelf: 'flex-start' }} onPress={() => {
                                                setEditDN(false);
                                            }}>
                                                <Text style={[styles.changeButton, { alignSelf: 'flex-start', backgroundColor: 'red' }]}>Close</Text>
                                            </TouchableOpacity>
                                        </View>
                                    </>
                                    :
                                    <Text style={{ fontWeight: 900, fontSize: baseFontSize * 4 }}>
                                        {displayName} <TouchableOpacity onPress={() => { setEditDN(true); }}><Icon name='edit' size={iconSize} color={'orange'} /></TouchableOpacity>
                                    </Text>
                                }
                                <Text style={{ fontWeight: 500, fontSize: baseFontSize * 3 }}>
                                    @{data['name']}
                                </Text>

                            </View>
                            {
                                // log out button
                            }
                            <TouchableOpacity onPress={() => {setSignedIn(false); socket.close(); logout() }}>
                                <Text style={{ color: 'white', fontSize: baseFontSize * 2.5, backgroundColor: "red", padding: bodyWidth / 40, width: bodyWidth / 5, textAlign: 'center', marginLeft: bodyWidth / 50, borderRadius: bodyWidth / 10, marginTop: bodyWidth / 20 }}>Log out</Text>
                            </TouchableOpacity>
                            {
                                // user stats
                            }
                            <View style={[styles.post, { justifyContent: 'space-around', paddingTop: bodyWidth / 20 }]}>
                                <Text style={styles.fontSizing}>{data['fans']} Fan{data['fans'] > 1 &&'s'}</Text>
                                <Text style={styles.fontSizing}>{data['obsessions']} Obsession{data['obsessions'] > 1 &&'s'}</Text>
                                <Text style={styles.fontSizing}>{data['stalkers']} Stalker{data['stalkers'] > 1 &&'s'}</Text>
                            </View>

                            <View>
                                <Text style={styles.posts}>Posts</Text>
                            </View>
                            {
                                // display all posts in a list where you render each post as Post component(custom component)
                            }
                            {
                                data['post'] !== undefined &&

                                <View>
                                    {
                                        data['post'].map((item) =>
                                            <View key={item['post_id']}>

                                                <Post opId={item['op']} communityIsPrivate={item['community_is_private']} communnityId={item['community']} communityName={item['community_name']} isShared={item['is_shared']} allege={item['allege']} comments={item['comment_count']} id={item['post_id']} oppfp={item['op_pfp']} post={item['post']} display={item['op_display_name']} op={item['op_user_name']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} shares={item['shares']} />

                                            </View>
                                        )
                                    }
                                </View>
                            }

                        </View>
                    </>
                }
            </ScrollView>
        </Layout>
    );
}

// style sheet
const styles = StyleSheet.create({
    post: {
        paddingLeft: bodyWidth / 50,
        paddingRight: bodyWidth / 50,
        flexDirection: 'row'
    },
    input: {
        borderColor: 'black',
        height: bodyHeight / 20,
        borderBottomWidth: 2,
        width: bodyWidth / 2,
        borderRadius: bodyWidth / 100,
        borderStyle: 'dotted',

    },
    bio: {
        fontSize: baseFontSize * 2.5,
        fontWeight: '900',
        width: bodyWidth / 2,
        alignSelf: 'flex-end'

    },
    bioContainer: {
        height: bodyHeight / 5
    },
    // styling to display fans, obsessions and stalkers
    fontSizing: {
        fontSize: bodyWidth / 20
    },
    posts:
    {
        textAlign: 'center',
        fontSize: bodyWidth / 10,
        borderBottomColor: 'orange',
        borderBottomWidth: bodyHeight / 100,
        borderTopColor: 'orange',
        borderTopWidth: bodyHeight / 100
    },
    changeButton: {
        backgroundColor: 'orange',
        color: 'white',
        padding: bodyWidth / 100,
        margin: bodyWidth / 100,
        borderRadius: bodyWidth / 50
    },
    imageBlur: {
        opacity: 0.5
    },
    pfp: {
        width: bodyWidth / 4, height: bodyWidth / 4, borderRadius: bodyWidth / 4
    }
});
