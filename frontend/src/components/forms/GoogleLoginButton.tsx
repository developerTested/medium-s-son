import MediumAPI from '@/utilities/api';
import { useAppDispatch } from '@/hooks';
import { setSocialUser } from '@/redux/slices/authSlice';
import { decodeJwtResponse } from '@/utilities/helper';
import { toast } from 'react-toastify';
import { GoogleLogin, GsiButtonConfiguration } from '@react-oauth/google';

export default function GoogleLoginButton({ width = 400, shape = "pill", size = "large", text }: GsiButtonConfiguration) {

    const dispatch = useAppDispatch();

    const handleSocialLogin = async (credentialResponse?: string) => {

        if (!credentialResponse) {
            toast.error("Login failed")

            return false;
        }

        const decodeToken = decodeJwtResponse(credentialResponse);

        const socialUser = {
            email: decodeToken.email,
            display_name: `${decodeToken.given_name} ${decodeToken.family_name}`,
            avatar: decodeToken.picture,
            social_id: decodeToken.sub,
            social_provider: "google",
        }

        try {

            const registerData = {
                ...socialUser,
                user_name: socialUser.display_name.toLowerCase().replace(/ /g, '_')
            }

            const { data: response } = await MediumAPI.post("/user/social", registerData)

            dispatch(setSocialUser(response))
        } catch (error) {
            toast.error("Error while Logging user")
        }

    }

    return (
        <div className="flex items-center justify-center">
            <GoogleLogin
                onSuccess={credentialResponse => handleSocialLogin(credentialResponse.credential)}
                onError={() => toast.error("Login Failed!")}
                size={size}
                shape={shape}
                width={width}
                text={text}
            />
        </div>
    )
}
