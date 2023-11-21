import { View, Text, TouchableOpacity, StatusBar, ToastAndroid, ScrollView, Image } from 'react-native'
import React, { useState, useEffect } from 'react'
import { storage, database, auth } from '../config/FirebaseConfig';
import { useNavigation } from '@react-navigation/native'
import { ChevronLeftIcon, TrashIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';






export default function ManageAccount(props: any) {
    const navigation = useNavigation();
    return (
        <ScrollView className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />

            <View className='flex-row items-center my-3'>
                <TouchableOpacity
                    onPress={() => props.navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={3.5} color="#38bdf8" />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4 text-center'>
                    { }
                </Text>
            </View>
            <View className="mx-5 space-y-4 pt-8">
                <Image className='h-24 w-24' source={require('../assets/images/avatar_man_1.png')} />

                <TouchableOpacity
                    className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                    onPress={() => { }}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đổi tên</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                    onPress={() => { }}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đổi số điện thoại</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    className="w-full bg-sky-400 p-3 rounded-xl mb-3"
                    onPress={() => { }}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Đổi mật khẩu</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}