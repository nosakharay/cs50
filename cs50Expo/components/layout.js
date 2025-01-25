// all imports
import { Dimensions, StyleSheet, View, StatusBar, Platform } from 'react-native';
import Footer from './footer';
import { useNavigation } from '@react-navigation/native';
import Top from './top';
import React, { useContext } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { GeneralContext } from './globalContext';
// user screen dimension
const { width, height } = Dimensions.get('window');
 
// height of body section of screen
export const bodyHeight = Platform.OS === 'android' ?  height * 0.83 : height *0.8

// origin of all fonts. All font sizes are mathematical functions of this number. Change this to change all font size
export const baseFontSize = width/100

export const bodyWidth = width - (2 * width/100);



export default function Layout({children, props}) {
    const {screen} = useContext(GeneralContext);
    const uri = props
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <StatusBar style="dark-content"/>
            <View style={{height : height * 0.05, zIndex:10, backgroundColor:'white'}}>
                <Top />
            </View>
    
            <View style={{paddingLeft:width/100, paddingRight:width/100 }}>

                {React.Children.map(children, child=>
                    React.cloneElement(child, {bodyHeight : bodyHeight, baseFontSize : baseFontSize})
                )}

            </View>
            <View style={styles.bottom}>
                <Footer active={screen} />
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
    },
    bottom: {
        padding: height / 50,
        backgroundColor: 'orange',
        width: width,
        height : height * 0.20
    },
    active: {
        borderBottomWidth: height / 200,
        borderBottomColor: 'orange'
    },
});
