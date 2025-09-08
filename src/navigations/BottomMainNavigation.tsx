import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { HomeScreen } from "../screens/Home";
import { ExplorarScreen } from "../screens/Explorar";
import { PerfilScreen } from "../screens/Perfil";
import ColorTheme from "../styles/colors";

const Tab = createBottomTabNavigator({
    screens: {
        Home: HomeScreen,
        Explorar: ExplorarScreen,
        Perfil: PerfilScreen,
    }
});


export function BottomMainNavigation() {
    return (
        <Tab.Navigator screenOptions={{
            headerShown: false,
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
    )
}