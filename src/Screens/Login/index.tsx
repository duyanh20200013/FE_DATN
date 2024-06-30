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
import { useLoginMutation } from '@/Redux/api/auth';
import Spinner from 'react-native-loading-spinner-overlay';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    };

    const [emailError, setEmailError] = useState(false);
    const [passwordError, setPasswordError] = useState(false)

    const [loginMutate, { isLoading }] = useLoginMutation();
    const [textAlert, setTextAlert] = useState('');

    const handleLogin = () => {
        // if (email.trim() === '' || password.trim() === '') {
        //     Alert.alert('Vui lòng nhập cả email và mật khẩu');
        //     return;
        // }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email.trim() === '' || !emailRegex.test(email)) {
            setTextAlert('Địa chỉ Email không hợp lệ');
            setEmailError(true);
            return;
        }

        if (password.trim() === '') {
            setTextAlert('Mật khẩu không hợp lệ');
            setEmailError(false);
            setPasswordError(true);
            return;
        }

        loginMutate({ email, password })
            .unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode === 0) {
                    if (data.data.status) {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'Home' }],
                        });
                    } else {
                        navigation.reset({
                            index: 0,
                            routes: [{ name: 'CreateTeam' }],
                        });
                    }
                } else if (data.errCode === 1 || data.errCode === 2) {
                    setTextAlert('Email không tồn tại trong hệ thống');
                    setEmailError(true);
                    setPasswordError(false);
                    return;
                } else {
                    setTextAlert('Mật khẩu không chính xác');
                    setEmailError(false);
                    setPasswordError(true);
                    return;
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Đăng nhập thất bại');
            });
    }
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
                    placeholder='Email của bạn'
                    placeholderTextColor={'#fff'}
                    textColor='#fff'
                    activeUnderlineColor='green'
                    value={email}
                    onChangeText={text => setEmail(text)}
                    error={emailError}
                />
                <TextInput
                    style={styles.input}
                    secureTextEntry={!isPasswordVisible}
                    placeholder='Mật khẩu'
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
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity
                    style={styles.createAccountButton}
                    onPress={() => navigation.navigate('SignUp')}>
                    <Text style={styles.createAccountButtonText}>Tạo tài khoản mới</Text>
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

export default LoginScreen;