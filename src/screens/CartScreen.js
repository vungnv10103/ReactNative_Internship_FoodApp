import { View, Text } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native'


export default function CartScreen() {
    const navigation = useNavigation();
    return (
        <View>
            <Text>Cart Screen</Text>
        </View>
    )
}