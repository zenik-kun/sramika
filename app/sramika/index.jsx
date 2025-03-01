import React, { useState, useEffect } from "react";
import { Text, TextInput, Pressable, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

// Mock data for work types
const workTypes = [
    { id: '1', name: 'Construction', icon: 'construct' },
    { id: '2', name: 'Painting', icon: 'color-palette' },
    { id: '3', name: 'Plumbing', icon: 'water' },
    { id: '4', name: 'Electrical', icon: 'flash' },
    { id: '5', name: 'Cleaning', icon: 'sparkles' },
    { id: '6', name: 'Gardening', icon: 'leaf' },
    { id: '7', name: 'Carpentry', icon: 'hammer' },
    { id: '8', name: 'Moving', icon: 'cube' }
];

const Page = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [personsNeeded, setPersonsNeeded] = useState('');
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestions, setSuggestions] = useState([]);
    const [selectedWorkTypes, setSelectedWorkTypes] = useState([]);

    useEffect(() => {
        if (searchQuery.length > 0) {
            const filtered = workTypes.filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setShowSuggestions(false);
        }
    }, [searchQuery]);

    const handleSelectWorkType = (workType) => {
        if (!selectedWorkTypes.some(item => item.id === workType.id)) {
            setSelectedWorkTypes([...selectedWorkTypes, workType]);
        }
        setSearchQuery('');
        setShowSuggestions(false);
    };

    const removeWorkType = (id) => {
        setSelectedWorkTypes(selectedWorkTypes.filter(item => item.id !== id));
    };

    const handleSearch = () => {
        // Extract just the skill names for passing to the workers page
        const skillNames = selectedWorkTypes.map(type => type.name);
        
        // Parse persons needed to a number, default to 1 if not specified
        const workers = personsNeeded ? parseInt(personsNeeded, 10) : 1;
        
        // Log the search parameters
        console.log('Search for workers with skills:', skillNames, 'Persons needed:', workers);
        
        // Pass the search parameters to the workers page using router.push
        router.push({
            pathname: "/sramika/workers",
            params: {
                skills: JSON.stringify(skillNames),
                personsNeeded: workers
            }
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-white">
            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                {/* Header */}
                <View className="bg-blue-600 pt-2 pb-6 px-4 rounded-b-3xl shadow-lg h-64 justify-center">
                    <Text className="text-3xl font-lbold text-white mt-2 mb-1 text-center">Sramika</Text>
                    <Text className="text-center text-white font-lregular text-lg opacity-80">Find skilled workers for your projects</Text>
                </View>

                {/* Main Content */}
                <View className="px-4 -mt-4 flex-1 justify-center">
                    {/* Search Bar */}
                    <View className="bg-white rounded-xl p-4 shadow-md">
                        <View className="relative mb-3">
                            <View className="flex-row items-center border border-gray-200 bg-gray-50 rounded-full px-3 py-2">
                                <Ionicons name="search" size={20} color="#666" style={{marginRight: 8}} />
                                <TextInput
                                    className="flex-1 text-base pl-1 py-1 font-lregular"
                                    placeholder="Search skills or work type..."
                                    value={searchQuery}
                                    onChangeText={setSearchQuery}
                                    onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
                                />
                            </View>
                        </View>

                        {/* Selected Work Types */}
                        {selectedWorkTypes.length > 0 && (
                            <View className="flex-row flex-wrap mb-3">
                                {selectedWorkTypes.map((item) => (
                                    <TouchableOpacity 
                                        key={item.id} 
                                        onPress={() => removeWorkType(item.id)}
                                        className="flex-row items-center bg-blue-100 rounded-full px-3 py-1 mr-2 mb-2"
                                    >
                                        <Ionicons name={item.icon} size={16} color="#3b82f6" />
                                        <Text className="text-blue-600 ml-1 mr-1">{item.name}</Text>
                                        <Ionicons name="close-circle" size={16} color="#3b82f6" />
                                    </TouchableOpacity>
                                ))}
                            </View>
                        )}

                        <View className="flex-row items-center border border-gray-200 bg-gray-50 rounded-full px-3 py-2 mb-4">
                            <Ionicons name="people" size={20} color="#666" style={{marginRight: 8}} />
                            <TextInput
                                className="flex-1 text-base pl-1 py-1 font-lregular"
                                placeholder="Number of workers needed"
                                value={personsNeeded}
                                onChangeText={setPersonsNeeded}
                                keyboardType="numeric"
                            />
                        </View>

                        <Pressable
                            className="bg-blue-600 rounded-full py-3 flex items-center justify-center shadow-sm"
                            onPress={handleSearch}
                            disabled={selectedWorkTypes.length === 0}
                        >
                            <Text className="text-white text-lg font-lsemibold">Find Workers</Text>
                        </Pressable>
                    </View>

                    {/* Suggestions */}
                    {showSuggestions && (
                        <View className="bg-white mt-2 rounded-xl shadow-md z-10">
                            <FlatList
                                data={suggestions}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <TouchableOpacity 
                                        className="p-3 border-b border-gray-100 flex-row items-center"
                                        onPress={() => handleSelectWorkType(item)}
                                    >
                                        <Ionicons name={item.icon} size={20} color="#3b82f6" />
                                        <Text className="text-gray-700 ml-2">{item.name}</Text>
                                    </TouchableOpacity>
                                )}
                            />
                        </View>
                    )}
                </View>

                {/* Quick Actions */}
                <View className="mt-6 px-4">
                    <Text className="text-lg font-lbold text-gray-800 mb-3">Quick Actions</Text>
                    <View className="flex-row justify-between">
                        <TouchableOpacity onPress={() => router.push('/sramikarta')} className="bg-blue-500 rounded-2xl p-4 shadow items-center flex-1">
                            <Ionicons name="person-add" size={28} color="white" style={{marginBottom: 8}} />
                            <Text className="text-white font-lsemibold">Post a Job</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Popular Categories */}
                <View className="mt-6 mb-6 px-4">
                    <Text className="text-lg font-lbold text-gray-800 mb-3">Popular Categories</Text>
                    <View className="flex-row flex-wrap justify-between">
                        {workTypes.slice(0, 4).map((item) => (
                            <TouchableOpacity 
                                key={item.id}
                                className="bg-white rounded-xl shadow mb-3 p-3 w-24 items-center"
                                onPress={() => handleSelectWorkType(item)}
                                style={{width: '48%', marginBottom: 12}}
                            >
                                <View className="bg-blue-100 p-3 rounded-full mb-2">
                                    <Ionicons name={item.icon} size={24} color="#3b82f6" />
                                </View>
                                <Text className="font-lregular text-center text-gray-700">{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>

                {/* Help Section */}
                <View className="bg-blue-50 rounded-xl p-4 mb-6 px-4">
                    <View className="flex-row items-center">
                        <Ionicons name="help-circle" size={24} color="#3b82f6" />
                        <Text className="text-blue-800 font-lbold ml-2">Need Assistance?</Text>
                    </View>
                    <Text className="text-blue-700 mt-1 font-lregular">Our support team is available 24/7 to help you find the right workers.</Text>
                    <TouchableOpacity className="bg-white rounded-full py-2 px-4 mt-2 self-start">
                        <Text className="text-blue-600 font-lsemibold">Contact Support</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Page;