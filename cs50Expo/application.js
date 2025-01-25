import { NavigationContainer} from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Posts from './components/posts';
import Search from './components/search';
import Explore from './components/community';
import MyCommunity from './components/my-community';
import Alert from './components/alert';
import Dms from './components/dms';
import Cms from './components/cms';
import Profile from './components/profile';
import Login from './components/login';
import PostE from './components/postE';
import CPosts from './components/communityPosts';
import Messages from './components/messages';
import NewPost from './components/newPost';
import Register from './components/register';
import FProfile from './components/FProfile';
import NewCommunity from './components/newCommunity';
import CMessages from './components/communityMessages';
import { useContext, useEffect } from 'react';
import { GeneralContext } from './components/globalContext';

const Stack = createNativeStackNavigator();


export default function Application() {


    const { setChatList, setIsRead } = useContext(GeneralContext);

    // set up chat socket to disconnect only on app close


    // get_chat function
    const get_chats = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/chat/')
            const result = await response.json()
            if (response.status === 200) {
                // Keep list of ids of all read chats
                const readChats = result['chats'].map(item =>
                    item['chat']['is_read'] ? item['chat']['id'] : null
                );
                setChatList(result['chats']);
                setIsRead(readChats);
            }
            // redirect not authenticated users
            if (response.status === 301) {
                console.error('err');
            }
        } catch (error) {
            console.error(error);
        }

    };

    // websocket for app
    useEffect(() => {

        get_chats();

    }, []);

    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName='Posts'>
                <Stack.Screen name='Posts' component={Posts} options={{ headerShown: false }} />
                <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
                <Stack.Screen name='Explore' component={Explore} options={{ headerShown: false }} />
                <Stack.Screen name='MyCommunity' component={MyCommunity} options={{ headerShown: false }} />
                <Stack.Screen name='Alert' component={Alert} options={{ headerShown: false }} />
                <Stack.Screen name='Dms' component={Dms} options={{ headerShown: false }} />
                <Stack.Screen name='Cms' component={Cms} options={{ headerShown: false }} />
                <Stack.Screen name="Profile" component={Profile} options={{ headerShown: false }} />
                <Stack.Screen name='Login' component={Login} options={{ headerShown: false }} />
                <Stack.Screen name='PostE' component={PostE} options={{ headerShown: false }} />
                <Stack.Screen name='CPosts' component={CPosts} options={{ headerShown: false }} />
                <Stack.Screen name='Messages' component={Messages} options={{ headerShown: false }} />
                <Stack.Screen name='New Post' component={NewPost} options={{ headerShown: false }} />
                <Stack.Screen name='Register' component={Register} options={{ headerShown: false }} />
                <Stack.Screen name='FProfile' component={FProfile} options={{ headerShown: false }} />
                <Stack.Screen name='New Community' component={NewCommunity} options={{ headerShown: false }} />
                <Stack.Screen name='CMessages' component={CMessages} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
