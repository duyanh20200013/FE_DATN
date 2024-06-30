import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Image, Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import React from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { Linking } from 'react-native';
import Modal from 'react-native-modal';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { useDeleteMatchFindMutation, useEditMatchFindMutation, useGetMatchFindsQuery } from "@/Redux/api/match";

const MatchFindOfTeamScreen = () => {
    const [data, setData] = useState();

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetMatchFindsQuery({ type: '0' });

    const [EditMatchFindMutation, { isLoading: isLoading2 }] = useEditMatchFindMutation();
    const [DeleteMatchFindMutation, { isLoading: isLoading3 }] = useDeleteMatchFindMutation();

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            setData(response?.data);
        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.navigate('Home')
    };

    const handlePhoneCall = (phoneNumber: any) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    const [mathFindIdSelect, setMatchFindIdSelect] = useState(0);
    const [mathFindStatus, setMatchFindStatus] = useState(0);

    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const handleAlertStatus = (id: number, status: number) => {
        setMatchFindIdSelect(id);
        setMatchFindStatus(status);
        toggleModal1();
    }

    const handleEditStatus = () => {
        EditMatchFindMutation({ matchFindId: mathFindIdSelect })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    toggleModal1();
                } else {
                    toggleModal1();
                    Alert.alert('Cập nhật trạng thái thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal1();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const handleDelete = () => {
        DeleteMatchFindMutation({ matchFindId: mathFindIdSelect })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    toggleModal2();
                } else {
                    toggleModal2();
                    Alert.alert('Xóa thông tin trận đấu thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal2();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const handleAlertDelete = (id: number) => {
        setMatchFindIdSelect(id);
        toggleModal2();
    }

    const dataRate = [
        { value: '50-50' },
        { value: '60-40' },
        { value: '70-30' },
        { value: '80-20' },
        { value: 'Thua chịu toàn bộ chi phí' },
    ]

    const dataLevel = [
        { value: 'Siêu gà, siêu yếu' },
        { value: 'Trung bình yếu' },
        { value: 'Trung bình' },
        { value: 'Trung bình khá' },
        { value: 'Trình độ phủi' },
        { value: 'Chuyên nghiệp' },
    ]

    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery || isLoading2 || isLoading3} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Các trận của team bạn</Text>
            </LinearGradient>
            {data && data.length !== 0 ? (<ScrollView style={styles.bodyContainer}>
                <TouchableOpacity
                    onPress={() => navigation.navigate('CreateMatchFind')}
                    style={{
                        alignItems: 'center',
                        flexDirection: 'row',
                        gap: 6,
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        width: 139,
                        backgroundColor: 'blue',
                        alignSelf: 'flex-end',
                        marginHorizontal: 12,
                        marginTop: 10,
                    }}>
                    <Icon
                        name="calendar-plus"
                        size={24}
                        color='#fff'
                    />
                    <Text style={{ fontSize: 18, fontWeight: 400, color: '#FFF' }}>Đăng thêm</Text>
                </TouchableOpacity>
                {data && data.map((matchFind: any, index: any) => (
                    <View key={index} style={styles.stadiumWrap}>
                        <View style={styles.stadiumWrapHeader}>
                            <View>
                                <Text>Tạo lúc {matchFind.createdAt.substring(11, 16)} {matchFind.createdAt.substring(8, 10)}/{matchFind.createdAt.substring(5, 7)}</Text>
                            </View>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <TouchableOpacity style={[
                                    styles.buttonCheck, matchFind.status === 1 ? styles.buttonCheckColorGreen : styles.buttonCheckColorBlue
                                ]} onPress={() => handleAlertStatus(matchFind.id, matchFind.status)}>
                                    <Icon
                                        name="calendar-check"
                                        size={24}
                                        color='#fff'
                                    />
                                    <Text style={{ color: '#fff' }}>{matchFind.status === 1 ? 'Chưa có đối' : 'Đã có đối'}</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleAlertDelete(matchFind.id)}>
                                    <Icon
                                        name="delete"
                                        size={28}
                                        color='red'
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            marginBottom: 14
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000',
                                fontWeight: "700",
                                marginBottom: 8
                            }}>Địa chỉ sân bóng</Text>
                            <Text>{matchFind.location}</Text>
                        </View>
                        <View style={styles.phoneWrap}>
                            <TouchableOpacity style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                            }}
                                onPress={() => handlePhoneCall(matchFind.phone)}
                            >
                                <FontAwesome5Icon size={16} color={'#1877f2'} name="phone" />
                                <Text
                                    style={{
                                        fontSize: 17,
                                        color: '#1877f2',
                                        paddingLeft: 10
                                    }}
                                >
                                    {matchFind.phone}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            marginBottom: 14
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000',
                                fontWeight: "700",
                                marginBottom: 8
                            }}>Ngày thi đấu</Text>
                            <Text style={{ fontSize: 20, fontWeight: 700, color: 'red' }}>{matchFind.end.substring(8, 10)}/{matchFind.end.substring(5, 7)}   <Text style={{ color: 'blue' }}>{matchFind.start.substring(11, 16)} - {matchFind.end.substring(11, 16)}</Text></Text>
                        </View>
                        {matchFind.price && matchFind.price !== null ?
                            (<View style={{
                                marginHorizontal: 10,
                                marginBottom: 14
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#000',
                                    fontWeight: "700",
                                    marginBottom: 8
                                }}>Chi phí ước tính (tùy chọn):</Text>
                                <Text style={{ color: 'red' }}>{matchFind.price}</Text>
                            </View>) :
                            (<></>)}
                        <View style={{
                            marginHorizontal: 10,
                            marginBottom: 14
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000',
                                fontWeight: "700",
                                marginBottom: 8
                            }}>Tỉ lệ chi phí: Thắng, Hòa, Thua:</Text>
                            <Text style={{ color: 'red', fontSize: 16, fontWeight: 500 }}>{dataRate[matchFind.rate - 1].value}</Text>
                        </View>
                        <View style={{
                            marginHorizontal: 10,
                            marginBottom: 14
                        }}>
                            <Text style={{
                                fontSize: 16,
                                color: '#000',
                                fontWeight: "400",
                                marginBottom: 8
                            }}>Cần tìm đối có trình độ:</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingRight: 12 }}>
                                <Text style={{ color: '#1877f2', fontSize: 16, fontWeight: 500 }}>{dataLevel[matchFind.level - 1].value}</Text>
                                <Text style={{ fontSize: 16, fontWeight: 500, color: 'green' }}>Sân 7</Text>
                            </View>
                        </View>
                        {matchFind.description && matchFind.description !== null ?
                            (<View style={{
                                marginHorizontal: 10,
                                marginBottom: 14
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: '#000',
                                    fontWeight: "700",
                                    marginBottom: 8
                                }}>Mô tả thêm (tùy chọn):</Text>
                                <Text>{matchFind.description}</Text>
                            </View>) : (<></>)}

                    </View>
                ))
                }
            </ScrollView >)
                : (<View style={{ height: SCREEN_HEIGHT - 120 }}>
                    <TouchableOpacity style={{ margin: 'auto' }} onPress={() => navigation.navigate('CreateMatchFind')}>
                        <Text style={{ fontSize: 19, fontWeight: 400, color: '#007AFF', textDecorationLine: 'underline' }}>Đăng thông báo tìm đối</Text>
                    </TouchableOpacity>
                </View>)}
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
                            Xác nhận
                        </Text>
                    </View>
                    <View style={styles.postOptionItemWrapper2}>
                        <Text
                            style={{
                                fontSize: 15,
                                fontWeight: '400',
                                color: '#000',
                            }}>
                            Bạn có chắc chắn muốn xoá thông tin trận này?
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
            {/* Modal Edit Status */}
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
                    <TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleEditStatus}>
                        <MaterialCommunityIcons
                            name="store-edit-outline"
                            size={26}></MaterialCommunityIcons>

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700
                        }}>Cập nhật trạng thái thành {mathFindStatus === 0 ? 'Chưa' : 'Đã'} có đối</Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View >
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
        height: SCREEN_HEIGHT - 120
    },
    stadiumWrap: {
        backgroundColor: '#fff',
        marginHorizontal: 12,
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    stadiumWrapHeader: {
        flexDirection: 'row',
        marginHorizontal: 10,
        marginVertical: 12,
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 2,
    },
    textNameStadium: {
        fontSize: 17,
        color: '#000',
        fontWeight: "700",
        width: SCREEN_WIDTH - 100
    },
    phoneWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 10,
        marginBottom: 14
    },
    buttonCheck: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        borderRadius: 20,
        paddingHorizontal: 10,
        paddingVertical: 4
    },
    buttonCheckColorGreen: {
        backgroundColor: 'green'
    },
    buttonCheckColorBlue: {
        backgroundColor: 'blue'
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
});

export default MatchFindOfTeamScreen;