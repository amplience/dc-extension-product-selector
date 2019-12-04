import { SFCC } from './SFCC';
import { Hybris } from './Hybris';

export const backends = {
  SFCC: 'SFCC'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case 'Hybris':
      return new Hybris(params);
    case 'SFCC':
    default:
      return new SFCC(params);
  }
}