import React, { useState, useEffect } from "react";
import { Text, View, FlatList, TouchableOpacity, Image, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import LabourDB from "../../libs/database";

const SearchResultsPage = () => {
    // Get search parameters from URL params using useLocalSearchParams
    const params = useLocalSearchParams();
    
    // Parse the skills array from JSON string, default to empty array if not provided
    const skills = params.skills ? JSON.parse(params.skills) : [];
    
    // Parse persons needed, default to 1 if not provided
    const personsNeeded = params.personsNeeded ? parseInt(params.personsNeeded, 10) : 1;
    
    // Create the search parameters object
    const searchParams = {
        skills: skills,
        personsNeeded: personsNeeded
    };

    const [selectedFilters, setSelectedFilters] = useState(['Highest Rated']);
    const [expandedProfile, setExpandedProfile] = useState(null);
    const [workers, setWorkers] = useState([]);
    const [filteredWorkers, setFilteredWorkers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [refreshing, setRefreshing] = useState(false);

    // Fetch workers from database based on skills
    const fetchWorkers = async () => {
        try {
            console.log("Fetching workers with skills:", searchParams.skills);
            let profiles;
            
            if (searchParams.skills && searchParams.skills.length > 0) {
                // Use skill-based search if skills are specified
                profiles = await LabourDB.getLabourProfilesBySkills(searchParams.skills);
            } else {
                // Otherwise get all profiles
                profiles = await LabourDB.getAllLabourProfiles();
            }
            
            // Transform the data to match the expected format in the UI
            const transformedProfiles = profiles.map(profile => ({
                id: profile.id.toString(),
                name: profile.full_name,
                photo: profile.photo || 'https://via.placeholder.com/64',
                verified: profile.verified,
                rating: calculateRating(profile), // You'll need to implement this
                skills: profile.skills,
                location: profile.location,
                experience: profile.experience,
                hourlyRate: profile.hourly_rate,
                availability: profile.availability,
                completedJobs: profile.completed_jobs,
                contactNumber: profile.phone,
                languages: profile.languages.split(',').map(lang => lang.trim())
            }));
            
            setWorkers(transformedProfiles);
        } catch (err) {
            console.error("Error fetching labour profiles:", err);
            setError("Failed to load workers. Please try again.");
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchWorkers();
    }, [searchParams.skills]);

    // Apply filters whenever workers or selectedFilters change
    useEffect(() => {
        const filtered = applyFilters(workers, selectedFilters);
        setFilteredWorkers(filtered);
    }, [workers, selectedFilters]);

    // Calculate a rating score (if not stored in DB)
    const calculateRating = (profile) => {
        // This is a placeholder - in a real app, you would have a proper rating system
        // For now, we'll generate a rating based on experience and completed jobs
        const baseRating = 3.0;
        const experienceBonus = Math.min(profile.experience * 0.1, 1.0);
        const jobsBonus = Math.min(profile.completed_jobs * 0.05, 1.0);
        const rating = baseRating + experienceBonus + jobsBonus;
        return rating.toFixed(1);
    };

    // Apply sorting based on selected filters
    const applyFilters = (profiles, filters) => {
        let result = [...profiles];
        
        if (filters.includes('Highest Rated')) {
            result.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating));
        }
        
        if (filters.includes('Most Experienced')) {
            result.sort((a, b) => b.experience - a.experience);
        }
        
        if (filters.includes('Lowest Price')) {
            result.sort((a, b) => a.hourlyRate - b.hourlyRate);
        }
        
        // For "Nearest" and "Immediate Availability", you would need more data
        // This is a simplified example
        
        return result;
    };

    const toggleFilter = (filter) => {
        if (selectedFilters.includes(filter)) {
            setSelectedFilters(selectedFilters.filter(f => f !== filter));
        } else {
            setSelectedFilters([...selectedFilters, filter]);
        }
    };

    const toggleExpandProfile = (id) => {
        if (expandedProfile === id) {
            setExpandedProfile(null);
        } else {
            setExpandedProfile(id);
        }
    };

    const handleHire = (worker) => {
        console.log('Hiring:', worker.name);
        // Navigate to hiring page or open contact modal
    };

    const handleSaveProfile = (worker) => {
        console.log('Saved profile:', worker.name);
        // Save profile logic
    };

    const handleTryAgain = () => {
        setError(null);
        setLoading(true);
        // Re-fetch workers instead of modifying selectedFilters
        fetchWorkers();
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchWorkers();
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
                    <Text className="text-2xl font-lbold text-white">Workers Available</Text>
                </View>
                <View className="flex-row items-center mt-2">
                    <Ionicons name="search" size={16} color="white" />
                    <Text className="text-white ml-1 font-lregular">
                        {searchParams.skills.join(', ')} • {searchParams.personsNeeded} worker{searchParams.personsNeeded > 1 ? 's' : ''}
                    </Text>
                </View>
            </View>

            {/* Filter Section */}
            <View className="bg-white px-4 py-2 border-b border-gray-200">
                <Text className="text-gray-700 mb-2 font-lregular">Filter by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {['Highest Rated', 'Nearest', 'Lowest Price', 'Most Experienced', 'Immediate Availability'].map((filter) => (
                        <TouchableOpacity 
                            key={filter}
                            className={`px-3 py-1 mr-2 rounded-full ${selectedFilters.includes(filter) ? 'bg-blue-600' : 'bg-gray-200'}`}
                            onPress={() => toggleFilter(filter)}
                        >
                            <Text 
                                className={`${selectedFilters.includes(filter) ? 'text-white' : 'text-gray-700'} font-lregular`}
                            >
                                {filter}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Loading and Error States */}
            {loading && (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#3B82F6" />
                    <Text className="mt-2 text-gray-600">Loading workers...</Text>
                </View>
            )}
            
            {error && !loading && (
                <View className="flex-1 justify-center items-center px-4">
                    <Ionicons name="alert-circle-outline" size={48} color="#EF4444" />
                    <Text className="mt-2 text-gray-800 text-center font-lbold">{error}</Text>
                    <TouchableOpacity 
                        className="mt-4 bg-blue-600 px-4 py-2 rounded-full"
                        onPress={handleTryAgain}
                    >
                        <Text className="text-white font-lbold">Try Again</Text>
                    </TouchableOpacity>
                </View>
            )}

            {/* Results */}
            {!loading && !error && (
                <FlatList
                    data={filteredWorkers}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={{ padding: 16 }}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                    ListEmptyComponent={() => (
                        <View className="flex-1 justify-center items-center py-8">
                            <Ionicons name="search-outline" size={48} color="#9CA3AF" />
                            <Text className="mt-2 text-gray-600 text-center font-lregular">
                                No workers found matching your criteria.
                            </Text>
                        </View>
                    )}
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
                                                <View key={index} className="bg-blue-100 rounded-md px-2 py-1 mr-2 mb-1">
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
                                        <View className="flex-row flex-wrap">
                                            {item.languages.map((lang, index) => (
                                                <Text key={index} className="mr-2 text-gray-800 font-lregular">
                                                    • {lang}
                                                </Text>
                                            ))}
                                        </View>
                                    </View>
                                    
                                    <View className="flex-row justify-between mt-2">
                                        <TouchableOpacity 
                                            className="bg-white border border-blue-600 rounded-full py-2 px-4 flex-1 mr-2 items-center"
                                            onPress={() => handleSaveProfile(item)}
                                        >
                                            <Text className="text-blue-600 font-lbold">Save Profile</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            className="bg-blue-600 rounded-full py-2 px-4 flex-1 ml-2 items-center"
                                            onPress={() => handleHire(item)}
                                        >
                                            <Text className="text-white font-lbold">Hire Now</Text>
                                        </TouchableOpacity>
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
            )}
        </SafeAreaView>
    );
};

export default SearchResultsPage;