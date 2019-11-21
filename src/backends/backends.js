import { SFCC } from './SFCC';

export const backends = {
  SFCC: 'SFCC'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case 'SFCC':
      return new SFCC(params);
    default:

  }
}