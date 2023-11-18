import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, RefreshControl, FlatList, Pressable, SectionList, ListRenderItem, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { storage, database, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { ICartInterface } from '../interfaces';
import Loading from '../components/Loading';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';






export default function CartScreen() {
    const navigation = useNavigation();

    const fetchData = async () => {

    };
    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <View className='flex-row items-center my-3'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4 text-center'>
                    Giỏ hàng
                </Text>
            </View>
            <ScrollView
                className="space-y-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >


            </ScrollView>
        </View>

    )
}