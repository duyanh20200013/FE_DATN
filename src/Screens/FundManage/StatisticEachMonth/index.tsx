import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, processColor } from "react-native"
import LinearGradient from "react-native-linear-gradient"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { useEffect, useState } from "react";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { PieChart } from 'react-native-charts-wrapper';
// import PieChart from 'react-native-pie-chart'
import { LineChart } from 'react-native-charts-wrapper';
import { SCREEN_HEIGHT } from "@/Constants";
import { useGetFundOfTeamQuery } from "@/Redux/api/fund";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';


const StatisticEachMonthScreen = () => {
    const [data, setData] = useState<any>();
    const [infos, setInfos] = useState<any>();
    const timeTitle = [
        { title: 'Toàn thời gian' },
        { title: (new Date().getMonth() + 1).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth()).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth() - 1).toString() + '/' + (new Date().getFullYear()).toString() },
    ];
    const [timeSearch, setTimeSearch] = useState<any>(0);
    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetFundOfTeamQuery({ type: (timeTitle[timeSearch].title === 'Toàn thời gian') ? '0' : timeTitle[timeSearch].title.slice(0, timeTitle[timeSearch].title.indexOf('/')) });

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            setData(response?.data);
            setInfos(response?.data?.fund)
            // setPlayers(response.data?.players)
            // setTotal(response.data?.count)
        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );
    const titleWithIcons = [
        { title: 'Tất cả', icon: 'cash' },
        { title: 'Thu', icon: 'cash-plus' },
        { title: 'Chi', icon: 'cash-minus' },
    ];
    const [type, setType] = useState<any>(0);
    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };
    const handleSelectDropdown = (index: any) => {
        setType(index);
        if (index === 1) {
            const infosClone = data.fund.filter((item: any) => item.type !== 0)
            setInfos(infosClone);
            return;
        }
        if (index === 2) {
            const infosClone = data.fund.filter((item: any) => item.type === 0)
            setInfos(infosClone);
            return;
        }
        else {
            setInfos(data.fund);
        }
    }
    const handleSelectDropdownTime = (index: any) => {
        setTimeSearch(index);
        refetch();
    }
    return (
        <View>
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Thống kê thu chi hàng tháng</Text>
            </LinearGradient>
            <View>
                <View style={{ alignItems: 'flex-end' }}>
                    <SelectDropdown
                        data={timeTitle}
                        onSelect={(selectedItem, index) => handleSelectDropdownTime(index)}
                        defaultValue={timeTitle[timeSearch]}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.title) || 'Select your Type'}
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
                </View>
                <View style={styles.bodyContainerHeader}>
                    <View style={styles.bodyContainerHeaderLeft}>
                        <View style={styles.bodyContainerHeaderLeftItem}>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 500, color: '#000' }}>Tổng thu:</Text>
                            <View style={styles.bodyContainerHeaderLeftItemRight}>
                                <Text style={{ fontSize: 18, fontWeight: 600, color: 'blue' }}>{data?.totalCollect}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>đ</Text>
                            </View>
                        </View>
                        <View style={styles.bodyContainerHeaderLeftItem}>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 500, color: '#000' }}>Tổng chi:</Text>
                            <View style={styles.bodyContainerHeaderLeftItemRight}>
                                <Text style={{ fontSize: 18, fontWeight: 600, color: 'red' }}>{data?.totalSpend}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>đ</Text>
                            </View>
                        </View>
                        <View style={[styles.bodyContainerHeaderLeftItem, styles.bodyContainerHeaderLeftBorder]}>
                            <Text style={{ textDecorationLine: 'underline', fontSize: 16, fontWeight: 500, color: '#000' }}>Tổng:</Text>
                            <View style={styles.bodyContainerHeaderLeftItemRight}>
                                <Text style={{ fontSize: 18, fontWeight: 600, color: 'green' }}>{data?.totalCollect - data?.totalSpend}</Text>
                                <Text style={{ fontSize: 18, fontWeight: 600 }}>đ</Text>
                            </View>
                        </View>
                    </View>
                    <PieChart
                        style={{ flex: 1 }}
                        data={{
                            dataSets: [{
                                values: [
                                    { value: (data?.totalCollect * 100 / (data?.totalCollect + data?.totalSpend)) ? (data?.totalCollect * 100 / (data?.totalCollect + data?.totalSpend)) : 0, label: 'Thu' },
                                    { value: (data?.totalSpend * 100 / (data?.totalCollect + data?.totalSpend)) ? (data?.totalSpend * 100 / (data?.totalCollect + data?.totalSpend)) : 0, label: 'Chi' },
                                ],
                                label: '',
                                config: {
                                    colors: [processColor('blue'), processColor('red')],
                                    valueTextSize: 12,
                                    valueTextColor: processColor('#fff'),
                                    sliceSpace: 5,
                                    selectionShift: 13,
                                    valueFormatter: "#.#'%'",
                                    valueLineColor: processColor('green'),
                                    valueLinePart1Length: 0.5
                                }
                            }]
                        }}
                        chartDescription={{
                            text: '',
                            textSize: 12,
                            textColor: processColor('darkgray'),

                        }}
                    />
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                    <SelectDropdown
                        data={titleWithIcons}
                        onSelect={(selectedItem, index) => handleSelectDropdown(index)}
                        defaultValue={titleWithIcons[type]}
                        renderButton={(selectedItem, isOpened) => {
                            return (
                                <View style={styles.dropdownButtonStyle}>
                                    {selectedItem && (
                                        <Icon name={selectedItem.icon} style={styles.dropdownButtonIconStyle} />
                                    )}
                                    <Text style={styles.dropdownButtonTxtStyle}>
                                        {(selectedItem && selectedItem.title) || 'Select your Type'}
                                    </Text>
                                    <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle} />
                                </View>
                            );
                        }}
                        renderItem={(item, index, isSelected) => {
                            return (
                                <View style={{ ...styles.dropdownItemStyle, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                    <Icon name={item.icon} style={styles.dropdownItemIconStyle} />
                                    <Text style={styles.dropdownItemTxtStyle}>{item.title}</Text>
                                </View>
                            );
                        }}
                        showsVerticalScrollIndicator={false}
                        dropdownStyle={styles.dropdownMenuStyle}
                    />
                </View>
                <ScrollView bounces={false} style={styles.scrollWrap}>
                    {infos?.map((info: any, index: any) => (
                        <View key={index} style={styles.fundInfoWrapItem}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
                                <Image style={styles.moneyImage} source={require("@/Assets/Images/Money4.png")} />
                                <View style={styles.funInfoWrapItemDetail}>
                                    <Text style={{ fontSize: 20, fontWeight: "700", color: "#000" }}>{info.type === 0 ? 'Chi:  ' : 'Thu:  '}{info.type === 0 ? (<Text style={{ color: '#5E1914' }}>{info.amount}</Text>) : (<Text style={{ color: '#1877f2' }}>{info.amount}</Text>)}</Text>
                                    {info.type !== 2 ? (<Text style={{ fontSize: 17, fontWeight: "600" }}>{info?.description}</Text>) : <Text style={{ fontSize: 17, fontWeight: "700", color: '#1877f2' }}>Quỹ tháng {new Date(info?.time).getMonth() + 1} đã thu</Text>}
                                    {info.type !== 2 ? (<Text style={{ fontSize: 15, fontWeight: "600", color: '#1877f2' }}>{new Date(info?.time).getDate()}/{new Date(info?.time).getMonth() + 1}/{new Date(info?.time).getFullYear()}</Text>) : <></>}
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            </View>
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
    bodyContainerHeader: {
        marginTop: 10,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        marginHorizontal: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 200,
        paddingTop: 10
    },
    bodyContainerHeaderLeft: {
        marginHorizontal: 12,
        width: '54%'
    },
    bodyContainerHeaderLeftItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 7,
        justifyContent: 'space-between'
    },
    bodyContainerHeaderLeftBorder: {
        borderTopColor: 'green',
        borderTopWidth: 1,
        marginTop: 12,
        paddingTop: 4
    },
    bodyContainerHeaderLeftItemRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
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
    scrollWrap: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        marginHorizontal: 4,
        height: SCREEN_HEIGHT - 390
    },
    fundInfoWrapItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 14,
        marginHorizontal: 4,
        marginVertical: 8,
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
})

export default StatisticEachMonthScreen