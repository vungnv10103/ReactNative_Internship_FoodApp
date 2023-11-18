import { View, Text, Image, FlatList, TouchableOpacity, Alert, ToastAndroid } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { themeColors } from '../theme';
import { useNavigation } from '@react-navigation/native';
import { database, auth, storage } from '../config/FirebaseConfig';
import { ref as databaseRef, onValue, query, orderByChild, get, update, runTransaction, push, remove } from "firebase/database";


export default function ProductsRecommend({ productRecommend, goScreen }) {
    const navigation = useNavigation()
    return (
        <View>
            {/* <Text style={{ fontSize: hp(3), fontFamily: 'Inter-Bold' }} className=" text-black"></Text> */}
            <Item item={productRecommend} navigation={navigation} goScreen={goScreen} />
        </View>
    )
}

function formatMoney(price) {
    const valuePrice = parseFloat(price)
    if (valuePrice >= 1000) {
        return valuePrice.toLocaleString('vi-VN') + " đ";
    } else {
        return valuePrice.toString() + " đ";
    }
}

const getNewPrice = (oldPrice, discount) => {
    const valueOldPrice = parseFloat(oldPrice)
    const valueDiscount = parseFloat(discount)
    const newPrice = valueOldPrice - (valueOldPrice * valueDiscount / 100)
    return formatMoney(newPrice)
}

const showToast = (message) => {
    ToastAndroid.show("" + message, ToastAndroid.SHORT);
};


const handleDeleteProductSubmit = (pos) => {
    const dataRef = databaseRef(database, `products/${pos}`);
    remove(dataRef)
        .then(() => {
            showToast('Xoá thành công')
            console.log('Data deleted successfully!');
        })
        .catch((error) => {
            showToast(`Xoá thất bại: ${error}`)
            console.error('Error deleting data:', error);
        });
}

const onDeleteProduct = (product) => {
    return Alert.alert(
        "Bạn có chắc chắn muốn xoá?",
        "Sản phẩm sẽ mất nếu bạn xoá.",
        [
            {
                text: "Xoá",
                onPress: () => {
                    handleDeleteProductSubmit(product.pos)
                },
            },
            {
                text: "Huỷ",
            },
        ]
    );
}

const Item = ({ item, navigation, goScreen }) => (
    <TouchableOpacity
        onPress={() => navigation.navigate(goScreen, { ...item })}
    >
        <View
            style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
            className="bg-white flex-row m-1 py-2 px-3  rounded-xl shadow-lg justify-between"
        >

            <View className="flex-row">
                {goScreen === "EditProduct" &&
                    <View className='justify-between'>
                        <TouchableOpacity
                            className='p-1'
                            onPress={() => navigation.navigate(goScreen, { ...item })}
                        >
                            <Image className="h-8 w-8" source={require('./../assets/images/edit.png')} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            className='p-1'
                            onPress={() => {
                                onDeleteProduct(item)
                            }}
                        >
                            <Image className="h-8 w-8" source={require('./../assets/images/delete.png')} />
                        </TouchableOpacity>
                    </View>
                }
                <View className='ml-5 justify-between'>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-base text-black pt-1.5">
                        {item.name.length > 18 ? item.name.slice(0, 18) + "..." : item.name}
                    </Text>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className="text-sm text-black pt-1.5">
                        {item.description.length > 18 ? item.description.slice(0, 18) + "..." : item.description}
                    </Text>
                    {/* Price */}
                    <View>
                        {item.sale > 0 ? (
                            <View className='flex-row items-center'>
                                <Image className="h-4 w-4" source={require('./../assets/images/sale_tag.png')} />
                                <Text style={{ fontFamily: "Inter-Bold" }} className='line-through text-red-600 text-sm mx-1'>
                                    {formatMoney(item.price)}
                                </Text>
                            </View>
                        ) : (<View></View>)}
                        <Text style={{ fontFamily: "Inter-Bold" }} className='text-black text-base'>
                            {getNewPrice(item.price, item.sale)}
                        </Text>
                    </View>
                </View>

            </View>
            <Image className="h-24 w-24 rounded-lg" source={{ uri: item.img }} />

        </View>
    </TouchableOpacity>
);