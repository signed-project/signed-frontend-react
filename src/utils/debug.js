import Debug from 'debug';
import { setLogger } from 'react-query';

const debug = Debug('app');
debug.log = console.log.bind(console);

if (process.env.REACT_APP_DEBUG) {
  Debug.enable(process.env.REACT_APP_DEBUG);

  setLogger({
    log: debug.extend('react-query:log'),
    warn: debug.extend('react-query:warn'),
    error: debug.extend('react-query:error'),
  });
} else {
  setLogger({
    log: () => {},
    warn: () => {},
    error: () => {},
  });
}

export default debug;
