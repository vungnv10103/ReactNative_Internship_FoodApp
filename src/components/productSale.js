import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeColors } from '../theme';
import { HeartIcon } from 'react-native-heroicons/solid';
import { useNavigation } from '@react-navigation/native';
import Loading from './Loading';


export default function ProductsSale({ productsSale }) {
    const navigation = useNavigation()

    const [showLoading, setShowLoading] = useState(true);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 7000);

        return () => clearTimeout(timer);
    }, []);

    if (productsSale.length <= 0) {
        return (
            <View className="mx-4 space-y-4">
                <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black">Sales</Text>
                <Loading className="mt-20" />
            </View>
        )
    }

    return (
        <View className="mx-4 space-y-4">
            <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black">Sales</Text>
            {
                productsSale.length > 0 ?
                    (
                        <View>
                            <FlatList
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                data={productsSale}
                                keyExtractor={item => item.id}
                                renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                            />
                        </View>
                    ) :
                    (
                        <View>
                            <Text className="text-black">No data product sale available</Text>
                        </View>
                    )
            }
        </View>
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

const Item = ({ item, navigation }) => {
    const [isFavourite, setIsFavourite] = useState(false);

    return (
        <TouchableOpacity
            onPress={() => navigation.push("DetailProductByIDCate", { ...item })}
        >
            <View
                style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
                className="mr-6 rounded-3xl bg-white shadow-lg"
            >
                <Image className="h-36 w-64 rounded-t-3xl" source={{ uri: item.img }} />
                <View className='absolute top-3 right-3 rounded-2xl'>
                    <TouchableOpacity
                        onPress={() => setIsFavourite(!isFavourite)}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        <HeartIcon size={hp(3)} strokeWidth={4.5} color={isFavourite ? "red" : "gray"} />
                    </TouchableOpacity>
                </View>
                <View className="px-3 pb-4 space-y-2">
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-lg text-black pt-2">
                        {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                    </Text>
                    <View className="flex-row items-center space-x-1">
                        <Image source={require('../assets/images/dev/fullStar.png')} className="h-4 w-4" />
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-xs">
                            <Text className="text-green-700">0</Text>
                            <Text className="text-gray-700"> reviews · </Text>
                            <Text className="line-through text-red-600">{getNewPrice(item.price, 0, true)}</Text>
                            <Text className="text-sm text-gray-700"> {getNewPrice(item.price, item.sale, true)}</Text>
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};