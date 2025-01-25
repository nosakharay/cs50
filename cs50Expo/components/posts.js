// Import sste components
import {StyleSheet, ActivityIndicator, FlatList, View } from 'react-native';

// Import Post component. This custom component renders a single post
import Post from './post';

// useEffect to rerender on state change and useState to manage states
import { useContext, useEffect, useState } from 'react';

// Import custom component layout and parameters for dimensioning
import Layout, {bodyHeight, bodyWidth} from './layout';
import { GeneralContext } from './globalContext';


// default function expoty
export default function Posts() {

    // check if data is still loading
    const [isLoading, setIsLoading] = useState(true);

    // data to containign all post details
    const [data, setData] = useState([]);

    // cotroller to abort incase of quick exit. Saves data and time
    const controller = new AbortController();
    const { signal } = controller

    const {setSignedIn} = useContext(GeneralContext);
    // function to get all posts
    const getPosts = async () => {
        try {
            const response = await fetch('http://192.168.0.4:8000/api-person/?format=json', { signal })
            const result = await response.json()
            setData(result);
            setSignedIn(result['signed_in']);
        }
        catch (error) {
            console.error(error)
        }
        finally {
            // display data and stop displaying activity indicator.
            setIsLoading(false)
        }
    };

    // run function on component mount
    useEffect(() => {
        getPosts();

        // abort on dismount
        return () => {
            controller.abort();
        }
    }, []);

    return (        
        <Layout>
            {
                // Layout has height passed with it. Can set bodyheight to make sure highe is consistent across devices
            }
            <View style={styles.post}>
                {
                    isLoading ? <ActivityIndicator /> :
                        <>
                            <FlatList data={data['posts']} renderItem={({ item }) =>
                                <Post distance = {item['distance']} userId={data['user_data']['id']} opId={item['op_id']} communityIsPrivate={item['community_is_private']} communityName={item['community_name']} communityId={item['community']} isShared={item['is_shared']} id={item['post_id']} oppfp={item['oppfp']} post={item['post']} display={item['display']} op={item['op']} media1={item['media1']} likes={item['likes']} frowns={item['frowns']} ghost_likes={item['ghost_likes']} comments={item['comments']} shares={item['shares']} allege={item['allege']} />
                            } />
                        </>
                }
            </View>
        </Layout>
    );
}

// style sheet
const styles = StyleSheet.create({

    // styling for post container
    post: {
        paddingLeft: bodyWidth / 50,
        paddingRight: bodyWidth / 50,
        height:bodyHeight
    },
});
