import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the shape of the state
interface UserState {
    walletConnectionStatus: boolean;
    userCampaigns: any[]; // Replace 'any' with a proper type/interface if you have one
}

// Initial state with correct type
const initialState: UserState = {
    walletConnectionStatus: false,
    userCampaigns: [],
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        setWalletConnectionStatus: (state, action: PayloadAction<boolean>) => {
            state.walletConnectionStatus = action.payload;
        },
        setUserCampaigns: (state, action: PayloadAction<any[]>) => {
            state.userCampaigns = action.payload;
        },
        addUserCampaign: (state, action: PayloadAction<any>) => {
            state.userCampaigns.push(action.payload);
        },
    },
});

// Export actions and reducer
export const { setWalletConnectionStatus, setUserCampaigns, addUserCampaign } = userSlice.actions;
export default userSlice.reducer;
