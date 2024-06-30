import { Alert, Image, Keyboard, Platform, StyleSheet, Text, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { TextInput } from 'react-native-paper';
import { SCREEN_WIDTH, SCREEN_HEIGHT, STATUSBAR_HEIGHT } from '@/Constants';
import { useState } from "react";
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'react-native-image-picker';
import Modal from 'react-native-modal';
import { ScreenNavigationProp } from "@/Routes/Stack";
import LinearGradient from "react-native-linear-gradient";
import storage from '@react-native-firebase/storage';
import Spinner from "react-native-loading-spinner-overlay";
import { useAddTeamMutation } from "@/Redux/api/team";
import { resolver } from "../../../../metro.config";
import { useAppDispatch } from "@/Redux/store";
import { setTeamNameAndImage } from "@/Redux/reducer/userInfo";

/* toggle includeExtra */
const includeExtra = true;

const CreateTeamScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<ScreenNavigationProp>();
    const [name, setName] = useState<any>();
    const [phone, setPhone] = useState<any>();
    const [description, setDescription] = useState<any>();
    const [image, setImage] = useState<any>();
    const [link, setLink] = useState<string>(
        'https://static.thenounproject.com/png/187803-200.png',
    );

    const [textAlert, setTextAlert] = useState('');
    const [nameError, setNameError] = useState(false);
    const [phoneError, setPhoneError] = useState(false);
    const [AddTeamMutation, { isLoading }] = useAddTeamMutation();
    const [loadingImage, setLoadingImage] = useState(false);

    const handleUploadImageandGetUrl = async () => {
        const filename = link.substring(link.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? link.replace('file://', '') : link;
        setLoadingImage(true);

        const imageRef = storage().ref(filename)
        await imageRef.putFile(uploadUri, { contentType: 'image/jpg' }).catch((error) => { setLoadingImage(false); throw error })
        const url = await imageRef.getDownloadURL().catch((error) => { setLoadingImage(false); throw error });
        setLoadingImage(false);
        return url;
    }

    const handleCreateTeam = async () => {
        if (name === null || name === undefined) {
            setNameError(true);
            setTextAlert('Tên đội không thể bỏ trống')
            return;
        }
        if (phone === null || phone === undefined) {
            setNameError(false);
            setPhoneError(true);
            setTextAlert('Số điện thoại không hợp lệ')
            return;
        }
        let uploadLink: any = null;
        if (image === null || image === undefined) {
            uploadLink = undefined;
        } else {
            uploadLink = await handleUploadImageandGetUrl();
        }
        AddTeamMutation({ name, phone, description, image: uploadLink })
            .unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode === 0) {
                    let dataImage = 'https://img.freepik.com/premium-vector/pre-match-football-team-photo-illustration-background_188398-318.jpg'
                    if (uploadLink) {
                        dataImage = uploadLink;
                    }
                    let value = {
                        teamName: name,
                        image: dataImage
                    }
                    dispatch(setTeamNameAndImage(value));
                    navigation.reset({
                        index: 0,
                        routes: [{ name: 'CreatePlayer' }],
                    });
                } else {
                    Alert.alert('Upload thất bại với errCode là 1');
                    return;
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Upload thất bại');
            });

    };

    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const handleCamera = () => {
        toggleModal1();
        ImagePicker.launchCamera(actions[0].options, response => {
            if (response.assets && response.assets[0].uri) {
                setLink(response.assets[0].uri);
                setImage(response.assets[0]);
            }
        });
    };

    const handleLibrary = () => {
        toggleModal1();
        ImagePicker.launchImageLibrary(actions[1].options, response => {
            if (response.assets && response.assets[0].uri) {
                setLink(response.assets[0].uri);
                setImage(response.assets[0]);
            }
        });
    };
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.container}>
                <Spinner visible={loadingImage} />
                <Spinner visible={isLoading} />
                <LinearGradient
                    colors={['#8BC6EC', '#9599E2']}
                    style={{
                        flexDirection: 'row',
                        height: 58,
                        width: '100%',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderBottomWidth: 1,
                        borderBottomColor: '#fff',
                        paddingHorizontal: 10,
                        marginBottom: 20
                    }}
                >
                    <Text style={{ fontSize: 19, color: '#fff', fontWeight: 600 }}>Tạo đội bóng của bạn</Text>
                </LinearGradient>
                <View style={{ paddingHorizontal: 20, alignItems: 'center' }}>
                    <Text style={{ color: 'red', fontSize: 18 }}>{textAlert}</Text>
                    <TouchableOpacity
                        style={{
                            marginBottom: 10,
                            marginTop: 10
                        }} onPress={toggleModal1}>
                        <Image
                            style={styles.avatar}
                            source={{
                                uri: link,
                            }}></Image>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: 'bold',
                            marginLeft: 46,
                            marginVertical: 5
                        }}>Thêm ảnh</Text>
                    </TouchableOpacity>
                    <TextInput
                        style={styles.input}
                        label="Team Name"
                        value={name}
                        onChangeText={text => setName(text)}
                        activeUnderlineColor="green"
                        error={nameError}
                    />
                    <TextInput
                        style={styles.input}
                        keyboardType={'phone-pad'}
                        label="Phone Number"
                        value={phone}
                        onChangeText={text => setPhone(text)}
                        error={phoneError}
                    />
                    <TextInput
                        style={styles.input}
                        label="Description"
                        value={description}
                        onChangeText={text => setDescription(text)}
                    />
                    <TouchableOpacity style={styles.loginButton} onPress={handleCreateTeam}>
                        <Text style={styles.loginButtonText}>Lưu</Text>
                    </TouchableOpacity>
                </View>
                {/* Model Chụp ảnh*/}
                <Modal
                    isVisible={isModalVisible1}
                    onBackdropPress={toggleModal1}
                    onBackButtonPress={toggleModal1}
                    backdropOpacity={0.3}
                    onSwipeComplete={toggleModal1}
                    useNativeDriverForBackdrop
                    swipeDirection={['down']}
                    style={{
                        margin: 5, borderRadius: 50, alignItems: 'center',
                    }}>
                    <View style={styles.postOptionsWrapper}>
                        <TouchableOpacity style={styles.postOptionItemWrapper} onPress={handleCamera}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '400',
                                    color: '#000',
                                }}>
                                Chụp ảnh
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postOptionItemWrapper} onPress={handleLibrary}>
                            <Text
                                style={{
                                    fontSize: 17,
                                    fontWeight: '400',
                                    color: '#000',
                                }}>
                                Chọn ảnh
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.postOptionWrapperEnd} onPress={() => setModalVisible1(false)}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Hủy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        // flex: 1,
        justifyContent: 'center',
        // paddingHorizontal: 20,
    },

    input: {
        width: '100%',
        height: 60,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    avatar: {
        height: 165,
        width: 165,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 5,
    },
    btnTemporary: {
        backgroundColor: '#E4E4E4',
        borderRadius: 5,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 150,
        marginRight: 13,
    },
    btnAddFrame: {
        backgroundColor: '#E4E4E4',
        borderRadius: 5,
        height: 40,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
        marginRight: 13,
    },
    loginButton: {
        width: '100%',
        height: 40,
        backgroundColor: '#1877f2',
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    postOptionsWrapper: {
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#F0F8FF',
        width: SCREEN_WIDTH - 60,
    },
    postOptionItemWrapper: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 20,
    },
    postOptionWrapperEnd: {
        paddingBottom: 10,
        paddingTop: 10,
        paddingRight: 40,
        alignItems: 'flex-end'
    }
});

interface Action {
    title: string;
    type: 'capture' | 'library';
    options: ImagePicker.CameraOptions | ImagePicker.ImageLibraryOptions;
}

const actions: Action[] = [
    {
        title: 'Chụp Ảnh',
        type: 'capture',
        options: {
            saveToPhotos: true,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },
    {
        title: 'Chọn Ảnh từ thư viện',
        type: 'library',
        options: {
            selectionLimit: 1,
            mediaType: 'photo',
            includeBase64: false,
            includeExtra,
        },
    },
    {
        title: 'Quay Video',
        type: 'capture',
        options: {
            saveToPhotos: true,
            formatAsMp4: true,
            mediaType: 'video',
            includeExtra,
        },
    },
    {
        title: 'Chọn Video từ thư viện',
        type: 'library',
        options: {
            selectionLimit: 0,
            mediaType: 'video',
            formatAsMp4: true,
            includeExtra,
        },
    },
    {
        title: 'Chọn ảnh hoặc video',
        type: 'library',
        options: {
            selectionLimit: 0,
            mediaType: 'mixed',
            includeExtra,
        },
    },
];

if (Platform.OS === 'ios') {
    actions.push({
        title: 'Take Image or Video\n(mixed)',
        type: 'capture',
        options: {
            saveToPhotos: true,
            mediaType: 'mixed',
            includeExtra,
            presentationStyle: 'fullScreen',
        },
    });
}


export default CreateTeamScreen;