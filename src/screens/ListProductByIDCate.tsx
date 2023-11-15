import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList, RefreshControl, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import Loading from '../components/Loading';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';

interface Category {
    id: string,
    name: string,
    img: string
}

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

export default function ListProductByIDCate(props: any) {
    const navigation = useNavigation()


    const [refreshing, setRefreshing] = React.useState(false);
    const [categorySelected, setCategorySelected] = useState<Category>(props.route.params)
    const [productByIdCart, setProductByIdCart] = useState<Product[]>([])



    const getAllProByIdCate = async (id: any) => {
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
            }, {
                onlyOnce: false
            });
        })
    }


    const [showLoading, setShowLoading] = useState(true);
    const fetchData = async () => {
        const productByIdCartData = await getAllProByIdCate(categorySelected.id);
        setProductByIdCart(productByIdCartData)
        setShowLoading(false)
    };


    useEffect(() => {
        fetchData()

        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 10000);

        return () => clearTimeout(timer);
    }, [])

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    // if (productByIdCart.length <= 0) {
    //     return (
    //         <View className='flex-1 justify-center items-center'>
    //             <Loading size='large' />
    //         </View>
    //     )
    // }

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <ScrollView
                className="space-y-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >
                <View className='flex-row items-center'>
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="p-2 rounded-full ml-5 bg-gray-100">
                        <ChevronLeftIcon size={hp(3.5)} strokeWidth={4.5} color="#2dd4c0" />
                    </TouchableOpacity>

                    <Text style={{ fontFamily: 'Inter-Bold' }}
                        className='text-black text-xl mx-4'>
                        Danh sách sản phẩm
                    </Text>
                </View>

                {productByIdCart.map((item, index) => <Text key={item.id}>{item.name}</Text>)}
            </ScrollView>

        </View>
    )
}