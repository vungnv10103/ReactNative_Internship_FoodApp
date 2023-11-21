import { View, Text, StatusBar, Image, TouchableOpacity, Dimensions, Alert, FlatList } from 'react-native'
import React, { useState, useEffect, useRef } from 'react'
import { database, auth } from '../../config/FirebaseConfig'
import { onAuthStateChanged } from 'firebase/auth'
import { ref as databaseRef, onValue, update, remove } from "firebase/database";
import { useNavigation } from '@react-navigation/native'
import { IUserInterface, IOrderInterface } from '../../interfaces'
import { themeColors } from '../../theme';
import Loading from '../../components/Loading';



const ID_ADMIN = 'SFdidBR95rWJxsTMLoHLXx8EBbk2'


export default function SuccessOrderScreen(props: any) {
    const navigation = useNavigation();

    const [currentUser, setUser] = useState<IUserInterface | null>();
    const [orderSelected, setOrderSelected] = useState<IOrderInterface | null>();
    const [orderWaiting, setOrderWaiting] = useState<IOrderInterface[]>([]);

    const getUserData = async () => {
        return new Promise<any>((resolve) => {
            onAuthStateChanged(auth, (user) => {
                if (user) {
                    resolve(user)
                }
            })
        })
    }

    const getOrderWaiting = (idUser: string) => {
        const dbRef = databaseRef(database, `orders/${ID_ADMIN}/`);

        onValue(dbRef, (snapshot) => {
            const mOrderData: any[] | ((prevState: never[]) => never[]) = [];

            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                // console.log(JSON.stringify(childData, null, 2));
                childData['pos'] = childKey
                childData['beforeScreen'] = "SuccessOrderScreen"
                if (childData.status === 'success') {
                    if (idUser === ID_ADMIN) {
                        mOrderData.push(childData);
                    }
                    else if (childData.idUser === idUser) {
                        mOrderData.push(childData)
                    }
                }
            });
            // console.log(JSON.stringify(mOrderData, null, 2));
            setOrderWaiting(mOrderData);
        }, {
            onlyOnce: false
        });
    }

    const handleOrderSelected = (item: IOrderInterface) => {
        if (currentUser?.uid === ID_ADMIN) {
            setOrderSelected(item)
            props.navigation.navigate('DetailOrder', { ...item })
        }
    }

    const fetchData = async () => {
        const dataUser = await getUserData()
        getOrderWaiting(dataUser.uid + "")
        setUser(dataUser)
    };

    useEffect(() => {
        fetchData()
    }, []);



    const renderItem = ({ item }: { item: IOrderInterface }) => (
        <TouchableOpacity
            onPress={() => handleOrderSelected(item)}>
            <View
                style={{ shadowColor: themeColors.bgColor(0.2), shadowRadius: 7 }}
                className="bg-white flex-row m-1 p-2 rounded-lg shadow-lg justify-between items-center"

            >
                <View className='space-y-1.5'>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className='text-black text-base'># {item.datetime}</Text>
                    <Text style={{ fontFamily: 'Inter-Medium' }} className='text-black text-base'>
                        {item.item.length > 20 ? item.item.slice(0, 20) + "..." : item.item}
                    </Text>
                </View>


            </View>
        </TouchableOpacity>

    );

    return (
        <View className="flex-1 bg-gray-200">
            <StatusBar barStyle="light-content" />
            {orderWaiting.length > 0 ?
                (
                    <View className='flex-1'>
                        <FlatList
                            data={orderWaiting}
                            keyExtractor={(item) => item.id}
                            renderItem={renderItem}
                        />
                    </View>
                ) :
                (<Loading size='large' />)
            }
        </View>
    )
}