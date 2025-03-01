import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

// Mock data for labours
const mockLabours = [
    {
        id: '1',
        name: 'Rajesh Kumar',
        age: 32,
        rating: 4.8,
        experience: 7,
        skills: ['Construction', 'Painting'],
        hourlyRate: 250,
        availability: 'Immediate',
        completedJobs: 43,
        location: 'Indira Nagar, Bangalore',
        languages: ['Hindi', 'Kannada', 'English'],
        photo: 'https://randomuser.me/api/portraits/men/75.jpg',
        verified: true,
        contactNumber: '+91 9876543210',
    },
    {
        id: '2',
        name: 'Suresh Patel',
        age: 28,
        rating: 4.5,
        experience: 5,
        skills: ['Plumbing', 'Electrical'],
        hourlyRate: 300,
        availability: 'Within 2 days',
        completedJobs: 27,
        location: 'Koramangala, Bangalore',
        languages: ['Gujarati', 'Hindi', 'English'],
        photo: 'https://randomuser.me/api/portraits/men/57.jpg',
        verified: true,
        contactNumber: '+91 9876543211',
    },
    // Add more mock data as needed
];

const ContractorDashboardPage = ({ navigation }) => {
    const [labours, setLabours] = useState(mockLabours);
    const [expandedProfile, setExpandedProfile] = useState(null);
    const router = useRouter();

    const toggleExpandProfile = (id) => {
        if (expandedProfile === id) {
            setExpandedProfile(null);
        } else {
            setExpandedProfile(id);
        }
    };

    const handleAddLabour = () => {
        router.push("/sramikarta/add");
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            {/* Header */}
            <View className="bg-blue-600 pt-2 pb-4 px-4">
                <View className="flex-row items-center">
                    <TouchableOpacity 
                        className="mr-2" 
                        onPress={() => router.back()}
                    >
                        <Ionicons name="arrow-back" size={24} color="white" />
                    </TouchableOpacity>
                    <Text className="text-2xl font-lbold text-white">Contractor Dashboard</Text>
                </View>
            </View>

            {/* Add Labour Button */}
            <View className="px-4 py-4">
                <TouchableOpacity 
                    className="bg-green-500 rounded-full py-3 px-6 flex-row items-center justify-center shadow-md"
                    onPress={handleAddLabour}
                >
                    <Ionicons name="person-add" size={24} color="white" style={{ marginRight: 8 }} />
                    <Text className="text-white text-lg font-lbold">Add Labour</Text>
                </TouchableOpacity>
            </View>

            {/* Labour List */}
            <FlatList
                data={labours}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ padding: 16 }}
                renderItem={({ item }) => (
                    <TouchableOpacity 
                        className="bg-white rounded-xl shadow-sm mb-4 overflow-hidden"
                        onPress={() => toggleExpandProfile(item.id)}
                    >
                        {/* Basic Info Card */}
                        <View className="p-4">
                            <View className="flex-row">
                                {/* Profile Photo */}
                                <View className="mr-3">
                                    <Image 
                                        source={{ uri: item.photo }} 
                                        className="w-16 h-16 rounded-full"
                                        style={{ width: 64, height: 64, borderRadius: 32 }}
                                    />
                                    {item.verified && (
                                        <View className="absolute bottom-0 right-0 bg-green-500 rounded-full p-1">
                                            <Ionicons name="checkmark" size={12} color="white" />
                                        </View>
                                    )}
                                </View>
                                
                                {/* Profile Info */}
                                <View className="flex-1">
                                    <View className="flex-row justify-between items-center">
                                        <Text className="text-lg font-lbold text-gray-800">{item.name}</Text>
                                        <View className="flex-row items-center bg-yellow-100 px-2 py-1 rounded-md">
                                            <Ionicons name="star" size={14} color="#F59E0B" />
                                            <Text className="text-yellow-700 ml-1 font-lbold">{item.rating}</Text>
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row flex-wrap mt-1">
                                        {item.skills.map((skill, index) => (
                                            <View key={skill} className="bg-blue-100 rounded-md px-2 py-1 mr-2 mb-1">
                                                <Text className="text-blue-700 text-xs font-lregular">{skill}</Text>
                                            </View>
                                        ))}
                                    </View>
                                    
                                    <View className="flex-row items-center mt-1">
                                        <Ionicons name="location" size={14} color="#666" />
                                        <Text className="text-gray-600 text-xs ml-1 font-lregular">{item.location}</Text>
                                    </View>
                                </View>
                            </View>
                            
                            <View className="flex-row justify-between mt-3 pt-3 border-t border-gray-100">
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-lregular">Experience</Text>
                                    <Text className="text-gray-800 font-lbold">{item.experience} years</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-lregular">Hourly Rate</Text>
                                    <Text className="text-gray-800 font-lbold">₹{item.hourlyRate}</Text>
                                </View>
                                <View className="items-center">
                                    <Text className="text-gray-500 text-xs font-lregular">Availability</Text>
                                    <Text className="text-gray-800 font-lbold">{item.availability}</Text>
                                </View>
                            </View>
                        </View>
                        
                        {/* Expanded Details */}
                        {expandedProfile === item.id && (
                            <View className="bg-gray-50 p-4 border-t border-gray-200">
                                <View className="flex-row justify-between mb-3">
                                    <View className="flex-row items-center">
                                        <Ionicons name="briefcase" size={16} color="#666" />
                                        <Text className="text-gray-700 ml-2 font-lregular">
                                            Completed {item.completedJobs} jobs
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="call" size={16} color="#666" />
                                        <Text className="text-gray-700 ml-2 font-lregular">
                                            {item.contactNumber}
                                        </Text>
                                    </View>
                                </View>
                                
                                <View className="mb-3">
                                    <Text className="text-gray-700 mb-1 font-lregular">Languages spoken:</Text>
                                    <View className="flex-row">
                                        {item.languages.map(lang => (
                                            <Text key={lang} className="mr-2 text-gray-800 font-lregular">
                                                • {lang}
                                            </Text>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        )}
                        
                        {/* Expand/Collapse Indicator */}
                        <View className={`items-center py-1 ${expandedProfile === item.id ? 'bg-gray-50' : 'bg-white'}`}>
                            <Ionicons 
                                name={expandedProfile === item.id ? "chevron-up" : "chevron-down"} 
                                size={16} 
                                color="#666" 
                            />
                        </View>
                    </TouchableOpacity>
                )}
            />
        </SafeAreaView>
    );
};

export default ContractorDashboardPage;