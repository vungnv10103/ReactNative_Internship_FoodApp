import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, FlatList, Pressable, SectionList } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { Products } from '../components';
import ProductsSale from '../components';
import ParallaxScrollView from '../components/ParallaxScrollView';
import Icon, { Icons } from '../components/Icons';



export default function DetailProduct(props) {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
        })
    }, []);

    const DATA = [
        {
            title: 'Main dishes',
            data: ['Pizza', 'Burger', 'Risotto'],
        },
        {
            title: 'Sides',
            data: ['French Fries', 'Onion Rings', 'Fried Shrimps'],
        },
        {
            title: 'Drinks',
            data: ['Water', 'Coke', 'Beer'],
        },
        {
            title: 'Desserts',
            data: ['Cheese Cake', 'Ice Cream'],
        },
    ];

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
        <>
            <ParallaxScrollView
                className="flex-1"
                backgroundColor="#fff"
                renderBackground={() =>
                    <Image
                        className="w-full h-64 rounded-3xl"
                        source={{ uri: productSelected.img }}
                    />
                }
                parallaxHeaderHeight={250}
                stickyHeaderHeight={100}
                renderStickyHeader={() => (
                    <View key="sticky-header"
                        className="w-full absolute flex-row justify-between items-center pt-4"
                    >
                        {/* back button */}
                        <TouchableOpacity
                            onPress={() => navigation.goBack()}
                            className="p-2 rounded-full ml-5 bg-gray-100">
                            <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                        </TouchableOpacity>
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-black text-center">{productSelected.name}</Text>
                        <TouchableOpacity
                            onPress={() => setIsFavourite(!isFavourite)}
                            className="p-2 rounded-full mr-5 bg-gray-100">
                            <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                        </TouchableOpacity>

                    </View>
                )}
            >
                <View>
                    <Text>{productSelected.name}</Text>
                    <Text>{productSelected.description}</Text>

                    <SectionList
                        scrollEnabled={false}
                        sections={DATA}
                        keyExtractor={(item, index) => item + index}
                        renderItem={({ item }) => (
                            <View >
                                <Text >{item}</Text>
                            </View>
                        )}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text>{title}</Text>
                        )}
                    />
                </View>
            </ParallaxScrollView>
        </>
    )
}