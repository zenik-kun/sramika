import React from "react";
import { Text, Pressable } from "react-native";
import { SafeAreaView } from 
"react-native-safe-area-context";
import { router } from 'expo-router';


const Page = () => {
    return (
        <SafeAreaView className="bg-white h-full flex items-center justify-center">
            <Pressable onPress = {() => router.push("/sramikarta")} className="bg-blue-500 rounded-full p-4 m-2 w-40 h-40 flex items-center justify-center">
                <Text className="text-white text-lg font-lbold">Sramikarta</Text>
            </Pressable>
            <Pressable onPress = {() => router.push("/sramika")} className="bg-green-500 rounded-full p-4 m-2 w-40 h-40 flex items-center justify-center">
                <Text className="text-white text-lg font-lbold">Sramika</Text>
            </Pressable>
        </SafeAreaView>
    )
}

export default Page;