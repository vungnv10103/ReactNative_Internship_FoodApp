import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation } from '@react-navigation/native'



export default function DetailProduct(props) {
    const navigation = useNavigation()

    let productSelected = props.route.params
    const [productByIdCart, setProductByIdCart] = useState(null)
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAllProByIdCart = (id) => {
        const dbRef = databaseRef(database, 'products');

        onValue(dbRef, (snapshot) => {
            const dataProduct = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.idCate == id) {
                    dataProduct.push(childData)
                }
            });
            setProductByIdCart(dataProduct)
            const jsonData = JSON.stringify(productByIdCart, null, 2);
            console.log(jsonData);
        }, {
            onlyOnce: false
        });

    }
    useEffect(() => {
        getAllProByIdCart(productSelected.idCate);
    }, [])


    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <StatusBar barStyle="light-content" />
            {/* Image */}
            <View className="flex-row justify-center">
                <Image
                    style={{ width: wp(95), height: hp(35), borderRadius: 30, marginTop: hp(1) }}
                    source={{ uri: productSelected.img }}
                />
            </View>

            {/* back button */}
            <Animated.View entering={FadeIn.delay(200).duration(1000)} className="w-full absolute flex-row justify-between items-center pt-5">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setIsFavourite(!isFavourite)}
                    className="p-2 rounded-full mr-5 bg-gray-100">
                    <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                </TouchableOpacity>
            </Animated.View>

            {/*  */}

        </ScrollView>
    )
}