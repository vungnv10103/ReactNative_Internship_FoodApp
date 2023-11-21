import { Text, View } from 'react-native'
import React from 'react'

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const Tab = createMaterialTopTabNavigator();
import WaitingOrderScreen from './order_admin/WaitingOrderScreen';
import SuccessOrderScreen from './order_admin/SuccessOrderScreen';
import CancelOrderScreen from './order_admin/CancelOrderScreen';

export default function ManageOrderAdmin(props: any) {
    return (
        <Tab.Navigator>
            <Tab.Screen name="WaitingOrder" component={WaitingOrderScreen} options={{ title: 'Đang chờ' }} />
            <Tab.Screen name="SuccessOrder" component={SuccessOrderScreen} options={{ title: 'Thành công' }} />
            <Tab.Screen name="CancelOrder" component={CancelOrderScreen} options={{ title: 'Bị huỷ' }} />
        </Tab.Navigator>
    );
}
