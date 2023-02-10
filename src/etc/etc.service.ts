import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import axios, { AxiosError, AxiosResponse } from 'axios';
import parse from 'node-html-parser';
import { catchError, map, Observable, tap } from 'rxjs';
const https = require('https');

@Injectable()
export class EtcService {
  constructor(private readonly httpService: HttpService) { }

  getSolvedProblemsNumber() {
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
}
