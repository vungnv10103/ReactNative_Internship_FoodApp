import React from 'react'
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import AccountScreen from './AccountScreen';
import Icon, { Icons } from '../components/Icons';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
const Tab = createMaterialBottomTabNavigator();

const TabArr = [
    {
        route: 'Home', label: 'Home', showCustomHeader: true, type: Icons.Ionicons, activeIcon: 'home', inActiveIcon: 'home-outline', component: HomeScreen, tabBarColor: "#fbbf24"
    },
    {
        route: 'Cart', label: 'Cart', showCustomHeader: true, type: Icons.Ionicons, activeIcon: 'cart', inActiveIcon: 'cart-outline', component: CartScreen, tabBarColor: "#FF0000"
    },
    {
        route: 'Account', label: 'Account', showCustomHeader: true, type: Icons.FontAwesome, activeIcon: 'user', inActiveIcon: 'user-o', component: AccountScreen, tabBarColor: "#00FF00"
    },
];


export default function BottomNav() {
    return (


        <Tab.Navigator onTabLongPress={() => alert("123")} initialRouteName='Home'
            shifting={true}

        // theme default
        // activeColor='#65558f'
        // inactiveColor='#2c2929'
        // barStyle={{ backgroundColor: '' }}

        // matcha
        // activeColor='#0e1f12'
        // inactiveColor='#0e1f12'
        // barStyle={{ backgroundColor: '#ebf1e6' }}
        >
            {TabArr.map((tab) => (
                <Tab.Screen
                    key={tab.route}
                    name={tab.route}
                    component={tab.component}
                    options={{
                        tabBarLabel: tab.label,
                        tabBarBadge: tab.label === "Cart" ? 3 : null,
                        tabBarIcon: ({ focused, color, size }) => (
                            <Icon name={focused ? tab.activeIcon : tab.inActiveIcon} type={tab.type} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}