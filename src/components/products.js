import { Image, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState, useEffect } from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';
import Loading from './Loading';
import MasonryList from '@react-native-seoul/masonry-list';
import { useNavigation } from '@react-navigation/native';

export default function Products({ activeCategory, products, productsPopular }) {
    const navigation = useNavigation()
    const dataProduct = products.filter(item => item.idCate === activeCategory);
    const [showLoading, setShowLoading] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 5000); // Change the duration as needed (in milliseconds)

        // Clear the timer when the component unmounts to prevent memory leaks
        return () => clearTimeout(timer);
    }, []);


    return (
        <View className="mx-4 space-y-4">
            <Text style={{ fontSize: hp(3) }} className="font-semibold text-neutral-600">{dataProduct.length == 0 ? "Popular" : "Products"}</Text>
            <View>
                {showLoading ? (
                    <Loading size="lagre" className="mt-20" />
                ) : (
                    dataProduct.length == 0 ? (
                        activeCategory != null && activeCategory.length > 0 ? (<View>
                            <Text style={{ fontFamily: 'Inter-Medium', color: 'black' }}>No data available</Text>
                        </View>) : (<MasonryList
                            data={productsPopular}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                            onEndReachedThreshold={0.1}
                        />)
                    ) : (
                        <MasonryList
                            data={dataProduct}
                            keyExtractor={(item) => item.id}
                            numColumns={2}
                            showsVerticalScrollIndicator={false}
                            renderItem={({ item, i }) => <ProductItem item={item} index={i} navigation={navigation} />}
                            onEndReachedThreshold={0.1}
                        />
                    ))}
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
                onPress={() => navigation.navigate('DetailProduct')}
            >
                <Image
                    source={{ uri: item.img }}
                    style={{ width: '100%', height: index % 3 == 0 ? hp(25) : hp(35), borderRadius: 35 }}
                    className="bg-black/5" />
                <Text
                    style={{ fontSize: hp(2), fontFamily: 'Inter-Medium', fontWeight: 'bold' }}
                    className=" ml-2 text-neutral-600">
                    {
                        item.name.length > 20 ? item.name.slice(0, 18) + "..." : item.name
                    }
                </Text>
            </Pressable>

        </Animated.View>
    )
}