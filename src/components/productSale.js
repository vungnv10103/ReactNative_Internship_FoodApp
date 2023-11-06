import { View, Text, Image, FlatList, TouchableOpacity } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';

export default function ProductsSale({ productsSale }) {
    const navigation = useNavigation()
    return (
        <View>
            {
                productsSale.length > 0 ? (
                    <View className="mx-4 space-y-4">
                        <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black">Sale</Text>
                        <FlatList
                            horizontal={true}
                            data={productsSale}
                            keyExtractor={item => item.id}
                            renderItem={({ item }) => <Item item={item} navigation={navigation} />}
                        />
                    </View>) : (<View>
                        <Text>No data</Text>
                    </View>)
            }

        </View>
    )
}

const Item = ({ item, navigation }) => (
    <TouchableOpacity
        onPress={() => navigation.navigate("DetailProduct")}
    >
        <View
            style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
            className="mr-6 bg-white rounded-3xl shadow-lg"
        >
            <Image className="h-36 w-64 rounded-t-3xl" source={{ uri: item.img }} />
            <View className="px-3 pb-4 space-y-2">
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-lg text-black pt-2">{item.name}</Text>
                <View className="flex-row items-center space-x-1">
                    <Image source={require('../assets/images/dev/fullStar.png')} className="h-4 w-4" />
                    <Text className="text-xs">
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-green-700">0</Text>
                        <Text style={{ fontFamily: 'Inter-Medium' }} className="text-gray-700"> reviews ·</Text>  <Text style={{ fontFamily: 'Inter-Medium' }} className=" text-gray-700">{item.price} đ</Text>
                    </Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>

);