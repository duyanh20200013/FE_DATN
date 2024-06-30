import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View, processColor } from "react-native"
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
import { useDeleteMatchMutation, useEditMatchMutation, useGetAllMatchQuery } from "@/Redux/api/match";
import React from "react";
import { useFocusEffect } from '@react-navigation/native';
import Spinner from "react-native-loading-spinner-overlay";

const StatisticResultScreen = () => {
    const [data, setData] = useState();
    const timeTitle = [
        { title: 'Toàn thời gian' },
        { title: (new Date().getMonth() + 1).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth()).toString() + '/' + (new Date().getFullYear()).toString() },
        { title: (new Date().getMonth() - 1).toString() + '/' + (new Date().getFullYear()).toString() },
    ];
    const [active, setActive] = useState<any>(0);
    const [timeSearch, setTimeSearch] = useState<any>(0);

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        refetch,
    } = useGetAllMatchQuery({ type: (timeTitle[timeSearch].title === 'Toàn thời gian') ? '0' : timeTitle[timeSearch].title.slice(0, timeTitle[timeSearch].title.indexOf('/')) });

    const [EditMatchMutation, { isLoading: isLoading1 }] = useEditMatchMutation();
    const [DeleteMatchMutation, { isLoading: isLoading2 }] = useDeleteMatchMutation();

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
    // const [results, setResults] = useState(data1.results);
    const [resultEdit, setResultEdit] = useState<any>();

    const handleActive = () => {
        setActive(0);
    }
    const handleNotActive = () => {
        setActive(1);
    }
    const handleSelectDropdownTime = (index: any) => {
        setTimeSearch(index);
        refetch()
    }

    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setModalVisible2(!isModalVisible2);
    };

    const handleEditResult = () => {
        if (!goalEdit) {
            setNumberError(true);
            return;
        }
        if (!lostGoalEdit) {
            setNumberLostGoalError(true);
            return;
        }
        EditMatchMutation({ id: resultEdit?.id, result: statusMatchEdit, goal: goalEdit, lostGoal: lostGoalEdit, description: description })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Cập nhật trận đấu thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal1();
    }

    const handleCancelEdit = () => {
        toggleModal1();
    }

    const handlePressThreeDot = (result: any) => {
        setResultEdit(result);
        setStatusMatchEdit(result?.result);
        setGoalEdit(result?.goal);
        setLostGoalEdit(result?.lostGoal);
        setDescription(result?.description);
        toggleModal2();
    }

    const handleToggleModalEditMatch = () => {
        toggleModal2();
        toggleModal1();
    }

    const handleDeleteMatch = () => {
        DeleteMatchMutation({ matchId: resultEdit?.id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                } else {
                    Alert.alert('Xoá trận đấu thất bại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2();
    }

    const options = [
        { label: 'Thắng', value: 'Thắng' },
        { label: 'Hoà', value: 'Hoà' },
        { label: 'Thua', value: 'Thua' },
    ];

    const [numberError, setNumberError] = useState(false);
    const [numberLostGoalError, setNumberLostGoalError] = useState(false);

    const [statusMatchEdit, setStatusMatchEdit] = useState('Thắng');
    const [goalEdit, setGoalEdit] = useState(0);
    const [lostGoalEdit, setLostGoalEdit] = useState(0);
    const [description, setDescription] = useState<any>();

    const handleEditStatusMatch = (type: any) => {
        setStatusMatchEdit(type);
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
                <Text style={styles.textNavigationBar}>Thống kê kết quả thi đấu</Text>
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
                {data?.results.length === 0 ?
                    (<View style={{
                        margin: 'auto',
                        justifyContent: 'center',
                        height: '80%'
                    }}>
                        <Text style={{ fontSize: 19, fontWeight: 400 }}>Không có thông tin trong thời gian này</Text>
                    </View>)
                    : (<View>
                        <View style={styles.pieChartWrap}>
                            <View style={styles.pieWrapHeader}>
                                <TouchableOpacity style={[styles.pieWrapHeaderItem, active === 0 ? styles.activeWrap : null]} onPress={handleActive}>
                                    <Text style={[styles.pieWrapHeaderItemText, active === 0 ? styles.activeText : null]}>Kết quả</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.pieWrapHeaderItem, active === 1 ? styles.activeWrap : null]} onPress={handleNotActive}>
                                    <Text style={[styles.pieWrapHeaderItemText, active === 1 ? styles.activeText : null]}>Bàn thắng</Text>
                                </TouchableOpacity>
                            </View>
                            {active === 0 ? (<PieChart
                                style={{ flex: 1 }}
                                data={{
                                    dataSets: [{
                                        values: [
                                            { value: (data?.win * 100 / data?.results.length) ? (data?.win * 100 / data?.results.length) : 0, label: 'Thắng' },
                                            { value: (data?.draw * 100 / data?.results.length) ? (data?.draw * 100 / data?.results.length) : 0, label: 'Hoà' },
                                            { value: (data?.lost * 100 / data?.results.length) ? (data?.lost * 100 / data?.results.length) : 0, label: 'Thua' },
                                        ],
                                        label: '',
                                        config: {
                                            colors: [processColor('blue'), processColor('#ddd'), processColor('red')],
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
                                styledCenterText={{ text: `Số trận: ${data?.results.length}`, color: processColor('#000'), fontFamily: 'HelveticaNeue-Medium', size: 14 }}
                            />) :
                                (<PieChart
                                    style={{ flex: 1 }}
                                    data={{
                                        dataSets: [{
                                            values: [
                                                { value: (data?.goal * 100 / (data?.goal + data?.lostGoal)) ? (data?.goal * 100 / (data?.goal + data?.lostGoal)) : 0, label: 'Goal' },
                                                { value: (data?.lostGoal * 100 / (data?.goal + data?.lostGoal)) ? (data?.lostGoal * 100 / (data?.goal + data?.lostGoal)) : 0, label: 'Lost' },
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
                                    holeColor={processColor('#ddd')}
                                    styledCenterText={{ text: `Số bàn: ${data?.goal + data?.lostGoal}`, color: processColor('#000'), fontFamily: 'HelveticaNeue-Medium', size: 14 }}
                                />)}
                        </View>
                        <ScrollView style={styles.resultWrap}>
                            {data?.results.map((result: any, index: any) => (
                                <View key={index} style={styles.resultWrapItem}>
                                    <View>
                                        <Text style={{ fontSize: 19, fontWeight: 700, color: 'blue' }}>{result.result}</Text>
                                        <Text style={{ fontSize: 17, fontWeight: 500 }}>Tỉ số: {result.goal} - {result.lostGoal}</Text>
                                        <Text style={{ fontSize: 15, fontWeight: 400, color: '#1877f2' }}>{result.description}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                        <Text style={{ fontSize: 16, fontWeight: 400, color: '#1877f2' }}>{new Date(result?.time).getDate()}/{new Date(result?.time).getMonth() + 1}/{new Date(result?.time).getFullYear()}</Text>
                                        <TouchableOpacity style={{

                                        }} onPress={handlePressThreeDot.bind(this, result)}>
                                            <Entypo name="dots-three-vertical" color='#1877f2' size={22} />
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>
                    </View>)
                }


            </View>
            {/* Modal Update Result */}
            <Modal isVisible={isModalVisible1}
                onBackdropPress={toggleModal1}
                onBackButtonPress={toggleModal1}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal1}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={styles.editResultWrap}>
                    <LinearGradient colors={['#8BC6EC', '#9599E2']} style={{ paddingVertical: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 15, textAlign: 'center'
                        }}>Cập nhật kết quả trận đấu</Text>
                    </LinearGradient>
                    <View>
                        <View style={{ marginTop: 14 }}>
                            <RadioForm
                                formHorizontal={true}
                            >
                                {
                                    options.map((obj, i) => (
                                        <RadioButton labelHorizontal={true} key={i} >
                                            <RadioButtonInput
                                                obj={obj}
                                                index={i}
                                                isSelected={statusMatchEdit === obj.value}
                                                onPress={handleEditStatusMatch.bind(this, obj.value)}
                                                buttonInnerColor={'#2196f3'}
                                                buttonOuterColor={statusMatchEdit === obj.value ? '#2196f3' : '#ddd'}
                                                buttonSize={10}
                                                buttonOuterSize={24}
                                                buttonStyle={{}}
                                                buttonWrapStyle={{ marginLeft: 16 }}
                                            />
                                            <RadioButtonLabel
                                                obj={obj}
                                                index={i}
                                                labelHorizontal={true}
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
                                defaultValue={resultEdit?.goal.toString()}
                                onChangeText={text => setGoalEdit(Number(text))}
                                error={numberError}
                                activeUnderlineColor="green" />
                            <Text style={{ fontSize: 16, fontWeight: 700, color: '#18392B' }}>-</Text>
                            <TextInput
                                style={styles.input}
                                underlineColor="#000"
                                placeholder="?"
                                placeholderTextColor="#ddd"
                                keyboardType="numeric"
                                defaultValue={resultEdit?.lostGoal.toString()}
                                onChangeText={text => setLostGoalEdit(Number(text))}
                                error={numberLostGoalError}
                                activeUnderlineColor="green" />
                        </View>
                        <View style={{ marginHorizontal: 12, marginVertical: 10 }}>
                            <Text style={{ fontSize: 17, fontWeight: 600, color: '#000' }}>Mô tả thêm</Text>
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
                                defaultValue={resultEdit?.description}
                                onChangeText={text => setDescription(text)}
                                // error={nameError}
                                activeUnderlineColor="green" />
                        </View>
                    </View>
                    <View style={styles.editResultWrapEndItem}>
                        <TouchableOpacity onPress={handleEditResult}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Cập nhật
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={handleCancelEdit}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Huỷ
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {/* Modal Option Match */}
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
                <View style={styles.postOptionsWrapper}>
                    <TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleToggleModalEditMatch}>
                        <MaterialCommunityIcons
                            name="account-edit-outline"
                            size={26} color={'#1877f2'}></MaterialCommunityIcons>

                        <Text style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: '#1877f2'
                        }}>Sửa thông tin trận đấu</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postOptionsWrapperItem} onPress={handleDeleteMatch}>
                        <MaterialCommunityIcons
                            name="account-remove-outline"
                            size={26}
                            color={'red'}></MaterialCommunityIcons>
                        <Text style={{
                            color: 'red',
                            fontSize: 16,
                            fontWeight: 700
                        }}>Xoá trận đấu</Text>
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
        height: SCREEN_HEIGHT - 440

    },
    resultWrapItem: {
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        paddingLeft: 16,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 6,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
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
    pieChartWrap: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        height: 280,
        paddingBottom: 10,
        marginHorizontal: 8,
        marginBottom: 12
    },
    pieWrapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6
    },
    pieWrapHeaderItem: {
        flexDirection: 'row',
        gap: 8,
        justifyContent: 'center',
        width: '50%',
        alignItems: 'center',
        marginTop: 10,
        paddingBottom: 10,
        borderBottomWidth: 3,
        borderBottomColor: '#ddd'
    },
    pieWrapHeaderItemText: {
        fontSize: 18,
        fontWeight: "700"
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
    editResultWrap: {
        paddingBottom: 10,
        backgroundColor: '#fff',
        width: SCREEN_WIDTH - 60,
    },
    editResultWrapItem: {

    },
    editResultWrapEndItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 140,
        paddingRight: 50,
    },
    input: {
        height: 40,
        marginHorizontal: 12,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: '#fff',
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

})

export default StatisticResultScreen;