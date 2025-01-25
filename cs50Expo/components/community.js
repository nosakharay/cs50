import { StyleSheet, Text, View, TouchableOpacity, FlatList } from 'react-native';
import { useEffect, useState } from 'react';
// This renders a single community object in the list of commmunities
import SCommunity from './community/singleCommunity';
// To get user's location
import * as Location from 'expo-location';
// Layout and dimensioning
import Layout, { bodyHeight, bodyWidth, baseFontSize } from './layout';
//Navigation head
import Head from './community/communityHead';
// Display this while data loads
import Searching from './community/searching';


export default function Explore() {
    // data and loading state
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    // user location
    const [location, setLocation] = useState(null);

    // err messaging system
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        // Function to get location and request permissions
        const getLocation = async () => {
            // Check for permissions and request if needed
            let { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            // Get current location
            let location = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.High,
            });
            setLocation(location.coords);
            getMyCommunities(location.coords.longitude, location.coords.latitude, 0.2);
        };
        getLocation();
    }, []);


    // function that takes in user longitude, laditude and a range (dist). It uses this to find community close to user.
    const getMyCommunities = async (long, lat, dist) => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/community?which=near&long=' + long + '&lat=' + lat + '&dist=' + dist);
            const result = await response.json()
            if (response.status === 200) {
                setData(result);
                setIsLoading(false);
            }
        }
        catch (error) {
            console.error(error);
        }

    };

    // main function return
    return (

        <Layout>
            <View style={{height:bodyHeight}}>
            <Head active='Explore'/>

                {isLoading ?
                    <Searching />
                    :

                    
                        <>
                        {
                            data['communities'].length < 1? 
                            <View style={{display:"flex", justifyContent:"center", alignItems:"center", height:bodyHeight *0.8, padding:bodyWidth/20}}>
                            <Text style={{fontWeight:'900'}}>NO COMMUNITIES NEAR YOU, CONSIDER INCREASING RANGE.</Text>
                            </View>
                            :

                        <FlatList data={data['communities']} renderItem={({ item }) =>
                            <SCommunity requested={item['requested']} isPrivate={item['is_private']} isMember={false} id={item['community']} creator={item['creator']} name={item['name']} memberCount={item['member_count']} />

                        } style={{height : bodyHeight * 0.8 }}/>

}
                        <TouchableOpacity onPress={() => {
                            getMyCommunities(location.longitude, location.latitude, data['dist']);
                        }} style={{height : bodyHeight *0.2}}>
                            <View style={styles.emp}>
                                <Text style={styles.logButton}> Increase range </Text>
                            </View>
                        </TouchableOpacity>
                    </>
                    }
                
            </View>
        </Layout>
    );
}

const styles = StyleSheet.create({

    // emphasize button
    emp: {
        width: bodyWidth / 3,
        alignSelf: 'center',
        marginTop: bodyHeight / 50,
        padding: bodyWidth / 50,
    },
    // orange button
    logButton: {
        fontSize: baseFontSize * 3,
        fontWeight: '900',
        backgroundColor: 'orange',
        color: 'white',
        textAlign: 'center',
        padding: bodyWidth / 50,
        borderRadius: bodyWidth / 20
    },
    // mark what bar is active with yellow underline
});
