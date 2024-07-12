import { atom, selector } from 'recoil';
import axios from 'axios';

export const labelsState = atom({
    key: 'labelsAtom',
    default: selector({
        key: 'labelsAtomSelector',
        get: async () => {
            try {
                const res = await axios.get('http://localhost:3000/api/v1/label/668e765f717600f6a7397dc2');
                return res.data.data;
            } catch (error) {
                return [{title: 'couldn\'t fetch data'}];
            }
        }
    })
});