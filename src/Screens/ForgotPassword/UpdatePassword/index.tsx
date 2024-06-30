import React, { useState } from 'react';
import {
    Alert,
    Image,
    ImageBackground,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/Constants';
import { TextInput } from "react-native-paper";
import { useResetPasswordMutation, useSignupMutation } from '@/Redux/api/auth';
import Spinner from 'react-native-loading-spinner-overlay';

const UpdatePasswordScreen = () => {
    const [token, setToken] = useState('');
    const [password, setPassword] = useState('');
    const [passwordCheck, setPasswordCheck] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [tokenError, setTokenError] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [passwordCheckError, setPasswordCheckError] = useState(false);
    const [ResetPasswordMutation, { isLoading }] = useResetPasswordMutation();

    const handleUpdatePassword = () => {

        if (token.trim() === '') {
            setTokenError(true);
            setTextAlert('Mã xác nhận không được bỏ trống')
            return;
        }

        if (password.trim() === '') {
            setTextAlert('Mật khẩu không hợp lệ');
            setTokenError(false);
            setPasswordError(true);
            return;
        }

        if (passwordCheck.trim() === '' || passwordCheck !== password) {
            setTextAlert('Mật khẩu không khớp');
            setTokenError(false);
            setPasswordError(false);
            setPasswordCheckError(true);
            return;
        }
        ResetPasswordMutation({ token, password })
            .unwrap()
            .then(data => {
                if (data.errCode === 1) {
                    setTextAlert('Mã xác nhận không chính xác hoặc đã hết hạn');
                    setTokenError(true);
                    setPasswordError(false);
                    setPasswordCheckError(false);
                    return;

                } else if (data.errCode === 0) {
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    });
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Cập nhật mật khẩu thất bại');
            });

    }
    const [textAlert, setTextAlert] = useState('');
    const navigation = useNavigation<ScreenNavigationProp>();

    return (
        <View style={styles.container}>
            <ImageBackground
                source={require("@/Assets/Images/Login.png")}
                style={{
                    width: SCREEN_WIDTH,
                    height: SCREEN_HEIGHT,
                    flex: 1,
                    justifyContent: 'center',
                    alignItems: 'center',
                    paddingHorizontal: 20,
                }}>
                <Spinner visible={isLoading} />
                <Image
                    source={require('@/Assets/Images/Logo1.png')}
                    style={styles.logo}
                />
                <Text style={{ color: 'red' }}>{textAlert}</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Mã xác nhận'
                    placeholderTextColor={'#fff'}
                    textColor='#fff'
                    activeUnderlineColor='green'
                    value={token}
                    onChangeText={text => setToken(text)}
                    error={tokenError}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={!isPasswordVisible}
                    placeholder='Mật khẩu mới'
                    placeholderTextColor={'#fff'}
                    activeUnderlineColor='green'
                    textColor='#fff'
                    value={password}
                    onChangeText={text => setPassword(text)}
                    error={passwordError}
                    right={
                        <TextInput.Icon
                            color={'#fff'}
                            icon={isPasswordVisible ? 'eye-off' : 'eye'}
                            onPress={togglePasswordVisibility}
                        />
                    }
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={!isPasswordVisible}
                    placeholder='Nhập lại mật khẩu'
                    placeholderTextColor={'#fff'}
                    activeUnderlineColor='green'
                    textColor='#fff'
                    value={passwordCheck}
                    onChangeText={text => setPasswordCheck(text)}
                    error={passwordCheckError}
                    right={
                        <TextInput.Icon
                            color={'#fff'}
                            icon={isPasswordVisible ? 'eye-off' : 'eye'}
                            onPress={togglePasswordVisibility}
                        />
                    }
                />
                <TouchableOpacity style={styles.loginButton} onPress={handleUpdatePassword}>
                    <Text style={styles.loginButtonText}>Cập nhật</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                    <Text style={styles.forgotPasswordText}>Quay về đăng nhập</Text>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        // paddingHorizontal: 20,
    },
    logo: {
        width: 140,
        height: 140,
        marginBottom: 30,
        backgroundColor: 'transparent'
    },
    input: {
        width: '100%',
        height: 60,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: 'transparent',
        color: '#fff'
    },
    loginButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#1877f2',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
        marginTop: 8
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    forgotPasswordText: {
        color: '#fff',
        marginBottom: 10,
        marginTop: 10,
        fontSize: 16
    },
    separator: {
        width: '100%',
        height: 1,
        backgroundColor: '#ddd',
        marginBottom: 10,
    },
    createAccountButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#42b72a',
        borderRadius: 5,
        justifyContent: 'center',
        alignItems: 'center',
    },
    createAccountButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default UpdatePasswordScreen;