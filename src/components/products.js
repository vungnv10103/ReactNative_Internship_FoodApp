import { Image, Pressable, Text, View, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './Loading';
import { HeartIcon } from 'react-native-heroicons/solid';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';

export default function Products({ activeCategory, products, productsPopular, fetchNextPage, ListEndLoader }) {
    const navigation = useNavigation()
    const { id, name } = activeCategory
    // console.log(id, name);
    const dataProduct = products.filter(item => item.idCate === id);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 9000);

        return () => clearTimeout(timer);
    }, []);

    if (products.length <= 0 || productsPopular.length <= 0) {
        return (
            <View className="mx-4 space-y-4">
                <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className="text-black">Products</Text>
                <Loading className="mt-20" />
            </View>
        )
    }

    return (
        <View className="mx-4 space-y-4">
            {/* Title */}
            {/* <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className="text-black">{name != null ? `Products » ${name}` : "Popular"}</Text> */}
            <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold', color: 'black' }}>
                Products
                {/* <Text style={{ fontFamily: 'Inter-Medium', fontSize: hp(2.8) }}>{dataProduct.length > 0 ? (" » ") : ""}</Text> */}
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: hp(2.8) }}> » </Text>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: hp(2.6) }}>
                    {/* {dataProduct.length > 0 ? (name != null ? name : "Popular") : ("")} */}
                    {name != null ? name : "Popular"}
                </Text>
            </Text>

            <View>
                {
                    dataProduct.length > 0 && id != null ?
                        (
                            <MasonryList
                                data={dataProduct}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                                // onEndReached={fetchNextPage}
                                onEndReachedThreshold={0.8}
                            // ListFooterComponent={ListEndLoader} // Loader when loading next page.
                            />
                        ) :
                        (
                            <View>
                                {
                                    productsPopular.length > 0 && id == null ?
                                        (
                                            <MasonryList
                                                data={productsPopular}
                                                keyExtractor={(item) => item.id}
                                                numColumns={2}
                                                showsVerticalScrollIndicator={false}
                                                renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                                                // onEndReached={fetchNextPage}
                                                onEndReachedThreshold={0.8}
                                            // ListFooterComponent={ListEndLoader} // Loader when loading next page.
                                            />
                                        ) :
                                        (
                                            <View>
                                                <Text style={{ fontFamily: 'Inter-Medium', color: 'black' }}>No data product available</Text>
                                            </View>
                                        )
                                }
                            </View>
                        )
                }
            </View >
        </View >
    )
}

const formatMoney = (price) => {
    if (price >= 1000) {
        return price.toLocaleString('vi-VN') + "đ";
    } else {
        return price.toString() + "đ";
    }
}

const getNewPrice = (oldPrice, discount, isFormat) => {
    const newPrice = parseFloat(oldPrice) - (parseFloat(oldPrice) * parseFloat(discount) / 100)
    if (isFormat) {
        return formatMoney(newPrice)
    }
    else {
        return newPrice
    }
}

const ProductItem = ({ item, index, navigation }) => {
    const [isFavourite, setIsFavourite] = useState(false);
    let isEven = index % 2 == 0

    const classPrice = isEven ? "left-2" : "left-4"
    const classFavouriteIcon = isEven ? "right-4" : "right-2"

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
            <Pressable
                style={{ width: '100%', paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
                className="flex justify-center mb-4 space-y-1"
                onPress={() => navigation.push('DetailProductByIDCate', { ...item })}
            >
                <Image
                    source={{ uri: item.img }}
                    style={{ width: '100%', height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
                    className="bg-black/5" />
                <View
                    className={classPrice + ' absolute top-3 px-2 py-1.5 bg-black/30 rounded-2xl'}>
                    <Text
                        style={{ fontFamily: 'Inter-Medium' }}
                        className='text-white text-sm'>
                        {getNewPrice(item.price, item.sale, true)}
                    </Text>
                </View>
                <View className={classFavouriteIcon + ' absolute top-3 rounded-2xl'}>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        <HeartIcon size={hp(2.5)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                    </TouchableOpacity>
                </View>

                <Text
                    style={{ fontSize: hp(1.9), fontFamily: 'Inter-Bold' }}
                    className=" ml-2 text-black">
                    {
                        item.name.length > 16 ? item.name.slice(0, 16) + "..." : item.name
                    }
                </Text>
            </Pressable>

        </Animated.View>
    )
}