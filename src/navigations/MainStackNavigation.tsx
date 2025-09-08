import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home";
import { CustomHeader } from "../components";
import ColorTheme from "../styles/colors";
import { BottomMainNavigation } from "./BottomMainNavigation";


const MainStack = createNativeStackNavigator<MainStackParamList>();

export type MainStackParamList = {
    MainStack: undefined;
};

export function MainStackNavigation() {
    return (
        <MainStack.Navigator
        screenOptions={{header: (props)=> <CustomHeader {...props}/>}}>
            <MainStack.Screen 
                name="MainStack" 
                component={BottomMainNavigation} 
            />
        </MainStack.Navigator>
    )
}