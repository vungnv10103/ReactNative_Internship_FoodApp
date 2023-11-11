import { Image, Pressable, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './Loading';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';

export default function Products({ activeCategory, products, productsPopular }) {
    const navigation = useNavigation()
    const { id, name } = activeCategory
    // console.log(id, name);
    const dataProduct = products.filter(item => item.idCate === id);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 6000);

        return () => clearTimeout(timer);
    }, []);


    return (
        <View className="mx-4 space-y-4">
            {/* <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className="text-black">{name != null ? `Products » ${name}` : "Popular"}</Text> */}
            <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold', color: 'black' }}>
                Products
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: hp(2.8) }}> » </Text>
                <Text style={{ fontFamily: 'Inter-Medium', fontSize: hp(2.6) }}>
                    {name != null ? name : "Popular"}
                </Text>
            </Text>

            <View>
                {showLoading ? (
                    <Loading className="mt-20" />
                ) : (
                    dataProduct.length == 0 ?
                        (
                            id != null ?
                                (
                                    <View>
                                        <Text style={{ fontFamily: 'Inter-Medium', color: 'black' }}>No data available</Text>
                                    </View>
                                ) :
                                (
                                    <MasonryList
                                        data={productsPopular}
                                        keyExtractor={(item) => item.id}
                                        numColumns={2}
                                        showsVerticalScrollIndicator={false}
                                        renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                                        onEndReachedThreshold={0.1}
                                    />
                                )
                        ) :
                        (
                            <MasonryList
                                data={dataProduct}
                                keyExtractor={(item) => item.id}
                                numColumns={2}
                                showsVerticalScrollIndicator={false}
                                renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                                onEndReachedThreshold={0.1}
                            />
                        )
                )
                }
            </View>
        </View>
    )
}

const ProductItem = ({ item, index, navigation }) => {
    let isEven = index % 2 == 0

    return (
        <Animated.View entering={FadeInDown.delay(index * 100).duration(600).springify().damping(12)}>
            <Pressable
                style={{ width: '100%', paddingLeft: isEven ? 0 : 8, paddingRight: isEven ? 8 : 0 }}
                className="flex justify-center mb-4 space-y-1"
                onPress={() => navigation.navigate('DetailProduct', { ...item })}
            >
                <Image
                    source={{ uri: item.img }}
                    style={{ width: '100%', height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
                    className="bg-black/5" />
                <Text
                    style={{ fontSize: hp(1.9), fontFamily: 'Inter-Bold' }}
                    className=" ml-2 text-neutral-600">
                    {
                        item.name.length > 17 ? item.name.slice(0, 17) + "..." : item.name
                    }
                </Text>
            </Pressable>

        </Animated.View>
    )
}