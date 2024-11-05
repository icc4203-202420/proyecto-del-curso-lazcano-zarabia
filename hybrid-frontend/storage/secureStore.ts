import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeToken = async (token: string): Promise<void> => {
    try {
        await AsyncStorage.setItem('authToken', token);
        console.log("Token guardado con AsyncStorage"); // Confirmación
    } catch (error) {
        console.error("Error al guardar el token con AsyncStorage:", error);
    }
};
