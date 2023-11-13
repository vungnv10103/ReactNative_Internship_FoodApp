import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function ProductsRecommend({ productRecommend }) {
    const navigation = useNavigation()
    return (
        <View>
            {/* <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black"></Text> */}
            <Item item={productRecommend} navigation={navigation} />
        </View>
    )
}

function formatMoney(price) {
    const valuePrice = parseFloat(price)
    if (valuePrice >= 1000) {
        return valuePrice.toLocaleString('vi-VN') + " đ";
    } else {
        return valuePrice.toString() + " đ";
    }
}

const getNewPrice = (oldPrice, discount) => {
    const valueOldPrice = parseFloat(oldPrice)
    const valueDiscount = parseFloat(discount)
    const newPrice = valueOldPrice - (valueOldPrice * valueDiscount / 100)
    return formatMoney(newPrice)
}

const Item = ({ item, navigation }) => (
    <TouchableOpacity
        onPress={() => alert(item.name)}
    >
        <View
            style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
            className="flex-row m-1 py-2 px-3 bg-gray-200 rounded-xl shadow-lg justify-between"
        >
            <View className="">
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-base text-black pt-1.5">
                    {item.name.length > 18 ? item.name.slice(0, 18) + "..." : item.name}
                </Text>
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-black pt-1.5">
                    {item.description.length > 18 ? item.description.slice(0, 18) + "..." : item.description}
                </Text>
                {/* Price */}
                <View className='flex-row items-center pt-1.5'>
                    {item.sale > 0 ? (
                        <View className='flex-row items-center'>
                            <Image className="h-4 w-4" source={require('./../assets/images/sale_tag.png')} />
                            <Text style={{ fontFamily: "Inter-Bold" }} className='line-through text-red-600 text-sm mx-1'>
                                {formatMoney(item.price)}
                            </Text>
                        </View>
                    ) : (<View></View>)}
                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-base'>
                        {getNewPrice(item.price, item.sale)}
                    </Text>
                </View>
            </View>
            <Image className="h-24 w-24 rounded-lg" source={{ uri: item.img }} />

        </View>
    </TouchableOpacity>
);