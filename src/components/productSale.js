import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeColors } from '../theme';
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

    if (showLoading) {
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

const getNewPrice = (oldPrice, discount) => {
    const valueOldPrice = parseFloat(oldPrice)
    const valueDiscount = parseFloat(discount)
    return valueOldPrice - (valueOldPrice * valueDiscount / 100)
}

const Item = ({ item, navigation }) => (
    <TouchableOpacity
        onPress={() => navigation.push("DetailProductByIDCate", { ...item })}
    >
        <View
            style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
            className="mr-6 rounded-3xl bg-white shadow-lg"
        >
            <Image className="h-36 w-64 rounded-t-3xl" source={{ uri: item.img }} />
            <View className="px-3 pb-4 space-y-2">
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-lg text-black pt-2">
                    {item.name.length > 20 ? item.name.slice(0, 20) + "..." : item.name}
                </Text>
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../assets/images/dev/fullStar.png')} className="h-4 w-4" />
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-xs">
                        <Text className="text-green-700">0</Text>
                        <Text className="text-gray-700"> reviews · </Text>
                        <Text className="line-through text-red-600">{item.price}đ</Text>
                        <Text className="text-sm text-gray-700"> {getNewPrice(item.price, item.sale)}đ</Text>
                    </Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>

);