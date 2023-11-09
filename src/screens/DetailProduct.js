import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, FlatList, Pressable } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { Products } from '../components';
import ProductsSale from '../components';


export default function DetailProduct(props) {
    const navigation = useNavigation()

    let productSelected = props.route.params
    const [productByIdCart, setProductByIdCart] = useState([])
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAllProByIdCart = (id) => {
        const dbRef = databaseRef(database, 'products');

        onValue(dbRef, (snapshot) => {
            const dataProduct = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(childData);
                if (childData.idCate === id) {
                    dataProduct.push(childData)
                }
            });
            setProductByIdCart(dataProduct)
            // const jsonData = JSON.stringify(productByIdCart, null, 2);
            // console.log(jsonData);
        }, {
            onlyOnce: false
        });

    }
    useEffect(() => {
        getAllProByIdCart(productSelected.idCate);
    }, [])

    const Item = ({ title, image }) => (
        <View>
            <Text className="text-black">{title}</Text>
            <Image className="h-36 w-64 rounded-t-3xl" source={{ uri: image }} />
        </View>
    );
    const getNewPrice = (oldPrice, discount) => {
        const valueOldPrice = parseFloat(oldPrice)
        const valueDiscount = parseFloat(discount)
        return valueOldPrice - (valueOldPrice * valueDiscount / 100)
    }


    return (
        <ScrollView
            className="flex-1 bg-gray-200"
            showsVerticalScrollIndicator={false}
        >
            <StatusBar barStyle="light-content" />
            {/* Image */}
            <View className="flex-row justify-center">
                <Image
                    className="w-full h-64 rounded-3xl"
                    source={{ uri: productSelected.img }}
                />
            </View>

            {/* back button */}
            <View className="w-full absolute flex-row justify-between items-center pt-5">
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
            </View>

            <View
                style={{ borderTopLeftRadius: 40, borderTopRightRadius: 40 }}
                className="bg-white -mt-12 pt-6"
            >
                <View
                    className="px-5"
                >
                    <Text style={{ fontFamily: 'Inter-Bold', color: 'black' }} className="text-3xl">FoodYum</Text>
                    <View className="flex-row space-x-2 my-1">
                        <View className="flex-row items-center space-x-1">
                            <Image source={require('../assets/images/dev/fullStar.png')} className="h-4 w-4" />
                            <Text style={{ fontFamily: 'Inter-Medium' }} className="text-xs">
                                <Text className="text-green-700">0</Text>
                                <Text className="text-gray-700"> reviews · </Text>
                                <Text className="line-through text-red-600">{productSelected.price}đ</Text>
                                <Text className="text-sm text-gray-700"> {getNewPrice(productSelected.price, productSelected.sale)}đ</Text>
                            </Text>
                        </View>
                    </View>
                </View>


            </View>



        </ScrollView>
    )
}