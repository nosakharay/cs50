import { StatusBar } from 'expo-status-bar';
import { Dimensions, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import Footer from './footer';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import Top from './top';


const { width, height } = Dimensions.get('window');

const Stack = createNativeStackNavigator();


export default function Globe() {
    const navigation = useNavigation()
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="auto" />
                <SafeAreaView style={styles.safe}>
                <StatusBar barStyle="dark-content" />
                  <View style={styles.top}>
                <Top/>
                </View>
                </SafeAreaView>
                  <View style={styles.head}>
      
                      <TouchableOpacity onPress={() => { navigation.navigate('Alert') }}>
                          <Text>
                              My clubs
                          </Text>
                      </TouchableOpacity>
      
                      <TouchableOpacity style={styles.active}  onPress={() => { navigation.navigate('Globe') }}>
                          <Text>
                              Globe
                          </Text>
                      </TouchableOpacity>
      
                  </View>
            <View style={styles.bottom}>
                <Footer active="notifications" />
            </View>
        </SafeAreaView>
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
        justifyContent :'space-around'
    },
    active: {
        borderBottomWidth:height/200,
        borderBottomColor:'orange'
    }
});
