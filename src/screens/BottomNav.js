import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import AccountScreen from './AccountScreen';

// import { HomeScreen, CartScreen, AccountScreen } from './index'
import Icon, { Icons } from '../components/Icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

const TabArr = [
    {
        route: 'Home',
        label: 'Home',
        type: Icons.Ionicons,
        activeIcon: 'home',
        inActiveIcon: 'home-outline',
        component: HomeScreen,
        tabBarColor: "#fbbf24"
    },
    {
        route: 'Cart',
        label: 'Cart',
        type: Icons.Ionicons,
        activeIcon: 'cart',
        inActiveIcon: 'cart-outline',
        component: CartScreen,
        tabBarColor: "#FF0000"
    },
    {
        route: 'Account',
        label: 'Account',
        type: Icons.FontAwesome,
        activeIcon: 'user',
        inActiveIcon: 'user-o',
        component: AccountScreen,
        tabBarColor: "#00FF00"
    },
];


export default function BottomNav() {
    return (
        <Tab.Navigator initialRouteName='Home'
            activeColor='#65558f'
            inactiveColor='#2c2929'
        >
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