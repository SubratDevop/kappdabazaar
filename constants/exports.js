import { BaseToast, ErrorToast } from "react-native-toast-message";

export const IMG_1 = require("../assets/img1.png");
export const IMG_2 = require("../assets/data1.png");
export const IMG_3 = require("../assets/data2.png");
export const IMG_4 = require("../assets/data3.png");
export const IMG_5 = require("../assets/img2.png");
export const IMG_6 = require("../assets/img3.png");
export const IMG_7 = require("../assets/img4.png");
export const IMG_8 = require("../assets/img5.png");
export const IMG_9 = require("../assets/img6.png");
export const IMG_10 = require("../assets/img7.png");
export const IMG_11 = require("../assets/img8.png");
export const themeInput = { colors: { primary: "#777", primaryContainer: "#fff" } }

export const URL_BASE = `https://api.kapdabazaar.in`; // change this to your base URL
// export const URL_BASE = 'http://192.168.31.24:9090'; // change this to your base 

export const API_BASE = `${URL_BASE}/kapda/v1/api`; // change this to your base URL

export const toastConfig = {
    success: (props) => (
        <BaseToast
            {...props}
            style={{ backgroundColor: "green", borderLeftColor: "green" }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '500',
                color: "#fff",
            }}
            text2Style={{
                fontSize: 12,
                fontWeight: '400',
                color: "#f7f7f7",
            }}
        />
    ),
    error: (props) => (
        <ErrorToast
            {...props}
            style={{ backgroundColor: "red", borderLeftColor: "red" }}
            contentContainerStyle={{ paddingHorizontal: 15 }}
            text1Style={{
                fontSize: 15,
                fontWeight: '500',
                color: "#fff",

            }}
            text2Style={{
                fontSize: 12,
                fontWeight: '400',
                color: "#f7f7f7",
            }}
        />
    )
}

export const COLORS = {
    primary: "#132f56",
    secondary: "#f28482",
    inactive: "#525252",
    background: "#fff",
};

// src/constants/Colors.js

export const colors = {
    steelBlue: '#3C6E9B',
    offWhite: '#FAFAFA',
    charcoal: '#2B2B2B',
    beige: '#E7D9BA',
    lightGray: '#E1E1E1',
    navyBlue: '#264577',
  };
  

export const commonTabOptions = {
    headerShown: false,
    headerStatusBarHeight: 0,
};

export const commonHeaderOptions = {
    headerStyle: { backgroundColor: COLORS.primary },
    headerShadowVisible: false,
    headerTintColor: "#fff",
};

export default {
    user_id: 123,
    name: 'John Doe',
    token: 'abc123',
};

export const DEV_MODE = true;
