import { Injectable } from "@nestjs/common";
import { Browser } from "puppeteer";

const moment = require('moment');
const global = require('global');

@Injectable()
export class GlobalService {
  constructor() {
    global.runJobVocabulary = { status: false, updatedAt: moment().valueOf() };
    global.system = {
      freeMem: 0, 
      totalMem: 0, 
      freeDisk: 0, 
      totalDisk: 0
    }
    global.job = {
      index: '-1',
      username: '',
      password: '',
      server: '',
    };
  }

  setJob = (value: string) => {
    let username = '';
    let server = +value <= 15 ? 'https://free-rice-database.vercel.app' : 'https://free-rice-database-1.vercel.app';
    if (value == '0') username = 'tranphanchau10@gmail.com';
    if (value == '1') username = 'tranphanchau12@gmail.com';
    if (value == '2') username = 'tranphanchau13@gmail.com';
    if (value == '3') username = 'tranphanchau14@gmail.com';
    if (value == '4') username = 'tranphanchau15@gmail.com';
    if (value == '5') username = 'tranphanchau16@gmail.com';
    if (value == '6') username = 'tranphanchau17@gmail.com';
    if (value == '7') username = 'tranphanchau18@gmail.com';
    if (value == '8') username = 'tranphanchau19@gmail.com';
    if (value == '9') username = 'tranphanchau20@gmail.com';
    if (value == '10') username = 'tranphanchau21@gmail.com';
    if (value == '11') username = 'tranphanchau26@gmail.com';
    if (value == '12') username = 'tranphanchau27@gmail.com';
    if (value == '13') username = 'tranphanchau28@gmail.com';
    if (value == '14') username = 'tranphanchau32@gmail.com';
    if (value == '15') username = 'tranphanchau39@gmail.com';
    if (value == '16') username = 'pdriveanime@gmail.com';
    if (value == '17') username = 'pdriveanime1@gmail.com';
    if (value == '18') username = 'pdriveanime2@gmail.com';
    if (value == '19') username = 'pdriveanime3@gmail.com';
    if (value == '20') username = 'pdriveanime4@gmail.com';
    if (value == '21') username = 'pdriveanime5@gmail.com';
    if (value == '22') username = 'pdriveanime6@gmail.com';
    if (value == '23') username = 'pdriveanime7@gmail.com';
    if (value == '24') username = 'pdriveanime8@gmail.com';
    if (value == '25') username = 'pdriveanime9@gmail.com';
    if (value == '26') username = 'pdriveanime10@gmail.com';
    if (value == '27') username = 'pdriveanime11@gmail.com';
    if (value == '28') username = 'pdriveanime12@gmail.com';
    if (value == '29') username = 'pdriveanime13@gmail.com';
    if (value == '30') username = 'pdriveanime14@gmail.com';
    if (value == '31') username = 'pdriveanime15@gmail.com';
    return global.job = { index: value, username, password: (value && 'kissmenow'), server };
  }

  getJob = (): { index: string; username: string; password: string; server: string; } => {
    return global.job;
  }

  getRunJobVocabulary = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary;
  } 

  setRunJobVocabulary = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary = {...global.runJobVocabulary, updatedAt: moment().valueOf(), ...value };
  }

  setSystem = (value: { freeMem, totalMem, freeDisk, totalDisk }) => {
    return global.system = value;
  }

  getSystem = () => {
    return global.system;
  }

  getKeyFromString = (str: string, upperCase: boolean = true) => {
    let data = String(str);
    if (!str) return '';
    data = data.toLowerCase();
    data = data.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
    data = data.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
    data = data.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
    data = data.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
    data = data.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
    data = data.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
    data = data.replace(/đ/g, 'd');
    data = data.replace(
      /”|“|!|@|%|^|\*|\(|\)|\+|=|<|>|\?|\/|,|\.|:|;|'|"|&|#|\[|\]|~|\$|_|`|-|{|}|\\/g,
      ' ',
    );
    data = data.replace('[', '');
    data = data.replace(/ + /g, ' ');
    data = data.replace(/-+-/g, '-');
    data = data.replace(/ – /g, ' ');
    data = data.trim();
    data = data.replace(/ /g, '-');
    if (upperCase) data = data.toUpperCase();
    return data;
  };
}
