import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { useEffect, useState } from "react";
import Modal from 'react-native-modal';
import { TextInput } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import CheckBox from "@react-native-community/checkbox";
import { useCreateFundCollectDetailMutation, useCreateFundCollectMutation, useGetAllFundCollectDetailQuery } from "@/Redux/api/fund";
import Spinner from "react-native-loading-spinner-overlay";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';

const ContributeFundScreen = () => {
    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };
    const [data, setData] = useState()
    const [money, setMoney] = useState<any>();
    const [description, setDescription] = useState<any>();
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [players, setPlayers] = useState<Array<any> | undefined>()
    const [active, setActive] = useState(0);

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetAllFundCollectDetailQuery({ type: (new Date().getMonth() + 1).toString() });
    const [CreateFundCollectMutation, { isLoading: isLoading1 }] = useCreateFundCollectMutation();
    const [CreateFundCollectDetailMutation, { isLoading: isLoading2 }] = useCreateFundCollectDetailMutation();

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            if (response && response.errCode === 0) {
                setData(response?.data);
                if (active === 0) {
                    setPlayers(response?.data?.success)
                } else if (active === 1) {
                    setPlayers(response?.data?.failed)
                } else {
                    setPlayers(response?.data?.free)
                }
                setMoney(response?.data?.fundCollect.amount.toString());
                setDescription(response?.data?.fundCollect.description);
            } else {
                CreateFundCollectMutation({ time: new Date(), amount: 0, description: null })
                    .unwrap()
                    .then(res => {
                        console.log(res);
                        if (res.errCode === 0) {
                            refetch()
                        } else {
                            Alert.alert('Tạo thông tin đóng quỹ thất bại');
                        }
                    })
                    .catch(err => {
                        console.log(err);
                        Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
                    });
            }
        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };
    const handleUpdateMoney = () => {
        CreateFundCollectMutation({ time: data?.fundCollect.time, amount: money, description: data?.fundCollect.description })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Cập nhật thông tin đóng quỹ thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal1();
    }
    const handleCancelUpdate = () => {
        setMoney(data?.fundCollect.amount.toString());
        toggleModal1();
    }

    const handelUpdateDescription = () => {
        CreateFundCollectMutation({ time: data?.fundCollect.time, amount: data?.fundCollect.amount, description: description })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Cập nhật thông tin đóng quỹ thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const handleActive = () => {
        setActive(0);
        setPlayers(data?.success);
    }
    const handleNotActive = () => {
        setActive(1);
        setPlayers(data?.failed);
    }

    const handleFree = () => {
        setActive(2);
        setPlayers(data?.free);
    }

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const [playerClick, setPlayerClick] = useState<any>();
    const handlePressThreeDot = (player: any) => {
        setPlayerClick(player);
        toggleModal2();
    }


    const handleUpdateFree = () => {
        CreateFundCollectDetailMutation({ fundCollectId: data?.fundCollect.id, playerId: playerClick?.id, status: 2 })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    // refetch()
                } else {
                    Alert.alert('Cập nhật thông tin đóng quỹ của thành viên thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2();
    }
    const handleUpdateStatus = (status: any) => {
        CreateFundCollectDetailMutation({ fundCollectId: data?.fundCollect.id, playerId: playerClick?.id, status: status })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    // refetch()
                } else {
                    Alert.alert('Cập nhật thông tin đóng quỹ của thành viên thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2();
    }
    return (
        <View>
            <Spinner visible={isLoadingQuery || isLoading1 || isLoading2} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Đóng quỹ tháng {new Date().getMonth() + 1}</Text>
            </LinearGradient>
            <View style={styles.bodyContainer}>
                <View style={styles.bodyContainerHeader}>
                    <View style={styles.bodyContainerHeaderMoney}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: '#18392B'
                        }}>Mỗi thành viên: </Text>
                        <Text style={{ fontSize: 20, color: 'red', fontWeight: "700", marginLeft: 14 }}>{data?.fundCollect.amount}</Text>
                        <TouchableOpacity style={{
                            position: 'absolute',
                            right: 20
                        }} onPress={toggleModal1}>
                            <FontAwesome5Icon size={20} name="pencil-alt" />
                        </TouchableOpacity>
                    </View>
                    <TextInput
                        style={styles.inputDescription}
                        defaultValue={data?.fundCollect.description === null ? undefined : data?.fundCollect.description}
                        placeholder="Ghi chú thêm nếu có...."
                        placeholderTextColor={"#999DA0"}
                        underlineColor="#ddd"
                        activeUnderlineColor="green"
                        onChangeText={text => setDescription(text)}
                        onSubmitEditing={handelUpdateDescription} />
                    <View style={styles.totalWrap}>
                        <Text style={{ fontSize: 18, fontWeight: "600" }}>Đã thu được:     <Text style={{ color: '#000', fontWeight: "800" }}>{data?.fundCollect.total}</Text></Text>
                    </View>
                    <View style={styles.endWrap}>
                        <View style={styles.endWrapHeader}>
                            <TouchableOpacity style={[styles.endWrapHeaderItem, active === 0 ? styles.activeWrap : null]} onPress={handleActive}>
                                <Text style={[styles.endWrapHeaderItemText, active === 0 ? styles.activeText : null]}>Đã đóng</Text>
                                <View style={[styles.endWrapHeaderItemEnd, active === 0 ? styles.activeBackground : null]}>
                                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: "600" }}>{data?.success.length}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.endWrapHeaderItem, active === 1 ? styles.activeWrap : null]} onPress={handleNotActive}>
                                <Text style={[styles.endWrapHeaderItemText, active === 1 ? styles.activeText : null]}>Chưa đóng</Text>
                                <View style={[styles.endWrapHeaderItemEnd, active === 1 ? styles.activeBackground : null]} >
                                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: "600" }}>{data?.failed.length}</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.endWrapHeaderItem, active === 2 ? styles.activeWrap : null]} onPress={handleFree}>
                                <Text style={[styles.endWrapHeaderItemText, active === 2 ? styles.activeText : null]}>Được miễn</Text>
                                <View style={[styles.endWrapHeaderItemEnd, active === 2 ? styles.activeBackground : null]} >
                                    <Text style={{ fontSize: 16, color: '#fff', fontWeight: "600" }}>{data?.free.length}</Text>
                                </View>
                            </TouchableOpacity>
                        </View>
                        {players?.length === 0 ? active !== 0 ? (<View style={{
                            margin: 'auto'
                        }}>
                            <Text style={{ fontSize: 19, fontWeight: 400 }}>{active === 1 ? 'Tất cả thành viên đã đóng quỹ' : 'Không có thành viên nào được miễn'}</Text>
                        </View>) : (<View style={{
                            margin: 'auto'
                        }}>
                            <Text style={{ fontSize: 19, fontWeight: 400 }}>Chưa có thành viên nào đóng quỹ</Text>
                        </View>) :
                            (<ScrollView style={styles.scrollWrap} bounces={false}>
                                {players?.map((player, index) => (
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
                                        <TouchableOpacity style={{
                                            alignSelf: 'flex-start',
                                        }}>
                                            <Entypo name="dots-three-vertical" color="#1877f2" size={20} onPress={handlePressThreeDot.bind(this, player)} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </ScrollView>)}

                    </View>
                </View>
            </View>
            {/* Model cập nhật Money */}
            <Modal
                isVisible={isModalVisible1}
                onBackdropPress={handleCancelUpdate}
                onBackButtonPress={handleCancelUpdate}
                backdropOpacity={0.3}
                onSwipeComplete={handleCancelUpdate}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5, borderRadius: 50, alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper}>
                    <View style={{
                        paddingBottom: 10,
                        paddingTop: 10,
                        paddingLeft: 20,
                        paddingRight: 10,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: '#000',
                            textAlign: 'center',
                        }}>Đóng quỹ tháng {new Date().getMonth() + 1}</Text>
                    </View>
                    <View >
                        <TextInput
                            style={styles.inputMoney}
                            defaultValue={money}
                            maxLength={10}
                            keyboardType="numeric"
                            activeUnderlineColor="green"
                            onChangeText={(text) => setMoney(text)} />
                    </View>
                    <View style={styles.postOptionWrapperEnd}>
                        <TouchableOpacity onPress={handleUpdateMoney}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Xác nhận
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelUpdate}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Hủy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Modal Option Player */}
            <Modal
                isVisible={isModalVisible2}
                onBackdropPress={toggleModal2}
                onBackButtonPress={toggleModal2}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal2}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    flex: 1,
                    justifyContent: 'flex-end',
                }}>
                <View style={styles.playerOptionsWrapper}>
                    <TouchableOpacity style={styles.playerOptionsWrapperItem} onPress={() => handleUpdateStatus(active === 0 ? 1 : 0)}>
                        <MaterialCommunityIcons
                            name="account-edit-outline"
                            size={26}></MaterialCommunityIcons>

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700
                        }}><Text style={{ color: '#0047bb' }}>{playerClick?.name}</Text> {active === 0 ? 'chưa' : 'đã'} đóng quỹ</Text>
                    </TouchableOpacity>
                    {active !== 2 ? (<TouchableOpacity style={styles.playerOptionsWrapperItem} onPress={handleUpdateFree}>
                        <MaterialCommunityIcons
                            name="account-remove-outline"
                            size={26}></MaterialCommunityIcons>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700
                        }}><Text style={{ color: '#0047bb' }}>{playerClick?.name}</Text> là thành viên được miễn đóng quỹ</Text>
                    </TouchableOpacity>)
                        : (<TouchableOpacity style={styles.playerOptionsWrapperItem} onPress={() => handleUpdateStatus(1)}>
                            <MaterialCommunityIcons
                                name="account-remove-outline"
                                size={26}></MaterialCommunityIcons>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 700
                            }}><Text style={{ color: '#0047bb' }}>{playerClick?.name}</Text> chưa đóng quỹ</Text>
                        </TouchableOpacity>)}
                </View>
            </Modal>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff',
        marginBottom: 50,
    },
    navigationBar: {
        paddingTop: 12,
        flexDirection: 'row',
        height: 58,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        paddingHorizontal: 10,
    },
    btnBack: {
        width: 50,
        alignItems: 'center',
    },
    textNavigationBar: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
        marginLeft: 15,
    },
    bodyContainer: {
        paddingTop: 0,
        height: SCREEN_HEIGHT - 110, //navigation bar searchTool
    },
    bodyContainerHeader: {
        marginVertical: 12,
        marginHorizontal: 12
    },
    bodyContainerHeaderMoney: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8
    },
    postOptionsWrapper: {
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#F0F8FF',
        width: SCREEN_WIDTH - 60,
    },
    postOptionWrapperEnd: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 140,
        paddingRight: 50,
    },
    inputMoney: {
        height: 40,
        borderRadius: 10,
        marginHorizontal: 14,
        marginBottom: 6,
        backgroundColor: '#F0F8FF',
        textAlign: 'center',
        color: '#000',
        fontSize: 19,
        fontWeight: "600"
    },
    inputDescription: {
        marginVertical: 6,
        height: 46,
        textAlign: 'left',
        fontSize: 16,
        color: '#000',
        backgroundColor: 'rgb(242, 242, 242)',
    },
    totalWrap: {
        marginVertical: 8
    },
    endWrap: {
        backgroundColor: '#fff',
        height: SCREEN_HEIGHT - 240,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    endWrapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    endWrapHeaderItem: {
        flexDirection: 'row',
        gap: 3,
        justifyContent: 'center',
        width: '33%',
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#ddd'
    },
    endWrapHeaderItemText: {
        fontSize: 18,
        fontWeight: "700"
    },
    endWrapHeaderItemEnd: {
        backgroundColor: '#ddd',
        borderRadius: 2000,
        alignItems: 'center',
        textAlign: 'center',
        height: 22,
        width: 22,
    },
    activeWrap: {
        borderBottomColor: '#1877f2'
    },
    activeText: {
        color: '#1877f2'
    },
    activeBackground: {
        backgroundColor: '#1877f2'
    },
    scrollWrap: {

    },
    playerWrapBodyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 4,
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
    scrollModal: {

    },
    modalWrapBodyItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 12,
        marginHorizontal: 10
    },
    modalWrapBodyItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10
    },
})

export default ContributeFundScreen;