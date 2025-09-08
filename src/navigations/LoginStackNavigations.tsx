import { StaticParamList } from "@react-navigation/native";
import { createNativeStackNavigator, NativeStackNavigationProp } from "@react-navigation/native-stack";
import { LoginScreen } from "../screens/Login";
import { RegisterScreen } from "../screens/Register";


const LoginStack = createNativeStackNavigator({
    screens: {
        Login: LoginScreen,
        Register: RegisterScreen
    }
});

type LoginStackParamList = StaticParamList<typeof LoginStack>;
type LoginScreenProps = NativeStackNavigationProp<LoginStackParamList, 'Login'>;

export type LoginTypes = {
    navigation: LoginScreenProps
}

export function LoginStackNavigations(){
    return (
        <LoginStack.Navigator initialRouteName="Login" screenOptions={{headerShown: false}}>
            <LoginStack.Screen name="Login" component={LoginScreen} />
            <LoginStack.Screen name="Register" component={RegisterScreen} />
        </LoginStack.Navigator>
    )
}