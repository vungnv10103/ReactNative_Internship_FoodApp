import { View, Text, TouchableOpacity, Image, StatusBar, ScrollView, TextInput, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { database, auth } from '../config/FirebaseConfig';
import { ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";
import { onAuthStateChanged } from 'firebase/auth';
import { BellIcon, MagnifyingGlassIcon, XCircleIcon } from "react-native-heroicons/outline"
import { Categories, Restaurants, Products, ProductsSale } from '../components/index';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';


export default function HomeScreen() {

    const navigation = useNavigation();

    const [user, setUser] = useState('');
    const [avatar, setAvatar] = useState('');
    const [search, setSearch] = useState('');
    const [activeCategory, setActiveCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [productsSale, setProductsSale] = useState([]);
    const [productsPopular, setProductsPopular] = useState([]);

    const getUserData = async () => {
        try {
            onAuthStateChanged(auth, (user) => {
                if (user != null) {
                    setUser(user.displayName ? user.displayName : user.email)
                    setAvatar(user.photoURL ? user.photoURL : 'https://picsum.photos/200/300')
                }
            })
        } catch (error) {
            console.log("Error: " + error.message);
        }
    }

    const getDataCategory = () => {
        const dbRef = databaseRef(database, 'categories');

        onValue(dbRef, (snapshot) => {
            const dataFromFirebase = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                dataFromFirebase.push(childData);
            });
            setCategories(dataFromFirebase);
        }, {
            onlyOnce: false
        });
    }
    const getDataProduct = () => {
        const dbRef = databaseRef(database, 'products');

        onValue(dbRef, (snapshot) => {
            const dataProductFromFirebase = [];
            const dataProductSale = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                if (childData.sale > 0) {
                    dataProductSale.push(childData)
                }
                dataProductFromFirebase.push(childData);
            });
            setProducts(dataProductFromFirebase);
            setProductsSale(dataProductSale)
        }, {
            onlyOnce: false
        });
    }

    const getDataProductPopular = async () => {
        try {
            const dbRef = databaseRef(database, 'products/');
            const productsPopularQuery = query(dbRef, orderByChild('sold'))
            const snapshot = await get(productsPopularQuery);
            if (snapshot.exists()) {
                const products = [];
                snapshot.forEach((childSnapshot) => {
                    const productData = childSnapshot.val();
                    products.push(productData);
                });
                const reversed = products.reverse();
                setProductsPopular(reversed)
            } else {
                console.log('Không có dữ liệu sản phẩm phổ biến.');
            }
        } catch (error) {
            console.error('Lỗi khi lấy dữ liệu từ Firebase:', error);
        }
    }

    const handleChangeCategory = category => {
        setActiveCategory(category)
    }

    useEffect(() => {
        getUserData();
        getDataCategory()
        getDataProduct()
        getDataProductPopular()
    }, [])


    let searchClass = search.length > 0 ? " pr-[30px]" : ""
    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 50 }}
                className="space-y-6 pt-5"
            >
                {/* Avatar $ Bell icon */}
                <View className="mx-3 flex-row justify-between items-center mb-1">
                    <TouchableOpacity
                        onPress={() => {
                            alert('Profile')
                        }}>
                        <Image
                            style={{ height: hp(5), width: hp(5), borderWidth: 0.5, borderColor: 'gray', borderRadius: 50, resizeMode: 'contain' }}
                            source={
                                avatar ? { uri: avatar } : require('./../assets/images/avatar.png')
                            }
                        />
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={() => {
                            alert('Notifications')
                        }}>
                        <BellIcon size={hp(4)} color="gray" />
                    </TouchableOpacity>
                </View>

                {/* greetings and punchline */}
                <View className="mx-4 space-y-2 mb-2">
                    <Text style={{ fontSize: hp(1.7), fontFamily: 'Inter-Medium' }} className="text-neutral-600">
                        Hello, {user} !
                    </Text>
                    <View>
                        <Text style={{ fontSize: hp(3.3), fontFamily: 'Inter-Medium' }} className="font-semibold text-neutral-600">Bringing the culinary world to your <Text style={{ fontFamily: 'Inter-Medium' }} className="text-amber-400">doorstep</Text></Text>
                    </View>

                </View>


                {/* search bar */}
                <View style={{ flexDirection: 'row' }} className={"mx-2 flex-row items-center " + searchClass}>
                    <View className="mx-1 flex-row items-center rounded-full bg-black/5 p-[3px]">
                        <TextInput
                            placeholder='Search any food...'
                            value={search}
                            onChangeText={(text) => setSearch(text)}
                            placeholderTextColor={'gray'}
                            style={{ fontSize: hp(2), color: 'black', fontFamily: 'Inter-Medium' }}
                            className="flex-1 text-base mb-0.5 pl-4 tracking-wider"
                        />

                        <View className="bg-white rounded-full p-3">
                            <TouchableOpacity
                                onPress={() => {
                                    if (search.length > 0) {
                                        alert(search)
                                    }
                                }}
                            >
                                <MagnifyingGlassIcon size={hp(2.5)} strokeWidth={3} color="gray" />
                            </TouchableOpacity>
                        </View>

                    </View>
                    {
                        search.length > 0 && <View className="rounded-full">
                            <TouchableOpacity
                                onPress={() => {
                                    setSearch('')
                                    // Handle
                                }}
                            >
                                <XCircleIcon size={hp(4)} strokeWidth={1.5} color="gray" />
                            </TouchableOpacity>
                        </View>
                    }
                </View>
                {/* Categories */}
                <View>
                    {categories.length > 0 && <Categories categories={categories} activeCategory={activeCategory} handleChangeCategory={handleChangeCategory} />}
                </View>
                {/* Restaurants */}
                {/* <View>
                    <Restaurants />
                </View> */}
                {/* Products Sale */}
                <View>
                    <ProductsSale productsSale={productsSale} />
                </View>
                {/* Products */}
                <View>
                    <Products products={products} activeCategory={activeCategory} productsPopular={productsPopular} />
                </View>
            </ScrollView>
        </View>
    )
}