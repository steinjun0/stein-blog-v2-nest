import { HttpService } from '@nestjs/axios';
import { HttpException, Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import parse from 'node-html-parser';
import { catchError, lastValueFrom, map, Observable, tap } from 'rxjs';

@Injectable()
export class EtcService {
  constructor(private readonly httpService: HttpService) { }

  getSolvedProblemsNumber() {
    const https = require('https');
    return new Promise((resolve) => {
      const result = https.get("https://www.acmicpc.net/user/1142308", function (res) {
        res.setEncoding('utf8');
        let result = ''
        res.on('data', function (data) {
          result += data

        });
        res.on('end', () => {
          const root = parse(result)
          resolve({
            'solved': +root.querySelector('#u-solved').innerHTML,
            'solvedacTierImg': root.querySelector('.solvedac-tier').attrs.src,
            'rating': +root.querySelectorAll('th').find(e => e.innerHTML === '등수').nextSibling.innerText,
          });
        })
      })
    })
  }

  getAuthOfAdmin(accessToken: string): Observable<boolean> {
    return this.httpService
      .get('https://kapi.kakao.com/v2/user/me', { headers: { Authorization: `Bearer ${accessToken}` } })
      .pipe(
        catchError(e => {
          throw new HttpException(e.response.data, e.response.status);
        }),
        map(response => response.data),
        map(e => e.id === 2651014525)
      )
  }

  getSolvedacData(): Observable<AxiosResponse<any>> {
    return this.httpService
      .get('https://solved.ac/api/v3/user/show?handle=1142308')
      .pipe(
        map(response => response.data),
      )
  }

  getProxy(url: string, config: object): Observable<AxiosResponse<any>> {
    return this.httpService
      .get(url,config)
      .pipe(
        map(response => response.data),
      )
  }
}
