import React, { useState } from "react";
import { 
    Text, 
    View, 
    TextInput, 
    TouchableOpacity, 
    ScrollView, 
    Switch, 
    KeyboardAvoidingView, 
    Platform,
    Image
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import LabourDB from "../../libs/database";

// Mock data for contractors
let contractors = [];

export const ContractorRegistrationPage = ({ navigation }) => {
    // Form state
    const [formData, setFormData] = useState({
        // Personal Details
        fullName: "",
        phone: "",
        email: "",
        address: "",
        city: "",
        pincode: "",
        photo: null,
        idProof: null,
        
        // Bank Details
        accountHolder: "",
        accountNumber: "",
        ifscCode: "",
        bankName: "",
        
        // Other Settings
        receiveNotifications: true,
        shareLocationData: true,
        agreeToTerms: false
    });

    // Current page in multi-step form
    const [currentStep, setCurrentStep] = useState(1);
    
    // Error state
    const [errors, setErrors] = useState({});

    const updateFormData = (field, value) => {
        setFormData({
            ...formData,
            [field]: value
        });
        // Clear error for this field if it exists
        if (errors[field]) {
            setErrors({
                ...errors,
                [field]: null
            });
        }
    };

    const pickImage = async (field) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: field === 'photo' ? [1, 1] : [4, 3],
            quality: 0.8,
        });

        if (!result.canceled) {
            updateFormData(field, result.assets[0].uri);
        }
    };

    const validateStep = (step) => {
        let stepErrors = {};
        let isValid = true;

        if (step === 1) {
            // Validate personal details
            if (!formData.fullName.trim()) {
                stepErrors.fullName = "Name is required";
                isValid = false;
            }
            
            if (!formData.phone.trim()) {
                stepErrors.phone = "Phone number is required";
                isValid = false;
            } else if (!/^\d{10}$/.test(formData.phone.trim())) {
                stepErrors.phone = "Enter a valid 10-digit phone number";
                isValid = false;
            }
            
            if (!formData.email.trim()) {
                stepErrors.email = "Email is required";
                isValid = false;
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                stepErrors.email = "Enter a valid email address";
                isValid = false;
            }
            
            if (!formData.address.trim()) {
                stepErrors.address = "Address is required";
                isValid = false;
            }
            
            if (!formData.city.trim()) {
                stepErrors.city = "City is required";
                isValid = false;
            }
            
            if (!formData.pincode.trim()) {
                stepErrors.pincode = "PIN code is required";
                isValid = false;
            } else if (!/^\d{6}$/.test(formData.pincode.trim())) {
                stepErrors.pincode = "Enter a valid 6-digit PIN code";
                isValid = false;
            }
        } else if (step === 2) {
            // Validate bank details
            if (!formData.accountHolder.trim()) {
                stepErrors.accountHolder = "Account holder name is required";
                isValid = false;
            }
            
            if (!formData.accountNumber.trim()) {
                stepErrors.accountNumber = "Account number is required";
                isValid = false;
            } else if (!/^\d{9,18}$/.test(formData.accountNumber.trim())) {
                stepErrors.accountNumber = "Enter a valid account number";
                isValid = false;
            }
            
            if (!formData.ifscCode.trim()) {
                stepErrors.ifscCode = "IFSC code is required";
                isValid = false;
            } else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(formData.ifscCode.trim())) {
                stepErrors.ifscCode = "Enter a valid IFSC code";
                isValid = false;
            }
            
            if (!formData.bankName.trim()) {
                stepErrors.bankName = "Bank name is required";
                isValid = false;
            }
        } else if (step === 3) {
            // Validate terms agreement
            if (!formData.agreeToTerms) {
                stepErrors.agreeToTerms = "You must agree to the terms and conditions";
                isValid = false;
            }
            
            if (!formData.photo) {
                stepErrors.photo = "Profile photo is required";
                isValid = false;
            }
            
            if (!formData.idProof) {
                stepErrors.idProof = "ID proof is required";
                isValid = false;
            }
        }

        setErrors(stepErrors);
        return isValid;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(currentStep - 1);
    };

    const handleSubmit = async () => {
        if (validateStep(currentStep)) {
            try {
                const newContractor = {
                    fullName: formData.fullName,
                    phone: formData.phone,
                    email: formData.email,
                    address: formData.address,
                    city: formData.city,
                    pincode: formData.pincode,
                    photo: formData.photo,
                    idProof: formData.idProof,
                    accountHolder: formData.accountHolder,
                    accountNumber: formData.accountNumber,
                    ifscCode: formData.ifscCode,
                    bankName: formData.bankName,
                    receiveNotifications: formData.receiveNotifications,
                    shareLocationData: formData.shareLocationData,
                    agreeToTerms: formData.agreeToTerms
                };
                await LabourDB.addContractorProfile(newContractor);
                // Navigate to dashboard
                router.push('/sramikarta/dashboard');
            } catch (error) {
                console.error('Error adding contractor profile:', error);
                // Handle error (e.g., show a notification)
            }
        }
    };

    const renderInputField = (label, field, placeholder, keyboardType = "default", isSecure = false) => (
        <View className="mb-4">
            <Text className="text-gray-700 mb-1 font-lregular">{label}</Text>
            <TextInput
                className={`border ${errors[field] ? 'border-red-500' : 'border-gray-300'} 
                    rounded-lg p-3 bg-gray-50 text-gray-800 font-lregular`}
                placeholder={placeholder}
                value={formData[field]}
                onChangeText={(text) => updateFormData(field, text)}
                keyboardType={keyboardType}
                secureTextEntry={isSecure}
            />
            {errors[field] && (
                <Text className="text-red-500 text-xs mt-1 font-lregular">{errors[field]}</Text>
            )}
        </View>
    );

    const renderPersonalDetailsForm = () => (
        <View>
            <Text className="text-blue-600 text-xl mb-4 font-lbold">Personal Details</Text>
            
            {renderInputField("Full Name", "fullName", "Enter your full name")}
            {renderInputField("Phone Number", "phone", "Enter 10-digit mobile number", "phone-pad")}
            {renderInputField("Email", "email", "Enter your email address", "email-address")}
            {renderInputField("Address", "address", "Enter your street address")}
            
            <View className="flex-row mb-4">
                <View className="flex-1 mr-2">
                    {renderInputField("City", "city", "Your city")}
                </View>
                <View className="flex-1 ml-2">
                    {renderInputField("PIN Code", "pincode", "6-digit PIN code", "numeric")}
                </View>
            </View>
        </View>
    );

    const renderBankDetailsForm = () => (
        <View>
            <Text className="text-blue-600 text-xl mb-4 font-lbold">Bank Account Details</Text>
            <Text className="text-gray-500 mb-4 font-lregular">Your payments will be sent to this account</Text>
            
            {renderInputField("Account Holder Name", "accountHolder", "Name as per bank records")}
            {renderInputField("Account Number", "accountNumber", "Enter account number", "numeric")}
            {renderInputField("IFSC Code", "ifscCode", "Bank IFSC code", "default", false)}
            {renderInputField("Bank Name", "bankName", "Name of your bank")}
        </View>
    );

    const renderVerificationForm = () => (
        <View>
            <Text className="text-blue-600 text-xl mb-4 font-lbold">Verification & Preferences</Text>
            
            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-lregular">Profile Photo</Text>
                <TouchableOpacity 
                    onPress={() => pickImage('photo')}
                    className={`border-2 border-dashed ${errors.photo ? 'border-red-500' : 'border-gray-300'} 
                        rounded-lg p-4 items-center justify-center h-32`}
                >
                    {formData.photo ? (
                        <Image 
                            source={{ uri: formData.photo }} 
                            className="w-full h-full rounded-lg"
                            style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        />
                    ) : (
                        <View className="items-center">
                            <Ionicons name="camera" size={32} color="#666" />
                            <Text className="text-gray-600 mt-2 font-lregular">Upload Photo</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {errors.photo && (
                    <Text className="text-red-500 text-xs mt-1 font-lregular">{errors.photo}</Text>
                )}
            </View>
            
            <View className="mb-6">
                <Text className="text-gray-700 mb-2 font-lregular">ID Proof (Aadhaar/PAN/Voter ID)</Text>
                <TouchableOpacity 
                    onPress={() => pickImage('idProof')}
                    className={`border-2 border-dashed ${errors.idProof ? 'border-red-500' : 'border-gray-300'} 
                        rounded-lg p-4 items-center justify-center h-32`}
                >
                    {formData.idProof ? (
                        <Image 
                            source={{ uri: formData.idProof }} 
                            className="w-full h-full rounded-lg"
                            style={{ width: '100%', height: '100%', borderRadius: 8 }}
                        />
                    ) : (
                        <View className="items-center">
                            <Ionicons name="document" size={32} color="#666" />
                            <Text className="text-gray-600 mt-2 font-lregular">Upload ID Proof</Text>
                        </View>
                    )}
                </TouchableOpacity>
                {errors.idProof && (
                    <Text className="text-red-500 text-xs mt-1 font-lregular">{errors.idProof}</Text>
                )}
            </View>
            
            <View className="mb-3">
                <View className="flex-row justify-between items-center py-2">
                    <Text className="text-gray-700 font-lregular">Receive Job Notifications</Text>
                    <Switch
                        value={formData.receiveNotifications}
                        onValueChange={(value) => updateFormData('receiveNotifications', value)}
                        trackColor={{ false: "#ccc", true: "#93C5FD" }}
                        thumbColor={formData.receiveNotifications ? "#3B82F6" : "#f4f3f4"}
                    />
                </View>
            </View>
            
            <View className="mb-3">
                <View className="flex-row justify-between items-center py-2">
                    <Text className="text-gray-700 font-lregular">Share Location Data</Text>
                    <Switch
                        value={formData.shareLocationData}
                        onValueChange={(value) => updateFormData('shareLocationData', value)}
                        trackColor={{ false: "#ccc", true: "#93C5FD" }}
                        thumbColor={formData.shareLocationData ? "#3B82F6" : "#f4f3f4"}
                    />
                </View>
            </View>
            
            <View className="mb-4">
                <TouchableOpacity 
                    className="flex-row items-center py-2"
                    onPress={() => updateFormData('agreeToTerms', !formData.agreeToTerms)}
                >
                    <View className={`w-6 h-6 mr-2 rounded border ${
                        formData.agreeToTerms ? 'bg-blue-600 border-blue-600' : 
                        errors.agreeToTerms ? 'border-red-500' : 'border-gray-300'
                    } items-center justify-center`}>
                        {formData.agreeToTerms && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <Text className="text-gray-700 flex-1 font-lregular">
                        I agree to the Terms of Service and Privacy Policy
                    </Text>
                </TouchableOpacity>
                {errors.agreeToTerms && (
                    <Text className="text-red-500 text-xs ml-8 font-lregular">{errors.agreeToTerms}</Text>
                )}
            </View>
        </View>
    );

    const renderProgressBar = () => (
        <View className="flex-row justify-between mb-6 mt-2">
            {[1, 2, 3].map((step) => (
                <View key={step} className="flex-1 px-1">
                    <View 
                        className={`h-2 rounded-full ${
                            step <= currentStep ? 'bg-blue-600' : 'bg-gray-300'
                        }`}
                    />
                </View>
            ))}
        </View>
    );

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return renderPersonalDetailsForm();
            case 2:
                return renderBankDetailsForm();
            case 3:
                return renderVerificationForm();
            default:
                return null;
        }
    };

    const renderButtons = () => (
        <View className="flex-row justify-between mt-4">
            {currentStep > 1 && (
                <TouchableOpacity
                    className="bg-gray-200 py-3 px-6 rounded-full"
                    onPress={handlePrevious}
                >
                    <Text className="text-gray-700 font-lbold">Back</Text>
                </TouchableOpacity>
            )}
            
            <TouchableOpacity
                className={`bg-blue-600 py-3 px-6 rounded-full ml-auto`}
                onPress={currentStep < 3 ? handleNext : handleSubmit}
            >
                <Text className="text-white font-lbold">
                    {currentStep < 3 ? "Next" : "Submit"}
                </Text>
            </TouchableOpacity>
        </View>
    );

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
                    <Text className="text-2xl font-lbold text-white">Join as Contractor</Text>
                </View>
            </View>
            
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                className="flex-1"
            >
                <ScrollView className="flex-1 px-4 py-4">
                    {renderProgressBar()}
                    {renderStepContent()}
                    {renderButtons()}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ContractorRegistrationPage;