import { Injectable } from "@nestjs/common";
import { Browser } from "puppeteer";

const moment = require('moment');
const global = require('global');

@Injectable()
export class GlobalService {
  constructor() {
    global.runJobVocabulary = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary1 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary2 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary3 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary4 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary5 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary6 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary7 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary8 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary9 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary10 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary11 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary12 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary13 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary14 = { status: false, updatedAt: moment().valueOf() };
    global.runJobVocabulary15 = { status: false, updatedAt: moment().valueOf() };
    global.system = {
      freeMem: 0, 
      totalMem: 0, 
      freeDisk: 0, 
      totalDisk: 0
    }
    global.job = {
      index: '-1',
      username: '',
      password: ''
    };
  }

  setJob = (value: string) => {
    let username = '';
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
    return global.job = { index: value, username, password: (value && 'kissmenow') };
  }

  getJob = (): { index: string; username: string; password: string; } => {
    return global.job;
  }

  getRunJobVocabulary15 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary15;
  } 

  setRunJobVocabulary15 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary15 = {...global.runJobVocabulary15, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary14 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary14;
  } 

  setRunJobVocabulary14 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary14 = {...global.runJobVocabulary14, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary13 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary13;
  } 

  setRunJobVocabulary13 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary13 = {...global.runJobVocabulary13, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary12 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary12;
  } 

  setRunJobVocabulary12 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary12 = {...global.runJobVocabulary12, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary11 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary11;
  } 

  setRunJobVocabulary11 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary11 = {...global.runJobVocabulary11, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary10 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary10;
  } 

  setRunJobVocabulary10 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary10 = {...global.runJobVocabulary10, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary9 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary9;
  } 

  setRunJobVocabulary9 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary9 = {...global.runJobVocabulary9, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary8 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary8;
  } 

  setRunJobVocabulary8 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary8 = {...global.runJobVocabulary8, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary7 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary7;
  } 

  setRunJobVocabulary7 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary7 = {...global.runJobVocabulary7, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary6 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary6;
  } 

  setRunJobVocabulary6 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary6 = {...global.runJobVocabulary6, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary5 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary5;
  } 

  setRunJobVocabulary5 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary5 = {...global.runJobVocabulary5, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary4 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary4;
  } 

  setRunJobVocabulary4 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary4 = {...global.runJobVocabulary4, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary3 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary3;
  } 

  setRunJobVocabulary3 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary3 = {...global.runJobVocabulary3, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary2 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary2;
  } 

  setRunJobVocabulary2 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary2 = {...global.runJobVocabulary2, updatedAt: moment().valueOf(), ...value };
  }

  getRunJobVocabulary1 = (): { status: Boolean; browser: Browser; updatedAt: number; } => {
    return global.runJobVocabulary1;
  } 

  setRunJobVocabulary1 = (value: { status?: Boolean; browser?: Browser; }) => {
    global.runJobVocabulary1 = {...global.runJobVocabulary1, updatedAt: moment().valueOf(), ...value };
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