import React from "react";
import { Text, Pressable, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Page = () => {
    const router = useRouter();

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="bg-blue-600 pt-2 pb-6 px-4 rounded-b-3xl shadow-lg h-64 justify-center">
                <Text className="text-3xl font-lbold text-white mt-2 mb-1 text-center">Sramikarta</Text>
                <Text className="text-center text-white font-lregular text-lg opacity-80">Manage your projects and workers</Text>
            </View>
            <View className="px-4 -mt-4 flex-1 justify-center items-center">
                <Pressable onPress={() => router.push("/sramikarta/register")} className="bg-red-500 rounded-xl p-4 m-2 h-20 flex items-center justify-center shadow-md">
                    <Ionicons name="person-add" size={28} color="white" style={{ marginBottom: 8 }} />
                    <Text className="text-white text-lg font-lbold">Be a Contractor</Text>
                </Pressable>
                <Pressable onPress={() => router.push("/sramikarta/dashboard")} className="bg-green-500 rounded-xl p-4 m-2 h-20 flex items-center justify-center shadow-md">
                    <Ionicons name="people" size={28} color="white" style={{ marginBottom: 8 }} />
                    <Text className="text-white text-lg font-lbold">Need Labour</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    )
}

export default Page;