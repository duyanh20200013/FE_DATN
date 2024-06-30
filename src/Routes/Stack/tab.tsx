/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect } from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MatchFindScreen from '@/Screens/MatchFind';
import MatchFindOfTeamScreen from '@/Screens/MatchFind/MatchFindOfTeam';
import { Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert } from 'react-native';
const numberOfTabs = 2; // your number of tabs

const windowWidth = Dimensions.get('window').width;
let tabWidth = windowWidth / numberOfTabs;
const Tab = createMaterialTopTabNavigator();

function MainTab() {

    return (
        <>
            <Tab.Navigator
                tabBarPosition="bottom"
                screenOptions={{
                    tabBarShowLabel: false,
                    tabBarStyle: {
                        // position: 'absolute',
                    },
                    tabBarIndicatorStyle: {
                        bottom: 40,
                    },
                }}>
                <Tab.Screen
                    name="Các trận cần tìm đối"
                    component={MatchFindScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                name="clipboard-search-outline"
                                size={24}
                                color={focused ? '#007AFF' : '#222'}
                            />
                        ),
                        tabBarLabel: 'Các trận cần tìm đối'
                    }}
                />
                <Tab.Screen
                    name="Của team bạn"
                    component={MatchFindOfTeamScreen}
                    options={{
                        tabBarIcon: ({ focused }) => (
                            <Icon
                                name="home-search-outline"
                                size={24}
                                color={focused ? '#007AFF' : '#222'}
                            />
                        ),
                    }}
                />
            </Tab.Navigator>
        </>
    );
}

export default MainTab;