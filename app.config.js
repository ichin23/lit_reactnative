import 'dotenv/config';

export default {
  "expo": {
    "name": "Lit",
    "slug": "lit_reactnative",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "scheme": "litapp",
    "deepLinking": true,
    "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY_ANDROID
        }
      },
    "splash": {
      "image": "./assets/adaptive-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#d02929"
    },
    "ios": {
      "supportsTablet": true,
      "config": {
        "googleMapsApiKey":  process.env.GOOGLE_MAPS_API_KEY_ANDROID
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#d02929"
      },
      "edgeToEdgeEnabled": true,
      "permissions": [
        "android.permission.ACCESS_COARSE_LOCATION",
        "android.permission.ACCESS_FINE_LOCATION"
      ],
      "package": "com.ichin23.lit_reactnative",
      "config": {
        "googleMaps": {
          "apiKey": process.env.GOOGLE_MAPS_API_KEY_ANDROID
        }
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera",
          "microphonePermission": "Allow $(PRODUCT_NAME) to access your microphone",
          "recordAudioAndroid": true
        }
      ],
      [
        "expo-media-library",
        {
          "photosPermission": "Permita $(PRODUCT_NAME) acessar suas fotos.",
          "savePhotosPermission": "Permita $(PRODUCT_NAME) salvar suas fotos.",
          "isAccessMediaLocationEnabled": true
        }
      ],
      [
        "expo-location",
        {
          "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        }
      ]
    ],
    "extra": {
      "eas": {
        "projectId": "a3df065e-ebc5-4954-9896-c610606cc9ff"
      }
    }
  }
}