import { SCREEN_WIDTH } from "@/Constants";
import { Alert, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import LinearGradient from "react-native-linear-gradient";
import Modal from 'react-native-modal';
import { useEffect, useState } from "react";
import { TextInput } from "react-native-paper";
import { useRoute } from '@react-navigation/native';
import { useCreateRateMutation, useGetTeamByIdQuery } from "@/Redux/api/team";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import { Linking } from 'react-native'

const OtherTeamScreen = () => {
    const [response, setResponse] = useState();
    const route = useRoute();
    const { id } = route.params as { id: any };
    console.log(id)

    const {
        data,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetTeamByIdQuery({ teamId: id });

    const [CreateRateMutation, { isLoading: isLoading2 }] = useCreateRateMutation();
    useEffect(() => {
        if (isSuccess) {
            console.log(data);
            setResponse(data?.data);
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
    const [content, setContent] = useState<any>();
    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setContent(null);
        setNewStar(1);
        setModalVisible1(!isModalVisible1);
    };

    const handleCreateRate = () => {
        CreateRateMutation({
            teamId: id,
            content: content,
            star: newStar
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
        toggleModal1();
    }

    const handleRate = () => {
        toggleModal1();
    }
    const number = [1, 2, 3, 4, 5];
    const [newStar, setNewStar] = useState<any>(1);

    const handlePhoneCall = (phoneNumber: any) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }
    return (
        <View style={styles.container}>
            <Spinner visible={isLoadingQuery || isLoading2} />
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>Các Team ở Hà Nội</Text>
            </LinearGradient>
            <ScrollView>
                <View style={styles.avatarCoverWrapper}>
                    <TouchableOpacity activeOpacity={0.8}
                    >
                        {response?.image ? (<Image style={styles.cover} source={{ uri: response?.image }} />) : <Image style={styles.cover} source={require("@/Assets/Images/DefaultTeam.png")} />}
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
                    {response?.star > 0 ? (<Text style={{
                        fontSize: 16,
                        fontWeight: "400",
                        color: 'red'
                    }}>{response?.star}/5 sao</Text>) : (<></>)}

                    <TouchableOpacity style={{
                        backgroundColor: '#9599E2',
                        borderRadius: 20,
                        paddingHorizontal: 10,
                        paddingVertical: 4
                    }} onPress={handleRate}>
                        <Text style={{
                            color: '#fff',
                            fontSize: 16,
                            fontWeight: "300"
                        }}>Đánh giá</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.itemWrapPencil}>
                    <Text
                        style={{
                            fontSize: 24,
                            fontWeight: '500',
                            color: '#1877f2'
                        }}
                    >
                        {response?.name}
                    </Text>
                </View>
                <View style={styles.itemWrap2}>
                    <Text style={{ fontSize: 18 }}>Có <Text style={{ color: 'red', fontWeight: 600 }}>{response?.countPlayer}</Text> thành viên</Text>
                </View>
                <View style={styles.itemWrap2}>
                    <Text style={{ fontSize: 16 }}>Đội sân 7</Text>
                </View>
                <View style={styles.itemWrapPencil}>
                    {response?.phone ?
                        (<TouchableOpacity style={{
                            flexDirection: 'row',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }} onPress={() => handlePhoneCall(response?.phone)}>
                            <FontAwesome5Icon size={16} color={'#1877f2'} name="phone" />
                            <Text
                                style={{
                                    fontSize: 18,
                                    color: '#1877f2',
                                    paddingLeft: 10
                                }}
                            >
                                {response?.phone}
                            </Text>
                        </TouchableOpacity>)
                        : (<Text style={{
                            fontSize: 18,
                            paddingLeft: 10
                        }}>Không có thông tin số điện thoại</Text>)
                    }

                </View>
                <View style={styles.itemWrapPencil}>
                    <View>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 500,
                            color: '#000',
                            paddingBottom: 5
                        }}>Thông tin thêm</Text>
                        <Text style={{
                            fontSize: 16,
                            paddingRight: 24,
                            textAlign: 'center'
                        }}>{response?.description}</Text>
                    </View>
                </View>
                {response?.teamRateData.length !== 0 ?
                    (<View style={{
                        marginTop: 20,
                        marginBottom: 50
                    }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: "600",
                            color: '#000',
                            marginLeft: 14
                        }}>{response?.teamRateData.length} lượt đánh giá</Text>
                        {response?.teamRateData.map((rate: any, index: any) => (
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
                        }}>Đánh giá</Text>
                    </View>
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 18,
                        justifyContent: 'center'
                    }}>
                        {number.map((item, index) => (
                            <TouchableOpacity key={index} onPress={() => setNewStar(item)}>
                                {item <= newStar ? (<FontAwesome name="star" color="#1877f2" size={32} />) : (<FontAwesome name="star-o" color="#000" size={32} />)}
                            </TouchableOpacity>
                        ))}
                    </View>
                    <View >
                        <TextInput
                            style={styles.input}
                            placeholder="Đánh giá thêm về Team này"
                            placeholderTextColor={'#ddd'}
                            value={content}
                            onChangeText={text => setContent(text)}
                            activeUnderlineColor="green" />
                    </View>
                    <View style={styles.postOptionWrapperEnd}>
                        <TouchableOpacity onPress={handleCreateRate}>
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
    avatarCoverWrapper: {
        paddingBottom: 20,
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
        bottom: 50 + 10,
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
        right: 20,
        bottom: 16
    },
    btnPencil2: {
        position: 'absolute',
        right: 20,
        bottom: 12
    },
    btnPencil3: {
        position: 'absolute',
        right: 20,
        bottom: 38
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

export default OtherTeamScreen;