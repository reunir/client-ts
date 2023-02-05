import { userType } from '../types';
import { setLocalStorage, getLocalStorage } from '../utils';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { ResponseType } from '../types';
import { setUserAvatar } from '../utils/generateAvatar';

export function useLocalStorage(key: string, initialValue: string | null) {
    const [token, setToken] = useState<string | null>(() => {
        try {
            // Get from local storage by key
            const item = getLocalStorage(key)
            // Parse stored json or if none return initialValue
            return item ? item : initialValue
        } catch (error) {
            // If error also return initialValue
            console.error(error)
            return initialValue
        }
    });
    const [storedUser, setStoredUser] = useState<userType>(null);
    const getUserData = async () => {
        const userData: ResponseType<userType> = await (await axios.get('auth/me')).data
        if (userData.success && userData.data) {
            setStoredUser(userData.data.body);
            if (userData.data.body)
                setUserAvatar(userData.data.body.stripe, userData.data.body.seed, userData.data.body.backgroundColor);
        }
    }
    const setUser = (value: string | null): void => {
        try {
            setLocalStorage(key, value)
            setToken(value)
        }
        catch (error) {
            console.error(error);
        }
    }
    return { storedUser, setUser, token, getUserData };
}
