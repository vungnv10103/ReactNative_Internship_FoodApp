import { View, Text, Image, TouchableOpacity } from 'react-native'
import React, { useRef, useMemo, useCallback, useState, useEffect } from 'react'
import Icon, { Icons } from './Icons';
import Loading from './Loading';
import BottomSheetMap from './BottomSheetMap';

export default function CustomHeader(props) {
    const isShow = props.show

    const [showLoading, setShowLoading] = useState(isShow);
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowLoading(false);
        }, 5000);

        return () => clearTimeout(timer);
    }, []);

    const bottomSheetRef = useRef(null);
    const snapPoints = useMemo(() => ['25%', '50%', '75%', '95%'], []);
    const handleSheetChanges = useCallback((index) => {
        console.log('handleSheetChanges', index);
    }, []);


    const openBottomSheet = () => {
        bottomSheetRef.current?.present()
    }

    return (
        <View>
            {
                !isShow ? (<View className="h-16 bg-gray-100 items-center flex-row justify-between">
                    <View className="flex-row items-center">
                        <TouchableOpacity onPress={() => { }}>
                            <Image className="h-16 w-16" source={require('./../assets/images/dev/bikeGuy.png')} />
                        </TouchableOpacity>

                        <View>
                            <Text style={{ fontFamily: "Inter-Medium", color: 'black' }}>Delivery • Now</Text>
                            <TouchableOpacity className="mt-1.5 flex-row"
                                onPress={openBottomSheet}>
                                <Text style={{ fontFamily: "Inter-Bold", color: 'black' }}>Selected location</Text>
                                <Icon name={'keyboard-arrow-down'} type={Icons.MaterialIcons} color='#00af80' />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity className="mx-3"
                        onPress={() => {

                        }}>
                        <Image className="h-6 w-6" source={require('./../assets/images/dev/menus.png')} />
                    </TouchableOpacity>

                    <BottomSheetMap bottomSheetRef={bottomSheetRef} snapPoints={snapPoints} />
                </View>) : (<View>
                    {
                        showLoading ? (<Loading className="mt-10" />) : (<View></View>)
                    }
                </View>)
            }
        </View>
    )
}