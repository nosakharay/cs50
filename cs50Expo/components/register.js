// default components
import { StyleSheet, TextInput, Text, View, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';

// manage state and navigation
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

// import Layout component
import Layout, { bodyHeight, bodyWidth } from './layout'


export default function Register() {
    // navigation
    const navigation = useNavigation();

    //reg details for form
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [dName, setDisplayName] = useState('');
    const [confirmPass, setConfirmPass] = useState('');
    // error handling display
    const [serr, setSerr] = useState('');

    // send registration details to backend
    const sendRegistrationDetails = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/register',
                {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: username,
                        pass: password,
                        pass2: confirmPass,
                        displayName: dName,
                    })
                }
            );
            // go to profile on succesful registration, else display error
            const results = await response.json();
            if (response.status === 403) {
                setSerr(results['err']);
            }
            if (response.status === 200) {
                navigation.navigate('Profile');
            }

        }
        catch (error) {
            console.error(error)
        }
        finally {
            setIsLoading(false);
        }
    }


    return (

        <Layout>
            {
                // make the view avoid keyboard on scroll out
            }
            <KeyboardAvoidingView enabled={true} behavior={Platform.OS === 'ios' ? 'position' : 'height'} style={{ height: bodyHeight, alignSelf: 'center', alignItems: 'center', alignContent: "center", justifyContent: 'center' }}>
              
              {
                // registration form
              }
                <View style={{ alignSelf: 'center', alignContent: 'center', backgroundColor: 'white' }}>
                    {
                    // error hadling system
                    serr && <Text style={{ color: 'red' }}>{serr}</Text>}
                    <Text style={[styles.emp, { alignSelf: 'flex-start' }]}>USERNAME:</Text>
                    <TextInput style={styles.input} onChangeText={setUsername} value={username} placeholder='Choose a username' />
                    
                    <Text style={[styles.emp, { alignSelf: 'flex-start' }]}>DISPLAY NAME:</Text>
                    <TextInput style={styles.input} onChangeText={setDisplayName} value={dName} placeholder='Display name' />
                    
                    <Text style={[styles.emp, { alignSelf: 'flex-start' }]}>PASSWORD:</Text>
                    <TextInput style={styles.input} onChangeText={setPassword} value={password} placeholder='Choose a password' />
                    
                    <Text style={[styles.emp, { alignSelf: 'flex-start' }]}>CONFIRM PASSWORD:</Text>
                    <TextInput style={styles.input} onChangeText={setConfirmPass} value={confirmPass} placeholder='Confirm your password' />
                    
                    {
                        // registration button
                    }
                    <TouchableOpacity onPress={() => { sendRegistrationDetails(); }}>
                        <View style={styles.emp}>
                            <Text style={styles.logButton}>
                                Register
                            </Text>
                        </View>
                    </TouchableOpacity>
                    {
                        // go to login screen incase of account
                    }
                    <Text>Already have an account?
                        <Text style={{ color: 'orange' }} onPress={() => {
                            navigation.navigate('Login')
                        }}>
                            Log in instead
                        </Text>
                    </Text>
                </View>
            </KeyboardAvoidingView>
        </Layout>
    );
}

// stylesheet
const styles = StyleSheet.create({
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
        margin: bodyWidth / 50
    },
    logButton: {
        fontSize: bodyWidth / 30,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        padding: bodyWidth / 50,
        paddingLeft: bodyWidth / 4,
        paddingRight: bodyWidth / 4,
        borderRadius: bodyWidth / 10,
        textAlign: 'center'
    },
});
