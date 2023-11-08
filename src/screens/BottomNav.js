import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from './HomeScreen';
import AccountScreen from './AccountScreen';
import SearchScreen from './SearchScreen';
import Icon, { Icons } from '../components/Icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
const TabArr = [
    {
        route: 'Home',
        label: 'Home',
        type: Icons.Ionicons,
        activeIcon: 'home',
        inActiveIcon: 'home-outline',
        component: HomeScreen
    },
    {
        route: 'Search',
        label: 'Search',
        type: Icons.Ionicons,
        activeIcon: 'search',
        inActiveIcon: 'search-outline',
        component: SearchScreen
    },
    {
        route: 'Account',
        label: 'Account',
        type: Icons.FontAwesome,
        activeIcon: 'user-circle',
        inActiveIcon: 'user-circle-o',
        component: AccountScreen
    },
];


export default function BottomNav() {
    return (
        <Tab.Navigator initialRouteName='Home'>
            {TabArr.map((tab) => (
                <Tab.Screen
                    key={tab.route}
                    name={tab.route}
                    component={tab.component}
                    options={{
                        headerShown: false,
                        tabBarIcon: ({ focused, color, size }) => (
                            <Icon name={focused ? tab.activeIcon : tab.inActiveIcon} type={tab.type} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}