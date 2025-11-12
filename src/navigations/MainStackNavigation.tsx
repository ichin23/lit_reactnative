import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/Home";
import { CustomHeader } from "../components/Appbar";
import ColorTheme from "../styles/colors";
import { BottomMainNavigation } from "./BottomMainNavigation";
import AddScreen from "../screens/Add";
import { StaticParamList } from "@react-navigation/native";
import { CameraScreen } from "../screens/Camera";
import { EditProfileScreen } from "../screens/EditProfile";
import { Asset } from "expo-asset";

type MainStackParamList = {
    MainStack: undefined,
    Add: undefined,
    Camera: { onPhotoTaken: (photo: Asset) => void } | undefined,
    EditProfile: undefined
};

const MainStack = createNativeStackNavigator<MainStackParamList>({
    screens: {
        MainStack: BottomMainNavigation,
        Add: AddScreen,
        Camera: CameraScreen,
        EditProfile: EditProfileScreen
    }
});

type HomeScreenProps = NativeStackNavigationProp<MainStackParamList, 'MainStack'>;

export type HomeTypes = {
    navigation: HomeScreenProps;
}

export function MainStackNavigation() {
    return (
        <MainStack.Navigator
            screenOptions={{ headerShown: false, contentStyle: { backgroundColor: ColorTheme.background } }}>
            <MainStack.Screen
                name="MainStack"
                component={BottomMainNavigation}
            />
            <MainStack.Screen
                name="Add"
                component={AddScreen}
                options={{ headerShown: false, animation: 'slide_from_bottom' }}
            />
            <MainStack.Screen
                name="Camera"
                component={CameraScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <MainStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
        </MainStack.Navigator>
    )
}