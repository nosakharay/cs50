import { ScrollView, Dimensions, StyleSheet, View, Image, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Post from './post';
import Icon from 'react-native-vector-icons/Foundation';
import { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

const { width, height } = Dimensions.get('window');


const iconSize = width / 20;

export default function FProfile(props) {

    const [data, setData] = useState([]);
    const [isLoading, setIsloading] = useState(true);
    const navigation = useNavigation();
    const [bio, setBio] = useState('');
    const [image, setImage] = useState(null);
    const parameters = props.route.params || {};
    const userId = parameters['id'];

    // take fans, obsessions, stalkers and relationship as states
    const [fans, setFans] = useState("0");
    const [obsessions, setObsessions] = useState("0");
    const [stalkers, setStalkers] = useState("0");
    const [relationship, setRelationship] = useState("ST");

    const [displayName, setDisplayName] = useState('');


    const get_details = async () => {

        try {
            // Get all details from back end for selected user by their ID.
            const response = await fetch('http://192.168.0.4:8000/api-person/person?userId=' + userId);
            if (response.status === 301) {
                navigation.navigate('Login', { err: 'Sign in to continue', from: 'Profile' });
                return;
            }
            if (response.status === 302) {
                navigation.navigate('Profile');
                return;
            };
            const data = await response.json();
            setData(data);
            setBio(data['bio']);
            setDisplayName(data['display_name']);
            data['pfp'] && setImage(data['pfp']);
            setFans(data['fans']);
            setObsessions(data['obsessions']);
            setStalkers(data['stalkers']);
            setRelationship(data['relationship']);
        }
        catch (error) {
            console.error(error)
        } finally {
            setIsloading(false);
        }
    }

    useEffect(() => {
        get_details();
    }, []);

    const chat = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/new-message?user1=' + userId);
            const result = await response.json();
            if (response.status === 301) {
                navigation.navigate("Login", { err: result['err'] });
            };
            if (response.status === 200) {
                navigation.navigate('Messages', { id: result['id'], displayName: result['other_display_name'], oppfp: result['other_pfp'] })
            }
        } catch (error) {
            console.error(error);
        }
    };

    const getRelationship = async() =>{
        const csrf = data['csrf']
        const form = new FormData();
        form.append('userId', data['user']);
        try {
            const resp = await fetch('http://192.168.0.4:8000/api-person/get-relationship',
                {
                    method : 'POST',
                    headers : {
                        'Content-Type' : 'multipart/form-data',
                        'X-CSRFToken' : csrf
                    },
                    body : form
                }
            );
            if(resp.status === 200){
                const result = await resp.json();
                setRelationship(result['relationship'])
                setFans(result['fans']);
                setObsessions(result['obsessions'])
                setStalkers(result['stalkers']);
            }
        } catch (error) {
            console.error(error);
        }
    }



    return (
        <>
            <SafeAreaView style={styles.container}>

                <ScrollView style={{ height: height }}>
                    <View >
                        {isLoading ? <ActivityIndicator /> :
                            <>
                                <View>
                                    <View style={styles.post}>
                                        <Image source={image !== null ? { uri: image } : require('../images/placeholder-male.jpg')} style={styles.pfp} />


                                        <Text style={styles.bio}>
                                            {bio}
                                        </Text>


                                    </View>
                                    <View style={{ marginLeft: width / 20 }}>


                                        <Text style={{ fontWeight: 900, fontSize: width / 20 }}>
                                            {displayName}
                                        </Text>
                                        <View style={{ flexDirection: 'row', justifyContent: "flex-start", width: width }}>
                                            <View>
                                                <Text style={{ fontWeight: 500, fontSize: width / 25 }}>
                                                    @{data['name']}
                                                </Text>

                                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: width / 5 }}>
                                                  {
                                                    // follow publicly and stalk privately icons
                                                    // both icons hold their icon size individually, to change, change each
                                                  }
                                                    <TouchableOpacity onPress={()=>{
                                                        getRelationship();
                                                    }}>

                                                        <MaterialCommunityIcons name={ relationship === 'FO' ? 'account-check' : 'account-check-outline'} size={iconSize * 1.5} color={'green'}/>
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                            <View style={{ marginLeft: width / 20 }}>
                                                <TouchableOpacity onPress={() => {
                                                    chat();
                                                }}>
                                                    <Icon name="mail" size={iconSize} style={{ color: 'orange' }} />
                                                </TouchableOpacity>
                                            </View>
                                        </View>

                                    </View>

                                    <View style={[styles.post, { justifyContent: 'space-around', paddingTop: width / 20 }]}>
                                        <Text style={styles.fontSizing}>{fans} Fans</Text>
                                        <Text style={styles.fontSizing}>{obsessions} Obsessions</Text>
                                        <Text style={styles.fontSizing}>{stalkers} Lurkers</Text>
                                    </View>
                                    <View>
                                        <Text style={styles.posts}>Posts</Text>
                                    </View>
                                    <View>
                                        {
                                            data['post'].map((item) =>
                                                <View key={item['post_id']}>
                                                    <Post opId={item['op_user_id']} userId={data['request_id']} communityIsPrivate={item['community_is_private']} communnityId={item['community']} communityName={item['community_name']} isShared={item['is_shared']} allege={item['allege']} comments={item['comment_count']} id={item['post_id']} oppfp={item['op_pfp']} post={item['post']} display={item['op_display_name']} op={item['op_user_name']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} shares={item['shares']} />
                                                </View>
                                            )
                                        }
                                    </View>
                                </View>
                            </>
                        }

                    </View>
                </ScrollView>


            </SafeAreaView>
            <View style={styles.bottom}>
                <Footer />
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        height: height * 0.9
    },
    post: {
        paddingLeft: width / 50,
        paddingRight: width / 50,
        flexDirection: 'row'
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width,
        height: height * 0.1,
        position: 'absolute',
        bottom: 0
    },

    bio: {
        fontSize: width / 40,
        fontWeight: '900',
        position: 'absolute',
        width: width / 1.5,
        right: width / 100,
        bottom: height / 50
    },
    fontSizing: {
        fontSize: width / 20
    },
    posts:
    {
        textAlign: 'center',
        fontSize: width / 10,
        borderBottomColor: 'orange',
        borderBottomWidth: height / 100,
        borderTopColor: 'orange',
        borderTopWidth: height / 100
    },

    changeButton: {
        backgroundColor: 'orange',
        color: 'white',
        padding: width / 100,
        margin: width / 100,
        borderRadius: width / 50
    },
    imageBlur: {
        opacity: 0.5
    },
    pfp: {
        width: width / 4, height: width/4, borderRadius: width / 4
    }
});
