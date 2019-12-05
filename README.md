# Product Selector Extension

The product selector extension allows you to easily search for products in Saleforce Commerce Cloud and add them to your schema.

The extension requires the use of the [SFCC product search proxy (UPDATE WITH GITHUB URL)](https://bitbucket.org/amplience/sfcc-product-search-proxy) to work around CORS issues when calling the SFCC data endpoint.

## Installation Parameters

The extension works with 'list of text' properties and supports the following parameters:

```json
{
  "proxyUrl": "{The URL of the proxy service}",
  "sfccUrl": "{The URL of the SFCC instance}",
  "authSecret": "{The SFCC OAuth client secret}",
  "authClientId": "{The SFCC OAuth client ID}",
  "siteId": "{The ID of the site containing products in SFCC}"
}
```

## Example Snippet

```json
"product selector": {
  "title": "Product Selector",
  "description": "description",
  "type": "array",
  "minItems": 3,
  "maxItems": 10,
  "items": {
    "type": "string"
  },
  "ui:extension": {
    "url": "https://product-selecotr.amplience.com",
    "height": 208,
    "params": {
      "proxyUrl": "https://sfcc-proxy.ampleince.com",
      "sfccUrl": "https://sandbox.demandware.net",
      "authSecret": "aa1111AAAAAA1",
      "authClientId": "11111111-1111-1111-1111-111111111111",
      "siteId": "TestSite"
    }
  }
}

```

## Available Scripts

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.<br />

### `npm run build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!
