import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import LinearGradient from 'react-native-linear-gradient';
import Entypo from 'react-native-vector-icons/Entypo';
import { useEffect, useState } from "react";
import Modal from 'react-native-modal';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { TextInput } from "react-native-paper";
import DatePicker from 'react-native-date-picker'
import { useChangeCaptainMutation, useDeletePlayerMutation, useGetListPlayerQuery } from "@/Redux/api/player";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useAddMatchMutation } from "@/Redux/api/match";

const TeamManageScreen = () => {
    const [data, setData] = useState();

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetListPlayerQuery();

    const [DeletePlayerMutation, { isLoading: isLoading2 }] = useDeletePlayerMutation();
    const [ChangeCaptainMutation, { isLoading: isLoading3 }] = useChangeCaptainMutation();
    const [AddMatchMutation, { isLoading: isLoading4 }] = useAddMatchMutation();

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            setData(response?.data);
            // setPlayers(response.data?.players)
            // setTotal(response.data?.count)
        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const options = [
        { label: 'Thắng', value: 'Thắng' },
        { label: 'Hoà', value: 'Hoà' },
        { label: 'Thua', value: 'Thua' },
    ];

    const [playerClick, setPlayerClick] = useState<any>();
    const [result, setResult] = useState<any>();
    const [goal, setGoal] = useState<any>();
    const [lostGoal, setLostGoal] = useState<any>();
    const [addInfomation, setAddInfomation] = useState<any>();

    const [numberError, setNumberError] = useState(false);
    const [numberLostGoalError, setNumberLostGoalError] = useState(false);

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.navigate('Home');
    };
    const [date, setDate] = useState(new Date())
    const [openDatePicker, setOpenDatePicker] = useState(false)
    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const handlePressThreeDot = (player: any) => {
        setPlayerClick(player);
        toggleModal1();
    }
    const handleChangCaptain = (id: any) => {
        console.log(id);
        ChangeCaptainMutation({ playerId: id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    toggleModal1();
                } else {
                    toggleModal1();
                    Alert.alert('Thay đổi đội trưởng thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal1();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const handleEditPlayer = (player: any) => {
        console.log(player.name);
        toggleModal1();
        navigation.navigate('UpdatePlayer',
            {
                id: player?.id,
                name: player?.name,
                number: player?.number,
                phone: player?.phone,
                isCaptain: player?.isCaptain
            }
        );
    }

    const handleDeletePlayer = () => {
        toggleModal1();
        toggleModal2();
    }
    const handleDelete = () => {
        DeletePlayerMutation({ playerId: playerClick?.id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Xoá cầu thủ thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2();
    }
    const handleCancelResult = () => {
        setResult(null);
        setGoal(null);
        setLostGoal(null);
        setAddInfomation(null);
    }
    const handleCreateResult = () => {
        if (!goal) {
            setNumberError(true);
            return;
        }
        if (!lostGoal) {
            setNumberLostGoalError(true);
            return;
        }
        AddMatchMutation({ result: result, goal: Number(goal), lostGoal: Number(lostGoal), time: date, description: addInfomation })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Tạo trận đấu thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });

        setResult(null);
        setGoal(null);
        setLostGoal(null);
        setAddInfomation(null);
        setNumberError(false);
        setNumberLostGoalError(false);
    }
    const navigateStatistic = () => {
        navigation.navigate('StatisticResult');
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery || isLoading2 || isLoading3 || isLoading4} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Quản lý đội bóng</Text>
            </LinearGradient>
            <ScrollView style={styles.bodyScroll} bounces={false}
                showsVerticalScrollIndicator={false}>
                <View style={styles.resultWrap}>
                    <LinearGradient
                        colors={['#bada55', '#16A085']}
                        style={styles.resultHeader}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 17,
                            fontWeight: '600'
                        }}>Kết quả thi đấu ngày?</Text>
                        <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                            <Text style={{
                                color: '#fff',
                                textDecorationLine: 'underline',
                                fontSize: 14
                            }}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={styles.resultWrapBody}>
                        <View style={{ marginVertical: 12 }}>
                            <RadioForm
                                formHorizontal={true}
                            >
                                {
                                    options.map((obj, i) => (
                                        <RadioButton labelHorizontal={true} key={i} >
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i}
                                                isSelected={result === obj.value}
                                                onPress={() => setResult(obj.value)}
                                                buttonInnerColor={'#2196f3'}
                                                buttonOuterColor={result === obj.value ? '#2196f3' : '#ddd'}
                                                buttonSize={10}
                                                buttonOuterSize={24}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 16 }}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={() => setResult(obj.value)}
                                                labelStyle={{ fontSize: 16, color: '#000', fontWeight: '600' }}
                                                labelWrapStyle={{}}
                                            />
                                        </RadioButton>
                                    ))
                                }
                            </RadioForm>
                        </View>
                        <View style={{ marginBottom: 8, marginHorizontal: 8, flexDirection: 'row', alignItems: 'center' }}>
                            <Text style={{ fontSize: 18, fontWeight: 700, color: '#18392B' }}>Tỉ số: </Text>
                            <TextInput
                                style={styles.input}
                                underlineColor="#000"
                                placeholder="?"
                                placeholderTextColor="#ddd"
                                keyboardType="numeric"
                                value={goal}
                                onChangeText={text => setGoal(text)}
                                error={numberError}
                                activeUnderlineColor="green" />
                            <Text style={{ fontSize: 16, fontWeight: 700, color: '#18392B' }}>-</Text>
                            <TextInput
                                style={styles.input}
                                underlineColor="#000"
                                placeholder="?"
                                placeholderTextColor="#ddd"
                                keyboardType="numeric"
                                value={lostGoal}
                                onChangeText={text => setLostGoal(text)}
                                error={numberLostGoalError}
                                activeUnderlineColor="green" />
                        </View>
                        {result ? (<View style={styles.resultAddInfomation}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: '#18392B' }}>Mô tả thêm (tuỳ chọn)</Text>
                            <TextInput
                                style={{
                                    height: 36,
                                    marginHorizontal: 12,
                                    marginBottom: 10,
                                    backgroundColor: '#fff',
                                }}
                                underlineColor="#ddd"
                                placeholder="Ví dụ: đối thủ thi đấu?, giải đấu?...vv"
                                placeholderTextColor="#ddd"
                                value={addInfomation}
                                onChangeText={text => setAddInfomation(text)}
                                // error={nameError}
                                activeUnderlineColor="green" />
                            <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 36, marginHorizontal: 30, marginTop: 24, marginBottom: 16 }}>
                                <TouchableOpacity onPress={handleCancelResult}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: 'red', textDecorationLine: 'underline' }}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCreateResult}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#0047bb', textDecorationLine: 'underline' }}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>
                        </View>) : (<></>)}

                    </View>
                </View>
                <TouchableOpacity style={styles.touchableOpacityItem} onPress={navigateStatistic}>
                    <Text style={styles.touchableOpacityText}>Thống kê kết quả thi đấu</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchableOpacityItem} onPress={() => { navigation.navigate('RatePlayer') }}>
                    <Text style={styles.touchableOpacityText}>Đánh giá thành viên</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.touchableOpacityItem} onPress={() => { navigation.navigate('TeamProfile') }}>
                    <Text style={styles.touchableOpacityText}>Hồ sơ đội bóng</Text>
                </TouchableOpacity>
                <View style={styles.playerWrap}>
                    <LinearGradient
                        colors={['#bada55', '#16A085']}
                        style={styles.playerHeader}>
                        <View style={{
                            flexDirection: 'row',
                            gap: 13
                        }}>
                            <Text style={{
                                color: '#fff',
                                fontSize: 17,
                                fontWeight: '600'
                            }}>Thành viên</Text>
                            <View style={{
                                borderRadius: 2000,
                                backgroundColor: '#0047bb',
                                height: 22,
                                width: 22,
                                alignItems: 'center'
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#fff',
                                }}>{data?.count}</Text>
                            </View>
                        </View>
                        <TouchableOpacity onPress={() => navigation.navigate('AddPlayer')}>
                            <Text style={{
                                color: '#fff',
                                textDecorationLine: 'underline',
                                fontSize: 14
                            }}>Thêm thành viên</Text>
                        </TouchableOpacity>
                    </LinearGradient>
                    <View style={styles.playerWrapBody}>
                        {data?.players.map((player: any, index: any) => (
                            <View key={index} style={styles.playerWrapBodyItem}>
                                <View style={styles.playerWrapBodyItemHeader}>
                                    <Text style={{
                                        color: '#fff',
                                        fontSize: 15,
                                        fontWeight: 600,
                                        paddingVertical: 10,
                                        textAlign: 'center'
                                    }}>{player.name}</Text>
                                    <TouchableOpacity style={{
                                        position: "absolute",
                                        right: 0,
                                        top: 10
                                    }} onPress={handlePressThreeDot.bind(this, player)}>
                                        <Entypo name="dots-three-vertical" color="#fff" size={20} />
                                    </TouchableOpacity>
                                    <View >
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
                                            right: -2,
                                            position: 'absolute',
                                        }} source={require("@/Assets/Images/CaptainIcon.png")} />) : (<></>)}
                                    </View>
                                </View>
                                <View style={styles.playerWrapBodyItemBody}>
                                    <Text style={{ fontSize: 16 }}>Số áo: <Text style={{ color: '#000', fontSize: 16, fontWeight: 900 }}>{player.number}</Text></Text>
                                </View>
                            </View>
                        ))}
                    </View>
                </View>
            </ScrollView>
            {/* Modal Option Player */}
            <Modal
                isVisible={isModalVisible1}
                onBackdropPress={toggleModal1}
                onBackButtonPress={toggleModal1}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal1}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    flex: 1,
                    justifyContent: 'flex-end',
                }}>
                <View style={styles.postOptionsWrapper}>
                    <TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleEditPlayer.bind(this, playerClick)}>
                        <MaterialCommunityIcons
                            name="account-edit-outline"
                            size={26}></MaterialCommunityIcons>

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700
                        }}>Sửa thông tin của <Text style={{ color: '#0047bb' }}>{playerClick?.name}</Text></Text>
                    </TouchableOpacity>
                    {!playerClick?.isCaptain ? (<TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleChangCaptain.bind(this, playerClick?.id)}>
                        <MaterialCommunityIcons
                            name="account-star-outline"
                            size={26}></MaterialCommunityIcons>

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700
                        }}>Chọn <Text style={{ color: '#0047bb' }}>{playerClick?.name}</Text> làm đội trưởng</Text>
                    </TouchableOpacity>) : (<></>)}
                    <TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleDeletePlayer}>
                        <MaterialCommunityIcons
                            name="account-remove-outline"
                            size={26}
                            color={'red'}></MaterialCommunityIcons>
                        <Text style={{
                            color: 'red',
                            fontSize: 16,
                            fontWeight: 700
                        }}>Xoá {playerClick?.name} khỏi danh sách đội bóng</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {/* Modal Accept Delete */}
            <Modal isVisible={isModalVisible2}
                onBackdropPress={toggleModal2}
                onBackButtonPress={toggleModal2}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal2}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper2}>
                    <View style={styles.postOptionItemWrapper2}>
                        <Text
                            style={{
                                fontSize: 17,
                                fontWeight: '700',
                                color: '#000',
                            }}>
                            Xoá {playerClick?.name} khỏi đội bóng
                        </Text>
                    </View>
                    <View style={styles.postOptionItemWrapper2}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '400',
                                color: '#000',
                            }}>
                            Bạn có chắc chắn muốn xoá <Text style={{ fontWeight: 700 }}>{playerClick?.name}</Text> khỏi đội bóng?
                        </Text>
                    </View>
                    <View style={styles.postOptionWrapperEnd2}>
                        <TouchableOpacity onPress={handleDelete}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Xoá
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal2}>
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
            <DatePicker
                modal
                open={openDatePicker}
                date={date}
                mode="date"
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: 50,
    },
    navigationBar: {
        paddingTop: 12,
        flexDirection: 'row',
        height: 64,
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
    bodyScroll: {
        paddingTop: 0,
        height: SCREEN_HEIGHT - 70, //navigation bar searchTool
    },
    resultWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 4,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    resultHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    resultWrapBody: {
        backgroundColor: '#fff',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        marginHorizontal: 12,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    resultAddInfomation: {
        marginLeft: 6,
        marginBottom: 8
    },
    touchableOpacityItem: {
        alignItems: 'center',
        borderRightWidth: 3,
        borderRightColor: 'green',
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        paddingVertical: 10,
        paddingLeft: 10,
        marginVertical: 10
    },
    touchableOpacityText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000'
    },
    playerWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 4,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    playerHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    playerWrapBody: {
        flexWrap: 'wrap',
        flexDirection: 'row',
        backgroundColor: '#ddd',
        marginVertical: 8,
        marginHorizontal: 6,
        justifyContent: 'space-between'
    },
    playerWrapBodyItem: {
        width: '45%',
        margin: 8,
        alignItems: 'center',
        borderRadius: 5,
        backgroundColor: '#006C67',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,

        elevation: 5,
        position: "relative"
    },
    playerWrapBodyItemHeader: {
        backgroundColor: '#006C67',
        alignItems: 'center',
        width: '100%'
    },
    playerWrapBodyItemBody: {
        backgroundColor: '#fff',
        width: '100%',
        alignItems: 'center',
        borderBottomEndRadius: 5,
        borderBottomStartRadius: 5,
        paddingVertical: 10
    },
    postOptionsWrapper: {
        paddingTop: 16,
        paddingBottom: 10,
        paddingHorizontal: 20,
        backgroundColor: '#F0F8FF',
    },
    postOptionsWrapperItem: {
        marginVertical: 14,
        flexDirection: 'row',
        gap: 5,
        alignItems: 'center'
    },
    postOptionsWrapperItemText: {
        fontSize: 16,
        fontWeight: 600
    },
    postOptionsWrapper2: {
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH - 60,
    },
    postOptionItemWrapper2: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 10,
    },
    postOptionWrapperEnd2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 140,
        paddingRight: 50,
    },
})

export default TeamManageScreen;