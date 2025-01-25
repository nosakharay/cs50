// system imports
import { StyleSheet, TextInput, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// manag state and rerender on state update
import { useContext, useEffect, useState } from 'react';

// navigate
import { useNavigation } from '@react-navigation/native';

// layout and dimensioning
import Layout, { bodyHeight, bodyWidth, baseFontSize } from './layout';
import { GeneralContext } from './globalContext';

export default function Login(props) {
    const {setSignedIn} = useContext(GeneralContext);
    // navigate
    const navigation = useNavigation();
    // params sent to login
    const params = props.route.params || {};
    // err from screen that forwarded user to login
    const err = params['err'];
    // from is the screen it came from. ALlows to navigate back to screen after login
    const from = params['from'] || "Profile";

    // form details
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // csrf needed to login
    const [csrf, setCsrf] = useState('');

    // login function. Submin username and password to server, navigate to profile with details returned if succesful else alert user of login error
    const login = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/login',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json',
                    },
                    body: JSON.stringify({
                        name: username,
                        pass: password
                    })
                }
            )
            // handle unsuccesful logins
            if (response.status === 400) {
                navigation.navigate('Login', { err: 'Bad request', from: from })
            }
            if (response.status === 401) {
                navigation.navigate('Login', { err: 'Invalid username or password', from: from })
            }
            if (response.status === 200) {
                setSignedIn(true);
                navigation.navigate(from);
            }
        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false);
        }
    }

    // Get csrf token to append to post request
    const get_csrf = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/login');
            const results = await response.json();
            setCsrf(results['csrf']);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        get_csrf();
    }, [])


    return (

        <Layout>
            <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={{ height: bodyHeight, width: bodyWidth, alignSelf: 'center', alignItems: 'center' }}>

                <View style={styles.login}>
                    {err && <Text style={{ color: 'red' }}>{err}</Text>}

                    <Text style={styles.emp}>USERNAME:</Text>
                    <TextInput style={styles.input} onChangeText={setUsername} value={username} />

                    <Text style={styles.emp}>PASSWORD:</Text>
                    <TextInput style={styles.input} onChangeText={setPassword} value={password} />

                    <TouchableOpacity onPress={() => { login() }}>
                        <View style={styles.emp}>
                            <Text style={styles.logButton}>
                                Log in
                            </Text>
                        </View>
                    </TouchableOpacity>

                    {
                        // go to registration screen 
                    }
                    <Text>
                        Don't have an account? <Text style={{ color: 'orange' }} onPress={() => { navigation.navigate('Register') }}>Register with us.</Text>
                    </Text>


                </View>
            </KeyboardAvoidingView>
        </Layout>

    );
}

const styles = StyleSheet.create({
    login:
    {
        alignItems: 'center',
        alignContent: 'center',
        justifyContent: 'center',
        height: bodyHeight * 0.9,
        width: bodyWidth * 0.8
    },
    input: {
        borderStyle: 'solid',
        borderColor: 'black',
        height: bodyHeight / 20,
        borderWidth: 1,
        width: bodyWidth / 1.2
    },
    emp: {
        fontSize: bodyWidth / 20,
        fontWeight: '900',
        margin: bodyWidth / 100,
    },
    logButton: {
        fontSize: bodyWidth / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        padding: bodyWidth / 50,
        paddingLeft: bodyWidth / 4,
        paddingRight: bodyWidth / 4,
        borderRadius: bodyWidth / 10
    },

});
