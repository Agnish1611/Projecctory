import { atom } from "recoil";


export const userAtom = atom({
    key: 'userAtom',
    default: {
        id: null,
        username: null,
        uniqueId: null,
        email: null,
        friends: null,
        accessToken: null
    }
});