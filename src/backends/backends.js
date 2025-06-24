import { SFCC } from './SFCC';
import { SFCCCors } from './SFCCCors';
import { Hybris } from './Hybris';
import { CommerceTools } from './CommerceTools';
import { KiboCommerce } from './KiboCommerce';
import { BigCommerce } from './BigCommerce';

export const backends = {
  SFCC: 'sfcc',
  SFCCCORS: 'sfcc-cors',
  HYBRIS: 'hybris',
  COMMERCETOOLS: 'commercetools',
  KIBOCOMMERCE: 'kibocommerce',
  BIGCOMMERCE: 'bigcommerce'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case backends.HYBRIS:
      return new Hybris(params);
    case backends.COMMERCETOOLS:
      return new CommerceTools(params);
    case backends.KIBOCOMMERCE:
      return new KiboCommerce(params);
    case backends.SFCCCORS:
      return new SFCCCors(params);
    case backends.BIGCOMMERCE:
      return new BigCommerce(params)
    case backends.SFCC:
    default:
      return new SFCC(params);
  }
};
