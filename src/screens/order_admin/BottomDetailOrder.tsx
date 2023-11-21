import { View, Text, TouchableOpacity } from 'react-native'
import React, { useCallback, useMemo, forwardRef, useState } from 'react'
import { BottomSheetBackdrop, BottomSheetModal, useBottomSheetModal } from '@gorhom/bottom-sheet';
import { XMarkIcon } from "react-native-heroicons/outline"
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { IOrderInterface } from '../../interfaces';

export type Ref = BottomSheetModal;

interface Props {
    item: IOrderInterface
}

const BottomDetailOrder = forwardRef<Ref, Props>(({ item }, ref) => {

    const [orderSelected, setOrderSelected] = useState<IOrderInterface | null>();
    setOrderSelected(item)
    const snapPoints = useMemo(() => ['75%', '95%'], []);
    const handleSheetChanges = useCallback((index: number) => {
        if (index != -1) {
            console.log('handleSheetChanges', index);
        }
        setOrderSelected(item)

    }, []);
    const { dismiss } = useBottomSheetModal();
    const renderBackdrop = useCallback((props: any) => <BottomSheetBackdrop appearsOnIndex={0} disappearsOnIndex={-1} {...props} />, []);

    return (
        <BottomSheetModal
            handleIndicatorStyle={{ display: 'none' }}
            overDragResistanceFactor={0}
            ref={ref}
            index={0}
            snapPoints={snapPoints}
            backgroundStyle={{ borderRadius: 15 }}
            backdropComponent={renderBackdrop}
            onChange={handleSheetChanges}
        >
            <View className="flex-1 bg-white">
                <TouchableOpacity
                    className="mx-2"
                    onPress={() => dismiss()}
                >
                    <XMarkIcon size={hp(4)} color="black" />
                </TouchableOpacity>

                <Text className='text-black'>{orderSelected?.item}</Text>
                <TouchableOpacity
                    className=" bg-sky-400 p-2.5 rounded-xl mb-3 mx-8"
                    onPress={() => dismiss()}>
                    <Text style={{ fontFamily: 'Inter-Bold' }} className="text-xl text-white text-center">Done</Text>
                </TouchableOpacity>
            </View>

        </BottomSheetModal>
    )
});
export default BottomDetailOrder;