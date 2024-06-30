import { StyleSheet, Text, TouchableOpacity, View, ScrollView, Image, Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
import { useEffect, useState } from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { TextInput } from "react-native-paper";
import { SelectList } from 'react-native-dropdown-select-list'
import DatePicker from 'react-native-date-picker'
import { useCreateMatchFindMutation } from "@/Redux/api/match";

const CreateMatchFindScreen = () => {

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };
    const dataRate = [
        { key: 1, value: '50-50' },
        { key: 2, value: '60-40' },
        { key: 3, value: '70-30' },
        { key: 4, value: '80-20' },
        { key: 5, value: 'Thua chịu toàn bộ chi phí' },
    ]

    const dataLevel = [
        { key: 1, value: 'Siêu gà, siêu yếu' },
        { key: 2, value: 'Trung bình yếu' },
        { key: 3, value: 'Trung bình' },
        { key: 4, value: 'Trung bình khá' },
        { key: 5, value: 'Trình độ phủi' },
        { key: 5, value: 'Chuyên nghiệp' },
    ]

    const [CreateMatchFindMutation, { isLoading }] = useCreateMatchFindMutation();

    const [openDatePicker, setOpenDatePicker] = useState(false);
    const [openDatePicker1, setOpenDatePicker1] = useState(false);
    const [openDatePicker2, setOpenDatePicker2] = useState(false);

    const [location, setLocation] = useState<string>('');
    const [price, setPrice] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [rate, setRate] = useState<number>(1);
    const [level, setLevel] = useState<number>(3);
    const [start, setStart] = useState(new Date(2024, 6, 23, 19, 30));
    const [end, setEnd] = useState(new Date(2024, 6, 23, 21, 30));
    const [date, setDate] = useState(new Date());

    const [locationError, setLocationError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);

    const handleCreateMatchFind = () => {
        if (!location) {
            setLocationError(true);
            Alert.alert('Vui lòng nhập thông tin địa chỉ sân bóng');
            return;
        }
        if (!phone) {
            setPhoneError(true);
            Alert.alert('Vui lòng nhập thông tin số điện thoại');
            return;
        }
        let startTime = start;
        startTime.setFullYear(date.getFullYear());
        startTime.setMonth(date.getMonth());
        startTime.setDate(date.getDate());
        let endTime = end;
        endTime.setFullYear(date.getFullYear());
        endTime.setMonth(date.getMonth());
        endTime.setDate(date.getDate());
        CreateMatchFindMutation({ phone, start: startTime, end: endTime, location, price, description, rate, level })
            .unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode === 0) {
                    navigation.goBack();
                    return;
                } else {
                    Alert.alert('Có lỗi xảy ra trong quá trình tạo thông tin');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có vấn đề xảy ra trong quá trình thực hiện');
            });
    }


    return (
        <View style={styles.container}>
            <Spinner visible={isLoading} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Cần tìm đối</Text>
            </LinearGradient>
            <View style={styles.bodyContainer}>
                <View style={styles.stadiumWrap}>
                    <View style={{
                        marginHorizontal: 10,
                        marginTop: 14
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#000',
                            fontWeight: "700",
                            marginBottom: 4
                        }}>Địa chỉ sân bóng</Text>
                        <TextInput
                            style={styles.input}
                            underlineColor="#fff"
                            placeholder="Nhập địa chỉ sân bóng..."
                            placeholderTextColor="#999DA0"
                            value={location}
                            onChangeText={text => setLocation(text)}
                            error={locationError}
                            activeUnderlineColor="green" />
                    </View>
                    <View style={{
                        marginHorizontal: 10,
                        marginBottom: 6
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#000',
                            fontWeight: "700",
                        }}>Số điện thoại (bắt buộc):</Text>
                        <TextInput
                            style={styles.input}
                            underlineColor="#fff"
                            placeholder="Số điện thoại để các đội liên lạc...."
                            placeholderTextColor="#999DA0"
                            keyboardType="phone-pad"
                            value={phone}
                            textColor="#1877f2"
                            onChangeText={text => setPhone(text)}
                            error={phoneError}
                            activeUnderlineColor="green" />
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
                        <View style={{ flexDirection: 'row', gap: 16 }}>
                            <TouchableOpacity onPress={() => setOpenDatePicker(true)}>
                                <Text style={{ fontSize: 20, fontWeight: 700, color: 'red', textDecorationLine: 'underline' }}>{date.getDate()}/{date.getMonth() + 1}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenDatePicker1(true)}>
                                <Text style={{ fontSize: 20, fontWeight: 700, color: 'blue', textDecorationLine: 'underline' }}>{start.getHours()}:{start.getMinutes()}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setOpenDatePicker2(true)}>
                                <Text style={{ fontSize: 20, fontWeight: 700, color: 'blue', textDecorationLine: 'underline' }}>{end.getHours()}:{end.getMinutes()}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <View style={{
                        marginHorizontal: 10,
                        marginBottom: 6
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#000',
                            fontWeight: "700",
                        }}>Chi phí ước tính (tùy chọn):</Text>
                        <TextInput
                            style={styles.input}
                            underlineColor="#fff"
                            placeholder="Tổng tiền sân, nước, vv..."
                            placeholderTextColor="#999DA0"
                            keyboardType="numeric"
                            textColor="red"
                            value={price}
                            onChangeText={text => setPrice(text)}
                            // error={numberError}
                            activeUnderlineColor="green" />
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
                        }}>Tỉ lệ chi phí: Thắng, Hòa, Thua:</Text>
                        <SelectList
                            setSelected={(val) => setRate(val)}
                            defaultOption={{ key: 1, value: '50-50' }}
                            inputStyles={{ color: 'red' }}
                            dropdownTextStyles={{ color: 'red' }}
                            data={dataRate}
                            save="key"
                        />
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
                        <SelectList
                            setSelected={(val) => setLevel(val)}
                            defaultOption={{ key: 3, value: 'Trung bình' }}
                            inputStyles={{ color: 'red' }}
                            dropdownTextStyles={{ color: 'red' }}
                            data={dataLevel}
                            save="key"
                        />
                    </View>
                    <View style={{
                        marginHorizontal: 10,
                        marginBottom: 14
                    }}>
                        <Text style={{
                            fontSize: 16,
                            color: '#000',
                            fontWeight: "700",
                        }}>Mô tả thêm (tùy chọn):</Text>
                        <TextInput
                            style={styles.input}
                            underlineColor="#fff"
                            placeholder="Ví dụ: màu áo, vvv..."
                            placeholderTextColor="#999DA0"
                            value={description}
                            onChangeText={text => setDescription(text)}
                            // error={numberError}
                            activeUnderlineColor="green" />
                    </View>
                </View>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'flex-end',
                    marginHorizontal: 4,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                }}>
                    <TouchableOpacity style={{
                        width: '50%',
                        alignItems: 'center',
                        borderTopWidth: 1,
                        borderColor: '#ddd',
                        backgroundColor: '#ddd',
                        paddingVertical: 14,
                        borderRightWidth: 1,
                    }} onPress={onPressGoBackHandler}>
                        <Text style={{ fontSize: 18, fontWeight: 700 }}>Hủy</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={{
                            width: '50%',
                            alignItems: 'center',
                            borderTopWidth: 1,
                            borderColor: '#ddd',
                            backgroundColor: '#d21f3c',
                            paddingVertical: 14,
                            borderRightWidth: 1,
                        }} onPress={handleCreateMatchFind}>
                        <Text style={{ fontSize: 18, color: '#fff', fontWeight: 700 }}>Tạo</Text>
                    </TouchableOpacity>
                </View>
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
            <DatePicker
                modal
                open={openDatePicker1}
                date={start}
                mode="time"
                onConfirm={(date) => {
                    setOpenDatePicker1(false)
                    setStart(date)
                }}
                onCancel={() => {
                    setOpenDatePicker1(false)
                }}
            />
            <DatePicker
                modal
                open={openDatePicker2}
                date={end}
                mode="time"
                onConfirm={(date) => {
                    console.log(date)
                    setOpenDatePicker2(false)
                    setEnd(date)
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
    input: {
        height: 40,
        width: '100%',
        marginHorizontal: 8,
        textAlign: 'left',
        backgroundColor: '#fff',
    },
});

export default CreateMatchFindScreen;