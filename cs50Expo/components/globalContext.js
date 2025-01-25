import { createContext, useState } from "react";
export const GeneralContext = createContext();


export const GeneralContextProvider = ({ children }) => {
    // store active screen
    const [screen, setScreen] = useState('globe-africa');

    // chat list
    const [chatList, setChatList] = useState(null);
    const [isRead, setIsRead] = useState([]);

    const [socket, setSocket] = useState(null);

    const [msgCount, setMsgCount] = useState(0);

    const [signedIn, setSignedIn] = useState(false);

    const [notifCount, setNotifCount] = useState(0);

    const [unRead, setUnRead] = useState([]);

    const [sResult, setSresult] = useState([]);

    const [comm, setComm] = useState([]);

    // comm chat list
    const [communityChatList, setCCL] = useState([]);
    /*
    SOCKET IMPLEMENTATION
    */

    // re_path to connect to
    const url = 'ws://192.168.0.4:8000/ws/chat-list/'
    const chatSocket = () => {
        // web socket object initialization
        const globalWS = new WebSocket(url);
        try {

            // web socket open
            globalWS.onopen = () => {
                // set socket
                setSocket(globalWS);
            }

            // on receive from server 
            globalWS.onmessage = (e) => {
                const data = JSON.parse(e.data);
                data['type'] === 'comm_signal' && setComm(data['message'])
                data['type'] === 'connection_established' && setMsgCount(data['unread']);
                // check signal type and take action
                if (data['type'] === 'new_message_signal') {

                    setMsgCount(data['unread']);
                    setUnRead(data['unread_ids']);
                    // check this isn't a new chat
                    if (data['chat_id']){
                        setChatList((prev) => [prev.find((item)=> item['chat']['id'] === data['chat_id'])].concat(prev.filter((item)=> item['chat']['id'] !== data['chat_id'] && item)))
                    }
                    

                }
                data['type'] === 'notif_count' && setNotifCount(data['notif_count']);

                data['type'] === 'search' && setSresult(data['message']);
                if (data['type'] === 'new_comm_msg') {
                    try {

                        setCCL((prev) => [prev.find((item) => item['community_id'] === data['message']['comm_id'])].concat(prev.filter((item) => item['community_id'] !== data['message']['comm_id'] && item)));
                        setComm((prev) => prev.map((item) => item['comm_id'] === data['message']['comm_id'] ? data['message'] : item));
                    } catch (error) {
                        console.error(error)
                    }
                }
            }

            // web closing
            globalWS.onclose = () => {
                // when socket closes, set socket to null. This tells app to restart socket on load
                setSocket(null);
            }


        } catch (error) {
            console.error(error);
        }
    }

    if (socket) {
        socket.send(JSON.stringify({ 'message': 'get_notif_count' }));
    }
    


    // auto connect in case of unsuspected misconnection
    if (socket === null && signedIn) {
        chatSocket();
    }

    // store chat list
    return (
        <GeneralContext.Provider value={{ communityChatList, setCCL, comm, sResult, unRead, setUnRead, screen, setScreen, chatList, setChatList, isRead, setIsRead, socket, setSocket, msgCount, setSignedIn, setMsgCount, notifCount }}>
            {children}
        </GeneralContext.Provider>
    )
}