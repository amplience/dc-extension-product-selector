export class ProductSelectorError extends Error {
  static codes = {
      INVALID_FIELD: 'INVALID_PROPERTY',
      INVALID_VALUE: 'INVALID_VALUE',
      GET_ITEMS: 'GET_ITEMS',
      GET_SELECTED_ITEMS: 'GET_SELECTED_ITEMS',
      GET_SDK: 'GET_SDK'
  }
  code = 'UNDEFINED'
  constructor(message, code) {
    super(message);
    if (code) {
      this.code = code;
    }
  }
}