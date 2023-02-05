import { useState } from "react";
import { useIsOnline } from "react-use-is-online";
export default function useNetwork() {
    const { isOnline, isOffline, error } = useIsOnline();
    return {
        isOnline, isOffline, networkError: error
    }
}