import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { endpoint, passportClient } from './../../settings/laravel';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

    constructor(public http: HttpClient, private storage: Storage) { }

    login(user: any): Observable<any> {
        let request = {
            grant_type: passportClient.grant_type,
            client_id: passportClient.client_id,
            client_secret: passportClient.client_secret,
            user_name: user.email,
            password: user.password,
        }
        return this.http.post(`${endpoint}/oauth/token`, request);
    }

    register(user: any): Observable<any> {
        return this.http.post(`${endpoint}/api/register`, user);
    }

    async checkIsAuthenticated () 
    {
        let now = Date.now();
        let auth: any = await this.storage.get('auth')
        if (!!!auth)
        return false;
        if ( auth.expired_at <= now)
        return false;

        return true;
    }

    removeCredentials () {
        this.storage.remove('auth');
    }

    storeCredentials (response: any) {
        let expired_at = (response.expires_in * 1000) + Date.now();
    
        this.storage.set('auth', {
          access_token: response.access_token,
          refresh_token: response.refresh_token,
          expired_at
        })
    }
}