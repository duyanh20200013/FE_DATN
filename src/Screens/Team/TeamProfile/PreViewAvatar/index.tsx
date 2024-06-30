import { Alert, Dimensions, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ScreenNavigationProp,
    ScreenPreViewImageProp

} from '@/Routes/Stack';
import { useState } from "react";
import React from "react";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import storage from '@react-native-firebase/storage';
import Spinner from "react-native-loading-spinner-overlay";
import { useEditTeamMutation } from "@/Redux/api/team";
import { useAppDispatch } from "@/Redux/store";
import { setImage } from "@/Redux/reducer/userInfo";


const PreViewAvatarScreen = () => {
    const dispatch = useAppDispatch();
    const navigation = useNavigation<ScreenNavigationProp>();
    const route = useRoute<ScreenPreViewImageProp>();
    const linkFirabase = route.params.linkFirabase;
    const [link, setLink] = useState(route.params.image.uri);
    const [loadingImage, setLoadingImage] = useState(false);
    const [EditTeamMutation, { isLoading: isLoading2 }] = useEditTeamMutation();
    const handleBack = () => {
        navigation.goBack();
    };

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

    const handleDeleteImageFireBase = async () => {
        let imageRef = storage().refFromURL(linkFirabase);
        setLoadingImage(true);
        await imageRef.delete().catch((error) => { setLoadingImage(false); throw error });
        setLoadingImage(false);
    }

    const handlePost = async () => {
        let uploadLink: string;
        if (linkFirabase) {
            await handleDeleteImageFireBase();
        }
        uploadLink = await handleUploadImageandGetUrl();
        EditTeamMutation({
            name: null,
            phone: null,
            image: uploadLink,
            description: null,
            balance: null
        }).unwrap()
            .then(res => {
                if (res.errCode === 0) {
                    console.log(res);
                    dispatch(setImage(uploadLink));
                    navigation.navigate('TeamProfile');
                }
            })
            .catch(err => {
                console.log(err);
                Alert.alert('Có lỗi xảy ra trong quá trình thực hiện');
            });
    }
    return (
        <View style={styles.parentContainer}>
            <Spinner visible={loadingImage || isLoading2} />
            <View style={styles.navigationBar}>
                <View style={styles.navigationBarLeft}>
                    <TouchableOpacity onPress={handleBack} style={styles.btnBack}>
                        <FontAwesome5Icon name="arrow-left" color="#000" size={20} />
                    </TouchableOpacity>
                    <Text style={styles.textNavigationBar}>Xem trước ảnh</Text>
                </View>
                <TouchableOpacity style={styles.btnPost} onPress={handlePost}>
                    <Text style={styles.btnText}>Lưu</Text>
                </TouchableOpacity>
            </View>
            <View style={styles.container}>
                <ImageBackground
                    style={styles.avatar}
                    source={{
                        uri: link,
                    }}></ImageBackground>
            </View>
        </View>
    )
}

const windowHeight = Math.round(Dimensions.get('window').height);
const windowWidth = Math.round(Dimensions.get('window').width);

const styles = StyleSheet.create({
    parentContainer: {
        backgroundColor: 'white',
        flex: 1,
    },
    container: {},
    navigationBar: {
        paddingTop: 12,
        flexDirection: 'row',
        height: 64,
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    navigationBarLeft: {
        flexDirection: 'row',
    },
    textNavigationBar: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginLeft: 5,
    },
    btnBack: {
        width: 50,
        alignItems: 'center',
    },
    btnPost: {
        backgroundColor: '#1877F2',
        borderRadius: 8,
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginRight: 12,
    },
    btnText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: 'white',
    },
    avatar: {
        width: windowWidth,
        height: 400,
        marginVertical: 15,
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
        width: 150,
        marginRight: 13,
    },
});

export default PreViewAvatarScreen;