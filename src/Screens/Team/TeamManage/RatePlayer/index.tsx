import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from "@/Routes/Stack";
import { useEffect, useState } from "react";
import { TextInput } from 'react-native-paper';
import CheckBox from "@react-native-community/checkbox";
import Spinner from "react-native-loading-spinner-overlay";
import DatePicker from 'react-native-date-picker'
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useCreateMatchDetailsByTitleMutation, useGetMatchByDateQuery, useGetMatchDetailsByTitleQuery, useGetMatchDetailsQuery } from "@/Redux/api/match";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import { useGetListPlayerQuery } from "@/Redux/api/player";
import Modal from 'react-native-modal';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import CounterInput from "react-native-counter-input";

const RatePlayerScreen = () => {

    const [data, setData] = useState();
    const [date, setDate] = useState(new Date());

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        refetch,
    } = useGetMatchByDateQuery({ time: date.getFullYear() + '-0' + (date.getMonth() + 1) + '-' + date.getDate() });

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

    const [matchSearchId, setMatchSearchId] = useState<any>(0);
    const [matchDetailData, setMatchDetailData] = useState<any>();

    const {
        data: response1,
        isSuccess: isSuccess1,
        isLoading: isLoadingQuery1,
        refetch: refetch1,
    } = useGetMatchDetailsByTitleQuery({ id: matchSearchId });

    useEffect(() => {
        if (isSuccess1) {
            console.log('response:', response1);
            setMatchDetailData(response1?.data);
            // setPlayers(response.data?.players)
            // setTotal(response.data?.count)
        }
    }, [response1, isSuccess1]);
    useFocusEffect(
        React.useCallback(() => {
            refetch1();
        }, [refetch1]),
    );

    const [playerData, setPlayerData] = useState<any>();
    const {
        data: response2,
        isSuccess: isSuccess2,
        isLoading: isLoadingQuery2,
        refetch: refetch2,
    } = useGetListPlayerQuery();

    useEffect(() => {
        if (isSuccess2) {
            console.log('response:', response2);
            setPlayerData(response2?.data?.players);
            // setPlayers(response.data?.players)
            // setTotal(response.data?.count)
        }
    }, [response2, isSuccess2]);
    useFocusEffect(
        React.useCallback(() => {
            refetch2();
        }, [refetch2]),
    );

    const [CreateMatchDetailsByTitleMutation, { isLoading: isLoading1 }] = useCreateMatchDetailsByTitleMutation();


    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };
    const [openDatePicker, setOpenDatePicker] = useState(false)


    const handleSelectDropdownMatch = (id: any) => {
        setMatchSearchId(id);
    }

    const [isModalVisible3, setModalVisible3] = useState(false);

    const toggleModal3 = () => {
        setDataUpdate([])
        setModalVisible3(!isModalVisible3);
    };

    const [isModalVisible4, setModalVisible4] = useState(false);

    const toggleModal4 = () => {
        setDataUpdate([])
        setModalVisible4(!isModalVisible4);
    };

    const handleModal = (typeSelect: any) => {
        setType(typeSelect);
        toggleModal3();
    }

    const handleModalAttitude = () => {
        setType('badAttitude');
        toggleModal4();
    }

    const [dataUpdate, setDataUpdate] = useState([])

    const handleCreateMatchDetail = () => {
        CreateMatchDetailsByTitleMutation({ matchId: matchSearchId, type: type, data: dataUpdate })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Cập nhật đánh giá cầu thủ thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        if (isModalVisible3) {
            toggleModal3();
        } else {
            toggleModal4();
        }
    }

    const handleChangeDataUpdate = (counter: any, playerId: any) => {
        let index = dataUpdate.findIndex((element) => element.playerId === playerId)
        if (index === -1) {
            dataUpdate.push({ playerId: playerId, value: counter })
            setDataUpdate(dataUpdate);
        }
        else {
            dataUpdate[index].value = counter;
            setDataUpdate(dataUpdate);
        }
        console.log(dataUpdate)
    }
    const [type, setType] = useState<any>();

    const AttitudeTitle = [
        { title: 'Ra sân đấu muộn' },
        { title: 'Gây gổ, đá xấu' },
        { title: 'Không chuyên nghiệp' },
        { title: 'Bùng kèo, không đi đá' },
    ];

    const handleSelectDropdownAttitudeTitle = (attitudeTitleIndex: any, playerId: any) => {
        let index = dataUpdate.findIndex((element) => element.playerId === playerId)
        if (index === -1) {
            dataUpdate.push({ playerId: playerId, value: AttitudeTitle[attitudeTitleIndex].title })
            setDataUpdate(dataUpdate);
        }
        else {
            dataUpdate[index].value = AttitudeTitle[attitudeTitleIndex].title;
            setDataUpdate(dataUpdate);
        }
        console.log(dataUpdate)
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery || isLoadingQuery1 || isLoadingQuery2 || isLoading1} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Đánh giá thành viên</Text>
            </LinearGradient>
            <View style={styles.bodyContainer}>
                <View style={{ alignItems: 'center', justifyContent: 'center', flexDirection: 'row', gap: 14, marginBottom: 16 }}>
                    <Text style={{ fontSize: 18, fontWeight: 600, color: '#000' }}>Đánh giá ngày?</Text>
                    <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                        <Text style={{
                            color: '#1877f2',
                            textDecorationLine: 'underline',
                            fontSize: 18,
                            fontWeight: 900
                        }}>{date.toLocaleDateString()}</Text>
                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: 'flex-end', marginBottom: 24 }}>
                    <SelectDropdown
                        data={data}
                        onSelect={(selectedItem, index) => handleSelectDropdownMatch(selectedItem.id)}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && (selectedItem.result + '  ' + selectedItem.goal + '-' + selectedItem.lostGoal)) || 'Chọn trận đấu'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Text style={styles.dropdownItemTxtStyle}>{item.result + '  ' + item.goal + '-' + item.lostGoal}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />
                </View>

                <TouchableOpacity style={matchSearchId !== 0 ? styles.itemWrap2 : styles.itemWrapdisable} disabled={matchSearchId !== 0 ? false : true} onPress={() => handleModal('goal')}>
                    <Text style={{ fontSize: 18, color: '#1877f2', fontWeight: 700 }}>Ghi bàn</Text>
                </TouchableOpacity>
                <TouchableOpacity style={matchSearchId !== 0 ? styles.itemWrap2 : styles.itemWrapdisable} disabled={matchSearchId !== 0 ? false : true} onPress={() => handleModal('assist')}>
                    <Text style={{ fontSize: 18, color: '#1877f2', fontWeight: 700 }}>Kiến tạo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={matchSearchId !== 0 ? styles.itemWrap2 : styles.itemWrapdisable} disabled={matchSearchId !== 0 ? false : true} onPress={handleModalAttitude}>
                    <Text style={{ fontSize: 18, color: '#1877f2', fontWeight: 700 }}>Thái độ, kỉ luật không tốt</Text>
                </TouchableOpacity>
                <TouchableOpacity style={matchSearchId !== 0 ? styles.itemWrap2 : styles.itemWrapdisable} disabled={matchSearchId !== 0 ? false : true} onPress={() => handleModal('yellowCard')}>
                    <Text style={{ fontSize: 18, color: '#1877f2', fontWeight: 700 }}>Thẻ vàng</Text>
                </TouchableOpacity>
                <TouchableOpacity style={matchSearchId !== 0 ? styles.itemWrap2 : styles.itemWrapdisable} disabled={matchSearchId !== 0 ? false : true} onPress={() => handleModal('redCard')}>
                    <Text style={{ fontSize: 18, color: '#1877f2', fontWeight: 700 }}>Thẻ đỏ</Text>
                </TouchableOpacity>

            </View>
            <View style={styles.endContainer}>
                <TouchableOpacity style={{
                    backgroundColor: '#1877f2',
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    width: '50%',
                    marginTop: 4
                }}
                    onPress={() => navigation.navigate('StatisticRatePlayer')}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: "600"
                    }}>XEM THỐNG KÊ</Text>
                </TouchableOpacity>
            </View>
            <DatePicker
                modal
                open={openDatePicker}
                date={date}
                mode="date"
                onConfirm={(date) => {
                    setOpenDatePicker(false)
                    setDate(date)
                    setMatchSearchId(0)
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
            {/* Modal Guild */}
            <Modal isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal3}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 4,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={{
                    paddingBottom: 10,
                    backgroundColor: '#fff'
                }}>
                    <LinearGradient colors={['#DE6262', '#FFB88C']} style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={toggleModal3}
                            style={styles.btnBack}>
                            <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 12,
                            marginRight: 16,
                            textAlign: 'center'
                        }}>Cập nhật đánh giá cầu thủ</Text>
                    </LinearGradient>
                    <ScrollView style={{ height: SCREEN_HEIGHT - 200 }}>
                        {playerData?.map((player: any, index: any) => (
                            <View style={styles.playerWrap} key={index} >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    width: '40%'
                                }}>
                                    <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Avatarplayer.png")} />
                                    <View>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: 600 }}>{player.name}</Text>
                                        <Text style={{ color: '#1877f2' }}>{player.number}</Text>
                                    </View>
                                </View>
                                <CounterInput
                                    horizontal={true}
                                    min={0}
                                    initial={matchDetailData !== undefined && matchDetailData[type] ? matchDetailData[type][index] : 0}
                                    //initial={0}
                                    max={type === 'yellowCard' ? 2 : (type === 'redCard' ? 1 : 20)}
                                    onChange={(counter) => handleChangeDataUpdate(counter, player?.id)}
                                    reverseCounterButtons={true}
                                    style={{ width: '50%', height: 65, }}
                                />
                            </View>))}
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 36, marginHorizontal: 30, marginTop: 24, marginBottom: 16 }}>
                        <TouchableOpacity onPress={toggleModal3}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: 'red', textDecorationLine: 'underline' }}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreateMatchDetail}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: '#0047bb', textDecorationLine: 'underline' }}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >

            {/* Modal Attitude */}
            <Modal isVisible={isModalVisible4}
                onBackdropPress={toggleModal4}
                onBackButtonPress={toggleModal4}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal4}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 4,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={{
                    paddingBottom: 10,
                    backgroundColor: '#fff'
                }}>
                    <LinearGradient colors={['#DE6262', '#FFB88C']} style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={toggleModal4}
                            style={styles.btnBack}>
                            <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 12,
                            marginRight: 16,
                            textAlign: 'center'
                        }}>Cập nhật đánh giá cầu thủ</Text>
                    </LinearGradient>
                    <ScrollView style={{ height: SCREEN_HEIGHT - 200 }}>
                        {playerData?.map((player: any, index: any) => (
                            <View style={styles.playerWrap} key={index} >
                                <View style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    gap: 8,
                                    width: '40%'
                                }}>
                                    <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Avatarplayer.png")} />
                                    <View>
                                        <Text style={{ color: '#000', fontSize: 17, fontWeight: 600 }}>{player.name}</Text>
                                        <Text style={{ color: '#1877f2' }}>{player.number}</Text>
                                    </View>
                                </View>
                                <SelectDropdown
                                    data={AttitudeTitle}
                                    onSelect={(selectedItem, index) => handleSelectDropdownAttitudeTitle(index, player?.id)}
                                    defaultValueByIndex={(matchDetailData !== undefined && matchDetailData[type]) ? AttitudeTitle.findIndex((element) => element.title === matchDetailData[type][index]) : 4}
                                    renderButton={(selectedItem, isOpened) => {
                                        return (
                                            <View style={styles.dropdownButtonStyle1}>
                                                <Text style={styles.dropdownButtonTxtStyle}>
                                                    {(selectedItem && selectedItem.title) || 'Select Type'}
                                                </Text>
                                                <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                            </View>
                                        );
                                    }}
                                    renderItem={(item, index, isSelected) => {
                                        return (
                                            <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                                <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                            </View>
                                        );
                                    }}
                                    showsVerticalScrollIndicator={false}
                                    dropdownStyle={styles.dropdownMenuStyle}
                                />
                            </View>))}
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 36, marginHorizontal: 30, marginTop: 24, marginBottom: 16 }}>
                        <TouchableOpacity onPress={toggleModal4}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: 'red', textDecorationLine: 'underline' }}>Huỷ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCreateMatchDetail}>
                            <Text style={{ fontSize: 16, fontWeight: 600, color: '#0047bb', textDecorationLine: 'underline' }}>Cập nhật</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal >
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
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
    bodyContainer: {
        marginTop: 28,
        flex: 0.98
    },
    endContainer: {
        alignItems: 'center'
    },
    itemWrap2: {
        alignItems: 'center',
        borderRightWidth: 3,
        borderRightColor: 'green',
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        paddingVertical: 14,
        paddingLeft: 10,
        marginBottom: 20
    },
    itemWrapdisable: {
        alignItems: 'center',
        borderRightWidth: 3,
        borderRightColor: 'green',
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        paddingVertical: 14,
        paddingLeft: 10,
        marginBottom: 20,
        opacity: 0.5
    },
    dropdownButtonStyle1: {
        width: 200,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonStyle: {
        width: 200,
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
    },
    dropdownButtonTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
    },
    dropdownButtonIconStyle: {
        fontSize: 28,
        marginRight: 4,
    },
    dropdownMenuStyle: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle: {
        fontSize: 28,
        marginRight: 4,
    },
    playerWrap: {
        marginTop: 16,
        marginBottom: 4,
        marginHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 8,
    },
})

export default RatePlayerScreen;