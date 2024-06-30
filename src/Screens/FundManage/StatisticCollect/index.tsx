import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { SCREEN_HEIGHT } from "@/Constants";
import SelectDropdown from 'react-native-select-dropdown';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import DatePicker from "react-native-date-picker";
import { useGetAllFundCollectDetailQuery } from "@/Redux/api/fund";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import Spinner from "react-native-loading-spinner-overlay";

const StatisticCollectScreen = () => {
    const timeTitle = [
        { title: (new Date().getMonth() + 1).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth()).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth() - 1).toString() + '/' + (new Date().getFullYear()).toString() },
    ];
    const [timeSearch, setTimeSearch] = useState<any>(0);

    const [data, setData] = useState();
    const [players, setPlayers] = useState<Array<any> | undefined>();
    const [errCode, setErrorCode] = useState(1);

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetAllFundCollectDetailQuery({ type: timeTitle[timeSearch].title.slice(0, timeTitle[timeSearch].title.indexOf('/')) });

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response);
            setErrorCode(response?.errCode);
            setData(response?.data);
            setPlayers(response?.data?.success)
            // setTotal(response.data?.count)
        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const titleWithIcons = [
        { title: 'Đã đóng', icon: 'account-check-outline' },
        { title: 'Chưa đóng', icon: 'account-cancel-outline' },
        { title: 'Được miễn', icon: 'account-star-outline' },
    ];
    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };

    const [type, setType] = useState<any>(0);

    const handleSelectDropdownTime = (index: any) => {
        setTimeSearch(index);
        refetch();
    }
    return (
        <View>
            <Spinner visible={isLoadingQuery} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Đóng quỹ hàng tháng</Text>
            </LinearGradient>
            <View style={styles.bodyContainer}>
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
                {errCode === 0 ?
                    (<View>
                        <View style={styles.bodyContainerHeader}>
                            <View style={styles.bodyContainerHeaderMoney}>
                                <Text style={{
                                    fontSize: 20,
                                    fontWeight: "700",
                                    color: '#18392B'
                                }}>Mỗi thành viên: </Text>
                                <Text style={{ fontSize: 20, color: 'red', fontWeight: "700", marginLeft: 18 }}>{data?.fundCollect.amount}</Text>
                            </View>
                            <View style={styles.bodyContainerHeaderCollect}>
                                <Text style={{
                                    fontSize: 18,
                                    fontWeight: "600",
                                    color: '#000'
                                }}>Đã thu được: </Text>
                                <Text style={{ fontSize: 18, color: '#000', fontWeight: "700", marginLeft: 18 }}>{data?.fundCollect.total}</Text>
                            </View>
                        </View>
                        <View style={styles.bodyContainerDropDown}>
                            <SelectDropdown
                                data={titleWithIcons}
                                onSelect={(selectedItem, index) => {
                                    setType(index);
                                    if (index === 1) {
                                        setPlayers(data?.failed);
                                    } else if (index === 0) {
                                        setPlayers(data?.success);
                                    } else {
                                        setPlayers(data?.free);
                                    }

                                }}
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
                            <Text style={{ color: '#151E26', fontSize: 18, fontWeight: 500 }}>({type === 0 ? data?.success.length : (type === 1 ? data?.failed.length : data?.free.length)})</Text>
                        </View>
                        <ScrollView style={styles.scrollWrap} bounces={false}>
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
                                </View>
                            ))}
                        </ScrollView>
                    </View>)
                    : (<View style={{
                        margin: 'auto',
                        justifyContent: 'center',
                        height: '80%'
                    }}>
                        <Text style={{ fontSize: 19, fontWeight: 400 }}>Không có thông tin trong thời gian này</Text>
                    </View>)}
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
    bodyContainer: {
        paddingTop: 0,
        height: SCREEN_HEIGHT - 110, //navigation bar searchTool
    },
    bodyContainerHeader: {
        backgroundColor: '#fff',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    bodyContainerHeaderMoney: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 8,
        paddingLeft: 14,
        paddingTop: 10
    },
    bodyContainerHeaderCollect: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingBottom: 10,
        paddingLeft: 14,
        paddingTop: 16
    },
    bodyContainerDropDown: {
        flexDirection: 'row',
        alignItems: 'center',
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
        height: SCREEN_HEIGHT / 2 + 50
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
})
export default StatisticCollectScreen;