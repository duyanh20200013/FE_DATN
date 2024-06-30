import { Alert, Image, Keyboard, ScrollView, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from 'react-native-paper';
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '@/Constants';
import React, { useState } from "react";
import CheckBox from "@react-native-community/checkbox";
import { ScreenNavigationProp } from "@/Routes/Stack";
import { useNavigation } from '@react-navigation/native';
import { useAddMultiplePlayerMutation } from "@/Redux/api/player";
import Entypo from "react-native-vector-icons/Entypo";
import Spinner from "react-native-loading-spinner-overlay";


const CreatePlayerScreen = () => {
    const [name, setName] = useState<any>();
    const [phone, setPhone] = useState<any>();
    const [number, setNumber] = useState<any>();
    const [captain, setCaptain] = useState(false);
    const navigation = useNavigation<ScreenNavigationProp>();
    const [listPlayer, setListPlayer] = useState([]);

    const [AddMultiplePlayerMutation, { isLoading }] = useAddMultiplePlayerMutation();

    const handleNavigateHome = () => {
        if (listPlayer.length === 0) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
        else {
            AddMultiplePlayerMutation({ data: listPlayer })
                .unwrap()
                .then(data => {
                    console.log(data);
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Home' }],
                    });
                })
                .catch(err => {
                    console.log(err);
                    Alert.alert('Tạo danh sách cầu thủ thất bại');
                });
        }
    }

    const handleAddPlayer = () => {
        if (name === undefined || name === null) {
            setNameError(true);
            setTextAlert('Không được bỏ trống tên cầu thủ');
            return;
        }

        if (number === undefined || number === null) {
            setNameError(false);
            setNumberError(true);
            setTextAlert('Không được bỏ trống số áo');
            return;
        }
        if (listPlayer.find((item) => item.number === Number(number)) !== undefined && listPlayer.length !== 0) {
            setNameError(false);
            setNumberError(true);
            setTextAlert(`Đã có cầu thủ với số áo ${number}`);
            return;
        }
        const newPlayer = {
            name: name,
            number: Number(number),
            phone: phone,
            isCaptain: captain,
        }
        const listPlayerClone = listPlayer
        if (captain) {
            listPlayerClone.map(item => { item.isCaptain = false; return item; })
        }
        const listNewPlayer = [...listPlayerClone, newPlayer];
        setListPlayer(listNewPlayer);
        setName(null);
        setNumber(null);
        setPhone(null);
        setCaptain(false);
        setNameError(false);
        setNumberError(false);
        setTextAlert(null);
    }

    const handleDeletePlayer = (number: Number) => {
        const listNewPlayer = listPlayer.filter(item => item.number !== number)
        setListPlayer(listNewPlayer);
        console.log(listPlayer)
    }

    const [textAlert, setTextAlert] = useState<any>()
    const [nameError, setNameError] = useState(false);
    const [numberError, setNumberError] = useState(false);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Spinner visible={isLoading} />
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 16, fontWeight: 500, color: 'red', marginBottom: 6 }}>{textAlert}</Text>
                    <TextInput
                        style={styles.input}
                        label="Tên cầu thủ"
                        activeUnderlineColor="green"
                        value={name}
                        onChangeText={text => setName(text)}
                        error={nameError}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType={'numeric'}
                        activeUnderlineColor="green"
                        label="Số áo"
                        value={number}
                        onChangeText={text => setNumber(text)}
                        error={numberError}
                    />
                    <TextInput
                        style={styles.input}
                        label="Số điện thoại"
                        activeUnderlineColor="green"
                        keyboardType={'phone-pad'}
                        value={phone}
                        onChangeText={text => setPhone(text)}
                    />
                    <View style={styles.addContainer}>
                        <View style={styles.checkboxContainer}>
                            <CheckBox
                                value={captain}
                                onValueChange={setCaptain}

                            />
                            <Text style={styles.checkBoxLabel}>Đội trưởng</Text>
                        </View>
                        <TouchableOpacity style={styles.addButton} onPress={handleAddPlayer}>
                            <Text style={styles.addButtonText}>Thêm vào</Text>
                        </TouchableOpacity>
                    </View>
                    {listPlayer.length !== 0 ?
                        (<ScrollView style={styles.scrollWrap} bounces={false}>
                            {listPlayer.map((player, index) => (
                                <View key={index} style={styles.playerWrapBodyItem}>
                                    <View style={styles.playerWrapBodyItemLeft}>
                                        <Image style={{
                                            height: 50,
                                            width: 50,
                                            borderRadius: 2000,
                                            backgroundColor: '#fff',
                                            marginBottom: 12,
                                        }} source={require("@/Assets/Images/Avatarplayer.png")} />
                                        {player.isCaptain ? (<Image style={{
                                            height: 20,
                                            width: 20,
                                            borderRadius: 2000,
                                            left: 38,
                                            top: 0,
                                            position: 'absolute',
                                        }} source={require("@/Assets/Images/CaptainIcon.png")} />) : (<></>)}
                                        <Text style={{
                                            color: '#000',
                                            fontSize: 17,
                                            fontWeight: 600,
                                            paddingVertical: 10
                                        }}>{player.name}</Text>
                                    </View>
                                    <TouchableOpacity style={{ backgroundColor: '#1877f2', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 }} onPress={() => handleDeletePlayer(player.number)}>
                                        <Text style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>Xóa</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>)
                        : (<></>)
                    }
                </View>
                <View style={styles.endContainer}>
                    <Text>Số lượng thành viên : <Text style={{ color: 'red' }}>{listPlayer.length}</Text></Text>
                    <TouchableOpacity style={styles.endButton} onPress={handleNavigateHome}>
                        <Text style={styles.endButtonText}>{listPlayer.length === 0 ? 'Để sau' : 'Hoàn tất'}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
        height: SCREEN_HEIGHT - 100,
        paddingHorizontal: 20,
        marginTop: 30,
        justifyContent: 'space-between'
    },
    input: {
        width: '100%',
        height: 60,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    addContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    checkBoxLabel: {
        margin: 8,
        fontSize: 16
    },
    addButton: {
        height: 50,
        width: 100,
        backgroundColor: '#fff',
        borderRadius: 34,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: '#1877f2',
        borderWidth: 1
    },
    addButtonText: {
        color: '#1877f2',
        fontSize: 16,
    },
    endButton: {
        height: 50,
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    endButtonText: {
        color: '#1877f2',
        fontSize: 18,
        fontWeight: 'bold',
    },
    endContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    scrollWrap: {
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        height: SCREEN_HEIGHT / 3 + 30
    },
    playerWrapBodyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 6,
        marginHorizontal: 10
    },
    playerWrapBodyItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14
    },
    playerOptionsWrapper: {
        paddingTop: 16,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F0F8FF',
    },
    playerOptionsWrapperItem: {
        marginVertical: 14,
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    playerOptionsWrapperItemText: {
        fontSize: 16,
        fontWeight: 600
    },
});


export default CreatePlayerScreen;