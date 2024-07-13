import axios from "axios";
import { atom, selector } from "recoil";

export const userState = atom({
    key: 'userState',
    default: selector({
        key: 'userStateSelector',
        get: async () => {
            const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/v1/user/me`, {
                headers: {
                    'Authorization': `${localStorage.getItem('token')}`,
                }
            })
            if (response.data.message === "Unauthorized") {
                return ""
            }
            else {
                return response.data.name
            }
        }
    })
})
