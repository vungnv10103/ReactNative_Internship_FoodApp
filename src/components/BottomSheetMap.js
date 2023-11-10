import { View, Text } from 'react-native'
import React, { } from 'react'
import { BottomSheetModal } from '@gorhom/bottom-sheet';

export default function BottomSheetMap({ bottomSheetRef, snapPoints }) {

    return (
        <BottomSheetModal
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 20 }}
        >
            <View>
                <Text>helo world</Text>
            </View>

        </BottomSheetModal>
    )
}