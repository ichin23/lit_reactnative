import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { styles } from "./styles";
import { useRoute, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { makePostUseCases } from "../../core/factories/makePostUseCases";
import { Post } from "../../core/domain/entities/Post";
import Toast from "react-native-toast-message";
import { SafeAreaView } from "react-native-safe-area-context";

export function UpdateScreen(data: {onUpdate: ()=>void}) {

    const [loading, setLoading] = useState(false)

    const  onClick = async ()=>{
        try{
            setLoading(true)
            await data.onUpdate()
        }catch(error){
            Toast.show(
                {
                    text1: "Erro ao atualizar",
                    type: "error"
                }
            )
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.label}>Atualização disponível</Text>
            <TouchableOpacity style={styles.button} onPress={data.onUpdate}>
                <Text style={styles.buttonText}>Atualizar</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
}
