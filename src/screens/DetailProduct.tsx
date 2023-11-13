import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, FlatList, Pressable, SectionList, ListRenderItem } from 'react-native'
import React, { useState, useEffect, useLayoutEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { storage, database, auth } from './../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { Products } from '../components';
import ParallaxScrollView from '../components/ParallaxScrollView';
import Icon, { Icons } from '../components/Icons';

interface Product {
    id: string;
    idCate: string;
    name: string;
    img: string;
    description: string;
    price: number;
    sale: number;
    sold: number;
    status: number;
}



export default function DetailProduct(props: any) {
    const navigation = useNavigation()

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTransparent: true,
            headerTitle: () => (<Text>Hehehe</Text>),
            headerTintColor: 'black',
            headerLeft: () => (
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}
                        className="p-2 rounded-full mr-5 bg-gray-100">
                        <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#fbbf24" />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, []);



    let productSelected = props.route.params
    const [productByIdCart, setProductByIdCart] = useState<Product[]>([])
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);

    const getAllProByIdCart = (id: any) => {
        const dbRef = databaseRef(database, 'products');

        onValue(dbRef, (snapshot) => {
            const dataProduct: any[] | ((prevState: never[]) => never[]) = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(childData);
                if (childData.idCate === id) {
                    dataProduct.push(childData)
                }
            });
            setProductByIdCart(dataProduct)
            const jsonData = JSON.stringify(dataProduct, null, 2);
            console.log("jsonData: ", jsonData);
        }, {
            onlyOnce: false
        });

    }
    useEffect(() => {
        getAllProByIdCart(productSelected.idCate);
    }, [])

    const DATA = productByIdCart.map((item, index) => ({
        title: item.idCate,
        data: productByIdCart,
        index,
    }));

    const getNewPrice = (oldPrice: number, discount: number) => {
        return oldPrice - (oldPrice * discount / 100)
    }

    const renderItem: ListRenderItem<any> = ({ item, index }) => (
        <View className='flex-row justify-between mx-4 my-2'>
            <Text className='text-black'>{item.name}</Text>
            <Text className='text-black'>{item.description}</Text>
        </View>
    )

    return (
        <>
            <ParallaxScrollView
                className="flex-1"
                backgroundColor="#fff"
                renderBackground={() =>
                    <View className=''>
                        <Image
                            className="w-full h-72 rounded-2xl"
                            source={{ uri: productSelected.img }}
                        />
                    </View>
                }
                parallaxHeaderHeight={300}
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
                        <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-black text-center">
                            {productSelected.name.length > 17 ? productSelected.name.slice(0, 17) + "..." : productSelected.name}
                        </Text>
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
                        contentContainerStyle={{ paddingBottom: 40 }}
                        scrollEnabled={false}
                        sections={DATA}
                        keyExtractor={(item, index) => `${item.id + index}`}
                        renderItem={renderItem}
                        ItemSeparatorComponent={() =>
                            <View className='h-0.5 bg-gray-100' ></View>}
                        SectionSeparatorComponent={() =>
                            <View className='h-0.5 bg-gray-100' ></View>}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-xl text-black mt-20 mx-16'>{title}</Text>
                        )}
                    />
                </View>
            </ParallaxScrollView>
        </>
    )
}