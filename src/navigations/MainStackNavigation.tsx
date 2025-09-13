import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home";
import { CustomHeader } from "../components/Appbar";
import ColorTheme from "../styles/colors";
import { BottomMainNavigation } from "./BottomMainNavigation";
import AddScreen from "../screens/Add";
import { StaticParamList } from "@react-navigation/native";


const MainStack = createNativeStackNavigator({
    screens: {
        MainStack: BottomMainNavigation,
        Add: AddScreen
    }
});

type MainStackParamList =  StaticParamList<typeof MainStack>;
type HomeScreenProps = NativeStackNavigationProp<MainStackParamList, 'MainStack'>;

export type HomeTypes = {
    navigation: HomeScreenProps;
}

export function MainStackNavigation() {
    return (
        <MainStack.Navigator
            screenOptions={{ header: (props) => <CustomHeader {...props} />, contentStyle: { backgroundColor: ColorTheme.background } }}>
            <MainStack.Screen
                name="MainStack"
                component={BottomMainNavigation}
            />
            <MainStack.Screen
                name="Add"
                component={AddScreen}
                options={{ headerShown: false, animation: 'slide_from_bottom' }}
            />
        </MainStack.Navigator>
    )
}