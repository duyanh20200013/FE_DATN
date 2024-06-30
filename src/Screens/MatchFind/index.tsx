import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Image, Alert, Keyboard, TouchableWithoutFeedback, Linking } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { useGetMatchFindsQuery } from "@/Redux/api/match";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import DatePicker from "react-native-date-picker";

const MatchFindScreen = () => {

    const [data, setData] = useState();
    const [dataBackUp, setDataBackUp] = useState();

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetMatchFindsQuery({ type: '1' });

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            setData(response?.data);
            setDataBackUp(response?.data);
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

    const handleEye = (teamId: number) => {
        navigation.navigate('OtherTeam', { id: teamId })
    }

    const compare_date = (date1: any, date2: any) => {
        if (Date.parse(date1) < date2.getTime())
            return 1;
        else if (Date.parse(date1) > date2.getTime())
            return 2;
        else
            return 0;

    }

    const handleSearch = (text: any, dataQuery: any) => {
        let dataSearch: never[] | React.SetStateAction<undefined> = [];
        if (dataQuery && dataQuery.length > 0) {
            for (let i = 0; i < dataQuery.length; i++) {
                if (dataQuery[i].phone.includes(text) || dataQuery[i].location.includes(text) || dataQuery[i].MatchFindTeamData.name.includes(text) || dataLevel[dataQuery[i].level - 1].value.includes(text)) {
                    dataSearch.push(dataQuery[i]);
                }
            }
        }
        setData(dataSearch);
    }

    const handleUpdateTimeSearch = (date: any, status: any) => {
        let dataBackUp1: never[] | React.SetStateAction<undefined> = [];
        if (response?.data && response?.data.length > 0) {
            for (let i = 0; i < response?.data.length; i++) {
                if (status === 1) {
                    if (compare_date(response?.data[i].end, date) === 2) {
                        if (!end || (end && compare_date(response?.data[i].start, end) === 1)) {
                            dataBackUp1.push(response?.data[i]);
                        }
                    }
                } else {
                    if (compare_date(response?.data[i].start, date) === 1) {
                        if (!start || (end && compare_date(response?.data[i].end, start) === 2)) {
                            dataBackUp1.push(response?.data[i]);
                        }
                    }
                }
            };
            setDataBackUp(dataBackUp1);
        }
        handleSearch(searchText, dataBackUp1);
        if (status === 1) {
            setStart(date);
            setOpenDatePicker1(false);
        } else {
            setEnd(date);
            setOpenDatePicker2(false);
        }

    }

    const handelCancelSearch = () => {
        setSearchText('');
        setData(dataBackUp);
    }

    const [searchText, setSearchText] = useState<any>('');
    const [openDatePicker1, setOpenDatePicker1] = useState(false);
    const [openDatePicker2, setOpenDatePicker2] = useState(false);
    const [start, setStart] = useState();
    const [end, setEnd] = useState();

    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Các trận cần tìm đối</Text>
            </LinearGradient>
            <View style={styles.bodyContainerSearch}>
                <FontAwesome5Icon name="search" color="#999DA0" size={20} />
                <TextInput
                    style={styles.input}
                    placeholder="Tìm theo đội, địa chỉ sân bóng, SĐT, trình độ..."
                    placeholderTextColor="#999DA0"
                    value={searchText}
                    onChangeText={text => setSearchText(text)}
                    returnKeyType="search"
                    onSubmitEditing={() => handleSearch(searchText, dataBackUp)}
                />
                <TouchableOpacity style={{ marginLeft: 16 }} onPress={handelCancelSearch}>
                    <Feather name="x" color="red" size={22} />
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <TouchableOpacity style={{
                    width: '45%',
                    backgroundColor: '#fff',
                    marginLeft: 12,
                    marginTop: 10,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 8
                }} onPress={() => setOpenDatePicker1(true)}>
                    <Text style={{ fontSize: 17, fontWeight: 400 }}>{start === undefined ? 'Từ ngày' : start.getDate().toString() + '/' + (start.getMonth() + 1).toString()}</Text>
                    <MaterialCommunityIcons size={24} color={'#ddd'} name="calendar-month" />
                </TouchableOpacity>
                <TouchableOpacity style={{
                    width: '45%',
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
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                    paddingHorizontal: 8,
                    paddingVertical: 8
                }} onPress={() => setOpenDatePicker2(true)}>
                    <Text style={{ fontSize: 17, fontWeight: 400 }}>{end === undefined ? 'Đến ngày' : end.getDate().toString() + '/' + (end.getMonth() + 1).toString()}</Text>
                    <MaterialCommunityIcons size={24} color={'#ddd'} name="calendar-month" />
                </TouchableOpacity>
            </View>
            {data && data.length !== 0 ? (<ScrollView style={styles.bodyContainer}>
                <View></View>
                {data && data.map((matchFind: any, index: any) => (
                    <View key={index} style={styles.stadiumWrap}>
                        <View style={styles.stadiumWrapHeader}>
                            <View style={styles.stadiumWrapHeaderItem}>
                                {
                                    matchFind.MatchFindTeamData.image ?
                                        (<Image style={styles.avatar} source={{ uri: matchFind.MatchFindTeamData.image }} />)
                                        : (<Image style={styles.avatar} source={require("@/Assets/Images/DefaultTeam.png")} />)
                                }
                                <Text style={styles.textNameTeam}>{matchFind.MatchFindTeamData.name}</Text>
                            </View>
                            <TouchableOpacity style={styles.btnEye} onPress={() => handleEye(matchFind.teamId)}>
                                <MaterialCommunityIcons size={20} color={'#1877f2'} name="eye" />
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
                    <View style={{ margin: 'auto' }}>
                        <Text style={{ fontSize: 19, fontWeight: 400, color: '#007AFF' }}>Chưa có trận nào</Text>
                    </View>
                </View>)}
            <DatePicker
                modal
                open={openDatePicker1}
                date={start !== undefined ? start : new Date()}
                mode="date"
                onConfirm={(date) => {
                    handleUpdateTimeSearch(date, 1)
                }}
                onCancel={() => {
                    setOpenDatePicker1(false)
                }}
            />
            <DatePicker
                modal
                open={openDatePicker2}
                date={end !== undefined ? end : new Date()}
                mode="date"
                onConfirm={(date) => {
                    handleUpdateTimeSearch(date, 2)
                }}
                onCancel={() => {
                    setOpenDatePicker2(false)
                }}
            />
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
    dropdownButtonStyle: {
        width: 240,
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
        marginRight: 6,
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
        marginRight: 8,
    },
    bodyContainer: {
        height: SCREEN_HEIGHT - 210,
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
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 10,
        marginVertical: 8
    },
    stadiumWrapHeaderItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatar: {
        height: 42,
        width: 42,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 2,
    },
    textNameTeam: {
        fontSize: 19,
        color: '#000',
        fontWeight: "700"
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
    stadiumWrapBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 10,
        marginBottom: 14
    },
    btnEye: {
        borderColor: '#fff',
        backgroundColor: '#ddd',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
        width: 45,
        height: 45,
        borderWidth: 2.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bodyContainerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#999DA0',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        marginLeft: 6,
        textAlign: 'left',
        backgroundColor: 'rgb(242, 242, 242)',
    },
});

export default MatchFindScreen;