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
            const res = await axios.post('/login', loginForm, {
                withCredentials: true,
            });
            const token = res.data.token;
            localStorage.setItem('token', token);
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            set({ loggedIn: true })
            return true;
        } catch (error) {
            console.error('Error during login:', error);
            return false;
        }
    },

    checkAuth: async () => {
        const token = localStorage.getItem('token')
        if (!token) {
            set({ loggedIn: false })
        }
        else {
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
            try {
                await axios.get('/check-auth')
                set({ loggedIn: true })
            }catch(error){
                set({ loggedIn: false})
            }
            
        }
    },

    logout: async () => {
        delete axios.defaults.headers.common['Authorization'];
        localStorage.removeItem('token');
        await axios.get('/logout')
        set({ loggedIn: false })
    }
}));

export default authStore;
