export interface AxiosCustomConfig {
    baseUrl?: string;
    enableCookies?: boolean;
    enableBearerToken?: boolean;
    bearerToken?: string;
    enableXSRFToken?: boolean;
    xsrfTokenFunction?: () => string;
    enableTabId?: boolean;
    customTabId?: string;
    enableRequestId?: boolean;
    customRequestId?: string | (() => string);
    excludedRoutes?: string[];
    redirectOnErrors?: number[];
    redirectUrl?: string;
}  