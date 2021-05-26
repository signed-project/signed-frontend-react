import fromUnixTime from 'date-fns/fromUnixTime';
import format from 'date-fns/format';


export const getReadFormat = (date) => {
    let readableString;
    try {
        if (Number(date) !== NaN) {
            readableString = format(new Date(fromUnixTime(date / 1000).toString()), 'PPpp')
        };
    } catch (e) {
        console.error([getReadFormat], e)
    }

    return readableString;
}