import { View, Text, StatusBar, Image, TouchableOpacity, Dimensions, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { ChevronLeftIcon, TrashIcon, ShoppingBagIcon } from 'react-native-heroicons/outline';
import { database, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from "firebase/auth";
import { ref as databaseRef, onValue, update, remove } from "firebase/database";
import { IUserInterface, IProductInterface, ICartInterface } from '../interfaces';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { SwipeListView } from 'react-native-swipe-list-view';
import { useCart } from './CartProvider';
import CheckBox from '@react-native-community/checkbox';
import { themeColors } from '../theme';
import Icon, { Icons } from '../components/Icons';

export default function CartScreen(props: any) {
    const navigation = useNavigation();
    const { updateCartItemsCount } = useCart();

    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [totalQuantity, setTotalQuantity] = useState<string>('');
    const [totalPrice, setTotalPrice] = useState<string>('');
    const [dataCart, setDataCart] = useState<ICartInterface[]>([]);

    const getUserData = async () => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user)
                }
            })
        })
    }

    const getDataCart = (idUser: string) => {
        const dbRef = databaseRef(database, `carts/${idUser}`);

        onValue(dbRef, (snapshot) => {
            const cartData: any[] | ((prevState: never[]) => never[]) = [];
            let totalQuan = 0;

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(JSON.stringify(childData, null, 2));
                childData['pos'] = childKey
                cartData.push(childData);
                if (childData.status === 'payment') {
                    totalQuan += childData.quantity
                }
            });
            // console.log(JSON.stringify(cartData, null, 2));
            setTotalQuantity(totalQuan.toString())
            setDataCart(cartData);
            updateCartItemsCount(cartData.length)
        }, {
            onlyOnce: false
        });
    }


    const fetchData = async () => {
        const dataUser = await getUserData()
        getDataCart(dataUser.uid + "")
        setUser(dataUser)
    };

    useEffect(() => {
        fetchData()
    }, [updateCartItemsCount]);

    const [refreshing, setRefreshing] = React.useState(false);
    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        fetchData()
        setTimeout(() => {
            setRefreshing(false);
        }, 2000);
    }, []);

    function getImageProduct(img: string): string {

        return img;
    }

    const handleDeleteCart = (itemSelected: ICartInterface) => {
        const dataRef = databaseRef(database, `carts/${itemSelected.idUser}/${itemSelected.pos}`);
        remove(dataRef)
            .then(() => {
                console.log('Data deleted successfully!');
            })
            .catch((error) => {
                console.error('Error deleting data:', error);
            });
    }
    const handlePayment = (itemSelected: ICartInterface) => {
        props.navigation.navigate('Payment', { itemSelected });
    }


    const showAlert = (message: string) => {
        return Alert.alert(
            "Thông báo !",
            message,
            [
                {
                    text: "Oke",
                    onPress: () => {

                    },
                },
                // {
                //     text: "Quay lại",
                // },
            ]
        );
    }

    const renderHiddenItem = ({ item }: { item: ICartInterface }) => (
        <View className='flex-1 flex-row justify-end p-2'>
            <TouchableOpacity
                className='bg-red-300 justify-center items-center'
                style={{ width: Dimensions.get('window').width / 6 }}
                onLongPress={() => showAlert('Bạn sẽ chỉ mua sản phẩm này thay vì toàn bộ giỏ hàng')}
                onPress={() => {
                    handlePayment(item);
                }}>
                <ShoppingBagIcon size={hp(3.5)} strokeWidth={1.5} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity
                className='justify-center items-center'
                style={{ backgroundColor: 'orangered', width: Dimensions.get('window').width / 6 }}
                onLongPress={() => showAlert('Sản phẩm sẽ mất khỏi giỏ hàng')}
                onPress={() => {
                    handleDeleteCart(item);
                }}>
                <TrashIcon size={hp(3.5)} strokeWidth={1.5} color="#fff" />
                {/* <Image className='h-16 w-16' source={require('../assets/images/delete.png')} /> */}
            </TouchableOpacity>
        </View>
    );

    const handleStatus = (selected: boolean, itemSelected: ICartInterface) => {
        const updates: { [key: string]: string } = {};
        updates[`carts/${itemSelected.idUser}/${itemSelected.pos}/status`] = selected ? 'payment' : 'incart';
        try {
            update(databaseRef(database), updates);
        } catch (error) {
            console.error('Cập nhật thất bại:', error);
        }
    }

    const handleQuantity = (type: string, itemSelected: ICartInterface) => {
        const updates: { [key: string]: number } = {};
        if (type === "minus") {
            if (itemSelected.quantity > 1) {
                updates[`carts/${itemSelected.idUser}/${itemSelected.pos}/quantity`] = --itemSelected.quantity;
            }
        } else {
            updates[`carts/${itemSelected.idUser}/${itemSelected.pos}/quantity`] = ++itemSelected.quantity;
        }
        try {
            update(databaseRef(database), updates);
        } catch (error) {
            console.error('Cập nhật số lượng thất bại:', error);
        }
    }

    function formatMoney(price: number) {
        if (price >= 1000) {
            return price.toLocaleString('vi-VN') + " đ";
        } else {
            return price.toString() + " đ";
        }
    }

    const renderItem = ({ item }: { item: ICartInterface }) => (
        <View
            style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
            className="bg-white flex-row m-1 p-2 rounded-lg shadow-lg justify-between items-center"
        >
            <Image className="h-24 w-24 rounded-lg" source={{ uri: item.img }} />

            {/* Information */}
            <View className='ml-2 space-y-2.5'>
                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-base text-black">
                    {item.item.length > 15 ? item.item.slice(0, 15) + "..." : item.item}
                </Text>
                <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-black">
                    {/* {item.idProduct.length > 15 ? item.idProduct.slice(0, 15) + "..." : item.idProduct} */}
                </Text>
                {/* Price */}
                <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-base'>
                    {formatMoney(item.price)}
                </Text>
            </View>

            {/* Button Action */}
            <View className='flex-row ml-auto'>
                {/* Plus & Minus */}
                <View className='items-center mr-1'>
                    <TouchableOpacity
                        onPress={() => handleQuantity('plus', item)}
                    >
                        {/* text-teal-400 */}
                        <Text style={{ backgroundColor: '#b00020' }} className='rounded-lg p-1.5 text-center text-white'>
                            <Icon type={Icons.Ionicons} name="add" color='white' size={24} style={{}} />
                        </Text>
                    </TouchableOpacity>
                    <Text style={{ fontFamily: "Inter-Bold" }} className='text-black mx-2 text-lg'>{item.quantity}</Text>
                    <TouchableOpacity
                        onPress={() => handleQuantity('minus', item)}
                    >
                        {/* let classMinusBtn = quantity <= 1 ? "bg-teal-100" : "bg-teal-400" */}
                        <Text style={{ backgroundColor: item.quantity <= 1 ? '#ffe9e9' : '#b00020' }} className='rounded-lg p-1.5 text-center justify-items-center text-white'>
                            <Icon type={Icons.Ionicons} name="remove-outline" color='white' size={24} style={{}} />
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Checkbox */}
                <View className=''>
                    <CheckBox
                        tintColors={{}}
                        disabled={false}
                        value={item.status === 'payment'}
                        onValueChange={(newValue) => handleStatus(newValue, item)}
                    />
                </View>
            </View>

        </View>
    );

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            <View className='flex-row items-center my-3'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={3.5} color="#b00020" />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4 text-center'>
                    Giỏ hàng
                </Text>
            </View>
            {
                dataCart.length > 0 ?
                    (
                        <View className='flex-1'>
                            <SwipeListView
                                contentContainerStyle={{ paddingBottom: 30 }}
                                data={dataCart}
                                renderItem={renderItem}
                                renderHiddenItem={renderHiddenItem}
                                rightOpenValue={-Dimensions.get('window').width / 3}
                                disableRightSwipe={true}
                                keyExtractor={(item) => item.id}
                            />

                            <View
                                className='mx-5'
                            >
                                <TouchableOpacity
                                    style={{ backgroundColor: '#b00020' }}
                                    className="flex-row w-full p-3 rounded-lg mb-3 justify-between"
                                    onPress={() => {
                                        if (parseInt(totalQuantity) > 0) {
                                            props.navigation.navigate('Payment', { dataCart })
                                        }
                                        else {
                                            showAlert('Bạn cần chọn sản phẩm')
                                        }
                                    }}
                                >
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-white text-lg'>{totalQuantity}</Text>
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-white text-lg'>Trang thanh toán</Text>
                                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-white text-lg'>{totalPrice} đ</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ) :
                    (
                        <View className='flex-1 justify-center items-center p-5'>
                            <Image className='h-64 w-64' source={require('../assets/images/cart_empty.png')} />
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-xl mt-5'>Giỏ hàng trống</Text>
                            <TouchableOpacity
                                onPress={() => props.navigation.navigate("Home")}
                                className="border border-red-400 bg-white p-2.5 rounded-lg mt-3">
                                <Text style={{ fontFamily: 'Inter-Medium' }} className='text-red-500 text-base text-center'>Mua sắm ngay!</Text>
                            </TouchableOpacity>
                        </View>
                    )
            }

        </View>

    )
}
