[![Amplience Dynamic Content](header.png)](https://amplience.com/dynamic-content)

# dc-extension-product-selector

![Travis](https://img.shields.io/travis/amplience/dc-extension-product-selector)

The product selector extension allows content authors to easily search and select products in Salesforce B2C Commerce Cloud (SFCC), SAP Commerce Cloud (Hybris) or Commercetools and add them to your content.

The IDs of each product selected are added to the content as an array of strings for SFCC or Commercetools and an array of objects with the id and catalog for Hybris.

![](/screenshot.png?raw=true)

The default SFCC backend requires the use of the [sfcc-product-search-proxy)](https://github.com/amplience/sfcc-product-search-proxy) to work around CORS issues when calling the SFCC data endpoint. It is not needed when using with Hybris or Commercetools, or using the `sfcc-cors` backend with the proper configuration.

## Installation Parameters


### Customise 

| paramerter  |  default  | notes   | required |
|---|---|---|---|
| noItemsText | No items selected. | Placeholder text to display when no items are selected. | false
| searchPlaceholderText  | Search  | Placeholder text to show in the search box.  | false 


### SFCC (cors)

To use this mode, your SFCC instance must be configured to allow the origin of the hosted extension for the provided client, and you must use at least version 21.10 of the api. The extension works with 'list of text' properties and supports the following parameters:

```json
{
  "backend": "sfcc-cors",
  "sfccUrl": "{The URL of the SFCC instance}",
  "authSecret": "{The SFCC OAuth client secret}",
  "authClientId": "{The SFCC OAuth client ID}",
  "siteId": "{The ID of the site containing products in SFCC}"
}
```

#### Example Snippet

```json
{
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
      "url": "https://product-selector.amplience.com",
      "height": 208,
      "params": {
        "backend": "sfcc-cors",
        "sfccUrl": "https://sandbox.demandware.net",
        "authSecret": "aa1111AAAAAA1",
        "authClientId": "11111111-1111-1111-1111-111111111111",
        "siteId": "TestSite"
      }
    }
  }
}
```

### SFCC (proxy)

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

#### Example Snippet

```json
{
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
      "url": "https://product-selector.amplience.com",
      "height": 208,
      "params": {
        "proxyUrl": "https://sfcc-proxy.amplience.com",
        "sfccUrl": "https://sandbox.demandware.net",
        "authSecret": "aa1111AAAAAA1",
        "authClientId": "11111111-1111-1111-1111-111111111111",
        "siteId": "TestSite"
      }
    }
  }
}
```

### Hybris

Hybris works with a list of objects with the properties id and catalog and requires the following parameters:

```json
{
  "hybrisUrl": "{URL of your hybris api}",
  "backend": "hybris",
  "currency": "{Currency of your products defaults to USD}",
  "catalogs": [
    {
      "id": "{ID of catalog}",
      "name": "{Display name of catalog}"
    }
  ]
}
```


#### Example snippet

```json
{
  "title": "title",
  "description": "description",
  "type": "array",
  "items": {
    "type": "object",
    "properties": {
      "id": {
        "type": "string"
      },
      "catalog": {
        "type": "string"
      }
    }
  },
  "ui:extension": {
    "name": "{{name of extension}}",
    "params": {
      "hybrisUrl": "https://api-hybris.amplience.com",
      "backend": "hybris",
      "catalogs": [
        {
          "id": "test-catalog",
          "name": "test"
        }
      ]
    }
  }
}
```

### Commercetools

The extension works with 'list of text' properties and supports the following parameters:

```json
{
  "backend": "commercetools",
  "apiUrl": "{API URL}",
  "host": "{Auth URL}",
  "projectKey": "{Project key}",
  "clientId": "{Client id}",
  "clientSecret": "{Client secret}",
  "scope": "{Scope of permissions}",
  "locale": "{Locale for text search}"
}
```
Values could be get from creating API Client on Commercetools platform (Settings/Developer settings/Create new API client). 
Required minimal scope of permissions is `view_published_products`, choose View/Products (published).
Image to display is selected from attributes of master variant by name `largeImageUrl` or first image in `images` array.

#### Example Snippet

```json
{
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
      "url": "https://product-selector.amplience.com",
      "height": 208,
      "params": {
        "backend": "commercetools",
        "apiUrl": "https://api.europe-west1.gcp.commercetools.com",
        "host": "https://auth.europe-west1.gcp.commercetools.com",
        "projectKey": "project-amp",
        "clientId": "clientId",
        "clientSecret": "clientSecret",
        "scope": "view_published_products",
        "locale": "en-CA"
      }
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
By default, Create React App produces a build assuming your app is hosted at the server root.  
To override this, specify the homepage in your `package.json`, for example:
 
 `"homepage": "."` <br />
Your app is ready to be deployed!
