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



export default function DetailProductByIDCate(props: any) {
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
        // setLoading(false)
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
        fetchData()
    }, [])

    const showDataTemp = () => {
        // console.log("current category: ", nameCategory);
        // console.log("array category: ", arrayNameCategory);
        // console.log("array product: ", JSON.stringify(productByIdCart, null, 2));
        const sameData = [{
            title: nameCategory,
            data: productByIdCart
        }]

        console.log("Sanme data: ", sameData);


    }

    const DATA1 = productByIdCart.map((item, index) => ({
        title: item.idCate,
        data: productByIdCart,
        index,
    }));

    const handleQuantity = (type: string) => {
        if (type === "minus") {
            if (quantity > 1) {
                setQuantity(quantity - 1)
            }
        } else {
            setQuantity(quantity + 1)
        }
    }
    
    const getNewPrice = (oldPrice: number, discount: number, isFormat: boolean) => {
        const newPrice = oldPrice - (oldPrice * discount / 100)
        if (isFormat) {
            return formatMoney(newPrice)
        }
        else {
            return newPrice
        }
    }

    const getTotalPrice = (oldPrice: number, discount: number, quantity: number) => {
        const totalPrice = (oldPrice - (oldPrice * discount / 100)) * quantity
        return formatMoney(totalPrice)
    }

    function formatMoney(price: number) {
        // if (typeof price === 'number') {
        //     if (price >= 1000) {
        //         return price.toLocaleString('vi-VN');
        //     } else {
        //         return price.toString();
        //     }
        // } else {
        //     return '$$$';
        // }
        if (price >= 1000) {
            return price.toLocaleString('vi-VN') + " đ";
        } else {
            return price.toString() + " đ";
        }
    }

    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };


    const handleItemClick = (index: number) => {
        setActiveIndex(index)
        if (firstItemRef.current && scrollViewRef.current) {
            firstItemRef.current?.measureLayout(
                scrollViewRef.current?.getInnerViewNode(),
                (x, y) => {
                    if (scrollViewRef.current) {
                        scrollViewRef.current?.scrollTo({ x, animated: true });
                    }
                }
            );
        }
    };

    const selectCategory = (index: number) => {
        const selected = itemRef.current[index]
        setActiveIndex(index)
        if (index >= 1) {
            const beforeSelected = itemRef.current[index - 1]
            beforeSelected.measure((x1, y1, width1, height1, pageX1, pageY1) => {
                // showToast("before x: " + x + " y: " + y + " w: " + width + " h: " + height + " pageX: " + pageX + " pageY: " + pageY)
                console.log("before x: " + x1 + " y: " + y1 + " w: " + width1 + " h: " + height1 + " pageX: " + pageX1 + " pageY: " + pageY1);
                selected.measure((x, y, width, height, pageX, pageY) => {
                    // showToast("selected x: " + x + " y: " + y + " w: " + width + " h: " + height + " pageX: " + pageX + " pageY: " + pageY)
                    console.log("selected x: " + x + " y: " + y + " w: " + width + " h: " + height + " pageX: " + pageX + " pageY: " + pageY);
                    scrollRef.current?.scrollTo({ x: pageX - width1, y: 0, animated: true })
                })
            })
        }
        else {
            selected.measure((x, y, width, height, pageX, pageY) => {
                showToast(pageX)
                scrollRef.current?.scrollTo({ x, y: 0, animated: true })
            })
        }
    }

    const onScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;
        if (y > 200) {
            opacity.value = withTiming(1);
        } else {
            opacity.value = withTiming(0);
        }
    };


    const renderItem: ListRenderItem<any> = ({ item, index }) => (
        <ProductsRecommend productRecommend={item} />
    )

    let classMinusBtn = quantity <= 1 ? "bg-teal-100" : "bg-teal-400"

    if (loading) {
        return <Loading size='large' />;
    }

    return (
        <>
            {!flagProduct ? (
                <>
                    <ParallaxScrollView
                        scrollEvent={onScroll}
                        className="flex-1"
                        backgroundColor="#fff"
                        renderBackground={() =>
                            <View className='shadow-2xl border-b border-gray-100'>
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
                                    onPress={showDataTemp}
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
                                renderSectionHeader={({ section: { title, data } }) => (
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-xl text-black m-5 mt-16'>{title}</Text>
                                )}
                                ItemSeparatorComponent={() => <View className='h-0.5 bg-gray-100 mx-4'></View>}
                                SectionSeparatorComponent={() => <View className='h-0.5 bg-gray-100 mx-4'></View>}
                            />
                        </View>
                    </ParallaxScrollView>

                    {/* Sticky segments */}
                    <Animated.View style={[animatedStyles]} className="justify-center absolute h-16 left-0 right-0 top-16 bg-white">
                        <View className=''>
                            <ScrollView
                                ref={scrollRef}
                                // ref={scrollViewRef}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: 16 }}
                            >
                                {arrayNameCategory.map((item, index) => (
                                    <TouchableOpacity
                                        ref={(ref) => (itemRef.current[index] = ref!)}
                                        // ref={(ref) => {
                                        //     if (index === 0) {
                                        //         itemRef.current[index] = ref!;
                                        //     }
                                        // }}
                                        key={index}
                                        style={activeIndex === index ? styles.segmentButtonActive : styles.segmentButton}
                                        className=''
                                        onPress={() => selectCategory(index)}
                                    // onPress={() => handleItemClick(index)}
                                    >
                                        <Text className='' style={activeIndex === index ? styles.segmentTextActive : styles.segmentText}>{item}</Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    </Animated.View>
                </>

            ) : (<Loading size='large' />)}
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
        fontFamily: 'Inter-Medium',
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
        fontFamily: 'Inter-Bold',
        fontWeight: 'bold',
        fontSize: 16,
    },
})