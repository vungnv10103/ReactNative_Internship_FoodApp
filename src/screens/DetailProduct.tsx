import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, FlatList, Pressable, SectionList, ListRenderItem, StyleSheet } from 'react-native'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { storage, database, auth } from './../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation, Link } from '@react-navigation/native'
import { Products } from '../components';
import ParallaxScrollView from '../components/ParallaxScrollView';
import Icon, { Icons } from '../components/Icons';
import { themeColors } from '../theme';
import ProductsRecommend from '../components/productRecommend';

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
    console.log("product selected: ", productSelected);

    const [productByIdCart, setProductByIdCart] = useState<Product[]>([])
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);
    const opacity = useSharedValue(0)
    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    const scrollRef = useRef<ScrollView>(null)
    const itemRef = useRef<TouchableOpacity[]>([])


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
        const newPrice = (oldPrice - (oldPrice * discount / 100)).toString()
        return formatMoney(newPrice)
    }
    function formatMoney(price: string) {
        // if (typeof price === 'number') {
        //     if (price >= 1000) {
        //         return price.toLocaleString('vi-VN');
        //     } else {
        //         return price.toString();
        //     }
        // } else {
        //     return '$$$';
        // }
        const valuePrice = parseFloat(price)
        if (valuePrice >= 1000) {
            return valuePrice.toLocaleString('vi-VN') + " đ";
        } else {
            return valuePrice.toString() + " đ";
        }
    }


    const selectCategory = (index: number) => {
        const selected = itemRef.current[index]
        setActiveIndex(index)
        selected.measure((x, y, width, height, pageX, pageY) => {
            scrollRef.current?.scrollTo({ x: x - 16, y: 0, animated: true })
        })
    }

    const onScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y > 350) {
            opacity.value = withTiming(1);
        } else {
            opacity.value = withTiming(0);
        }
    };


    const renderItem: ListRenderItem<any> = ({ item, index }) => (
        <ProductsRecommend productRecommend={item} />

        // <View className='flex-row justify-between bg-white p-2'>
        //     <TouchableOpacity className='flex justify-between'>
        //         <View >
        //             <Text className='text-black'>{item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}</Text>
        //             <Text className='text-black'>{item.price} đ</Text>
        //         </View>
        //         <Image source={{ uri: item.img }} className='w-24 h-24 rounded-sm' />
        //     </TouchableOpacity>
        // </View>
        // <Link className='flex-row justify-between bg-white p-2' to={{ screen: "", params: { id: "myID" } }} >
        //     <TouchableOpacity >
        //         <View className='flex-1'>
        //             <Text className='text-black'>{item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}</Text>
        //             <Text className='text-black'>{item.price} đ</Text>
        //         </View>
        //         <Image source={{ uri: item.img }} className='w-24 h-24 rounded-sm' />
        //     </TouchableOpacity>
        // </Link>
    )

    return (
        <>
            <ParallaxScrollView
                scrollEvent={onScroll}
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
                stickyHeaderHeight={80}
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
                <View className='bg-white'>
                    {/* Title + Desc */}
                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-xl mx-4 my-1.5'>
                        {productSelected.name.length > 80 ? productSelected.name.slice(0, 80) + "..." : productSelected.name}
                        {/* {productSelected.name} */}
                    </Text>
                    <Text style={{ fontFamily: "Inter-Medium" }} className='text-black text-base mx-4 my-1.5'>
                        {productSelected.description.length > 150 ? productSelected.description.slice(0, 150) + "..." : productSelected.description}
                        {/* {productSelected.description} */}
                    </Text>

                    {/* Price */}
                    <View className='flex-row my-1.5 items-center'>
                        {productSelected.sale > 0 ? (
                            <View className='flex-row items-center ml-4'>
                                <Image className="h-5 w-5" source={require('./../assets/images/sale_tag.png')} />
                                <Text style={{ fontFamily: "Inter-Bold" }} className='line-through text-red-600 text-base ml-3'>
                                    {formatMoney(productSelected.price)}
                                </Text>
                            </View>
                        ) : (<View></View>)}
                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-lg mx-4'>
                            {getNewPrice(productSelected.price, productSelected.sale)}
                        </Text>
                    </View>

                    {/* Button Checkout */}
                    <View className='flex items-center mx-5 mt-4'>
                        <TouchableOpacity
                            className='w-full bg-amber-400 p-2.5 rounded-lg  mx-14'
                        >
                            <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-lg uppercase text-center'>Add to cart</Text>
                        </TouchableOpacity>
                    </View>


                    <SectionList
                        contentContainerStyle={{ paddingBottom: 40 }}
                        scrollEnabled={false}
                        sections={DATA}
                        keyExtractor={(item, index) => `${item.id + index}`}
                        renderItem={renderItem}
                        // ItemSeparatorComponent={() => <View className='h-0.5 bg-gray-100' ></View>}
                        // SectionSeparatorComponent={() => <View className='h-0.5 bg-gray-100' ></View>}
                        renderSectionHeader={({ section: { title } }) => (
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-xl text-black m-5 mt-16'>{title}</Text>
                        )}
                    />
                </View>
            </ParallaxScrollView>


            {/* Sticky segments */}
            <Animated.View style={[animatedStyles]} className="justify-center absolute h-16 left-0 right-0 top-16 bg-white">
                <View className=''>
                    <ScrollView
                        ref={scrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 16 }}
                    >
                        {productByIdCart.map((item, index) => (
                            <TouchableOpacity
                                ref={(ref) => (itemRef.current[index] = ref!)}
                                key={index}
                                style={activeIndex === index ? styles.segmentButtonActive : styles.segmentButton}
                                className=''
                                onPress={() => selectCategory(index)}
                            >
                                <Text className='' style={activeIndex === index ? styles.segmentTextActive : styles.segmentText}>{item.idCate}</Text>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </Animated.View>
        </>
    )
}

const styles = StyleSheet.create({
    segmentButton: {
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 50,
    },
    segmentText: {
        color: '#6EE7B7',
        fontSize: 16,
    },
    segmentButtonActive: {
        backgroundColor: '#6EE7B7',
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 50,
    },
    segmentTextActive: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
    },
})