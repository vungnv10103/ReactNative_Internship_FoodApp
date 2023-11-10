import { View, Text, Button, TouchableOpacity } from 'react-native'
import React, { forwardRef, useCallback } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';


export default function BottomSheetMap({ bottomSheetRef, snapPoints }) {

    const { dismiss } = useBottomSheetModal();
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
            <View>
                <Text>Map</Text>
                <TouchableOpacity onPress={() => dismiss()}>
                    <Text>Dismiss</Text>
                </TouchableOpacity>
            </View>

        </BottomSheetModal>
    )
}