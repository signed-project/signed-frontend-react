import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const useSourcePost = (address) => {
    const sourceStateLatest = useSelector(state => state.source.latest);
    const [sourceLatest, setSourceLatest] = useState([]);
    useEffect(() => {
        if (address) {
            // console.log('sourceStateLatest[address]', sourceStateLatest[address]);
            setSourceLatest(sourceStateLatest[address])
        }
    }, [sourceStateLatest, address]);
    return sourceLatest;
};
export default useSourcePost;
