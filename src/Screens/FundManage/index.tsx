import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Alert } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { useEffect, useState } from "react";
import DatePicker from 'react-native-date-picker'
import { TextInput } from "react-native-paper";
import { SCREEN_HEIGHT } from "@/Constants";
import Entypo from "react-native-vector-icons/Entypo";
import { useAddFundMutation, useDeleteFundMutation, useGetFundOfTeamQuery } from "@/Redux/api/fund";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const FundManageScreen = () => {
    const [data, setData] = useState<any>()

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetFundOfTeamQuery({ type: '0' });

    const [AddFundMutation, { isLoading: isLoading1 }] = useAddFundMutation();
    const [DeleteFundMutation, { isLoading: isLoading2 }] = useDeleteFundMutation();

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

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };

    const [date, setDate] = useState(new Date());
    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [fund, setFund] = useState<any>(0);
    const [addInfomation, setAddInfomation] = useState<any>();

    const [type, setType] = useState(0);

    const handleCancelFund = () => {
        setType(0);
        setFund(null);
        setAddInfomation(null);
    }
    const handleCreateFund = () => {
        AddFundMutation({ time: date, amount: Number(fund), description: addInfomation, type: type })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Tạo thông tin thu chi thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        setType(0);
        setFund(null);
        setAddInfomation(null);
    }

    const [idDelete, setIdDelete] = useState<any>(0);
    const handlePressThreeDot = (fund: any) => {
        if (fund.type !== 2) {
            setIdDelete(fund?.id);
            toggleModal2();
        } else {
            toggleModal1();
        }
    }


    const options = [
        { label: 'Chi', value: 0 },
        { label: 'Thu', value: 1 },
    ];

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const handleDeleteFund = () => {
        DeleteFundMutation({ id: idDelete })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Xóa thông tin thu chi thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2()
    }

    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };
    const handleNavigateToCollectStatistic = () => {
        toggleModal1();
        navigation.navigate('StatisticCollect')
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
                <Text style={styles.textNavigationBar}>Quản lý Quỹ</Text>
            </LinearGradient>
            <ScrollView style={styles.bodyContainer} bounces={false}>
                <View style={styles.overBalanceWrap}>
                    <View style={styles.overBalanceWrapItem1}>
                        <Text style={{
                            color: '#000',
                            fontSize: 19,
                            fontWeight: "700"
                        }}>Số dư hiện tại:   <Text style={{ color: 'red' }}>{data?.balance}</Text>  đ</Text>
                    </View>
                    <View style={styles.overBalanceWrapItem2}>
                        <Text style={{
                            fontSize: 15,
                            fontWeight: "700",
                            color: '#9599E2'
                        }}>Quỹ tháng {new Date().getMonth() + 1} đã thu:</Text>
                        <Text style={{ fontSize: 15, fontWeight: "700", color: 'red' }}>{data?.fundOfMonth}</Text>
                        <TouchableOpacity onPress={() => navigation.navigate('StatisticCollect')}>
                            <Text style={{ marginLeft: 8, fontSize: 15, fontWeight: "600", color: '#1877f2', textDecorationLine: 'underline' }}>Xem thống kê</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.createFundWrap}>
                    <View style={styles.createFundWrapHeader}>
                        <Text style={{
                            color: '#000',
                            fontSize: 17,
                            fontWeight: '600'
                        }}>Thu chi gì ngày?</Text>
                        <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                            <Text style={{
                                color: '#1877f2',
                                textDecorationLine: 'underline',
                                fontSize: 16
                            }}>{date.toLocaleDateString()}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.createFundWrapBody}>
                        <TextInput
                            style={styles.input}
                            underlineColor="#000"
                            placeholder="0"
                            placeholderTextColor="#999DA0"
                            keyboardType="numeric"
                            value={fund}
                            onChangeText={text => setFund(text)}
                            // error={numberError}
                            activeUnderlineColor="green" />
                        <Text style={{ color: '#000', fontSize: 19, fontWeight: "700", marginLeft: 24 }}>đ</Text>
                    </View>
                    {fund > 0 ?
                        (<View style={{ marginVertical: 12 }}>
                            <RadioForm
                                formHorizontal={true}
                            >
                                {
                                    options.map((obj, i) => (
                                        <RadioButton labelHorizontal={true} key={i} >
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i}
                                                isSelected={type === obj.value}
                                                onPress={() => setType(obj.value)}
                                                buttonInnerColor={'#2196f3'}
                                                buttonOuterColor={type === obj.value ? '#2196f3' : '#ddd'}
                                                buttonSize={10}
                                                buttonOuterSize={24}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 16 }}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i}
                                                labelHorizontal={true}
                                                onPress={() => setType(obj.value)}
                                                labelStyle={{ fontSize: 16, color: '#000', fontWeight: '600' }}
                                                labelWrapStyle={{}}
                                            />
                                        </RadioButton>
                                    ))
                                }
                            </RadioForm>
                        </View>) :
                        (<></>)}
                    <View style={styles.createFundAddInfomation}>
                        <Text style={{ fontSize: 16, fontWeight: 600, color: '#18392B' }}>Ghi chú thêm (tuỳ chọn)</Text>
                        <TextInput
                            style={{
                                height: 36,
                                marginHorizontal: 12,
                                marginBottom: 10,
                                backgroundColor: '#fff',
                            }}
                            underlineColor="#ddd"
                            placeholder="Ví dụ: Tiền sân nước, tiền thưởng, tiền phạt"
                            placeholderTextColor="#ddd"
                            value={addInfomation}
                            onChangeText={text => setAddInfomation(text)}
                            // error={nameError}
                            activeUnderlineColor="green" />
                        {fund > 0 ?
                            (<View style={{ flexDirection: 'row', justifyContent: 'flex-end', gap: 36, marginHorizontal: 30, marginTop: 24, marginBottom: 16 }}>
                                <TouchableOpacity onPress={handleCancelFund}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: 'red', textDecorationLine: 'underline' }}>Huỷ</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleCreateFund}>
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: '#0047bb', textDecorationLine: 'underline' }}>Cập nhật</Text>
                                </TouchableOpacity>
                            </View>) :
                            (<></>)
                        }
                    </View>
                </View>
                <View style={styles.fundInfoWrap}>
                    <TouchableOpacity onPress={() => navigation.navigate('StatisticEachMonth')}>
                        <Text style={{ fontSize: 15, fontWeight: "600", color: '#1877f2', textDecorationLine: 'underline', textAlign: 'right', marginVertical: 16 }}>Thống kê thu chi hàng tháng</Text>
                    </TouchableOpacity>
                    {/* <View style={{ marginVertical: 12 }}>
                        <Text style={{ textAlign: 'center', fontSize: 17 }}>Chưa có thông tin giao dịch</Text>
                    </View> */}
                    {data?.fund.map((info: any, index: any) => (
                        <View key={index} style={styles.fundInfoWrapItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                <Image style={styles.moneyImage} source={require("@/Assets/Images/Money4.png")} />
                                <View style={styles.funInfoWrapItemDetail}>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#000" }}>{info.type === 0 ? 'Chi:  ' : 'Thu:  '}{info.type === 0 ? (<Text style={{ color: '#5E1914' }}>{info.amount}</Text>) : (<Text style={{ color: '#1877f2' }}>{info.amount}</Text>)}</Text>
                                    {info.type !== 2 ? (<Text style={{ fontSize: 17, fontWeight: "600" }}>{info?.description}</Text>) : <Text style={{ fontSize: 17, fontWeight: "700", color: '#1877f2' }}>Quỹ tháng {new Date(info?.time).getMonth() + 1} đã thu</Text>}
                                    {info.type !== 2 ? (<Text style={{ fontSize: 15, fontWeight: "600", color: '#1877f2' }}>{new Date(info?.time).getDate()}/{new Date(info?.time).getMonth() + 1}/{new Date(info?.time).getFullYear()}</Text>) : <></>}
                                </View>
                            </View>
                            <TouchableOpacity style={{
                                alignSelf: 'flex-start',
                            }} onPress={handlePressThreeDot.bind(this, info)}>
                                <Entypo name="dots-three-vertical" color="#1877f2" size={20} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            </ScrollView>
            <View style={styles.endContainer}>
                <TouchableOpacity style={{
                    backgroundColor: '#1877f2',
                    borderRadius: 20,
                    paddingHorizontal: 20,
                    paddingVertical: 10,
                    width: '50%',
                    marginTop: 4
                }} onPress={() => navigation.navigate('ContributeFund')}>
                    <Text style={{
                        textAlign: 'center',
                        fontSize: 16,
                        color: '#fff',
                        fontWeight: "600"
                    }}>ĐÓNG QUỸ THÁNG {new Date().getMonth() + 1}</Text>
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
                }}
                onCancel={() => {
                    setOpenDatePicker(false)
                }}
            />
            {/* Modal Option Fund */}
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
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#F0F8FF',
                }}>
                    <TouchableOpacity style={{
                        marginVertical: 14,
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center'
                    }} onPress={handleDeleteFund}>
                        <MaterialCommunityIcons
                            name="delete"
                            size={26} color={'red'}></MaterialCommunityIcons>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: 'red'
                        }}>Xóa thông tin thu chi</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
            {/* Modal Option FundCollect */}
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
                <View style={{
                    paddingTop: 16,
                    paddingBottom: 10,
                    paddingHorizontal: 20,
                    backgroundColor: '#F0F8FF',
                }}>
                    <TouchableOpacity style={{
                        marginVertical: 14,
                        flexDirection: 'row',
                        gap: 5,
                        alignItems: 'center'
                    }} onPress={handleNavigateToCollectStatistic}>
                        <MaterialCommunityIcons
                            name="chart-bar"
                            size={26} color={'#1877f2'}></MaterialCommunityIcons>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#1877f2'
                        }}>Xem thống kê các tháng</Text>
                    </TouchableOpacity>
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
    overBalanceWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 6,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    overBalanceWrapItem1: {
        marginHorizontal: 12,
        marginVertical: 8,
        gap: 8,
        borderBottomColor: '#ddd',
        borderBottomWidth: 1,
        paddingBottom: 8
    },
    overBalanceWrapItem2: {
        marginHorizontal: 8,
        marginBottom: 24,
        marginTop: 12,
        flexDirection: 'row',
        gap: 8
    },
    createFundWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 6,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    createFundWrapHeader: {
        flexDirection: 'row',
        gap: 22,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 16
    },
    createFundWrapBody: {
        marginBottom: 8,
        marginHorizontal: 8,
        flexDirection: 'row',
        alignItems: 'center'
    },
    input: {
        height: 40,
        width: '50%',
        marginHorizontal: 12,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#fff',
    },
    createFundAddInfomation: {
        marginLeft: 12,
        marginBottom: 8,
        marginTop: 4
    },
    fundInfoWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 6,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        paddingHorizontal: 8,
        marginBottom: 20,
    },
    fundInfoWrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
        marginHorizontal: 4,
        marginVertical: 10,
        paddingBottom: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd'
    },
    moneyImage: {
        height: 36,
        width: 36,
        backgroundColor: '#fff',
        marginBottom: 12,
    },
    funInfoWrapItemDetail: {
        gap: 4,
    },
    endContainer: {
        alignItems: 'center'
    }
})


export default FundManageScreen;