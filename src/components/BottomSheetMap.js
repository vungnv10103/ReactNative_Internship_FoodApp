import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { forwardRef, useCallback, useMemo } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native'




export default function BottomSheetMap({ bottomSheetRef }) {
    const navigation = useNavigation();
    const { dismiss } = useBottomSheetModal();
    const snapPoints = useMemo(() => ['50%', '75%'], []);
    const renderBackdrop = useCallback((props) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);
    return (
        <BottomSheetModal
            // handleIndicatorStyle={{ display: 'none' }}
            overDragResistanceFactor={0}
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 15 }}
            backdropComponent={renderBackdrop}
        >
            <View className='flex-1 bg-white'>
                <TouchableOpacity
                    className=" bg-sky-400 p-2.5 rounded-xl mb-3 mx-8"
                    onPress={() => {
                        dismiss()
                        navigation.navigate("Location")
                    }}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Search location</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    className=" bg-sky-400 p-2.5 rounded-xl mb-3 mx-8"
                    onPress={() => dismiss()}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Done</Text>
                </TouchableOpacity>
            </View>

        </BottomSheetModal>
    )
}