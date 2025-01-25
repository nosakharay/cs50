import { StyleSheet, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useState, useCallback } from 'react';
import SCommunity from './community/singleCommunity';
import Icon from 'react-native-vector-icons/FontAwesome';
import Layout, { bodyHeight, bodyWidth, baseFontSize } from './layout';
import Head from './community/communityHead';



export default function MyCommunity() {

    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const getMyCommunities = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community?which=mine');
            const result = await response.json()
            setData(result);
            setIsLoading(false);
            if (response.status === 301) {
                navigation.navigate('Login', { err: result['err'], from: 'MyCommunity' });
            }

        }
        catch (error) {
            console.error(error);
        }

    };

    useFocusEffect(
        useCallback(() => {
            getMyCommunities();
        }, [])
    )






    const navigation = useNavigation();
    return (
        <Layout>

            <View style={{ width: bodyWidth, height: bodyHeight }}>
                {
                    // Height is body baseheight
                }
                <View>
                    {
                        // navigation height takes up 5% of base height
                    }
                    <View style={{height : bodyHeight * 0.05}}>
                        <Head active='MyCommunity' />
                    </View>
                    <View style={{height:bodyHeight * 0.94}}>
                        {
                            // List takes 94%. Leaving 1% for styling
                        }
                    {isLoading ? <ActivityIndicator /> :
                        <>
                            <FlatList data={data['communities']} renderItem={({ item }) =>
                                <SCommunity isPrivate={item['is_private']} id={item['community']} creator={item['creator']} name={item['name']} memberCount={item['member_count']} communityPfp={item['pfp']} />} />
                        </>
                    }
                    </View>
                    {
                        // Add new community button
                    }
                    <View style={{ flexDirection: 'row-reverse', width: bodyWidth, position: 'absolute', bottom: bodyHeight / 10 }}>
                        <TouchableOpacity style={{ width: bodyWidth / 4 }} onPress={() => {
                            navigation.navigate('New Community');
                        }}>
                            <Icon name='plus' size={baseFontSize * 10} style={styles.plusIcon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>

        </Layout>


    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    head: {
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    bottom: {
        position: 'absolute',
        bottom: 0,
        padding: bodyHeight / 50,
        backgroundColor: 'orange',
        width: bodyWidth
    },
    active: {
        borderBottomWidth: bodyHeight / 200,
        borderBottomColor: 'orange'
    },
    plusIcon:
    {
        backgroundColor: "orange", color: 'white', width: bodyWidth / 8, textAlign: 'center', borderRadius: bodyWidth / 20, margin: bodyWidth / 50, padding: bodyWidth / 100
    }

});
