import { HttpClient } from 'aurelia-http-client';
import {singleton} from 'aurelia-framework';

@singleton()
export class AppConfig {
    config = null;
    _baseHref = '';
    _stampWebServicesUrl = '';

    constructor() {
        this.http = new HttpClient();
    }

    async load(baseHref) {
        if (this.config) return this.config;
        this.baseHref = baseHref;
        const href = `${this.baseHref}/resources/app-config.json`;
        const response = await this.http.get(href);
        this.config = await response.content;
        return this.config;
    }

    get baseHref() {
        return this._baseHref;
    }

    set baseHref(_href) {
        let _baseHref = _href;
        if (_baseHref?.endsWith('/')) {
            _baseHref = _baseHref.replace(/\/$/, '');
        }
        this._baseHref = _baseHref;
    }

    get stampWebServicesUrl() {
        return this.config?.stampWebServicesUrl ?? '/../stamp-webservices/';
    }
    get stampWebUrl() {
        return this.config?.stampWebUrl ?? '/stamp-web/#';
    }
}
