import React, { useEffect } from 'react';
import type { RouteProp } from '@react-navigation/native';

import {
    NativeStackNavigationProp,
    createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from '@/Screens/Home';
import LoginScreen from '@/Screens/Login';
import CreateTeamScreen from '@/Screens/Login/CreateTeam'
import CreatePlayerScreen from '@/Screens/Login/CreatePlayer'
import TeamProfileScreen from '@/Screens/Team/TeamProfile'
import TeamManageScreen from '@/Screens/Team/TeamManage'
import PreViewAvatarScreen from '@/Screens/Team/TeamProfile/PreViewAvatar';
import UpdatePlayerScreen from '@/Screens/Player/UpdatePlayer';
import AddPlayerScreen from '@/Screens/Player/AddPlayer';
import ListTeamScreen from '@/Screens/ListTeam';
import OtherTeamScreen from '@/Screens/ListTeam/OtherTeam';
import FundManageScreen from '@/Screens/FundManage';
import ContributeFundScreen from '@/Screens/FundManage/ContributeFund';
import StatisticCollectScreen from '@/Screens/FundManage/StatisticCollect';
import StatisticEachMonthScreen from '@/Screens/FundManage/StatisticEachMonth';
import StatisticResultScreen from '@/Screens/Team/TeamManage/StatisticResult';
import SquadScreen from '@/Screens/Squad';
import SignUpScreen from '@/Screens/SignUp';
import RatePlayerScreen from '@/Screens/Team/TeamManage/RatePlayer';
import StatisticRatePlayerScreen from '@/Screens/Team/TeamManage/RatePlayer/StatisticRatePlayer';
import ForgotPasswordScreen from '@/Screens/ForgotPassword';
import UpdatePasswordScreen from '@/Screens/ForgotPassword/UpdatePassword';
import ListStadiumScreen from '@/Screens/ListTeam/ListStadium';
import MatchFindScreen from '@/Screens/MatchFind';
import CreateMatchFindScreen from '@/Screens/MatchFind/CreateMatchFind';
import MainTab from './tab';
import { useAppSelector } from '@/Redux/store';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamList = {
    Home: undefined;
    Login: undefined;
    SignUp: undefined;
    CreateTeam: undefined;
    CreatePlayer: undefined;
    TeamProfile: undefined;
    TeamManage: undefined;
    AddPlayer: undefined;
    UpdatePlayer: { id: any, name: any, number: any, phone: any, isCaptain: any };
    PreViewAvatar: { image: any | undefined, linkFirabase: any | undefined };
    ListTeam: undefined;
    OtherTeam: { id: any };
    FundManage: undefined;
    ContributeFund: undefined;
    StatisticCollect: undefined;
    StatisticEachMonth: undefined;
    StatisticResult: undefined;
    Squad: undefined;
    RatePlayer: undefined;
    ForgotPassword: undefined;
    UpdatePassword: undefined;
    ListStadium: undefined;
    StatisticRatePlayer: undefined;
    MatchFind: undefined;
    CreateMatchFind: undefined;
    Profile: { userId: string };
};
export type ScreenNavigationProp =
    NativeStackNavigationProp<RootStackParamList>;
const Stack = createNativeStackNavigator<RootStackParamList>();

export type ScreenPreViewImageProp = RouteProp<RootStackParamList, 'PreViewAvatar'>;

function MyStack() {
    const token = useAppSelector(state => state.auth.token);
    const status = useAppSelector(state => state.info.status);

    const nav = useNavigation<ScreenNavigationProp>();
    useEffect(() => {
        console.log(status);
        if (!token) {
            nav.reset({
                index: 0,
                routes: [{ name: 'Login' }],
            });
        }
        if (token && status === false) {
            nav.reset({
                index: 0,
                routes: [{ name: 'CreateTeam' }],
            });
        }
        if (token && (status === true)) {
            nav.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            });
        }
    }, [nav, token]);

    return (
        <Stack.Navigator initialRouteName="Home">
            {/* <Stack.Screen name="Login" component={LoginScreen} /> */}
            {/* <Stack.Screen
                name="CreateTeam"
                component={CreateTeamScreen}
                options={
                    {
                        title: 'Tạo đội bóng của bạn',
                        headerTitleAlign: 'center',
                    }
                }
            /> */}
            <Stack.Screen
                name="CreatePlayer"
                component={CreatePlayerScreen}
                options={
                    {
                        title: 'Thêm thành viên',
                        headerTitleAlign: 'center',
                    }
                }
            />
            <Stack.Group
                screenOptions={{
                    headerShown: false,
                }}>
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="SignUp" component={SignUpScreen} />
                <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                <Stack.Screen name="UpdatePassword" component={UpdatePasswordScreen} />
                <Stack.Screen name="CreateTeam" component={CreateTeamScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="TeamProfile" component={TeamProfileScreen} />
                <Stack.Screen name="TeamManage" component={TeamManageScreen} />
                <Stack.Screen name="PreViewAvatar" component={PreViewAvatarScreen} />
                <Stack.Screen name="UpdatePlayer" component={UpdatePlayerScreen} />
                <Stack.Screen name="AddPlayer" component={AddPlayerScreen} />
                <Stack.Screen name="ListTeam" component={ListTeamScreen} />
                <Stack.Screen name="OtherTeam" component={OtherTeamScreen} />
                <Stack.Screen name="FundManage" component={FundManageScreen} />
                <Stack.Screen name="ContributeFund" component={ContributeFundScreen} />
                <Stack.Screen name="StatisticCollect" component={StatisticCollectScreen} />
                <Stack.Screen name="StatisticEachMonth" component={StatisticEachMonthScreen} />
                <Stack.Screen name="StatisticResult" component={StatisticResultScreen} />
                <Stack.Screen name="Squad" component={SquadScreen} />
                <Stack.Screen name="RatePlayer" component={RatePlayerScreen} />
                <Stack.Screen name="StatisticRatePlayer" component={StatisticRatePlayerScreen} />
                <Stack.Screen name="ListStadium" component={ListStadiumScreen} />
                <Stack.Screen name="MatchFind" component={MainTab} />
                <Stack.Screen name="CreateMatchFind" component={CreateMatchFindScreen} />
            </Stack.Group>
        </Stack.Navigator>
    );
}

export default MyStack;