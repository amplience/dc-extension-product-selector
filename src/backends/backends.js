import {SFCC} from './SFCC';
import {SFCCReal} from './SFCCReal';
import {Hybris} from './Hybris';
import {CommerceTools} from './CommerceTools';

export const backends = {
  SFCC: 'sfcc',
  SFCCDIRECT: 'sfcc-direct',
  HYBRIS: 'hybris',
  COMMERCETOOLS: 'commercetools'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case backends.HYBRIS:
      return new Hybris(params);
    case backends.COMMERCETOOLS:
      return new CommerceTools(params);
    case backends.SFCCDIRECT:
      return new SFCCReal(params);
    case backends.SFCC:
    default:
      return new SFCC(params);
  }
}