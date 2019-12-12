import { SFCC } from './SFCC';

export const backends = {
  SFCC: 'sfcc'
};

export const getBackend = (params) => {
  switch (params.backend) {
    case backends.SFCC:
    default:
      return new SFCC(params);
  }
}