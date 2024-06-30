import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import LinearGradient from "react-native-linear-gradient";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from "@/Routes/Stack";
import { useState } from "react";
import { TextInput } from 'react-native-paper';
import CheckBox from "@react-native-community/checkbox";
import { useRoute } from '@react-navigation/native';
import { useEditPlayerMutation } from "@/Redux/api/player";
import Spinner from "react-native-loading-spinner-overlay";

const UpdatePlayerScreen = () => {
    const route = useRoute();
    const { id, name, number, phone, isCaptain } = route.params as { id: any, name: any, number: any, phone: any, isCaptain: any };
    const [EditPlayerMutation, { isLoading }] = useEditPlayerMutation();
    // const data = {
    //     name: 'Duy Anh',
    //     number: 5,
    //     phone: '0867954826',
    //     isCaptain: true
    // }
    const [nameNew, setName] = useState(name);
    const [numberNew, setNumber] = useState(number);
    const [phoneNew, setPhone] = useState(phone);
    const [captain, setCaptain] = useState(isCaptain === 1 ? true : false);
    const [nameError, setNameError] = useState(false);
    const [numberError, setNumberError] = useState(false);
    const [alertText, setAlertText] = useState<any>()

    const navigation = useNavigation<ScreenNavigationProp>();
    const onPressGoBackHandler = () => {
        navigation.goBack();
    };
    const handleCancel = () => {
        navigation.goBack();
    }
    const handleSave = () => {
        if (!nameNew) {
            setNameError(true);
            setAlertText('Tên cầu thủ không thể bỏ trống')
            return;
        }
        if (!numberNew) {
            setNameError(false);
            setNumberError(true);
            setAlertText('Số áo là bắt buộc')
            return
        }

        EditPlayerMutation({ id, name: nameNew, number: numberNew, phone: phoneNew, isCaptain: captain })
            .unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode === 2) {
                    setNameError(false);
                    setNumberError(true);
                    setAlertText(`Đã có cầu thủ với số áo ${numberNew}`)
                    return;
                } else if (data.errCode === 0) {
                    navigation.goBack();
                } else {
                    Alert.alert('Cầu thủ không tồn tại');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có vấn đề xảy ra trong quá trình thêm cầu thủ');
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
                <Text style={styles.textNavigationBar}>Cập nhật thành viên</Text>
            </LinearGradient>
            <View style={styles.bodyContainer}>
                <Text style={{ fontSize: 18, fontWeight: 600, color: 'red', marginBottom: 6, textAlign: 'center' }}>{alertText}</Text>
                <TextInput
                    style={styles.input}
                    underlineColor="#ddd"
                    placeholder="Tên cầu thủ (bắt buộc)..."
                    placeholderTextColor="#ddd"
                    value={nameNew}
                    onChangeText={text => setName(text)}
                    error={nameError}
                    activeUnderlineColor="green" />
                <TextInput
                    style={styles.input}
                    underlineColor="#ddd"
                    placeholder="Số áo (bắt buộc)..."
                    placeholderTextColor="#ddd"
                    keyboardType="numeric"
                    value={numberNew}
                    onChangeText={text => setNumber(text)}
                    error={numberError}
                    activeUnderlineColor="green" />
                <TextInput
                    style={styles.input}
                    underlineColor="#ddd"
                    placeholder="Số điện thoại (tuỳ chọn)..."
                    placeholderTextColor="#ddd"
                    value={phoneNew}
                    onChangeText={text => setPhone(text)}
                    keyboardType={'phone-pad'}
                    activeUnderlineColor="green" />
                <View style={styles.checkboxContainer}>
                    <CheckBox
                        value={captain}
                        onValueChange={setCaptain}
                        style={{ marginLeft: 12 }}
                    />
                    <Text style={styles.checkBoxLabel}>Đội trưởng</Text>
                </View>
            </View>
            <View style={styles.endContainer}>
                <TouchableOpacity style={styles.endContainerItem1} onPress={handleCancel}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 600,
                    }}>Không</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.endContainerItem2} onPress={handleSave}>
                    <Text style={{
                        fontSize: 17,
                        fontWeight: 600,
                        color: '#318bfb',
                    }}>Lưu</Text>
                </TouchableOpacity>
            </View>
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
        flex: 0.5
    },
    input: {
        width: '100%',
        height: 40,
        marginHorizontal: 12,
        marginBottom: 10,
        textAlign: 'center',
        backgroundColor: 'rgb(242, 242, 242)',

    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#ddd',
        marginHorizontal: 12,
        paddingVertical: 10
    },
    checkBoxLabel: {
        margin: 8,
        fontSize: 16
    },
    endContainer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        flex: 0.5
    },
    endContainerItem1: {
        width: '50%',
        alignItems: 'center',
        borderTopWidth: 1,
        borderColor: '#ddd',
        paddingVertical: 14,
        borderRightWidth: 1,
    },
    endContainerItem2: {
        width: '50%',
        alignItems: 'center',
        borderColor: '#ddd',
        paddingVertical: 14,
        borderTopWidth: 1
    }

})

export default UpdatePlayerScreen;