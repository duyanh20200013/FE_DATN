import React, { useEffect, useState } from 'react';
import {
    Image,
    Linking,
    Platform,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import Modal from 'react-native-modal';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import Entypo from 'react-native-vector-icons/Entypo'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import LinearGradient from 'react-native-linear-gradient';
import AppLink from 'react-native-app-link';
import { TextInput } from "react-native-paper";
import useLogout from '@/Hooks/useLogout';
import Spinner from 'react-native-loading-spinner-overlay';
import { useAppSelector } from '@/Redux/store';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from '@/Constants';

const HomeScreen = () => {
    const { teamName, image } = useAppSelector(state => state.info);

    const navigation = useNavigation<ScreenNavigationProp>();
    const handleFundManage = () => {
        navigation.navigate('FundManage');
    }
    const handleTeamManage = () => {
        navigation.navigate('TeamManage');
    }
    const handleLineupManage = () => {
        navigation.navigate('Squad');
    }

    const handleNavigateToTeamProfile = () => {
        toggleModal1();
        navigation.navigate('TeamProfile');
    }

    const handleNavigateStadium = () => {
        toggleModal1();
        navigation.navigate('ListStadium');
    }

    const handleNavigateStar = () => {
        toggleModal1();
        // navigation.navigate('CreateMatchFind');
    }

    const handleNavigateListTeam = () => {
        toggleModal1();
        navigation.navigate('ListTeam');
    }

    const handleNavigateFBPage = () => {
        toggleModal1();
        const pageID = 377603436438317; // Waltmart's ID 
        const scheme = Platform.select({ ios: 'fb://profile/', android: 'fb://page/' });
        const url = `${scheme}${pageID}`;
        const appName = 'Facebook';
        const appStoreId = 529379082;
        const appStoreLocale = 'us';
        const playStoreId = 'Facebook';
        AppLink.maybeOpenURL(url, { appName, appStoreId, appStoreLocale, playStoreId }).then(() => {
            Linking.openURL(url);
        })
            .catch((err) => {
                // handle error
            });
    }
    const { handleLogout } = useLogout();

    const [isModalVisible1, setModalVisible1] = useState(false);
    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const [isModalVisible3, setModalVisible3] = useState(false);
    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    };

    // const handleNavigateMessagePage = () => {
    //     const userId = 100076818546219; // Waltmart's ID 
    //     const scheme = 'fb-messenger://user-thread/';
    //     const url = `${scheme}${userId}`;
    //     const appName = 'Messenger';
    //     const appStoreId = 529379082;
    //     const appStoreLocale = 'us';
    //     const playStoreId = 'Messenger';
    //     AppLink.maybeOpenURL(url, { appName, appStoreId, appStoreLocale, playStoreId }).then(() => {
    //         Linking.openURL(url);
    //     })
    //         .catch((err: any) => {
    //             console.log(err)
    //         });
    // }

    return (
        <View style={styles.container}>
            <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                <TouchableOpacity onPress={toggleModal1}>
                    {
                        image ?
                            (<Image style={styles.avatar} source={{ uri: image }} />)
                            : (<Image style={styles.avatar} source={require("@/Assets/Images/DefaultTeam.png")} />)
                    }

                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>{teamName}</Text>
            </LinearGradient>
            <View style={{ justifyContent: 'space-between', height: SCREEN_HEIGHT - 130 }}>
                <View>
                    <View style={styles.wrapHeader}>
                        <TouchableOpacity style={styles.wrapHeaderItem} onPress={handleFundManage}>
                            <Image style={styles.imageHeader} source={require("@/Assets/Images/Quy.png")} />
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#000'
                            }}>Quản lý Quỹ</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.wrapHeaderItem} onPress={handleTeamManage}>
                            <Image style={styles.imageHeader} source={require("@/Assets/Images/ManageTeam.png")} />
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#000'
                            }}>Quản lý Team</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.wrapEnd}>
                        <TouchableOpacity style={styles.wrapEndItem} onPress={handleLineupManage}>
                            <Image style={{
                                height: 70,
                                width: 100,
                                marginBottom: 14
                            }} source={require("@/Assets/Images/Lineup.png")} />
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#000'
                            }}>Đội hình ra sân</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.wrapEnd}>
                        <TouchableOpacity style={styles.wrapEndItem} onPress={() => { navigation.navigate('MatchFind') }}>
                            <Image style={{
                                height: 60,
                                width: 70,
                                marginBottom: 14
                            }} source={require("@/Assets/Images/Find1.png")} />
                            <Text style={{
                                fontSize: 17,
                                fontWeight: 600,
                                color: '#000'
                            }}>Tìm kiếm trận đấu</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <TouchableOpacity style={{
                    alignSelf: 'center',
                    alignItems: 'center',
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    backgroundColor: '#fff',
                    paddingVertical: 12,
                    paddingHorizontal: 8,
                    borderRadius: 16,
                    width: '50%'
                }}
                    onPress={toggleModal3}>
                    <Text style={{ fontSize: 17, fontWeight: 500 }}>Ủng hộ <Text style={{ color: 'red', fontWeight: 700 }}>Football Lover</Text> </Text>
                </TouchableOpacity>
            </View>
            <Modal
                animationIn={'slideInLeft'}
                animationInTiming={600}
                animationOut={'slideOutLeft'}
                animationOutTiming={600}
                isVisible={isModalVisible1}
                onBackdropPress={toggleModal1}
                onBackButtonPress={toggleModal1}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal1}
                useNativeDriverForBackdrop
                swipeDirection={['left']}
                style={{
                    margin: 1,
                    width: '65%',
                    backgroundColor: '#fff',
                    justifyContent: 'flex-start'
                }}>
                <View style={styles.containerModal}>
                    <LinearGradient
                        colors={['#8BC6EC', '#9599E2']}
                        style={styles.navigationBarModal}
                    >
                        <TouchableOpacity>
                            {
                                image ?
                                    (<Image style={styles.avatarModal} source={{ uri: image }} />)
                                    : (<Image style={styles.avatarModal} source={require("@/Assets/Images/DefaultTeam.png")} />)
                            }
                        </TouchableOpacity>
                        <Text style={styles.textNavigationBarModal}>{teamName}</Text>
                    </LinearGradient>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleNavigateToTeamProfile}>
                        <AntDesign name="profile" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Hồ sơ đội bóng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleNavigateListTeam}>
                        <Entypo name="location" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Các team ở Hà Nội</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleNavigateFBPage}>
                        <Entypo name="facebook" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Cộng đồng Football Lover</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleNavigateStadium}>
                        <MaterialCommunityIcons name="stadium" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Các sân bóng ở Hà Nội</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleNavigateStar}>
                        <Entypo name="star" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Đánh giá 5 sao</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.bodyModalItem} onPress={handleLogout}>
                        <MaterialCommunityIcons name="logout" color="#000" size={20} />
                        <Text style={styles.textBodyModal}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

            {/* Modal Guild */}
            <Modal isVisible={isModalVisible3}
                onBackdropPress={toggleModal3}
                onBackButtonPress={toggleModal3}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal3}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper2}>
                    <LinearGradient colors={['#DE6262', '#FFB88C']} style={{ paddingVertical: 12, alignItems: 'center', justifyContent: 'center', flexDirection: 'row' }}>
                        <TouchableOpacity
                            onPress={toggleModal3}
                            style={{
                                width: 50,
                                position: 'absolute',
                                top: '50%',
                                left: 18
                            }}>
                            <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 15, textAlign: 'center'
                        }}>Ủng hộ Football Lover</Text>
                    </LinearGradient>
                    <View style={{ width: '100%', backgroundColor: '#FFB88C' }}>
                        <View style={styles.guideWrap}>
                            <Text style={styles.guideWrapText}>Football Lover là ứng dụng miễn phí. Chúng tôi rất vui nếu được các bạn ủng hộ và động viên. Các bạn có thể ủng hộ Football Lover bằng các cách sau</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            paddingVertical: 4,
                            marginLeft: 40,
                            marginHorizontal: 10
                        }}>
                            <Text style={styles.guideWrapTextItem}>Đăng kí sử dụng phiên bản cao cấp để kích hoạt các chức năng chuyên biệt và nhận được sự hỗ trợ tốt hơn</Text>
                        </View>
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: 8,
                            paddingVertical: 4,
                            marginLeft: 40,
                            marginRight: 10
                        }}>
                            <Text style={styles.guideWrapTextItem}>Đánh giá 5 sao và giới thiệu Football Lover tới bạn bè</Text>
                        </View>
                        <View style={{
                            alignItems: 'center', paddingTop: 24, paddingBottom: 14

                        }}>
                            <Text style={styles.guideWrapText1}>Cảm ơn các bạn rất nhiều</Text>
                        </View>
                    </View>
                </View>
            </Modal >
        </View>
    );
};
const styles = StyleSheet.create({
    container: {
        marginBottom: 50,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        height: 64,
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: '#fff',
        paddingHorizontal: 12,
        marginBottom: 40
    },
    textNavigationBar: {
        fontSize: 18,
        fontWeight: '700',
        color: '#fff',
    },
    avatar: {
        height: 44,
        width: 44,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 2,
    },
    wrapHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 26
    },
    wrapHeaderItem: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 24,
        borderRadius: 16,
    },
    imageHeader: {
        height: 70,
        width: 110,
        marginBottom: 14
    },
    wrapEnd: {
        marginTop: 20,
        paddingHorizontal: 26
    },
    wrapEndItem: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 18,
        borderRadius: 16,
    },
    containerModal: {

    },
    navigationBarModal: {
        borderBottomWidth: 1,
        paddingLeft: 12,
        borderBottomColor: '#fff',
        paddingVertical: 16,
        marginBottom: 24,

    },
    avatarModal: {
        height: 40,
        width: 40,
        borderRadius: 2000,
        borderColor: '#fff',
        borderWidth: 1,
        marginBottom: 6
    },
    textNavigationBarModal: {
        fontSize: 14,
        color: '#fff',
    },
    bodyModalItem: {
        flexDirection: 'row',
        paddingVertical: 16,
        paddingLeft: 8
    },
    textBodyModal: {
        marginLeft: 14,
        fontSize: 15,
        color: '#000',
        opacity: 0.6,
        fontWeight: '600'
    },
    postOptionsWrapper2: {
        backgroundColor: '#FFB88C',
        width: SCREEN_WIDTH - 60,
    },
    postOptionItemWrapper2: {
        paddingBottom: 10,
        paddingTop: 30,
        paddingLeft: 20,
        paddingRight: 10,
    },
    postOptionWrapperEnd2: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
        paddingTop: 10,
        paddingLeft: 140,
        paddingRight: 50,
    },
    guideWrap: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 12,
        marginHorizontal: 10
    },
    guideWrapText: {
        fontSize: 16,
        fontWeight: "500",
        color: '#fff'
    },
    guideWrapText1: {
        fontSize: 18,
        fontWeight: "700",
        color: '#fff'
    },
    guideWrapTextItem: {
        fontSize: 14,
        fontWeight: "400",
        color: '#fff'
    }

});

export default HomeScreen;