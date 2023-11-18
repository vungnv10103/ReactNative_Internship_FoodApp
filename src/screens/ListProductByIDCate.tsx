import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList, RefreshControl, ToastAndroid } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import Loading from '../components/Loading';
import { ChevronLeftIcon, ClockIcon, FireIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import ProductsRecommend from '../components/productRecommend';
import { ICategoryInterface, IProductInterface } from '../interfaces/index'

export default function ListProductByIDCate(props: any) {
    const navigation = useNavigation()


    const [refreshing, setRefreshing] = React.useState(false);
    const [categorySelected, setCategorySelected] = useState<ICategoryInterface>(props.route.params)
    const [productByIdCart, setProductByIdCart] = useState<IProductInterface[]>([])



    const getAllProByIdCate = async (id: any) => {
        return new Promise<any[]>((resolve) => {
            const dbRef = databaseRef(database, 'products');

            onValue(dbRef, (snapshot) => {
                const dataProduct: any[] | ((prevState: never[]) => never[]) = [];
                snapshot.forEach((childSnapshot) => {
                    const childKey = childSnapshot.key;
                    const childData = childSnapshot.val();
                    if (childData.idCate === id) {
                        const itemProduct = {
                            pos: childKey,
                            id: childData.id,
                            idCate: childData.idCate,
                            idSeller: childData.idSeller,
                            name: childData.name,
                            description: childData.description,
                            img: childData.img,
                            price: childData.price,
                            sale: childData.sale,
                            sold: childData.sold,
                            status: childData.status
                        }
                        dataProduct.push(itemProduct)
                    }
                });
                resolve(dataProduct)
                setProductByIdCart(dataProduct)
            }, {
                onlyOnce: false
            });
        })
    }


    const [showLoading, setShowLoading] = useState(true);
    const fetchData = async () => {
        await getAllProByIdCate(categorySelected.id);
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

    const openEditProduct = (product: IProductInterface) => {
        console.log(product.name);
    }

    // ! Warning
    if (productByIdCart.length <= 0) {
        return (
            <View className='flex-1 justify-center items-center'>
                <Loading size='large' />
            </View>
        )
    }

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />

            <View className='flex-row items-center my-3'>
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

            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-center text-black text-lg'>{categorySelected.name}</Text>
            {
                productByIdCart.length > 0 ?
                    (
                        <FlatList
                            contentContainerStyle={{ paddingTop: 16, paddingBottom: 30 }}
                            keyExtractor={item => item.id}
                            showsVerticalScrollIndicator={false}
                            data={productByIdCart}
                            renderItem={({ item }) => <ProductsRecommend key={item.id} productRecommend={item} goScreen={'EditProduct'} />}
                            refreshControl={<RefreshControl colors={["#498627", "#496727"]} refreshing={refreshing} onRefresh={onRefresh} />}
                        />
                    ) :
                    (
                        <View className='flex-1 justify-center items-center'>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-lg text-black'>No data avaliable</Text>
                        </View>
                    )
            }

            {/* <ScrollView
                className="space-y-6 pt-4"
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 30 }}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
            >

                {
                    productByIdCart.length > 0 ?
                        (
                            <View>
                                {productByIdCart.map((item, index) => (
                                    <ProductsRecommend key={item.id} productRecommend={item} goScreen={'EditProduct'} />))}
                            </View>
                        ) :
                        (
                            <View className='flex-1 justify-center items-center'>
                                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-lg text-black'>No data avaliable</Text>
                            </View>
                        )
                }

            </ScrollView > */}

        </View >
    )
}