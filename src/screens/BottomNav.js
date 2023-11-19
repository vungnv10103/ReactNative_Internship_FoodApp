import React, { useState, useEffect } from 'react'
import { ToastAndroid } from 'react-native';
import { database, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import HomeScreen from './HomeScreen';
import CartScreen from './CartScreen';
import AccountScreen from './AccountScreen';
import Icon, { Icons } from '../components/Icons';
import { useCart } from './CartProvider';
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

    // const [currentUser, setUser] = useState(null);
    // const [dataCart, setDataCart] = useState();


    // const getUserData = async () => {
    //     return new Promise < any > ((resolve) => {
    //         onAuthStateChanged(auth, (user) => {
    //             if (user) {
    //                 resolve(user)
    //             }
    //         })
    //     })
    // }

    // const getDataCart = (idUser) => {
    //     const dbRef = databaseRef(database, `carts/${idUser}`);
    //     onValue(dbRef, (snapshot) => {
    //         const cartData = [];
    //         snapshot.forEach((childSnapshot) => {
    //             const childKey = childSnapshot.key;
    //             const childData = childSnapshot.val();
    //             // console.log(JSON.stringify(childData, null, 2));
    //             if (childData.status === 'incart') {
    //                 cartData.push(childData);
    //             }
    //         });
    //         setDataCart(cartData);
    //     }, {
    //         onlyOnce: false
    //     });
    // }

    // const fetchData = async () => {
    //     const dataUser = await getUserData()
    //     getDataCart(dataUser.uid + "")
    //     setUser(dataUser)

    // };

    // useEffect(() => {
    //     fetchData()
    // }, []);

    const { cartItemsCount } = useCart();

    const showToast = (message) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };

    return (
        <Tab.Navigator onTabLongPress={(item) => showToast(item.route.name)} initialRouteName='Home'
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
                        tabBarBadge: tab.label === "Cart" ? cartItemsCount : null,
                        tabBarIcon: ({ focused, color, size }) => (
                            <Icon name={focused ? tab.activeIcon : tab.inActiveIcon} type={tab.type} color={color} size={size} />
                        ),
                    }}
                />
            ))}
        </Tab.Navigator>
    )
}