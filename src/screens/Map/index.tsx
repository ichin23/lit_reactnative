import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Linking, Platform, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import * as Location from 'expo-location';
import Constants from 'expo-constants';
import { MaterialIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { styles } from './styles';
import { GeoCoordinates } from '../../core/domain/value-objects/GeoCoordinates';

type MapScreenRouteProp = RouteProp<{
    Map: {
        destination: GeoCoordinates;
        locationName: string;
    }
}, 'Map'>;

export function MapScreen() {
    const navigation = useNavigation();
    const route = useRoute<MapScreenRouteProp>();
    const { destination, locationName } = route.params;

    const [userLocation, setUserLocation] = useState<Location.LocationObject | null>(null);
    const [duration, setDuration] = useState<number | null>(null);
    const [distance, setDistance] = useState<number | null>(null);

    const GOOGLE_MAPS_APIKEY = Platform.OS === 'ios'
        ? Constants.expoConfig?.ios?.config?.googleMapsApiKey
        : Constants.expoConfig?.android?.config?.googleMaps?.apiKey;

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão negada', 'Precisamos da sua localização para traçar a rota.');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setUserLocation(location);
        })();
    }, []);

    const openInMaps = () => {
        const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const latLng = `${destination.latitude},${destination.longitude}`;
        const label = locationName;
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });

        if (url) {
            Linking.openURL(url);
        }
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                    latitude: destination.latitude,
                    longitude: destination.longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                }}
                showsUserLocation={true}
            >
                <Marker
                    coordinate={{
                        latitude: destination.latitude,
                        longitude: destination.longitude,
                    }}
                    title={locationName}
                />

                {userLocation && GOOGLE_MAPS_APIKEY && (
                    <MapViewDirections
                        origin={{
                            latitude: userLocation.coords.latitude,
                            longitude: userLocation.coords.longitude,
                        }}
                        destination={{
                            latitude: destination.latitude,
                            longitude: destination.longitude,
                        }}
                        apikey={GOOGLE_MAPS_APIKEY}
                        strokeWidth={3}
                        strokeColor="#1976d2"
                        onReady={result => {
                            setDuration(result.duration);
                            setDistance(result.distance);
                        }}
                        onError={(errorMessage) => {
                            console.log('MapViewDirections Error:', errorMessage);
                        }}
                    />
                )}
            </MapView>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <MaterialIcons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>

            <View style={styles.footer}>
                <View style={styles.headerContent}>
                    <View>
                        <Text style={styles.locationTitle}>{locationName}</Text>
                        <Text style={styles.locationAddress}>Destino selecionado</Text>
                    </View>
                    {duration !== null && distance !== null && (
                        <View style={styles.routeInfoContainer}>
                            <Text style={styles.durationText}>{Math.round(duration)} min</Text>
                            <Text style={styles.distanceText}>{distance.toFixed(1)} km</Text>
                        </View>
                    )}
                </View>

                <TouchableOpacity style={styles.openMapsButton} onPress={openInMaps}>
                    <MaterialIcons name="map" size={20} color="white" />
                    <Text style={styles.openMapsButtonText}>Abrir no Maps</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
