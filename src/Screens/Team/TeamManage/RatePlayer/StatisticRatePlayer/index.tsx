import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View, processColor } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { PieChart } from 'react-native-charts-wrapper';
import { useEffect, useState } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import SelectDropdown from "react-native-select-dropdown";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import Modal from 'react-native-modal';
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import { TextInput } from "react-native-paper";
import { useDeleteMatchMutation, useEditMatchMutation, useGetAllMatchDetailsQuery, useGetAllMatchQuery } from "@/Redux/api/match";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import Spinner from "react-native-loading-spinner-overlay";

const StatisticRatePlayerScreen = () => {

    const [data, setData] = useState();
    const [total, setTotal] = useState(1);

    const [values, setValues] = useState<any>([]);

    const [type, setType] = useState('goal');

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
        refetch,
    } = useGetAllMatchDetailsQuery({ type: (timeTitle[timeSearch].title === 'Toàn thời gian') ? '0' : timeTitle[timeSearch].title.slice(0, timeTitle[timeSearch].title.indexOf('/')) });

    useEffect(() => {
        if (isSuccess) {
            setData(response?.data);
            if (response.data && response.data[type]) {
                let newTotal = 0;
                let values = [];
                for (let i = 0; i < Object.keys(response.data[type]).length; i++) {
                    newTotal = newTotal + response.data[type][i].value;
                }
                for (let i = 0; i < Object.keys(response.data[type]).length; i++) {
                    values.push({ value: 100 * response.data[type][i].value / newTotal })
                }

                setTotal(newTotal);
                setValues(values);
            }



        }
    }, [response, isSuccess]);
    useFocusEffect(
        React.useCallback(() => {
            refetch();
        }, [refetch]),
    );

    const handleSelectDropdownTime = (index: any) => {
        setTimeSearch(index);
        refetch()
    }

    const handleSelectDropdownType = (index: any) => {
        setType(typeTitle[index].type)
        if (data && data[typeTitle[index].type]) {
            let newTotal = 0;
            let values = [];
            for (let i = 0; i < Object.keys(data[typeTitle[index].type]).length; i++) {
                newTotal = newTotal + data[typeTitle[index].type][i].value
            }
            for (let i = 0; i < Object.keys(data[typeTitle[index].type]).length; i++) {
                values.push({ value: 100 * data[typeTitle[index].type][i].value / newTotal })
            }
            setTotal(newTotal);
            setValues(values)
        }
    }

    const typeTitle = [
        { title: 'Ghi bàn', type: 'goal' },
        { title: 'Kiến tạo', type: 'assist' },
        { title: 'Thái độ, kỉ luật không tốt', type: 'badAttitude' },
        { title: 'Thẻ vàng', type: 'yellowCard' },
        { title: 'Thẻ đỏ', type: 'redCard' }
    ];

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };

    return (
        <View>
            <Spinner visible={isLoadingQuery} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Thống kê chỉ số</Text>
            </LinearGradient>
            <View style={{ justifyContent: 'space-between', height: SCREEN_HEIGHT - 58 }}>
                <View>
                    <View style={{ alignItems: 'flex-end' }}>
                        <SelectDropdown
                            data={timeTitle}
                            onSelect={(selectedItem, index) => handleSelectDropdownTime(index)}
                            defaultValue={timeTitle[timeSearch]}
                            renderButton={(selectedItem, isOpened) => {
                                return (
                                    <View style={styles.dropdownButtonStyle1}>
                                        <Text style={styles.dropdownButtonTxtStyle1}>
                                            {(selectedItem && selectedItem.title) || 'Select your Type'}
                                        </Text>
                                        <Icon name={isOpened ? 'chevron-up' : 'chevron-down'} style={styles.dropdownButtonArrowStyle1} />
                                    </View>
                                );
                            }}
                            renderItem={(item, index, isSelected) => {
                                return (
                                    <View style={{ ...styles.dropdownItemStyle1, ...(isSelected && { backgroundColor: '#D2D9DF' }) }}>
                                        <Text style={styles.dropdownItemTxtStyle1}>{item.title}</Text>
                                    </View>
                                );
                            }}
                            showsVerticalScrollIndicator={false}
                            dropdownStyle={styles.dropdownMenuStyle1}
                        />
                    </View>
                    {(data?.goal.length === 0 && data?.assist.length === 0 && data?.redCard.length === 0 && data?.yellowCard.length === 0 && data?.badAttitude.length === 0) ?
                        <View style={{
                            margin: 'auto',
                            justifyContent: 'center',
                            height: '80%'
                        }}>
                            <Text style={{ fontSize: 19, fontWeight: 400 }}>Không có thông tin trong thời gian này</Text>
                        </View>
                        : (<View>
                            <View style={styles.pieChartWrap}>
                                <PieChart
                                    style={{ flex: 1 }}
                                    data={{
                                        dataSets: [{
                                            values: values,
                                            label: '',
                                            config: {
                                                colors: [processColor('blue'), processColor('#ddd'), processColor('red'), processColor('green'), processColor('pink'), processColor('violet'), processColor('gold')],
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
                                    holeColor={processColor('#ddd')}
                                    styledCenterText={{ text: `Total: ${total}`, color: processColor('#000'), fontFamily: 'HelveticaNeue-Medium', size: 14 }}
                                />

                            </View>
                            <ScrollView style={styles.resultWrap}>
                                {data && data[type].map((result: any, index: any) => (
                                    <View key={index} style={styles.resultWrapItem}>
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                            gap: 8,
                                            width: '65%'
                                        }}>
                                            <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Avatarplayer.png")} />
                                            <View>
                                                <Text style={{ color: '#000', fontSize: 17, fontWeight: 600 }}>{result.name}</Text>
                                                <Text style={{ color: '#1877f2' }}>{result.number}</Text>
                                                {type === 'badAttitude' ? <Text style={{ color: 'red' }}>{result.details.toString()}</Text> : <></>}
                                            </View>
                                        </View>
                                        <View>
                                            <Text style={{ fontSize: 24, fontWeight: 700, color: '#1877f2' }}>{result.value}</Text>
                                        </View>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>)}
                </View>
                <View>
                    <View style={{ marginHorizontal: 6, marginVertical: 8 }}>
                        <Text style={{ color: 'red', fontSize: 13, textAlign: 'center' }}>Để thay đổi hoặc xoá dữ liệu đánh giá thành viên. Hãy quay lại mục Đánh giá thành viên để thao tác</Text>
                    </View>
                    <View style={{ justifyContent: 'center', backgroundColor: '#8BC6EC' }}>
                        <SelectDropdown
                            data={typeTitle}
                            onSelect={(selectedItem, index) => handleSelectDropdownType(index)}
                            defaultValue={typeTitle[0]}
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
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
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
    resultWrap: {
        marginTop: 8,
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        marginHorizontal: 8,
        backgroundColor: '#fff',
        height: SCREEN_HEIGHT - 480

    },
    resultWrapItem: {
        marginTop: 16,
        marginBottom: 4,
        marginHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginRight: 12
    },
    dropdownButtonStyle: {
        width: '100%',
        height: 50,
        borderRadius: 12,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 12,
        gap: 8
    },
    dropdownButtonTxtStyle: {
        fontSize: 18,
        fontWeight: '500',
        color: '#fff',
    },
    dropdownButtonArrowStyle: {
        fontSize: 28,
        color: '#fff'
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
    pieChartWrap: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        height: 240,
        paddingBottom: 10,
        marginHorizontal: 8,
        marginBottom: 12
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
    dropdownButtonTxtStyle1: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownButtonArrowStyle1: {
        fontSize: 28,
    },
    dropdownButtonIconStyle1: {
        fontSize: 28,
        marginRight: 6,
    },
    dropdownMenuStyle1: {
        backgroundColor: '#E9ECEF',
        borderRadius: 8,
    },
    dropdownItemStyle1: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 8,
    },
    dropdownItemTxtStyle1: {
        flex: 1,
        fontSize: 18,
        fontWeight: '500',
        color: '#151E26',
    },
    dropdownItemIconStyle1: {
        fontSize: 28,
        marginRight: 8,
    },
})

export default StatisticRatePlayerScreen;