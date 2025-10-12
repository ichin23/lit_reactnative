import {NavigationContainer} from '@react-navigation/native'
import { LoginStackNavigations } from './LoginStackNavigations'
import { use } from 'react';
import { MainStackNavigation } from './MainStackNavigation';
import { useAuth } from '../context/auth';

export function Navigation(){
    const {user} = useAuth();
    
    return (
        <NavigationContainer>
            { user ? <MainStackNavigation /> : <LoginStackNavigations />}
        </NavigationContainer>
    )
}