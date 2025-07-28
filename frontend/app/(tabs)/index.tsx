import AddMarkerModal from '@/components/AddMarkerModal';
import MarkerOptionsModal from '@/components/MarkerOptionsModal';
import { Coordinates } from '@/constants/coordinates';
import { useAuth } from '@/context/auth';
import { useMarker } from '@/context/marker';
import { IMarker } from '@/types/map';
import * as Location from 'expo-location';
import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, useColorScheme, View } from 'react-native';
import MapView, { LatLng, MapPressEvent, Marker, MarkerPressEvent, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';

export default function App() {
    const { isAuthenticated } = useAuth();

    // If user is not authenticated, redirect to login page
    if (!isAuthenticated) {
        return <Redirect href='/login' />;
    }

    // Get the current color scheme (light or dark)
    const colorScheme = useColorScheme();

    // State to hold the initial region of the map
    const [initialRegion, setInitialRegion] = useState<Region | null>();
    // State to hold the markers on the map
    const { markers, addMarker } = useMarker();
    // State to control the visibility of the modal
    const [isAddModalVisible, setIsAddModalVisible] = useState(false);
    // State to control the visibility of the marker options modal
    const [isMarkerOptionsModalVisible, setIsMarkerOptionsModalVisible] = useState(false);
    // State to hold the temporary coordinate for the new marker
    const [tempCoordinate, setTempCoordinate] = useState<LatLng | null>(null);
    // State to control the navigation state
    const [isNavigating, setIsNavigating] = useState(false);
    // State to hold the current marker
    const [currentMarker, setCurrentMarker] = useState<IMarker | null>(null);

    useEffect(() => {
        (async () => {
            // Request permission to access current user location
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.log('Permission to access location was denied');
                return;
            }

            // Get current user location
            const location = await Location.getCurrentPositionAsync({});
            setInitialRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: Coordinates.latitudeDelta,
                longitudeDelta: Coordinates.longitudeDelta,
            });
        })();
    }, []);

    function handleMapPress(event: MapPressEvent) {
        const { coordinate } = event.nativeEvent;
        setTempCoordinate(coordinate);
        setIsAddModalVisible(true);
    }

    function handleMarkerPress(event: MarkerPressEvent, marker: IMarker) {
        // Stop event propagation to prevent map press event from opening the modal
        event.stopPropagation();
        setCurrentMarker(marker);
        setIsMarkerOptionsModalVisible(true);
    }

    async function handleAddMarker(title: string) {
        if (tempCoordinate) {
            await addMarker({
                coordinate: tempCoordinate,
                title,
            });
            setIsAddModalVisible(false);
            setTempCoordinate(null);
        }
    }

    function handleNavigate() {
        if (isNavigating) {
            // Need to reset the navigatiion state like this to ensure the directions are re-rendered
            setIsNavigating(false);
            setIsNavigating(true);
        } else {
            setIsNavigating(true);
        }
    }

    // If user denies location permission show a loading indicator
    if (!initialRegion) {
        return (
            <View style={styles.container}>
                <ActivityIndicator size='large' style={styles.indicator} />
            </View>
        );
    }

    const containerStyle = {
        ...styles.container,
        backgroundColor: colorScheme === 'dark' ? '#1D3D47' : '#A1CEDC',
    };

    return (
        <View style={containerStyle}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                initialRegion={initialRegion}
                showsUserLocation
                showsMyLocationButton
                onPress={handleMapPress}>
                {markers.map((marker) => (
                    <Marker
                        key={marker.id}
                        coordinate={marker.coordinate}
                        onPress={(event) => handleMarkerPress(event, marker)}
                    />
                ))}
                {isNavigating && (
                    <MapViewDirections
                        origin={initialRegion}
                        destination={currentMarker?.coordinate}
                        strokeWidth={3}
                        strokeColor='blue'
                        apikey='AIzaSyAhtwU8oYSEkJzilkiVeKI4H3EDtS5OLtA'
                    />
                )}
            </MapView>

            <AddMarkerModal
                visible={isAddModalVisible}
                onClose={() => {
                    setIsAddModalVisible(false);
                    setTempCoordinate(null);
                }}
                onSubmit={handleAddMarker}
            />
            <MarkerOptionsModal
                visible={isMarkerOptionsModalVisible}
                title={currentMarker?.title || ''}
                onClose={() => setIsMarkerOptionsModalVisible(false)}
                onNavigate={handleNavigate}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: 85,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    indicator: {
        marginTop: 'auto',
        marginBottom: 'auto',
    },
});
