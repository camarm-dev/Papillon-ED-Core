import {API, VERSION} from "./constants";
import {Session} from "./session";
import {
    A2F_ERROR,
    INVALID_API_URL,
    INVALID_BODY,
    INVALID_VERSION,
    OBJECT_NOT_FOUND,
    SESSION_EXPIRED,
    TOKEN_INVALID,
    UNAUTHORIZED,
    WRONG_CREDENTIALS
} from "~/errors";
import {RequestOptions} from "~/utils/types/requests";
import {response} from "~/types/v3/responses/default/responses";

class Request {

    session: Session;
    requestOptions: RequestOptions;

    constructor(session: Session) {
        this.session = session;
        this.requestOptions = {
            headers: {
                "Accept": "application/json, text/plain, */*",
                "Content-Type": "application/x-www-form-urlencoded",
                "User-Agent": "EDMOBILE"
            }
        };
    }

    /**
     *
     * @param url Path to fetch or Url to fetch
     * @param body request payload
     * @param completeUrl set to true, `url` will be used as a full url, not a route of "api.ecoledirecte.com"
     * @param method GET request or POST request
     */
    async blob(url: string, body: string, completeUrl: boolean = false, method: "POST" | "GET" = "POST") {
        if(this.session.isLoggedIn) this.requestOptions.headers["X-token"] = this.session._token;
        const finalUrl = completeUrl ? url:  API + url;
        if (method == "GET") {
            return await fetch(finalUrl, {
                method: method,
                headers: this.requestOptions.headers
            }).then(response => response.blob());
        }
        return await fetch(finalUrl, {
            method: method,
            headers: this.requestOptions.headers,
            body: body
        }).then(response => response.blob());
    }

    /**
     *
     * @param url   The path to fetch
     * @param body  The string formatted body data
     * @param params    A string containing extra parameters (e.g "foo=bar&mode=auto")
     * @param ignoreErrors  Disable error handling, will return a response, even if it's an error response
     */
    async post(url: string, body: string, params?: string, ignoreErrors: boolean = false) {
        const paramsString = params ? "&" + params: "";
        const finalUrl = `${API}${url}${url.includes("?") ? `&verbe=post&v=${VERSION}${paramsString}` : `?verbe=post&v=${VERSION}${paramsString}`}`;
        return await this.request(finalUrl, body, ignoreErrors);
    }

    /**
     *
     * @param url   The path to fetch
     * @param body  The string formatted body data
     * @param params    A string containing extra parameters (e.g "foo=bar&mode=auto")
     * @param ignoreErrors  Disable error handling, will return a response, even if it's an error response
     */
    async get(url: string, body: string, params?: string, ignoreErrors: boolean = false) {
        const paramsString = params ? "&" + params: "";
        const finalUrl = `${API}${url}${url.includes("?") ? `&verbe=get&v=${VERSION}${paramsString}` : `?verbe=get&v=${VERSION}${paramsString}`}`;
        return await this.request(finalUrl, body, ignoreErrors);
    }

    /**
     *
     * @param url   The path to fetch
     * @param body  The string formatted body data
     * @param params    A string containing extra parameters (e.g "foo=bar&mode=auto")
     * @param ignoreErrors  Disable error handling, will return a response, even if it's an error response
     */
    async delete(url: string, body: string, params?: string, ignoreErrors: boolean = false) {
        const paramsString = params ? "&" + params: "";
        const finalUrl = `${API}${url}${url.includes("?") ? `&verbe=delete&v=${VERSION}${paramsString}` : `?verbe=delete&v=${VERSION}${paramsString}`}`;
        return await this.request(finalUrl, body, ignoreErrors);
    }

    /**
     *
     * @param url   The path to fetch
     * @param body  The string formatted body data
     * @param params    A string containing extra parameters (e.g "foo=bar&mode=auto")
     * @param ignoreErrors  Disable error handling, will return a response, even if it's an error response
     */
    async put(url: string, body: string, params?: string, ignoreErrors: boolean = false) {
        const paramsString = params ? "&" + params: "";
        const finalUrl = `${API}${url}${url.includes("?") ? `&verbe=put&v=${VERSION}${paramsString}` : `?verbe=put&v=${VERSION}${paramsString}`}`;
        return await this.request(finalUrl, body, ignoreErrors);
    }

    async request(url: string, body: string, ignoreErrors: boolean = false) {
        if(this.session._token) this.requestOptions.headers["X-token"] = this.session._token;
        return await fetch(url, {
            method: "POST",
            headers: this.requestOptions.headers,
            body: body
        })
            .then(res => res.text())
            .then(res => {
                const response = res.startsWith("{") ? JSON.parse(res): res;
                if (ignoreErrors) return response;
                if (typeof response != "object" && response.includes("<title>Loading...</title>")) throw INVALID_API_URL.drop();
                if (response.code == 525) {
                    throw SESSION_EXPIRED.drop();
                }
                if (response.code == 526) {
                    throw SESSION_EXPIRED.drop();
                }
                if (response.code == 520) {
                    throw TOKEN_INVALID.drop();
                }
                if (response.code == 505) {
                    throw WRONG_CREDENTIALS.drop();
                }
                if (response.code == 512) {
                    throw INVALID_BODY.drop();
                }
                if (response.code == 403) {
                    throw UNAUTHORIZED.drop(response.message);
                }
                if (response.code == 210) {
                    throw OBJECT_NOT_FOUND.drop(response.message);
                }
                if(response.code == 250) {
                    throw A2F_ERROR.drop();
                }
                if(response.code == 517) {
                    throw INVALID_VERSION.drop();
                }
                return response;
            }) as Promise<response>;
    }
}

export {
    Request
};
