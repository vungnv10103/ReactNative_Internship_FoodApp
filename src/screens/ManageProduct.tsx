import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList, RefreshControl, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigation } from '@react-navigation/native'
import { database, auth } from '../config/FirebaseConfig';
import { ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import Animated, { FadeInDown } from 'react-native-reanimated';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { EditCategory, EditProduct } from '../components/form/index'

interface Category {
    id: string,
    name: string,
    img: string
}

export default function ManageProduct(props: any) {

    const navigation = useNavigation();

    const [refreshing, setRefreshing] = React.useState(false);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('');


    const [isEditCategoryVisible, setEditCategoryVisible] = useState(false);
    const [isEditProductVisible, setEditProductVisible] = useState(false);


    const handleChangeCategory = (category: Category | React.SetStateAction<string>) => {
        // setActiveCategory(category.toString())
        props.navigation.navigate("ListProductByIDCate", category)
    }

    const getDataCategory = async () => {
        return new Promise<any[]>((resolve) => {
            const dbRef = databaseRef(database, 'categories');

            onValue(dbRef, (snapshot) => {
                const dataFromFirebase: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    dataFromFirebase.push(childData);
                });
                resolve(dataFromFirebase)
            }, {
                onlyOnce: false
            });
        })

    }

    const fetchData = async () => {
        const dataCategory = await getDataCategory();
        setCategories(dataCategory)
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    useEffect(() => {
        fetchData()
    }, [])


    const showToast = (message: any) => {
        ToastAndroid.show("" + message, ToastAndroid.SHORT);
    };


    const handleEditCategorySubmit = async (idCate: string, nameCate: string, imageSelected: any) => {


    }

    const handleEditProductSubmit = async (idCate: string, idProduct: string, nameProduct: string, description: string, price: string, imageSelected: any) => {


    }

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <ScrollView
                className="space-y-6 pt-1"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }>

                {
                    categories.length > 0 ? (
                        <Animated.View entering={FadeInDown.duration(500).springify()}>
                            <ScrollView
                                className=''
                                showsHorizontalScrollIndicator={false}
                                contentContainerStyle={{ paddingHorizontal: hp(1.5) }}
                            >
                                <Text style={{ fontFamily: 'Inter-Bold' }}
                                    className='text-center text-black text-xl m-4'>
                                    Danh sách thể loại
                                </Text>
                                {
                                    categories.map((cate, index) => {
                                        return (
                                            <TouchableOpacity
                                                key={index}
                                                onPress={() => handleChangeCategory(cate)}
                                            >
                                                <View className={"flex-row w-full rounded-lg p-[5px] bg-white items-center my-2"}>
                                                    <Image
                                                        source={{ uri: cate.img }}
                                                        style={{ width: hp(6.5), height: hp(6.5) }}
                                                    />
                                                    <Text className="text-black" style={{ fontSize: hp(2), fontFamily: 'Inter-Medium' }}>
                                                        {
                                                            cate.name.length > 12 ? cate.name.slice(0, 12) + "..." : cate.name
                                                        }
                                                    </Text>
                                                    <TouchableOpacity
                                                        onPress={() => setEditCategoryVisible(true)}>
                                                        <Image className="h-8 w-8" source={require('./../assets/images/edit.png')} />
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => { }}>
                                                        <Image className="h-8 w-8" source={require('./../assets/images/delete.png')} />
                                                    </TouchableOpacity>
                                                </View>
                                            </TouchableOpacity>
                                        )
                                    })
                                }
                            </ScrollView>
                        </Animated.View>
                    ) :
                        (
                            <View>
                                <Text style={{ fontFamily: 'Inter-Medium', color: 'black' }}>No data category available</Text>
                            </View>
                        )
                }

                {/* <View>
                    <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />
                </View> */}


                <EditCategory
                    visible={isEditCategoryVisible}
                    onClose={() => setEditCategoryVisible(false)}
                    onSubmit={handleEditCategorySubmit}
                />
                <EditProduct
                    visible={isEditProductVisible}
                    onClose={() => setEditProductVisible(false)}
                    onSubmit={handleEditProductSubmit}
                />
            </ScrollView>

        </View>
    )
}