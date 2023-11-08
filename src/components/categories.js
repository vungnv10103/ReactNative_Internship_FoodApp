import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Animated, { FadeInDown } from 'react-native-reanimated';



export default function Categories({ categories, activeCategory, handleChangeCategory }) {
    return (
        <View className="mx-4 space-y-4">
            <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black">Categories</Text>
            <View>
                <Animated.View entering={FadeInDown.duration(500).springify()}>
                    <ScrollView
                        horizontal
                        className="space-x-4"
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 15 }}
                    >
                        {
                            categories.map((cate, index) => {
                                let isActive = cate.id == activeCategory
                                let activeButtonClass = isActive ? ' bg-amber-400' : ' bg-black/10'
                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => handleChangeCategory(cate.id)}
                                        className="flex items-center space-y-1"
                                    >
                                        <View className={"rounded-full p-[5px]" + activeButtonClass}>
                                            <Image
                                                source={{ uri: cate.img }}
                                                style={{ width: hp(6.5), height: hp(6.5) }}
                                                className="rounded-full" />
                                        </View>
                                        <Text className="text-black" style={{ fontSize: hp(1.6), fontFamily: 'Inter-Medium' }}>{cate.name}</Text>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </ScrollView>
                </Animated.View>
            </View>
        </View>


    )
}
