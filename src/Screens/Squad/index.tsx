import { Alert, Animated, Image, ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import FontAwesome5Icon from "react-native-vector-icons/FontAwesome5";
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import { SCREEN_HEIGHT, SCREEN_WIDTH } from "@/Constants";
import { useEffect, useRef, useState } from "react";
import Draggable from 'react-native-draggable';
import Modal from 'react-native-modal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from "react-native-linear-gradient";
import EvilIcons from "react-native-vector-icons/EvilIcons";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Octicons from 'react-native-vector-icons/Octicons'
import { TextInput } from "react-native-paper";
import { useAppSelector } from "@/Redux/store";
import { useGetLineUpQuery } from "@/Redux/api/team";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import Spinner from "react-native-loading-spinner-overlay";
import ViewShot from "react-native-view-shot";
var RNFS = require("react-native-fs");
import Share from "react-native-share";
import { useAddPlayerMutation, useAddSupportMutation, useDeleteSupportMutation, useRemoveAllPositionMutation, useRemovePositionMutation, useUpdatePositionMutation } from "@/Redux/api/player";

const SquadScreen = () => {
    const viewShotRef = useRef(null);
    const [isSharingView, setSharingView] = useState(false);
    useEffect(() => {
        if (isSharingView) {
            const shareScreenshot = async () => {
                try {
                    const uri = await viewShotRef.current?.capture();
                    const res = await RNFS.readFile(uri, "base64");
                    const urlString = `data:image/jpeg;base64,${res}`;
                    const info = '...';
                    const filename = '...';
                    const options = {
                        title: info,
                        message: info,
                        url: urlString,
                        type: "image/jpeg",
                        filename: filename,
                        subject: info,
                    };
                    await Share.open(options);
                    setSharingView(false);
                } catch (error) {
                    setSharingView(false);
                    console.log("shareScreenshot error:", error);
                }
            };
            shareScreenshot();
        }
    }, [isSharingView]);
    const { teamName } = useAppSelector(state => state.info);
    const [data, setData] = useState();
    const {
        data: response,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetLineUpQuery();

    const [AddSupportMutation, { isLoading: isLoading1 }] = useAddSupportMutation();
    const [AddPlayerMutation, { isLoading: isLoading2 }] = useAddPlayerMutation();
    const [DeleteSupportMutation, { isLoading: isLoading3 }] = useDeleteSupportMutation();
    const [UpdatePositionMutation, { isLoading: isLoading4 }] = useUpdatePositionMutation();
    const [RemovePositionMutation, { isLoading: isLoading5 }] = useRemovePositionMutation();
    const [RemoveAllPositionMutation, { isLoading: isLoading6 }] = useRemoveAllPositionMutation();
    useEffect(() => {
        if (isSuccess) {
            setData(response?.data);
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

    const [playerIndexUpdate, setPlayerIndexUpdate] = useState<number>(1);
    const [isModalVisible1, setModalVisible1] = useState(false);

    const toggleModal1 = () => {
        setModalVisible1(!isModalVisible1);
    };

    const handleClickDraggable = (index: number) => {
        setPlayerIndexUpdate(index);
        toggleModal1();
    }
    const handleUpdateLineupPlayer = (player: any) => {
        console.log(player);
        UpdatePositionMutation({ position: playerIndexUpdate.toString(), type: 'Player', id: player?.id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    refetch();
                } else {
                    Alert.alert('Không tìm thấy cầu thủ ');
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal2();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal1();
    }
    const handleUpdateLineupSupport = (support: any) => {
        UpdatePositionMutation({ position: playerIndexUpdate.toString(), type: 'Support', id: support?.id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 0) {
                    refetch();
                } else {
                    Alert.alert('Không tìm thấy cầu thủ ');
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal2();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
        toggleModal1();
    }

    const handleDeleteSupport = (player: any) => {
        DeleteSupportMutation({ supportId: player?.id })
            .unwrap()
            .then(res => {
                console.log(res);
                if (res.errCode === 1) {
                    Alert.alert('Không tìm thấy cầu thủ hỗ trợ');
                } else {
                    refetch();
                }
            })
            .catch(err => {
                console.log(err);
                toggleModal2();
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const [isModalVisible2, setModalVisible2] = useState(false);

    const toggleModal2 = () => {
        setNameNewPlayer(null);
        setNumberNewPlayer(null);
        setAlertText(null);
        setModalVisible2(!isModalVisible2);
    };

    const [typeAddPlayer, setTypeAddPlayer] = useState<number>(1)
    const handleToggleModalAddPlayer = (type: number) => {
        setTypeAddPlayer(type);
        toggleModal2();
    }

    const [nameNewPlayer, setNameNewPlayer] = useState<any>(null);
    const [numberNewPlayer, setNumberNewPlayer] = useState<any>(null);

    const handleCreatePlayer = () => {
        if (nameNewPlayer === null || nameNewPlayer === undefined) {
            setAlertText('Tên cầu thủ không được bỏ trống');
            return;
        }
        if (numberNewPlayer === null || numberNewPlayer === undefined) {
            setAlertText('Số áo không được bỏ trống');
            return;
        }
        if (typeAddPlayer !== 1) {
            AddSupportMutation({ name: nameNewPlayer, number: numberNewPlayer })
                .unwrap()
                .then(res => {
                    console.log(res);
                    if (res.errCode === 1) {
                        setAlertText(`Đã có cầu thủ có số áo là ${numberNewPlayer}`);
                        return;
                    } else {
                        refetch();
                        toggleModal2();
                    }
                })
                .catch(err => {
                    console.log(err);
                    toggleModal2();
                    Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
                });
        } else {
            AddPlayerMutation({ name: nameNewPlayer, number: numberNewPlayer, phone: null, isCaptain: false })
                .unwrap()
                .then(data => {
                    console.log(data);
                    if (data.errCode === 1) {
                        setAlertText(`Đã có cầu thủ với số áo ${nameNewPlayer}`)
                        return;
                    } else {
                        refetch();
                        toggleModal2();
                    }
                })
                .catch(err => {
                    console.log(err);
                    toggleModal2();
                    Alert.alert('Có vấn đề xảy ra trong quá trình thực hiện');
                });
        }
    }

    const [isModalVisible3, setModalVisible3] = useState(false);

    const toggleModal3 = () => {
        setModalVisible3(!isModalVisible3);
    };

    const handleDeleteSquad = () => {
        RemoveAllPositionMutation()
            .unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode !== 0) {
                    Alert.alert('Có vấn đề xảy ra trong quá trình Xoá Position');
                    return;
                } else {
                    refetch();
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có vấn đề xảy ra trong quá trình thực hiện');
            });
    }

    const handleRemovePosition = () => {
        RemovePositionMutation({ position: playerIndexUpdate.toString() }).
            unwrap()
            .then(data => {
                console.log(data);
                if (data.errCode !== 0) {
                    Alert.alert('Có vấn đề xảy ra trong quá trình Xoá LineUp');
                    return;
                } else {
                    refetch();
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có vấn đề xảy ra trong quá trình thực hiện');
            });
    }

    const [alertText, setAlertText] = useState<any>();


    return (
        <View>
            <Spinner visible={isLoadingQuery || isLoading1 || isLoading2 || isLoading3 || isLoading4 || isLoading5 || isLoading6} />
            <View style={styles.navigationBar}>
                <TouchableOpacity
                    onPress={onPressGoBackHandler}
                    style={styles.btnBack}>
                    <FontAwesome5Icon name="arrow-left" color="#318bfb" size={20} />
                </TouchableOpacity>
                <Text style={styles.textNavigationBar}>{teamName}</Text>
            </View>
            <View>
                <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
                    <View style={{ height: 480, }}>
                        <ImageBackground
                            source={require("@/Assets/Images/Pitch.png")}
                            style={{
                                width: null,
                                height: null,
                                flex: 1,
                            }}>
                            <Draggable
                                x={SCREEN_WIDTH / 2 - 25}
                                y={390}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(1)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Short2.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['1']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['1']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={SCREEN_WIDTH / 4 - 25}
                                y={250}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(2)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['2']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['2']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={SCREEN_WIDTH / 2 - 25}
                                y={300}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(3)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['3']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['3']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={3 * SCREEN_WIDTH / 4 - 25}
                                y={250}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(4)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['4']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['4']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={SCREEN_WIDTH / 4 - 25}
                                y={100}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(5)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['5']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['5']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={SCREEN_WIDTH / 2 - 25}
                                y={160}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(6)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['6']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['6']?.number}</Text>
                                    </View>
                                }
                            />
                            <Draggable
                                x={3 * SCREEN_WIDTH / 4 - 25}
                                y={100}
                                renderSize={50}
                                renderColor='transparent'
                                onShortPressRelease={() => handleClickDraggable(7)}
                                children={
                                    <View style={{ alignItems: 'center' }}>
                                        <Image style={[styles.imageShirt]} source={require("@/Assets/Images/Shirt.png")} />
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['7']?.name}</Text>
                                        <Text style={{ fontSize: 12, color: '#fff' }}>{data?.lineup['7']?.number}</Text>
                                    </View>
                                }
                            />
                        </ImageBackground>
                    </View>
                </ViewShot>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 8, marginVertical: 12, justifyContent: 'flex-end', gap: 20 }}>
                    <TouchableOpacity onPress={handleDeleteSquad}>
                        <Octicons name="trash" color="#151E3D" size={31} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={toggleModal3} style={{ backgroundColor: '#8D021F', paddingHorizontal: 13, paddingVertical: 7 }}>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Hướng dẫn</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={{ backgroundColor: '#318bfb', paddingHorizontal: 13, paddingVertical: 7 }} onPress={() => setSharingView(true)}>
                        <Text style={{ fontSize: 18, fontWeight: 600, color: '#fff' }}>Chia sẻ</Text>
                    </TouchableOpacity>
                </View>
            </View>
            {/* Modal change Lineup */}
            <Modal
                animationIn={'slideInRight'}
                animationInTiming={600}
                animationOut={'slideOutRight'}
                animationOutTiming={600}
                isVisible={isModalVisible1}
                onBackdropPress={toggleModal1}
                onBackButtonPress={toggleModal1}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal1}
                useNativeDriverForBackdrop
                swipeDirection={['right']}
                style={{
                    margin: 1,
                    width: '60%',
                    backgroundColor: '#fff',
                    justifyContent: 'flex-start',
                    alignSelf: 'flex-end'
                }}>
                <View style={styles.containerModal}>
                    <View>
                        <LinearGradient
                            colors={['#DE6262', '#FFB88C']}
                            style={styles.navigationBarModal}
                        >
                            <Text style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>Thành viên trong đội</Text>
                            <TouchableOpacity onPress={() => handleToggleModalAddPlayer(1)}>
                                <EvilIcons name="plus" color="#fff" size={30} />
                            </TouchableOpacity>
                        </LinearGradient>
                        <ScrollView style={{ height: SCREEN_HEIGHT / 2 - 100 }}>
                            {data?.players?.map((player: any, index: any) => (
                                <TouchableOpacity style={styles.playerWrap} key={index} onPress={handleUpdateLineupPlayer.bind(this, player)}>
                                    <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Shirt.png")} />
                                    <View>
                                        <Text>{player.name}</Text>
                                        <Text style={{ color: '#1877f2' }}>{player.number}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </ScrollView>
                    </View>
                    <View>
                        <LinearGradient
                            colors={['#8BC6EC', '#9599E2']}
                            style={styles.navigationBarModal}
                        >
                            <Text style={{ fontSize: 17, color: '#fff', fontWeight: 600 }}>Cầu thủ đá hộ</Text>
                            <TouchableOpacity onPress={() => handleToggleModalAddPlayer(2)}>
                                <EvilIcons name="plus" color="#fff" size={30} />
                            </TouchableOpacity>
                        </LinearGradient>
                        <ScrollView style={{ height: SCREEN_HEIGHT / 2 - 80 }}>
                            {data?.supports?.map((support: any, index: any) => (
                                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 8 }}>
                                    <TouchableOpacity style={styles.playerWrap} onPress={handleUpdateLineupSupport.bind(this, support)}>
                                        <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Shirt.png")} />
                                        <View>
                                            <Text>{support.name}</Text>
                                            <Text style={{ color: '#1877f2' }}>{support.number}</Text>
                                        </View>

                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={handleDeleteSupport.bind(this, support)}>
                                        <Text style={{ fontSize: 16, color: '#1877f2' }}>Xoá</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                    {data?.lineup[playerIndexUpdate.toString()]
                        ? (<TouchableOpacity onPress={handleRemovePosition}>
                            <LinearGradient
                                colors={['#8BC6EC', '#9599E2']}
                                style={{
                                    borderBottomWidth: 1,
                                    paddingLeft: 12,
                                    borderBottomColor: '#fff',
                                    paddingVertical: 16,
                                    marginBottom: 10,
                                    alignItems: 'center',
                                    paddingRight: 12
                                }}
                            >
                                <Text style={{ fontSize: 17, color: '#fff', fontWeight: 600, textAlign: 'center' }}>Ẩn cầu thủ khỏi sơ đồ</Text>
                            </LinearGradient>
                        </TouchableOpacity>)
                        : (<></>)
                    }

                </View>
            </Modal>

            {/* Modal add player */}
            <Modal isVisible={isModalVisible2}
                onBackdropPress={toggleModal2}
                onBackButtonPress={toggleModal2}
                backdropOpacity={0.3}
                onSwipeComplete={toggleModal2}
                useNativeDriverForBackdrop
                swipeDirection={['down']}
                style={{
                    margin: 5,
                    borderRadius: 50,
                    alignItems: 'center',
                }}>
                <View style={styles.postOptionsWrapper2}>
                    <LinearGradient colors={['#8BC6EC', '#9599E2']} style={{ paddingVertical: 12 }}>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 15, textAlign: 'center'
                        }}>Thêm cầu thủ vào sơ đồ</Text>
                    </LinearGradient>
                    <View style={styles.postOptionItemWrapper2}>
                        <Text style={{ fontSize: 17, textAlign: 'center', color: 'red', fontWeight: 600 }}>{alertText}</Text>
                        <TextInput
                            style={styles.input}
                            underlineColor="#000"
                            placeholder="Tên cầu thủ (bắt buộc)..."
                            placeholderTextColor="#999DA0"
                            value={nameNewPlayer}
                            onChangeText={text => setNameNewPlayer(text)}
                            // error={numberError}
                            activeUnderlineColor="green" />
                        <TextInput
                            style={styles.input}
                            underlineColor="#000"
                            keyboardType="numeric"
                            placeholder="Số áo (bắt buộc)..."
                            placeholderTextColor="#999DA0"
                            value={numberNewPlayer}
                            onChangeText={text => setNumberNewPlayer(text)}
                            // error={numberError}
                            activeUnderlineColor="green" />
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                            <MaterialCommunityIcons name="radiobox-marked" color="red" size={26} />
                            <Text style={{ fontSize: 17, fontWeight: 500, color: '#000' }}>{typeAddPlayer === 1 ? 'Là thành viên mới trong đội' : 'Cầu thủ đá hộ trận tới'}</Text>
                        </View>
                    </View>
                    <View style={styles.postOptionWrapperEnd2}>
                        <TouchableOpacity onPress={handleCreatePlayer}>
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
                        <TouchableOpacity onPress={toggleModal2}>
                            <View>
                                <Text
                                    style={{
                                        fontSize: 17,
                                        fontWeight: '700',
                                        color: '#000',
                                    }}>
                                    Hủy
                                </Text>
                            </View>
                        </TouchableOpacity>
                    </View>
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
                            style={styles.btnBack}>
                            <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                        </TouchableOpacity>
                        <Text style={{
                            fontSize: 18,
                            fontWeight: 'bold',
                            color: '#fff',
                            marginLeft: 15, textAlign: 'center'
                        }}>Hướng dẫn</Text>
                    </LinearGradient>
                    <View style={{ width: '85%' }}>
                        <View style={styles.guideWrap}>
                            <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Shirt.png")} />
                            <Text style={styles.guideWrapText}>Chạm và di chuyển ngón tay để thay đổi vị trí cầu thủ</Text>
                        </View>
                        <View style={styles.guideWrap}>
                            <Image style={{ height: 40, width: 40 }} source={require("@/Assets/Images/Shirt.png")} />
                            <Text style={styles.guideWrapText}>Click để thêm cầu thủ vào vị trí thi đấu</Text>
                        </View>
                        <View style={styles.guideWrap}>
                            <View style={{ width: 40, justifyContent: 'center' }}>
                                <Octicons name="trash" color="#151E3D" size={31} />
                            </View>
                            <Text style={styles.guideWrapText}>Click xoá toàn bộ đội hình hiện tại</Text>
                        </View>
                    </View>
                </View>
            </Modal >
        </View >
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
        justifyContent: 'center',
        height: 58,
        alignItems: 'center',
        paddingHorizontal: 10,
    },
    btnBack: {
        width: 50,
        position: 'absolute',
        top: '50%',
        left: 18
    },
    textNavigationBar: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#318bfb',
        marginLeft: 15,
    },
    imageShirt: {
        height: 50,
        width: 50,
    },
    containerModal: {
        height: SCREEN_HEIGHT
    },
    navigationBarModal: {
        borderBottomWidth: 1,
        paddingLeft: 12,
        borderBottomColor: '#fff',
        paddingVertical: 16,
        marginBottom: 10,
        justifyContent: 'space-between',
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12
    },
    playerWrap: {
        marginVertical: 12,
        marginHorizontal: 4,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        width: '75%'
    },

    postOptionsWrapper2: {
        paddingBottom: 10,
        backgroundColor: '#fff',
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
    input: {
        height: 40,
        marginBottom: 16,
        textAlign: 'center',
        backgroundColor: '#fff',
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
        fontWeight: "500"
    }
})

export default SquadScreen;