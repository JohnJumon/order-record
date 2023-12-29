import { create } from 'zustand';
import axios from 'axios';

interface LoginForm {
    username: string;
    password: string;
}

interface AuthStore {
    loggedIn: boolean | null;
    loginForm: LoginForm;
    updateUsername: (value: string) => void;
    updatePassword: (value: string) => void;
    login: () => Promise<boolean>;
    checkAuth: () => Promise<void>;
    logout: () => Promise<void>;
}


const authStore = create<AuthStore>((set) => ({
    loggedIn: null,

    loginForm: {
        username: '',
        password: '',
    },

    updateUsername: (value) => {
        set((state) => ({
            loginForm: {
                ...state.loginForm,
                username: value,
            },
        }));
    },

    updatePassword: (value) => {
        set((state) => ({
            loginForm: {
                ...state.loginForm,
                password: value,
            },
        }));
    },

    login: async () => {
        try {
            const { loginForm } = authStore.getState();
            await axios.post('/login', loginForm, {
                withCredentials: true,
            });
            set({ loggedIn: true })
            return true;
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    },

    checkAuth: async () => {
        try {
            await axios.get('/check-auth')
            set({ loggedIn: true })
        } catch (err) {
            set({ loggedIn: false })
        }

    },

    logout: async () => {
        await axios.get('/logout')
        set({loggedIn: false})
    }
}));

export default authStore;
