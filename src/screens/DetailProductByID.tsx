import { View, Text, ScrollView, StatusBar, Image, TouchableOpacity, FlatList, Pressable, SectionList, ListRenderItem, StyleSheet, ToastAndroid } from 'react-native'
import React, { useState, useRef, useEffect, useLayoutEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { HeartIcon, Square3Stack3DIcon, UsersIcon } from 'react-native-heroicons/solid';
import Animated, { FadeInDown, FadeIn, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { useNavigation, Link } from '@react-navigation/native'
import { Products } from '../components';
import ParallaxScrollView from '../components/ParallaxScrollView';
import Icon, { Icons } from '../components/Icons';
import { themeColors } from '../theme';
import ProductsRecommend from '../components/productRecommend';
import Loading from '../components/Loading';



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

interface SameDataProduct {
    title: string;
    data: Product[];
}



export default function DetailProductByID(props: any) {
    const navigation = useNavigation()

    const [productSelected, setProductSelected] = useState<Product>(props.route.params)

    const [productByIdCart, setProductByIdCart] = useState<Product[]>([])
    const [flagProduct, setFlagProduct] = useState(true);
    const [nameCategory, setNameCategory] = useState('')
    const [flagNameCate, setFlagNameCate] = useState(false);
    const [arrayNameCategory, setArrayCategory] = useState<string[]>([])
    const [isFavourite, setIsFavourite] = useState(false);
    const [loading, setLoading] = useState(true);
    const [DATA, setSameData] = useState<SameDataProduct[]>([]);

    const [quantity, setQuantity] = useState<number>(1);
    const [activeIndex, setActiveIndex] = useState(0);
    const opacity = useSharedValue(0)
    const animatedStyles = useAnimatedStyle(() => ({
        opacity: opacity.value
    }))
    const scrollRef = useRef<ScrollView>(null)
    const itemRef = useRef<TouchableOpacity[]>([])

    const scrollViewRef = useRef<ScrollView>(null);
    const firstItemRef = useRef<TouchableOpacity>(null);


    const getNameCategory = async (id: string) => {
        return new Promise<string>((resolve) => {
            const dbRef = databaseRef(database, 'categories');

            onValue(dbRef, (snapshot) => {
                const dataNameCategory: string[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    dataNameCategory.push(childData.name)
                    if (childData.id === id) {
                        setNameCategory(childData.name)
                        resolve(childData.name)
                        setFlagNameCate(true)
                    }
                });
                setArrayCategory(dataNameCategory)
            }, {
                onlyOnce: false
            });
        })
    }

    const getAllProByIdCart = async (id: any) => {
        return new Promise<any[]>((resolve) => {
            const dbRef = databaseRef(database, 'products');

            onValue(dbRef, (snapshot) => {
                const dataProduct: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    if (childData.idCate === id) {
                        dataProduct.push(childData)
                    }
                });
                resolve(dataProduct)
                setProductByIdCart(dataProduct)
                setFlagProduct(false)
            }, {
                onlyOnce: false
            });
        })
    }

    const fetchData = async () => {
        const nameCategoryData = await getNameCategory(productSelected.idCate);
        const productByIdCartData = await getAllProByIdCart(productSelected.idCate);

        const sameData = [{
            title: nameCategoryData,
            data: productByIdCartData
        }];

        setSameData(sameData);
        setTimeout(() => {
            setLoading(false);
        }, 3000);

    };

    useEffect(() => {

    }, [])

    const getNewPrice = (oldPrice: number, discount: number, isFormat: boolean) => {
        const newPrice = oldPrice - (oldPrice * discount / 100)
        return formatMoney(newPrice)
    }
    function formatMoney(price: number) {
        if (price >= 1000) {
            return price.toLocaleString('vi-VN') + " đ";
        } else {
            return price.toString() + " đ";
        }
    }

    const getTotalPrice = (oldPrice: number, discount: number, quantity: number) => {
        const totalPrice = (oldPrice - (oldPrice * discount / 100)) * quantity
        return formatMoney(totalPrice)
    }

    const handleQuantity = (type: string) => {
        if (type === "minus") {
            if (quantity > 1) {
                setQuantity(quantity - 1)
            }
        } else {
            setQuantity(quantity + 1)
        }
    }

    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };

    let classMinusBtn = quantity <= 1 ? "bg-teal-100" : "bg-teal-400"

    // if (loading) {
    //     return <Loading size='large' />;
    // }

    return (
        <ScrollView
            className="flex-1 bg-white"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 30 }}
        >
            <StatusBar barStyle="light-content" />

            <Image
                className="w-full h-64 rounded-2xl"
                source={{ uri: productSelected.img }}
            />

            {/* back button */}
            <Animated.View entering={FadeIn.delay(200).duration(1000)} className="w-full absolute flex-row justify-between items-center pt-5">
                <TouchableOpacity onPress={() => navigation.goBack()} className="p-1.5 rounded-full ml-5 bg-white">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => { setIsFavourite(!isFavourite) }} className="p-1.5 rounded-full mr-5 bg-white">
                    <HeartIcon size={hp(3.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                </TouchableOpacity>
            </Animated.View>


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
                        <Text style={{ fontFamily: "Inter-Bold" }} className='line-through text-red-600 text-sm ml-2'>
                            {formatMoney(productSelected.price)}
                        </Text>
                    </View>
                ) : (<View></View>)}
                <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-base ml-4 mr-2'>
                    {getNewPrice(productSelected.price, productSelected.sale, true)}
                </Text>

                <Icon type={Icons.Ionicons} name="close-outline" color='black' size={24} style={{}} />
                <TouchableOpacity
                    className='ml-2'
                    onPress={() => handleQuantity('minus')}
                >
                    <Text className={classMinusBtn + ' rounded-lg p-1.5 text-center justify-items-center text-white'}>
                        <Icon type={Icons.Ionicons} name="remove-outline" color='white' size={24} style={{}} />
                    </Text>
                </TouchableOpacity>
                <Text style={{ fontFamily: "Inter-Bold" }} className='text-black mx-4 text-lg'>{quantity}</Text>
                <TouchableOpacity
                    onPress={() => handleQuantity('plus')}
                >
                    {/* text-teal-400 */}
                    <Text className='bg-teal-400 rounded-lg p-1.5 text-center text-white'>
                        <Icon type={Icons.Ionicons} name="add" color='white' size={24} style={{}} />
                    </Text>
                </TouchableOpacity>
            </View>


            {/* PLus && minus */}
            <View className='flex-row justify-center items-center mt-4'>
                <Text style={{ fontFamily: "Inter-Bold" }} className='text-black mx-4 text-lg'>
                    = {getTotalPrice(productSelected.price, productSelected.sale, quantity)}
                </Text>
            </View>

            {/* Button Checkout */}
            <View className='flex items-center mx-5 mt-5'>
                <TouchableOpacity
                    className='w-full bg-teal-400 p-2.5 rounded-lg  mx-14'
                    onPress={() => { }}
                >
                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-white text-lg uppercase text-center'>Add to cart</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    )
}