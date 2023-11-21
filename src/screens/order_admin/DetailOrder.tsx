import { View, Text, StatusBar, Image, TouchableOpacity, Dimensions, Alert, FlatList, ScrollView, ToastAndroid } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { database, auth } from '../../config/FirebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { ref as databaseRef, onValue, update, remove } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { IUserInterface, IOrderInterface } from '../../interfaces'
import { themeColors } from '../../theme';
import Loading from '../../components/Loading';
import { XMarkIcon } from 'react-native-heroicons/outline';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import DashedLine from 'react-native-dashed-line';

const ID_ADMIN = 'SFdidBR95rWJxsTMLoHLXx8EBbk2'



export default function DetailOrder(props: any) {
    // console.log(props.route.params);

    const navigation = useNavigation()

    const [isLoading, setLoading] = useState(false)
    const [beforeScreen, setBeforeScreen] = useState(props.route.params?.beforeScreen)
    const [orderSelected, setOrderSelected] = useState<IOrderInterface>(props.route.params)



    const showToast = (message: string) => {
        ToastAndroid.show(message, ToastAndroid.SHORT);
    };


    const formatMoney = (price: number) => {
        if (price >= 1000) {
            return price.toLocaleString('vi-VN') + " đ";
        } else {
            return price.toString() + " đ";
        }
    }

    const handleConfirmOrder = (status: string) => {
        setLoading(true)
        const updates: { [key: string]: string } = {};
        updates[`orders/${ID_ADMIN}/${orderSelected.pos}/status`] = status
        try {
            update(databaseRef(database), updates);
            if (status === 'success') {
                showToast('Xác nhận đơn hàng thành công')
            } else if (status === 'cancel') {
                showToast('Đã huỷ đơn hàng')
            }
        } catch (error) {
            console.error('Cập nhật số lượng thất bại:', error);
        } finally {
            setLoading(false)
            navigation.goBack()
        }
    }


    return (
        <ScrollView className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />

            {/* Navigation */}
            <View className='flex-row justify-between items-center m-3'>
                <XMarkIcon size={hp(3)} strokeWidth={1.5} color={'black'} onPress={() => navigation.goBack()} />
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-xl'>Chi tiết đơn hàng</Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-red-600 text-lg'>10:00</Text>
            </View>

            {/* Infor Order */}
            <View className='bg-white rounded-xl m-3 p-2 space-y-1.5'>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'># {orderSelected.id}</Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>Nhận đơn lúc: {orderSelected.datetime}</Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>Sẽ nhận lúc: --/--/---- --:--:--.---</Text>
            </View>

            {/* Customer */}
            <View className='bg-white rounded-xl mx-3 p-2 space-y-1.5'>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>Khách hàng</Text>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'>{orderSelected.idUser}</Text>
            </View>


            {/* Menu */}
            <View className='bg-white rounded-xl mt-3 mx-3 p-2 space-y-1.5'>
                <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>Menu</Text>
                <View className='flex-row justify-between items-center'>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className='text-black text-base'>{orderSelected.quantity}</Text>
                    <XMarkIcon size={hp(1.6)} strokeWidth={3.5} color="#000000" style={{ marginTop: 2, marginLeft: 8 }} />
                    <Text style={{ fontFamily: 'Inter-Medium' }} className='ml-4 text-black text-base'>{orderSelected.item.length >= 20 ? orderSelected.item.slice(0, 20) + "..." : orderSelected.item}</Text>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className='ml-auto text-black text-base'>{formatMoney(orderSelected.price * orderSelected.quantity)}</Text>
                </View>
                <DashedLine dashLength={5} style={{ paddingVertical: 20 }} />

                <View className='flex-row justify-around'>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>Tổng cộng</Text>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-lg'>{formatMoney(orderSelected.price * orderSelected.quantity)}</Text>
                </View>
            </View>

            {
                beforeScreen === "WaitingOrderScreen" ? (<View>
                    {!isLoading ? (

                        <View>
                            <TouchableOpacity
                                className=" bg-sky-400 p-3 rounded-lg mx-3 mt-24"
                                onPress={() => handleConfirmOrder('success')}>
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Xác nhận đơn hàng</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                className=" bg-gray-400 p-3 rounded-lg mx-3 mt-5"
                                onPress={() => handleConfirmOrder('cancel')}>
                                <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Từ chối đơn hàng</Text>
                            </TouchableOpacity>
                        </View>) : (<Loading size='large' />)}
                </View>) : (<View></View>)
            }




        </ScrollView>
    )
}