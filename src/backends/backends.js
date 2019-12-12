import { SFCC } from './SFCC';
import { Hybris } from './Hybris';

export const backends = {
  SFCC: 'sfcc',
  HYBRIS: 'hybris'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case backends.HYBRIS:
      return new Hybris(params);
    case backends.SFCC:
    default:
      return new SFCC(params);
  }
}