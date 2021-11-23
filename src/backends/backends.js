import {SFCC} from './SFCC';
import {SFCCCors} from './SFCCCors';
import {Hybris} from './Hybris';
import {CommerceTools} from './CommerceTools';

export const backends = {
  SFCC: 'sfcc',
  SFCCCORS: 'sfcc-cors',
  HYBRIS: 'hybris',
  COMMERCETOOLS: 'commercetools'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case backends.HYBRIS:
      return new Hybris(params);
    case backends.COMMERCETOOLS:
      return new CommerceTools(params);
    case backends.SFCCCORS:
      return new SFCCCors(params);
    case backends.SFCC:
    default:
      return new SFCC(params);
  }
}