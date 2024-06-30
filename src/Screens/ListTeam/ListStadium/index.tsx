import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Image, Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
// import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { useGetAllStadiumQuery } from "@/Redux/api/match";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { Linking } from 'react-native'

const ListStadiumScreen = () => {
    const [response, setResponse] = useState();
    const [stadiums, setStadium] = useState();

    const districtTitle = [
        { title: 'Tất cả' },
        { title: 'Quận Thanh Xuân' },
        { title: 'Quận Nam Từ Liêm' },
        { title: 'Quận Bắc Từ Liêm' },
        { title: 'Quận Hai Bà Trưng' },
        { title: 'Quận Hoàng Mai' },
        { title: 'Quận Cầu Giấy' },
        { title: 'Quận Đống Đa' },
        { title: 'Quận Tây Hồ' },
        { title: 'Quận Long Biên' },
        { title: 'Quận Ba Đình' },
        { title: 'Quận Hà Đông' },
    ];
    const [districtSearch, setDistrictSearch] = useState<any>(0);
    const {
        data,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetAllStadiumQuery({ districtName: 'Tất cả' });

    useEffect(() => {
        if (isSuccess) {
            setResponse(data?.data);
            setStadium(data?.data)
        }
    }, [data, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };

    const handleSelectDropdownDistrict = (index: any) => {
        setDistrictSearch(index);
        if (index === 0) {
            setStadium(response);
        } else {
            let newStadiums = response?.filter((data) => data.district === districtTitle[index].title);
            setStadium(newStadiums);
        }
    }

    const handlePhoneCall = (phoneNumber: any) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }

    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Các sân bóng ở Hà Nội</Text>
            </LinearGradient>
            <View>
                <View style={{ alignItems: 'flex-end' }}>
                    <SelectDropdown
                        data={districtTitle}
                        onSelect={(selectedItem, index) => handleSelectDropdownDistrict(index)}
                        defaultValue={districtTitle[districtSearch]}
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
                <ScrollView style={styles.bodyContainer}>
                    {stadiums && stadiums.map((stadium: any, index: any) => (
                        <View key={index} style={styles.stadiumWrap}>
                            <View style={styles.stadiumWrapHeader}>
                                <Image style={styles.avatar} source={require("@/Assets/Images/Stadium.png")} />
                                <View>
                                    <Text style={styles.textNameStadium}>{stadium.name}</Text>
                                </View>
                            </View>
                            <View style={styles.stadiumWrapBody}>
                                <TouchableOpacity style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                }}
                                    onPress={() => handlePhoneCall(stadium.phone)}>
                                    <FontAwesome5Icon size={16} color={'#1877f2'} name="phone" />
                                    <Text
                                        style={{
                                            fontSize: 17,
                                            color: '#1877f2',
                                            paddingLeft: 10
                                        }}
                                    >
                                        {stadium.phone}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View style={{
                                marginHorizontal: 10,
                                marginBottom: 14
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    color: 'red',
                                    fontWeight: "400",
                                    marginBottom: 8
                                }}>Địa chỉ</Text>
                                <Text >{stadium.address}</Text>
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
        height: SCREEN_HEIGHT - 120
    },
    stadiumWrap: {
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
    stadiumWrapHeader: {
        flexDirection: 'row',
        gap: 10,
        marginHorizontal: 10,
        marginVertical: 12,
        alignItems: 'center',
        flex: 1
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
    stadiumWrapBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 10,
        marginBottom: 14
    },
});

export default ListStadiumScreen;