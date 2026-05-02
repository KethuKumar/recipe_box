import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import API from "../../api/axios";

// Register
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/api/auth/register", formData);
      return res.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed",
      );
    }
  },
);
// Login
export const loginUser = createAsyncThunk(
  "auth/login",
  async (formData, thunkAPI) => {
    try {
      const res = await API.post("/api/auth/login", formData);
      return res.data; // 🔥 return full data
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Login failed",
      );
    }
  },
);
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await API.post("/api/auth/logout");
    } catch (err) {
      console.log(err);
    }
  },
);

const initialState = {
  user: JSON.parse(localStorage.getItem("user")) || null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder

      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;

        const { token, user } = action.payload;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user)); // ✅ add this

        state.user = user;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // REGISTER
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, user } = action.payload;

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        state.user = user;
      })

      // LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem("token");
        localStorage.removeItem("user"); // ✅ add this

        state.user = null;
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
