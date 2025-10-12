import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';6
import { HomeScreen } from "../screens/Home";
import { ExplorarScreen } from "../screens/Explorar";
import { PerfilScreen } from "../screens/Perfil";
import ColorTheme from "../styles/colors";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { HomeTypes } from "./MainStackNavigation";
import { CustomHeader } from "../components/Appbar";

const Tab = createBottomTabNavigator({
    screens: {
        Home: HomeScreen,
        Explorar: ExplorarScreen,
        Perfil: PerfilScreen,
    }
});


export function BottomMainNavigation({navigation}: HomeTypes) {
    return (
        <View style={{ flex: 1 }}>
        <Tab.Navigator screenOptions={{
            header: (props) => <CustomHeader {...props} navigation={navigation} />,
            tabBarActiveTintColor: ColorTheme.primary,
            tabBarInactiveTintColor: ColorTheme.textSecondary,
        }}>
            <Tab.Screen name="Home" component={HomeScreen} options={{
                tabBarIcon: ({ color, focused })=>(<FontAwesome5 name="home" size={24} color={color} solid={focused} />)
            }}/>
            <Tab.Screen name="Explorar" component={ExplorarScreen} options={{
                tabBarIcon: ({ color, focused })=>(<MaterialIcons name="navigation" size={24} color={color} solid={focused} />)
            }}/>
            <Tab.Screen name="Perfil" component={PerfilScreen} options={{
                tabBarIcon: ({ color, focused })=>(<FontAwesome5 name="user" size={24} color={color} solid={focused} />)
            }}/>
        </Tab.Navigator>
        <TouchableOpacity style={styles.fab} onPress={() => navigation.navigate('Add')}>
            <MaterialIcons name="add" size={32} color="#fff" />
        </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
  fab: {
    position: "absolute",
    right: 24,
    bottom: 100,
    backgroundColor: "#c00",
    width: 56,
    height: 56,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    zIndex: 100,
  },
});