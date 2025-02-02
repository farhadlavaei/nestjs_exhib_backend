// src/helpers/connect-to-api.helper.ts
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { catchError, map } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class ConnectToApi {
    private url: string;
    private apikey: string;
    private httpService: HttpService;

    constructor(MainUrl: string, apikey: string ,
                httpService: HttpService)
    {
        this.url = MainUrl;
        this.apikey = apikey;
        this.httpService = httpService
    }

    Exec(urlpath: string, req: any): Observable<any> {
        const fullUrl = `${this.url}/Apiv2/${urlpath}`;

        return this.httpService.post(fullUrl, req, {
            headers: {
                'Authorization': `BASIC APIKEY:${this.apikey}`,
                'Content-Type': 'application/json;charset=utf-8',
            },
        }).pipe(
            map(response => response.data),
            catchError(error => {
                console.error('Error:', error.response ? error.response.data : error.message);
                return throwError(new InternalServerErrorException('API call failed'));
            }),
        );
    }
}
