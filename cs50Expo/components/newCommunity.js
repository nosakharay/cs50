// Add new community function
import {Keyboard, KeyboardAvoidingView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import Icon from "react-native-vector-icons/FontAwesome"
import { useEffect, useState } from "react"
import { useNavigation } from "@react-navigation/native"
import Layout, { bodyHeight, bodyWidth } from "./layout"

// get dimensions
const width = bodyWidth
const height = bodyWidth
export default function NewCommunity() {

    // track private option on form
    const [isPrivate, setIsPrivate] = useState(false);
    // track community name. max length is 30
    const [name, setName] = useState('');
    // track description
    const [description, setDescription] = useState('');

    // csrf token to append to user post request
    const [csrf, setCsrf] = useState('');

    //error display
    const [err, setErr] = useState('');

    // navigation object 
    const navigation = useNavigation();



    // check if user is trying to exceed 30 values 
    if (name.length > 50) {
        setName(name.slice(0, 50));
    };

    if (description.length > 500) {
        setDescription(description.slice(0, 500));
    };

    const createCommunity = async () => {
        const form = new FormData();
        form.append('name', name);
        form.append('isPrivate', isPrivate);
        form.append('description', description);
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/new-community',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'X-CSRFToken': csrf
                    },
                    body: form
                }

            );
            const result = await response.json();
            if (response.status === 400) {
                setErr('Name cannot be blank')
            }
            if (response.status === 200) {
                navigation.navigate('CPosts', { id: result['id'] });
            }
        } catch (error) {
            console.error(error);
        }
    }

    const getCsrf = async () => {
        try {
            const resp = await fetch('http://192.168.0.4:8000/api-person/new-community');
            const result = await resp.json();
            setCsrf(result['csrf']);

        } catch (error) {
            console.error(error);
        }
    }
    useEffect(() => {
        getCsrf();
    }, []);



    return (


        <Layout>
            <View style={{height:bodyHeight }} >
                <ScrollView style={{padding: bodyWidth /50}} >
                <TouchableOpacity onPress={()=>{
                    Keyboard.dismiss();
                }}>
                    <KeyboardAvoidingView enabled={true} behavior="height">
                    <View style={{ alignSelf: 'center' }}>
                        {
                            // Error display if any
                        }
                        <Text style={{ textAlign: 'center', fontWeight: '900', color: 'red' }}>
                            {err}
                        </Text>
                        {
                            // Welcom text
                        }
                        <Text>
                            Welcome to Communities! Here, you can create new communities and choose to make them either private or public. Private communities require approval from a moderator to join, while public communities allow users nearby to join and post without needing your permission.
                        </Text>
                        <View style={{ marginTop: height / 50 }}>
                            {
                                // Community name.
                                // Show character limits for community
                            }
                            <Text style={styles.title}>Community Name:</Text>
                            <TextInput onChangeText={setName} value={name} style={{ height: height / 10, borderBottomWidth: 1, borderColor: 'gray', fontSize: height / 25 }} multiline={true} placeholder="Enter new community name" />
                            <Text>{name.length}/50</Text>
                            <Text style={{ color: 'blue' }}>Community name can only be alphanumeric. Do not use symbols.</Text>

                            {
                                // Change look and help text based on option
                            }
                            <Text style={styles.title}>
                                Privacy:

                            </Text>

                            <TouchableOpacity onPress={() => {
                                isPrivate ? setIsPrivate(false) : setIsPrivate(true);
                            }}>

                                <Icon name={isPrivate ? 'toggle-on' : 'toggle-off'} size={width / 10} style={{ color: isPrivate ? 'orange' : 'gray' }} />
                            </TouchableOpacity>
                            <Text style={{ color: 'blue' }}>
                                {isPrivate ? 'In private communities, people must request and receive your approval to join.' : 'Anyone can join and post in public communities without needing your approval.'}
                            </Text>

                            {
                                // Get new commmunity desctiption
                                // show how many values remain to exhause character limit for descrption
                            }
                            <View style={{ height: bodyHeight * 0.23 }}>
                                <Text style={styles.title}>
                                    Description:
                                </Text>
                                <TextInput value={description} onChangeText={setDescription} style={{ height: height * 0.2, borderBottomWidth: 1, borderColor: 'gray', fontSize: height / 25 }} multiline={true} placeholder="What's happening here?" />
                                <Text>{description.length}/500</Text>

                            </View>
                            <TouchableOpacity onPress={() => {
                                createCommunity();
                            }}>

                                {
                                    // Join button
                                }
                                <Text style={{ textAlign: 'center', padding: height / 50, backgroundColor: 'orange', alignSelf: 'center', margin: height / 50, color: 'white', fontWeight: '900', fontSize: height / 30, borderRadius: width / 10, paddingLeft: width / 5, paddingRight: width / 5 }}>
                                    Join
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    </KeyboardAvoidingView>
                    </TouchableOpacity>

                </ScrollView>
            </View>
        </Layout>


    )
}

const styles = StyleSheet.create({
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: height / 50,
        backgroundColor: 'orange',
        width: width
    },
    title:
    {
        fontWeight: '900', fontSize: height / 30, marginTop: height / 50
    }

});