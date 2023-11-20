import { View, Text, TouchableOpacity, StatusBar, FlatList, Image } from 'react-native'
import React, { useState, useEffect, useMemo } from 'react'
import { useNavigation } from '@react-navigation/native'
import { database, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as databaseRef, onValue } from "firebase/database";
import { IUserInterface, ICartInterface } from '../interfaces'
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { ChevronLeftIcon, XMarkIcon } from 'react-native-heroicons/outline';
import { themeColors } from '../theme';
import RadioGroup, { RadioButtonProps } from 'react-native-radio-buttons-group';
import GetLocation from 'react-native-get-location'
import MapView from 'react-native-maps';
import LocationScreen from './LocationScreen';



interface Location {
    latitude: number,
    longitude: number,
    latitudeDelta: number,
    longitudeDelta: number
}

export default function PaymentScreen(props: any) {
    const navigation = useNavigation();

    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [totalQuantity, setTotalQuantity] = useState<string>('');
    const [discount, setDiscount] = useState<number>(0);
    const [delivery, setDelivery] = useState<number>(5);
    const [totalPrice, setTotalPrice] = useState<string>('');
    const [itemCart, setItemCart] = useState<ICartInterface | null>(props.route.params.itemSelected);
    const [dataCart, setDataCart] = useState<ICartInterface[]>([])

    const [myLocation, setLocation] = useState<Location>({
        latitude: 20.1695081,
        longitude: 106.2525582,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
    })

    const radioButtons: RadioButtonProps[] = useMemo(() => ([
        {
            id: '1',
            label: '',
            value: 'Tiền mặt'
        },
        // {
        //     id: '2',
        //     label: 'Master Card',
        //     value: 'ATM'
        // }
    ]), []);

    const [selectedId, setSelectedId] = useState<string | undefined>();

    const demo = () => {
        console.log(props);
    }


    const getUserData = async () => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user)
                }
            })
        })
    }

    const getDataCart = async (idUser: string) => {
        const dbRef = databaseRef(database, `carts/${idUser}`);

        onValue(dbRef, (snapshot) => {
            const mCartData: any[] | ((prevState: never[]) => never[]) = [];
            let totalQuan = 0;
            let totalPrice = 0;
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(JSON.stringify(childData, null, 2));
                if (childData.status === 'payment') {
                    childData['pos'] = childKey
                    mCartData.push(childData);
                    totalQuan += childData.quantity
                    totalPrice += childData.price
                }
            });
            setDataCart(mCartData)
            setTotalPrice(totalPrice.toString())
        }, {
            onlyOnce: false
        });
    }

    const fetchData = async () => {
        const dataUser = await getUserData()
        getDataCart(dataUser.uid + "")
        setUser(dataUser)
    };

    const getCurrentLocation = () => {
        GetLocation.getCurrentPosition({
            enableHighAccuracy: true,
            timeout: 60000,
        })
            .then(location => {
                // console.log(location.longitude);
                // console.log(location.latitude);
                let currentLocation = {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                }
                setLocation(currentLocation)

            })
            .catch(error => {
                const { code, message } = error;
                console.warn(code, message);
            })
    }

    useEffect(() => {
        fetchData()

        getCurrentLocation()
    }, []);


    function getImageProduct(img: string): string {

        return img;
    }
    const handlePayment = () => {
        console.log(123);

    }


    const getTotalPrice = (oldPrice: number, discount: number, quantity: number) => {
        const totalPrice = (oldPrice - (oldPrice * discount / 100)) * quantity
        return formatMoney(totalPrice)
    }

    const getNewPrice = (oldPrice: number, discount: number, isFormat: boolean) => {
        const newPrice = oldPrice * discount / 100
        if (isFormat) {
            return formatMoney(newPrice)
        }
        else {
            return newPrice
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
        <View className='flex-row justify-between items-center'>
            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>{item.quantity}</Text>
            {/* <Icon type={Icons.Ionicons} name="close-outline" color='black' size={16} style={{}} /> */}
            <XMarkIcon size={hp(1.6)} strokeWidth={3.5} color="#000000" style={{ marginTop: 2, marginLeft: 8 }} />
            <Text style={{ fontFamily: 'Inter-Bold' }} className='ml-4 text-black text-base'>
                {item.item.length > 20 ? item.item.slice(0, 20) + "..." : item.item}
            </Text>
            <Text style={{ fontFamily: 'Inter-Bold' }} className='ml-auto text-black text-base'>{formatMoney(item.price)}</Text>
        </View>
    )

    return (
        <View className="flex-1 bg-white">
            <StatusBar barStyle="light-content" />
            <View className='flex-row items-center my-3 pb-4'>
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="p-2 rounded-full ml-5 bg-gray-100">
                    <ChevronLeftIcon size={hp(3.5)} strokeWidth={3.5} color="#b00020" />
                </TouchableOpacity>

                <Text style={{ fontFamily: 'Inter-Bold' }}
                    className='text-black text-xl mx-4 text-center'>
                    Thanh toán
                </Text>
            </View>
            {
                itemCart != null ?
                    (
                        <View
                            className="flex-row justify-between px-5 items-center"
                        >
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>{itemCart.quantity}</Text>
                            <XMarkIcon size={hp(1.6)} strokeWidth={3.5} color="#000000" style={{ marginTop: 2, marginLeft: 8 }} />
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black ml-4 text-base'>
                                {itemCart.item.length > 20 ? itemCart.item.slice(0, 20) + "..." : itemCart.item}
                            </Text>
                            <Text style={{ fontFamily: 'Inter-Bold' }} className='ml-auto text-black text-base'>{formatMoney(itemCart.price)}</Text>
                        </View>
                    ) :
                    (
                        <FlatList
                            className='px-5'
                            data={dataCart}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                            // ItemSeparatorComponent={() => <View className='h-0.5 bg-gray-100 mx-4'></View>}

                            ListFooterComponent={<View>
                                <View className='h-0.5 bg-gray-100 my-4'></View>
                                {dataCart.length > 0 &&
                                    <View className='flex'>
                                        {/* Total */}
                                        <View className='flex-row justify-between'>
                                            <Text style={{ fontFamily: 'Inter-Medium' }} className='text-black text-base'>Total</Text>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>{formatMoney(parseFloat(totalPrice))}</Text>
                                        </View>
                                        {/* Discount */}
                                        <View className='flex-row justify-between'>
                                            <Text style={{ fontFamily: 'Inter-Medium' }} className='text-black text-base'>Discounts {discount}%</Text>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-red-500 text-lg'>- {getNewPrice(parseFloat(totalPrice), discount, true)}</Text>
                                        </View>
                                        {/* Delivery */}
                                        <View className='flex-row justify-between'>
                                            <Text style={{ fontFamily: 'Inter-Medium' }} className='text-black text-base'>Delivery charges</Text>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-green-500 text-lg'>{delivery > 0 ? getNewPrice(parseFloat(totalPrice), delivery, true) : 'FREE'}</Text>
                                        </View>

                                        {/* Total */}
                                        <View className='flex-row justify-between mt-1'>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>Total</Text>
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>
                                                {formatMoney(parseFloat(totalPrice) - getNewPrice(parseFloat(totalPrice), discount, false) + getNewPrice(parseFloat(totalPrice), delivery, false))}
                                            </Text>
                                        </View>
                                        <View className='h-0.5 bg-gray-100 my-4'></View>
                                        <View className='flex'>
                                            {/* Method title */}
                                            <View className='flex-row justify-between'>
                                                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-xl'>Payment method</Text>
                                                <TouchableOpacity>
                                                    <Text style={{ fontFamily: 'Inter-Medium' }} className='text-green-500 text-base'>Add method</Text>
                                                </TouchableOpacity>
                                            </View>

                                            {/* Method options */}
                                            <View
                                                style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
                                                className="bg-gray-100 flex-row m-1 p-2 rounded-lg shadow-lg justify-between items-center"
                                            >

                                                <Image className='w-12 h-12' source={require('../assets/images/money.png')} />
                                                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base ml-2'>Tiền mặt</Text>
                                                <View className='ml-auto'>
                                                    <RadioGroup
                                                        radioButtons={radioButtons}
                                                        onPress={setSelectedId}
                                                        selectedId={selectedId}
                                                    />
                                                </View>
                                            </View>
                                            {/* <MapView className='flex-1' region={myLocation} showsUserLocation={true} /> */}
                                            <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-xl my-4 ml-2'>Delevery Address</Text>
                                            <MapView
                                                className='w-full h-48'
                                                initialRegion={myLocation}
                                            />
                                        </View>
                                    </View>


                                }
                            </View>
                            }
                        />
                    )
            }
            <View
                className='mx-5'
            >
                <TouchableOpacity
                    style={{ backgroundColor: '#b00020' }}
                    className="flex-row w-full p-3 rounded-lg justify-center mb-10"
                    onPress={() => {
                        handlePayment()
                    }}
                >
                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-white text-lg'>Đặt hàng</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}