import { StyleSheet, Text, TouchableOpacity, View, ScrollView, TextInput, Image, Alert, Keyboard, TouchableWithoutFeedback } from "react-native"
import { useNavigation } from '@react-navigation/native';
import { ScreenNavigationProp } from '@/Routes/Stack';
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import LinearGradient from "react-native-linear-gradient";
// import { TextInput } from "react-native-paper";
import { useEffect, useState } from "react";
import { useGetAllTeamQuery, useSearchTeamMutation } from "@/Redux/api/team";
import Spinner from "react-native-loading-spinner-overlay";
import { useFocusEffect } from '@react-navigation/native';
import React from "react";
import Feather from "react-native-vector-icons/Feather";
import { Linking } from 'react-native'

const ListTeamScreen = () => {
    const [response, setResponse] = useState();
    const {
        data,
        isSuccess,
        isLoading: isLoadingQuery,
        error,
        refetch,
    } = useGetAllTeamQuery();

    const [SearchTeamMutation, { isLoading: isLoadingSearch }] = useSearchTeamMutation();
    useEffect(() => {
        if (isSuccess) {
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

    const handleNavigateOtherTeam = (teamId: any) => {
        navigation.navigate('OtherTeam', { id: teamId });
    }

    function handleSearch(text: any) {
        SearchTeamMutation({
            searchText: text
        }).unwrap()
            .then(res => {
                if (res.errCode === 0) {
                    setResponse(res?.data);
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }

    const handelCancelSearch = () => {
        setSearchText('');
        handleSearch('');
    }

    const [searchText, setSearchText] = useState<any>();

    const handlePhoneCall = (phoneNumber: any) => {
        Linking.openURL(`tel:${phoneNumber}`)
    }
    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}
            accessible={false}>
            <View style={styles.container}>
                <Spinner visible={isLoadingQuery || isLoadingSearch} />
                <LinearGradient colors={['#8BC6EC', '#9599E2']} style={styles.navigationBar}>
                    <TouchableOpacity
                        onPress={onPressGoBackHandler}
                        style={styles.btnBack}>
                        <FontAwesome5Icon name="arrow-left" color="#fff" size={20} />
                    </TouchableOpacity>
                    <Text style={styles.textNavigationBar}>Các Team ở Hà Nội</Text>
                </LinearGradient>
                <ScrollView style={styles.bodyContainer}>
                    <View style={styles.bodyContainerSearch}>
                        <FontAwesome5Icon name="search" color="#999DA0" size={20} />
                        <TextInput
                            style={styles.input}
                            placeholder="Tìm tên theo đội, khu vực thi đấu, SĐT,..."
                            placeholderTextColor="#999DA0"
                            value={searchText}
                            onChangeText={text => setSearchText(text)}
                            returnKeyType="search"
                            onSubmitEditing={() => handleSearch(searchText)} />
                        <TouchableOpacity style={{ marginLeft: 16 }} onPress={handelCancelSearch}>
                            <Feather name="x" color="red" size={22} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.bodyWrap}>
                        {response?.rows.map((team: any, index: any) => (
                            <TouchableOpacity key={index} style={styles.teamWrap} onPress={() => handleNavigateOtherTeam(team.id)}>
                                <View style={styles.teamWrapHeader}>
                                    {
                                        team.image ?
                                            (<Image style={styles.avatar} source={{ uri: team.image }} />)
                                            : (<Image style={styles.avatar} source={require("@/Assets/Images/DefaultTeam.png")} />)
                                    }
                                    <Text style={styles.textNameTeam}>{team.name}</Text>
                                </View>
                                <View style={styles.teamWrapBody}>
                                    <Text style={{
                                        fontSize: 17,
                                        color: '#000',
                                        fontWeight: "400"
                                    }}>Đội sân 7</Text>
                                    <TouchableOpacity style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                    }} onPress={() => handlePhoneCall(team.phone)}>
                                        <FontAwesome5Icon size={16} color={'#1877f2'} name="phone" />
                                        <Text
                                            style={{
                                                fontSize: 17,
                                                color: '#1877f2',
                                                paddingLeft: 10
                                            }}
                                        >
                                            {team.phone}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.teamWrapEnd}>
                                    <Text style={{
                                        fontSize: 16,
                                        color: 'red',
                                        fontWeight: "400",
                                        marginBottom: 8
                                    }}>Giới thiệu về Team:</Text>
                                    <Text >{team.description}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </ScrollView>
            </View>
        </TouchableWithoutFeedback>
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
    bodyContainer: {

    },
    bodyContainerSearch: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#999DA0',
        justifyContent: 'space-between'
    },
    input: {
        height: 40,
        marginLeft: 6,
        textAlign: 'left',
        backgroundColor: 'rgb(242, 242, 242)',
    },
    bodyWrap: {
        marginBottom: 20
    },
    teamWrap: {
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
    teamWrapHeader: {
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
        fontSize: 19,
        color: '#000',
        fontWeight: "700"
    },
    teamWrapBody: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        marginHorizontal: 10,
        marginBottom: 14
    },
    teamWrapEnd: {
        marginHorizontal: 10,
        marginBottom: 14
    }
});

export default ListTeamScreen;