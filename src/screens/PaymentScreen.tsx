import { View, Text, TouchableOpacity, StatusBar } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { database, auth } from '../config/FirebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { ref as databaseRef, onValue, update, remove } from "firebase/database";
import { IUserInterface, ICartInterface } from '../interfaces'



export default function PaymentScreen(props: any) {
    const navigation = useNavigation();

    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [totalQuantity, setTotalQuantity] = useState<string>('');
    const [itemCart, setItemCart] = useState<ICartInterface | null>(props.route.params.itemSelected);
    const [dataCart, setDataCart] = useState<ICartInterface[]>([])

    const demo = () => {
        console.log(itemCart);
        // console.log(props);
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

    const getDataCart = (idUser: string) => {
        const dbRef = databaseRef(database, `carts/${idUser}`);

        onValue(dbRef, (snapshot) => {
            const cartData: any[] | ((prevState: never[]) => never[]) = [];
            let totalQuan = 0;

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(JSON.stringify(childData, null, 2));
                if (childData.status === 'payment') {
                    childData['pos'] = childKey
                    cartData.push(childData);
                    totalQuan += childData.quantity
                }
            });
            // console.log(JSON.stringify(cartData, null, 2));
            setTotalQuantity(totalQuan.toString())
            setDataCart(cartData);
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
    }, []);

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            {/* <Text className='text-black'>heheh</Text> */}
            {
                itemCart != null ?
                    (
                        <View><Text className='text-black'>{itemCart.id}</Text>
                        </View>
                    ) :
                    (
                        <View>
                            {dataCart.map((item, index) => <Text key={item.id} className='text-black'>{item.id}</Text>)}
                        </View>
                    )
            }
        </View>
    )
}