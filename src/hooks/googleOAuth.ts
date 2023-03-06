import { useGoogleLogin } from "@react-oauth/google";
import { useState } from "react";

export default function useGoogleOAuth() {
    const [oauth, setoauth] = useState('');
    const useGoogleSignIn = () => {
        useGoogleLogin({
            onSuccess: (credResponse) => {
                console.log(credResponse);
            },
        });
    }
    return { useGoogleSignIn }
}