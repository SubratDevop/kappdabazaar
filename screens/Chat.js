import { Feather } from '@expo/vector-icons'
import { useIsFocused } from '@react-navigation/native'
import moment from 'moment/moment'
import React, { useEffect, useRef, useState } from 'react'
import { Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native'
import { TouchableRipple } from 'react-native-paper'
import { useSocket } from '../contexts/SocketContext'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import getAsyncStorageFn from '../utils/constants'
import WaitingApprovalScreen from './WaitingApprovalScreen'

const chatList = [
    // {
    //     id: 1,
    //     name: "John Doe",
    //     message: "Hey, how are you?",
    //     time: "10:30 AM",
    //     date: "Today",
    //     image: "https://randomuser.me/api/portraits/men/18.jpg"
    // },
    // {
    //     id: 2,
    //     name: "Alice Brown",
    //     message: "Meeting at 3 PM?",
    //     time: "09:15 AM",
    //     date: "Today",
    //     image: "https://randomuser.me/api/portraits/women/40.jpg"
    // },
    // {
    //     id: 3,
    //     name: "Michael Smith",
    //     message: "See you tomorrow!",
    //     time: "Yesterday",
    //     date: "Yesterday",
    //     image: "https://randomuser.me/api/portraits/men/13.jpg"
    // },
    // {
    //     id: 4,
    //     name: "Emma Wilson",
    //     message: "Thanks for your help!",
    //     time: "12:45 PM",
    //     date: "Feb 28, 2025",
    //     image: "https://randomuser.me/api/portraits/women/14.jpg"
    // },
    // {
    //     id: 5,
    //     name: "John Doe",
    //     message: "Hey, how are you?",
    //     time: "10:30 AM",
    //     date: "Today",
    //     image: "https://randomuser.me/api/portraits/men/10.jpg"
    // },
    // {
    //     id: 6,
    //     name: "Alice Brown",
    //     message: "Meeting at 3 PM?",
    //     time: "09:15 AM",
    //     date: "Today",
    //     image: "https://randomuser.me/api/portraits/women/17.jpg"
    // },
    // {
    //     id: 7,
    //     name: "Emma Wilson",
    //     message: "Thanks for your help!",
    //     time: "12:45 PM",
    //     date: "Feb 28, 2025",
    //     image: "https://randomuser.me/api/portraits/women/5.jpg"
    // },
    // {
    //     id: 8,
    //     name: "Michael Smith",
    //     message: "See you tomorrow!",
    //     time: "Yesterday",
    //     date: "Yesterday",
    //     image: "https://randomuser.me/api/portraits/men/6.jpg"
    // },
    // {
    //     id: 9,
    //     name: "John Doe",
    //     message: "Hey, how are you?",
    //     time: "10:30 AM",
    //     date: "Today",
    //     image: "https://randomuser.me/api/portraits/men/9.jpg"
    // },
    // {
    //     id: 10,
    //     name: "Michael Smith",
    //     message: "See you tomorrow!",
    //     time: "Yesterday",
    //     date: "Yesterday",
    //     image: "https://randomuser.me/api/portraits/men/10.jpg"
    // },
];

const Chat = ({ navigation }) => {
    const [searchQuery, setSearchQuery] = useState("");
    const inputRef = useRef(null);
    const isFocused = useIsFocused();

    const [userData, setUserData] = useState(null);

    const [show, setShow] = useState(false);
    const [conversationList, setConversationList] = useState([]);
    const { getApprovalStatus, isLoading: isAuthLoading, userRole } = useAuthStore();

    const { fetchConversations, conversations } = useChatStore();


    const socket = useSocket();


    async function helperFn() {
        const res = await getAsyncStorageFn();
        setUserData(res);
        const role = res?.role;
        const user_id = role === "superadmin" ? res?.admin_id : res?.user_id;
        const convos = await fetchConversations({ role, user_id });
        setConversationList(convos.data.conversations);
    }

    useEffect(() => {
        navigation.getParent()?.setOptions({ tabBarStyle: { display: isFocused ? "none" : "flex" } });
        async function fetchDetails() {
            // await helperFn();
        }
        if (isFocused) {
            // const res = await getAsyncStorageFn();
            fetchDetails();
        }
    }, [isFocused]);

    useEffect(() => {
        async function fetchDetails() {
            // const user = await AsyncStorage.getItem(STORAGE_KEYS.USER);
            const user = await getAsyncStorageFn();
            const res = await getApprovalStatus(user.user_id);
            setShow(res);
        }
        if (isFocused) {
            fetchDetails();
        }
    }, []);

    if (isFocused && show === true && userRole === "seller")
        return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <WaitingApprovalScreen />
        </View>

    return (
        <View
            style={{ flex: 1, backgroundColor: "#fff", padding: 5 }}
        >
            <View style={{ flex: 1, padding: 3 }}>
                {conversationList.length !== 0 ?
                    <View style={{ flex: 1 }}>
                        <View style={{
                            flexDirection: "row",
                            alignItems: "center",
                            backgroundColor: "#f9f9f9",
                            borderRadius: 12,
                            paddingHorizontal: 10,
                            marginBottom: 10,
                            height: 45,
                        }}>
                            {/* <SearchIcon color="#111" size={20} /> */}
                            <Feather name="search" size={20} color="#111" />
                            <TextInput
                                ref={inputRef}
                                placeholder="Search"
                                placeholderTextColor="#888"
                                style={{ flex: 1, marginLeft: 8, fontSize: 16, color: "#111", paddingVertical: 10 }}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </View>
                        <ScrollView style={{ flex: 1, paddingHorizontal: 0 }}
                            showsVerticalScrollIndicator
                            scrollToOverflowEnabled>
                            <View>
                                <Text style={{ fontSize: 14, color: "#f28482", fontWeight: "600", marginLeft: 4 }}>Messages</Text>
                                {conversationList?.map(chat => (
                                    <TouchableRipple
                                        key={chat.id}
                                        // onPress={() => navigation.navigate("PersonalChat", { user: chat })}
                                        onPress={() => navigation.navigate("PersonalChat", { user: chat })}
                                        rippleColor="#EED7CE"
                                        borderless={false}
                                        style={{ borderRadius: 25, paddingHorizontal: 5 }}
                                    >
                                        <View style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eee' }}>
                                            <Image
                                                source={
                                                    chat?.opponent?.profile_image
                                                        ? { uri: chat?.opponent?.profile_image }
                                                        : require("../assets/kapda_icon.png")
                                                }
                                                style={{ width: 50, height: 50, borderRadius: 25, marginRight: 10 }}
                                            />
                                            <View style={{ flex: 1 }}>
                                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{chat?.opponent?.name + " (" + chat?.opponent?.type + ")"}</Text>
                                                <Text style={{ fontSize: 14, color: '#555' }} numberOfLines={1}>{chat.last_message_content}</Text>
                                            </View>
                                            <Text style={{ fontSize: 12, color: '#999' }}>{moment(chat.last_message_time).format("hh:mm a")}</Text>
                                        </View>
                                    </TouchableRipple>
                                ))}
                            </View>
                        </ScrollView>
                    </View> : <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Image
                            source={require('../assets/chats_inbox.jpg')} // replace with your image path
                            style={styles.image}
                            resizeMode="contain"
                        />
                        <Text style={styles.description}>
                            Your conversations will appear here once you start messaging others on the platform.
                        </Text>
                        <Text style={styles.note}>
                            To begin, go to a product or profile and send a message to a seller or user.
                        </Text>

                    </View>}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 350,
        height: 270,
        marginBottom: 20,
    },
    description: {
        fontSize: 17,
        textAlign: 'center',
        color: '#444',
        marginBottom: 10,
    },
    note: {
        fontSize: 14,
        textAlign: 'center',
        color: '#777',
        marginTop: 2,
        marginHorizontal: 15,
    },
});

export default Chat;
