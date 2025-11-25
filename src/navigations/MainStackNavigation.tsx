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
import * as MediaLibrary from "expo-media-library"
import { CameraCapturedPicture } from "expo-camera";
import { MapScreen } from "../screens/Map";
import { GeoCoordinates } from "../core/domain/value-objects/GeoCoordinates";
import { PublicProfileScreen } from "../screens/PublicProfile";
import { FollowRequestsScreen } from "../screens/FollowRequests";

export type MainStackParamList = {
    MainStack: undefined,
    Add: undefined,
    Camera: { onPhotoTaken: (photo: CameraCapturedPicture) => void } | undefined,
    EditProfile: undefined,
    Map: { destination: GeoCoordinates, locationName: string },
    PublicProfile: { userId: string },
    FollowRequests: undefined
};

const MainStack = createNativeStackNavigator<MainStackParamList>({
    screens: {
        MainStack: BottomMainNavigation,
        Add: AddScreen,
        Camera: CameraScreen,
        EditProfile: EditProfileScreen,
        Map: MapScreen,
        PublicProfile: PublicProfileScreen,
        FollowRequests: FollowRequestsScreen
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
                options={{ headerShown: false, animation: 'slide_from_bottom' }}
            />
            <MainStack.Screen
                name="EditProfile"
                component={EditProfileScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <MainStack.Screen
                name="Map"
                component={MapScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <MainStack.Screen
                name="PublicProfile"
                component={PublicProfileScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <MainStack.Screen
                name="FollowRequests"
                component={FollowRequestsScreen}
                options={{ headerShown: false, animation: 'slide_from_right' }}
            />
        </MainStack.Navigator>
    )
}