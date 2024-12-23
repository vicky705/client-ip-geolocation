# Client IP and Geolocation Extractor

`client-ip-geolocation` is a lightweight NPM package that extracts the client's IP address from an HTTP request object and fetches its geolocation details using an external API.

## Features
- Extracts the client’s IP address from common headers and socket information.
- Supports various proxy and CDN headers like `x-forwarded-for`, `cf-connecting-ip`, and more.
- Provides detailed geolocation information such as country, region, city, latitude, longitude, ISP, timezone, and zip code using a geolocation API.

## Installation
Install the package via NPM:
```bash
npm install client-ip-geolocation
```

## Usage
**Basic Example**

```typescript
import { createServer, IncomingMessage } from "http";
import { getClientIp, getClientIpAndLocation } from "client-ip-geolocation";

const server = createServer(async (req: IncomingMessage, res) => {
  const clientIp = getClientIp(req);
  console.log("Client IP:", clientIp);

  const geoLocation = await getClientIpAndLocation(req);
  if (geoLocation) {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(geoLocation));
  } else {
    res.writeHead(500, { "Content-Type": "text/plain" });
    res.end("Unable to fetch geolocation");
  }
});

server.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
```

## Methods

`getClientIp(req: any): string | null | undefined`

Extracts the client’s IP address from the HTTP request.

- Parameters:
    - `req:` The `any` object from an HTTP request.

- Returns:
    - The client’s IP address as a string or `null | undefined` if not found.

`getClientIpAndLocation(req: any): Promise<GeoLocation | null>`

Fetches the client’s geolocation details using their IP address.
- Parameters
    - `req:` The `any object from an HTTP request.

- Returns:
    - A promise resolving to a GeoLocation object or `null | undefine` if geolocation fails.

## GeoLocation Object Structure
```typescript
interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  regionCode: string;
  regionName: string;
  city: string;
  geolocation: [
    {
      lat: number;
      lon: number;
    }
  ];
  isp: string;
  timezone: string;
  zip: string;
}
```

## Example Output
When using the `getClientIpAndLocation` method, you may get a result like this:
```json
{
  "ip": "203.0.113.195",
  "country": "United States",
  "countryCode": "US",
  "regionCode": "CA",
  "regionName": "California",
  "city": "San Francisco",
  "geolocation": [
    {
      "lat": 37.7749,
      "lon": -122.4194
    }
  ],
  "isp": "Comcast Cable",
  "timezone": "America/Los_Angeles",
  "zip": "94103"
}
```

## Requirements
- Node.js >=14.x
- A network connection to call the geolocation API.

## Notes
- The package uses the ip-api service by default to fetch geolocation. You can replace this API with your preferred geolocation provider if required.
- Ensure you handle API rate limits and errors gracefully in production environments.

## License
- This package is open-source and available under the [MIT License](https://docs.npmjs.com/policies/npm-license).

## Contributing
- Contributions are welcome! If you’d like to add features or improve the package, feel free to submit a pull request.

## Git Repository
[https://github.com/vicky705/client-ip-geolocation.git](https://github.com/vicky705/client-ip-geolocation.git)

## Issues
- If you encounter any issues, please open an [issue](https://github.com/vicky705/client-ip-geolocation/issues) on the GitHub repository.

## Author
Vicky705 (Vicky Kumar)

[https://github.com/vicky705](https://github.com/vicky705)