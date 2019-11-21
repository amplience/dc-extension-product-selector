export class ProductSelectorError extends Error {
  static codes = {
      INVALID_FIELD: 'INVALID_PROPERTY',
      INVALID_VALUE: 'INVALID_VALUE'
  }
  code = 'UNDEFINED'
  constructor(message, code) {
    super(message);
    this.code = code;
  }
}