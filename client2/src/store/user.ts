import { atom } from "recoil";


export const userAtom = atom({
    key: 'userAtom',
    default: {
        id: '66b52a53c5eac8302c280ff2',
        username: 'agnish',
        uniqueId: 'a6bmffq5',
        email: 'sukla.baruipur2@gmail.com',
        friends: [],
        accessToken: ''
    }
});