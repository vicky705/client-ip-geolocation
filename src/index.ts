import axios from "axios";

interface GeoLocation {
  ip: string;
  country: string;
  countryCode: string;
  regionCode: string;
  regionName: string;
  city: string;
  geolocation : [
      lat: number,
      lon: number
  ];
  isp: string;
  timezone: string;
  zip: string;
}

export async function getClientIpAndLocation(
  req: any
): Promise<GeoLocation | null> {
  try {
    // Extract IP address
    const clientIp = getClientIp(req)

    // Call geolocation API
    const response = await axios.get(`http://ip-api.com/json/${clientIp}`);

    if (response.status === 200 && response.data.status === "success") {
      const { query, country, countryCode, regionName, region, city, lat, lon, isp, timezone, zip } = response.data;

      return {
        ip: query,
        country,
        countryCode, 
        regionCode: region,
        regionName,
        city,
        geolocation : [
            lat,
            lon,
        ],
        isp,
        timezone,
        zip
      };
    }

    return null; // Return null if geolocation fails
  } catch (error) {
    console.error("Error fetching geolocation:", error);
    return null;
  }
}

export function getClientIp(req: any): string | null | undefined {
    const headers = req.headers;
  
    // Common headers used for forwarding client IP
    const forwardedHeaders = [
      headers["x-forwarded-for"], // Standard header for forwarded IPs
      headers["x-real-ip"],       // Often used by NGINX or other proxies
      headers["cf-connecting-ip"], // Cloudflare's header for client IP
      headers["fastly-client-ip"], // Fastly's header for client IP
      headers["true-client-ip"],   // Akamai and other CDNs
      headers["x-client-ip"],      // Less common, fallback
      headers["x-cluster-client-ip"], // Common with some load balancers
      headers["forwarded"],         // General header, might include "for="
    ];
  
    // Extract and parse the first valid IP
    for (const headerValue of forwardedHeaders) {
      if (typeof headerValue === "string" && headerValue.trim() !== "") {
        // x-forwarded-for can contain a list of IPs, split and take the first
        const ip = headerValue.split(",")[0].trim();
        if (isValidIp(ip)) return ip;
      }
    }
  
    // Fallback to remoteAddress if no headers provided an IP
    const remoteAddress = req.socket.remoteAddress;
    return isValidIp(remoteAddress) ? remoteAddress : null;
  }

// Helper function to validate IP format
function isValidIp(ip: string | undefined): boolean {
    if (!ip) return false;
    const ipv4Regex = /^(?:\d{1,3}\.){3}\d{1,3}$/; // Match IPv4
    const ipv6Regex = /^[a-fA-F0-9:]+$/;          // Match IPv6
    return ipv4Regex.test(ip) || ipv6Regex.test(ip);
  }