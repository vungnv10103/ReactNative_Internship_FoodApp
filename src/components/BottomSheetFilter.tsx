import { View, Text, TouchableOpacity, FlatList, ListRenderItem } from 'react-native'
import React, { useCallback, useRef, useMemo, forwardRef, useState, useEffect } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { XMarkIcon } from "react-native-heroicons/outline"
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { database, auth } from '../config/FirebaseConfig';
import { ref as databaseRef, onValue, query, orderByChild, get } from "firebase/database";





export type Ref = BottomSheetModal;

interface Category {
    id: string;
    name: string;
    img: string;
    count: number;
    checked?: boolean;
}

interface Product {
    id: string;
    name: string;
    img: string;
    count: number;
    checked?: boolean;
}

interface filterSum {
    type: string;
    count: number;
    checked?: boolean;
}
const BottomSheetFilter = forwardRef<Ref>((props, ref) => {

    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);

    const getDataCategory = () => {
        const dbRef = databaseRef(database, 'categories');

        onValue(dbRef, (snapshot) => {
            const dataFromFirebase: any[] | ((prevState: never[]) => never[]) = [];
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
            const dataProductFromFirebase: any[] | ((prevState: never[]) => never[]) = [];
            const dataProductSale: any[] | ((prevState: never[]) => never[]) = [];
            snapshot.forEach((childSnapshot) => {
                const childKey = childSnapshot.key;
                const childData = childSnapshot.val();
                dataProductFromFirebase.push(childData);
            });
            setProducts(dataProductFromFirebase);
        }, {
            onlyOnce: false
        });
    }

    useEffect(() => {
        getDataCategory()
        getDataProduct()
    }, [])




    const snapPoints = useMemo(() => ['75%', '95%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);
    const { dismiss } = useBottomSheetModal();
    const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    const renderItem: ListRenderItem<Product> = ({ item, index }) => (
        <View>
            <Text>{item.name}</Text>
        </View>

    )

    return (
        <BottomSheetModal
            handleIndicatorStyle={{ display: 'none' }}
            overDragResistanceFactor={0}
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 15 }}
            backdropComponent={renderBackdrop}
        >
            <View className="flex-1 bg-white">
                <TouchableOpacity
                    className="mx-2"
                    onPress={() => dismiss()}
                >
                    <XMarkIcon size={hp(4)} color="black" />
                </TouchableOpacity>


                <FlatList data={products} renderItem={renderItem} />

                <TouchableOpacity
                    className=" bg-sky-400 p-2.5 rounded-xl mb-3 mx-8"
                    onPress={() => dismiss()}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Done</Text>
                </TouchableOpacity>
            </View>

        </BottomSheetModal>
    )
});

export default BottomSheetFilter;