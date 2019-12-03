import { SFCC } from './SFCC';

export const backends = {
  SFCC: 'SFCC'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case 'SFCC':
    default:
      return new SFCC(params);

  }
}