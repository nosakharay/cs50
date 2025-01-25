import { Dimensions, StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import Notification from './notification';
import Layout, { bodyHeight } from './layout';

const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Alert() {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const get_notifs = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/get-notifs');
            const result = await response.json();
            setData(result);
            setIsLoading(false);
            if (response.status === 301) {
                navigation.navigate('Login', { err: result['err'], from: 'Alert' })
            }
        } catch (error) {
            console.error(error)
        }
    };

    useEffect(() => {
        get_notifs();
    }, []);
    const navigation = useNavigation();
    return (
        <Layout>
                <View style={{height:bodyHeight}}>
                <View style={styles.head}>
                    <TouchableOpacity style={styles.active} onPress={() => { navigation.navigate('Alert') }}>
                        <Text>
                            Notifications
                        </Text>
                    </TouchableOpacity>
                </View>
                {
                    // Display alerts in list
                }
                {
                    isLoading ?
                        <ActivityIndicator /> :
                        <View>
                            <FlatList data={data['notif']} renderItem={({ item }) => <Notification isSeen={item['is_seen']} postId={item['post_id']} post={item['post']} userId={item['user_id']} message={item['message']} pfp={item['oppfp']} type={item['type']} displayName={item['user']} />} />
                        </View>

                }
                </View>

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
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    }
});
