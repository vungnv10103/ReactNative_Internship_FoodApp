import { View, Text } from 'react-native'
import React, { useState, useEffect } from 'react'
import { useNavigation } from '@react-navigation/native'
import { storage, database, auth } from '../config/FirebaseConfig';
import { getDatabase, runTransaction, push, ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";




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


    const fetchData = async () => {
        // setLoading(false)
        const productByIdCartData = await getAllProByIdCate(categorySelected.id);
        setProductByIdCart(productByIdCartData)
    };

    useEffect(() => {
        fetchData()
    }, [])

    return (
        <View>
            {productByIdCart.map((item, index) => <Text key={item.id}>{item.name}</Text>)}
        </View>
    )
}