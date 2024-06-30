import React, { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Modal from 'react-native-modal';
import { SCREEN_WIDTH } from '@/Constants';
import * as ImagePicker from 'react-native-image-picker';
import { useEditTeamMutation, useGetMyTeamQuery, useGetTeamByIdQuery } from '@/Redux/api/team';
import Spinner from 'react-native-loading-spinner-overlay';
import { useFocusEffect } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '@/Redux/store';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { setTeamName } from '@/Redux/reducer/userInfo';

/* toggle includeExtra */
const includeExtra = true;

const TeamProfileScreen = () => {
    const dispatch = useAppDispatch();
    const id = useAppSelector(state => state.info.id);
    // const {
    //     data: response,
    //     isSuccess,
    //     isLoading: isLoadingQuery,
    //     error,
    //     refetch,
    // } = useGetMyTeamQuery();

    const [data, setData] = useState<any>();
    const [name, setName] = useState<any>();
    const [phone, setPhone] = useState<any>();
    const [description, setDescription] = useState<any>();

    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetTeamByIdQuery({ teamId: id || 0 });

    const [EditTeamMutation, { isLoading: isLoading2 }] = useEditTeamMutation();

    useEffect(() => {
        if (isSuccess) {
            console.log('response:', response.data);
            setData(response.data);
            setName(response.data?.name);
            setPhone(response.data?.phone);
            setDescription(response.data?.description);
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
    const [isModalVisible1, setModalVisible1] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);
    const [isModalVisible3, setModalVisible3] = useState(false);

    const toggleModal1 = () => {
        setName(data.name);
        setModalVisible1(!isModalVisible1);
    };

    const toggleModal2 = () => {
        setPhone(data.phone);
        setModalVisible2(!isModalVisible2);
    };

    const toggleModal3 = () => {
        setDescription(data.description);
        setModalVisible3(!isModalVisible3);
    };

    const handleUpdateName = () => {
        EditTeamMutation({
            name: name,
            phone: null,
            image: null,
            description: null,
            balance: null
        }).unwrap()
            .then(res => {
                if (res.errCode === 0) {
                    dispatch(setTeamName(name));
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal1();
    }
    const handleUpdatePhone = () => {
        EditTeamMutation({
            name: null,
            phone: phone,
            image: null,
            description: null,
            balance: null
        }).unwrap()
            .then(res => {
                if (res.errCode === 0) {
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal2();
    }
    const handleUpdateDescription = () => {
        EditTeamMutation({
            name: null,
            phone: null,
            image: null,
            description: description,
            balance: null
        }).unwrap()
            .then(res => {
                if (res.errCode === 0) {
                    console.log(res);
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal3();
    }

    const number = [1, 2, 3, 4, 5];

    const handleLibrary = () => {
        ImagePicker.launchImageLibrary(actions[1].options, res => {
            if (res.assets) {
                navigation.navigate('PreViewAvatar', {
                    image: res?.assets[0],
                    linkFirabase: data?.image
                });
            }
        });
    };
    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery || isLoading2} />
            <View style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Hồ sơ đội bóng</Text>
            </View>
            <ScrollView>
                <View style={styles.avatarCoverWrapper}>
                    <TouchableOpacity activeOpacity={0.8}
                    >
                        {data?.image ? (<Image style={styles.cover} source={{ uri: data?.image }} />) : <Image style={styles.cover} source={require("@/Assets/Images/DefaultTeam.png")} />}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnChangeCover} >
                        <FontAwesome5Icon size={18} name="camera" onPress={handleLibrary} />
                    </TouchableOpacity>
                </View>
                <View style={{
                    flexDirection: 'row',
                    gap: 8,
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    marginRight: 14,
                    marginBottom: 16
                }}>
                    {data?.star > 0 ? (<Text style={{
                        fontSize: 16,
                        fontWeight: "400",
                        color: 'red'
                    }}>{data?.star}/5 sao</Text>) : (<></>)}

                </View>
                <View style={styles.itemWrapPencil}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '500',
                            color: '#1877f2'
                        }}
                    >
                        {data?.name}
                    </Text>
                    <TouchableOpacity style={styles.btnPencil1} onPress={toggleModal1}>
                        <FontAwesome5Icon size={20} name="pencil-alt" />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemWrap2}>
                    <Text style={{ fontSize: 18 }}>Có <Text style={{ color: 'red', fontWeight: 600 }}>{data?.countPlayer}</Text> thành viên</Text>
                </View>
                <View style={styles.itemWrap2}>
                    <Text style={{ fontSize: 16 }}>Đội sân 7</Text>
                </View>
                <View style={styles.itemWrapPencil}>
                    {data?.phone ?
                        (<TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <FontAwesome5Icon size={16} color={'#1877f2'} name="phone" />
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: '#1877f2',
                                    paddingLeft: 10
                                }}
                            >
                                {data?.phone}
                            </Text>
                        </TouchableOpacity>)
                        : ((<Text style={{
                            fontSize: 15,
                        }}>Số điện thoại để các đội liên lạc ...</Text>))
                    }
                    <TouchableOpacity style={styles.btnPencil2}>
                        <FontAwesome5Icon size={20} name="pencil-alt" onPress={toggleModal2} />
                    </TouchableOpacity>
                </View>
                <View style={styles.itemWrapPencil}>
                    <View>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: '#000',
                            paddingBottom: 5,
                            textAlign: 'center'
                        }}>Thông tin thêm</Text>
                        <Text style={{
                            fontSize: 16,
                            paddingRight: 24,
                            textAlign: 'center'
                        }}>{data?.description}</Text>
                    </View>
                    <TouchableOpacity style={styles.btnPencil3}>
                        <FontAwesome5Icon size={20} name="pencil-alt" onPress={toggleModal3} />
                    </TouchableOpacity>
                </View>
                {data?.teamRateData.length !== 0 ?
                    (<View style={{
                        marginTop: 20,
                        marginBottom: 50
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: '#000',
                            marginLeft: 14
                        }}>{data?.teamRateData.length} lượt đánh giá</Text>
                        {data?.teamRateData.map((rate: any, index: any) => (
                            <View key={index} style={styles.rateWrap}>
                                <View style={styles.rateWrapHeader}>
                                    {
                                        rate.oppositeData.image ?
                                            (<Image style={styles.avatar} source={{ uri: rate.oppositeData.image }} />)
                                            : (<Image style={styles.avatar} source={require("@/Assets/Images/DefaultTeam.png")} />)
                                    }
                                    <Text style={styles.textNameTeam}>{rate.oppositeData.name}</Text>
                                </View>
                                <View style={styles.rateWrapBody}>
                                    <View style={{
                                        flexDirection: 'row',
                                        gap: 4,
                                        marginBottom: 6
                                    }}>
                                        {number.map((item, index) => (
                                            <View key={index}>
                                                {item <= rate.star ? (<FontAwesome name="star" color="#1877f2" size={20} />) : (<FontAwesome name="star-o" color="#000" size={20} />)}
                                            </View>
                                        ))}
                                        <Text>{rate.updatedAt.substring(8, 10)}/{rate.updatedAt.substring(5, 7)}/{rate.updatedAt.substring(0, 4)}</Text>
                                    </View>
                                    <View>
                                        <Text>{rate.content}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>) :
                    (<View style={{
                        marginTop: 20,
                        marginBottom: 50,
                        justifyContent: 'center'
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "400",
                            textAlign: 'center'
                        }}>Không có đánh giá nào!</Text>
                    </View>)}
            </ScrollView>
            {/* Model cập nhật name */}
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
                    <View style={{
                        paddingBottom: 10,
                        paddingTop: 10,
                        paddingLeft: 20,
                        paddingRight: 10,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: '#000',
                            textAlign: 'center',
                        }}>Cập nhật tên đội</Text>
                    </View>
                    <View >
                        <TextInput
                            style={styles.input}
                            value={name}
                            onChangeText={text => setName(text)}
                            activeUnderlineColor="green" />
                    </View>
                    <View style={styles.postOptionWrapperEnd}>
                        <TouchableOpacity onPress={handleUpdateName}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Xác nhận
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal1}>
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
                </View>
            </Modal>
            {/* Model cập nhật phone */}
            <Modal
                isVisible={isModalVisible2}
                onBackdropPress={toggleModal2}
                onBackButtonPress={toggleModal2}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal2}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5, borderRadius: 50, alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper}>
                    <View style={{
                        paddingBottom: 10,
                        paddingTop: 10,
                        paddingLeft: 20,
                        paddingRight: 10,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: '#000',
                            textAlign: 'center',
                        }}>Cập nhật SĐT</Text>
                    </View>
                    <View >
                        <TextInput
                            style={styles.input}
                            keyboardType={'phone-pad'}
                            value={phone}
                            onChangeText={text => setPhone(text)}
                            activeUnderlineColor="green" />
                    </View>
                    <View style={styles.postOptionWrapperEnd}>
                        <TouchableOpacity onPress={handleUpdatePhone}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Xác nhận
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal2}>
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
                </View>
            </Modal>
            {/* Model cập nhật description */}
            <Modal
                isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal3}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5, borderRadius: 50, alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper}>
                    <View style={{
                        paddingBottom: 10,
                        paddingTop: 10,
                        paddingLeft: 20,
                        paddingRight: 10,
                    }}>
                        <Text style={{
                            fontSize: 17,
                            fontWeight: '700',
                            color: '#000',
                            textAlign: 'center',
                        }}>Thông tin thêm</Text>
                    </View>
                    <View >
                        <TextInput
                            style={styles.input}
                            value={description}
                            onChangeText={text => setDescription(text)}
                            activeUnderlineColor="green" />
                    </View>
                    <View style={styles.postOptionWrapperEnd}>
                        <TouchableOpacity onPress={handleUpdateDescription}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#318bfb',
                                    }}>
                                    Xác nhận
                                </Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={toggleModal3}>
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
                </View>
            </Modal>
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        // backgroundColor: '#fff',
        marginBottom: 50,
    },
    navigationBar: {
        paddingTop: 12,
        flexDirection: 'row',
        height: 64,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        marginHorizontal: 10,
    },
    btnBack: {
        width: 50,
        alignItems: 'center',
    },
    textNavigationBar: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 15,
    },
    avatarCoverWrapper: {
        paddingBottom: 30,
        position: 'relative'
    },
    cover: {
        width: '100%',
        height: 200,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    btnChangeCover: {
        borderColor: '#fff',
        backgroundColor: '#ddd',
        position: 'absolute',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 50,
        width: 45,
        height: 45,
        borderWidth: 2.5,
        bottom: 30 + 10,
        right: 10,
        justifyContent: 'center',
        alignItems: 'center'

    },
    itemWrapPencil: {
        alignItems: 'center',
        borderRightWidth: 3,
        borderRightColor: 'green',
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        paddingVertical: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        position: 'relative'
    },
    itemWrap2: {
        alignItems: 'center',
        borderRightWidth: 3,
        borderRightColor: 'green',
        borderLeftWidth: 3,
        borderLeftColor: 'red',
        borderRadius: 4,
        backgroundColor: '#fff',
        marginHorizontal: 30,
        paddingVertical: 10,
        paddingLeft: 10,
        marginBottom: 20
    },
    btnPencil1: {
        position: 'absolute',
        right: 16,
        bottom: '50%'
    },
    btnPencil2: {
        position: 'absolute',
        right: 16,
        bottom: '50%'
    },
    btnPencil3: {
        position: 'absolute',
        right: 16,
        bottom: '50%'
    },
    postOptionsWrapper: {
        paddingTop: 16,
        paddingBottom: 10,
        backgroundColor: '#F0F8FF',
        width: SCREEN_WIDTH - 60,
    },
    postOptionWrapperEnd: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 140,
        paddingRight: 50,
    },
    input: {
        height: 40,
        borderRadius: 10,
        marginHorizontal: 14,
        marginBottom: 10,
        backgroundColor: '#F0F8FF',
    },
    rateWrap: {
        marginHorizontal: 4,
        marginTop: 10,
    },
    rateWrapHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginHorizontal: 12,
        marginVertical: 12
    },
    avatar: {
        height: 42,
        width: 42,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 2,
    },
    textNameTeam: {
        fontSize: 17,
        color: '#000',
        fontWeight: "600"
    },
    rateWrapBody: {
        marginHorizontal: 12
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

export default TeamProfileScreen;