import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import AsyncStorage from "@react-native-community/async-storage";
import {
    View,
    Text,
    SafeAreaView,
    Image,
    StyleSheet,
    TouchableOpacity
} from "react-native";

import api from "../services/api";

import Logo from "../assets/logo.png";
import Like from "../assets/like.png";
import Dislike from "../assets/dislike.png";
import ItsaMatch from "../assets/itsamatch.png";

// import { Container } from './styles';

export default function Main({ navigation }) {
    const id = navigation.getParam("user");
    const [users, setUsers] = useState([]);
    const [matchDev, setMatchDev] = useState(null);

    useEffect(() => {
        async function loadUsers() {
            const response = await api.get("/devs", {
                headers: { user: id }
            });
            setUsers(response.data);
        }
        loadUsers();
    }, [id]);

    useEffect(() => {
        const socket = io("http://localhost:3333", {
            query: { user: id }
        });

        socket.on("match", dev => {
            setMatchDev(dev);
        });
    }, [id]);

    async function handlelike() {
        const [user, ...rest] = users;

        await api.post(`/devs/${user._id}/likes`, null, {
            headers: { user: id }
        });
        setUsers(rest);
    }

    async function handleDislike() {
        const [user, ...rest] = users;
        await api.post(`/devs/${user._id}/dislikes`, null, {
            headers: { user: id }
        });
        setUsers(rest);
    }

    async function handleLogout() {
        await AsyncStorage.clear();
        navigation.navigate("Login");
    }

    return (
        <SafeAreaView style={styles.container}>
            <TouchableOpacity onPress={handleLogout}>
                <Image source={Logo} />
            </TouchableOpacity>

            <View style={styles.cardsContainer}>
                {users.length === 0 ? (
                    <Text style={styles.empty}>It's Over! :(</Text>
                ) : (
                    users.map((user, index) => (
                        <View
                            key={user._id}
                            style={[
                                styles.card,
                                { zIndex: users.length - index }
                            ]}
                        >
                            <Image
                                style={styles.avatar}
                                source={{
                                    uri: `${user.avatar}`
                                }}
                            />
                            <View style={styles.footer}>
                                <Text style={styles.name}>{user.name}</Text>
                                <Text style={styles.bio} numberOfLines={3}>
                                    {user.bio}
                                </Text>
                            </View>
                        </View>
                    ))
                )}
            </View>

            {users.length > 0 && (
                <View style={styles.buttonsContainer}>
                    <TouchableOpacity
                        onPress={handleDislike}
                        style={styles.button}
                    >
                        <Image source={Dislike} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={handlelike}
                        style={styles.button}
                    >
                        <Image source={Like} />
                    </TouchableOpacity>
                </View>
            )}

            {matchDev && (
                <View style={styles.matchContainer}>
                    <Image source={ItsaMatch} style={styles.matchImage} />
                    <Image
                        source={matchDev.avatar}
                        style={styles.matchAvatar}
                    />
                    <Text style={styles.strong}>{matchDev.name}</Text>
                    <Text style={styles.paragraph}>{matchDev.bio}</Text>
                    <TouchableOpacity onPress={() => setMatchDev(null)}>
                        <Text style={styles.buttonClose}>Fechar</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 30
    },
    cardsContainer: {
        flex: 1,
        alignSelf: "stretch",
        justifyContent: "center",
        maxHeight: 500
    },
    empty: {
        alignSelf: "center",
        color: "#999",
        fontSize: 24,
        fontWeight: "bold"
    },
    card: {
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        overflow: "hidden",
        margin: 30,
        backgroundColor: "#fff",
        position: "absolute",
        top: 0,
        left: 0,
        bottom: 0,
        right: 0
    },
    avatar: {
        flex: 1,
        height: 300
    },
    footer: {
        paddingHorizontal: 20,
        paddingVertical: 15
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333"
    },
    bio: {
        fontSize: 14,
        color: "#999",
        marginTop: 5,
        lineHeight: 18
    },
    buttonsContainer: {
        flexDirection: "row",
        marginBottom: 30,
        zIndex: 2
    },
    button: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        marginHorizontal: 15,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.05,
        shadowRadius: 2,
        shadowOffset: {
            width: 0,
            height: 2
        }
    },
    matchContainer: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        zIndex: 8
    },
    matchImage: {
        height: 60,
        resizeMode: "contain"
    },
    matchAvatar: {
        width: 150,
        height: 150,
        borderRadius: 75,
        borderWidth: 4,
        borderColor: "#fff",
        marginVertical: 30
    },
    strong: {
        fontSize: 26,
        fontWeight: "bold",
        color: "#fff"
    },
    paragraph: {
        fontSize: 26,
        lineHeight: 30,
        color: "rgba(255, 255, 255, 0.8)"
    },
    buttonClose: {
        fontWeight: "bold",
        color: "rgba(255, 255, 255, 0.8)",
        fontSize: 18,
        marginTop: 20
    }
});
