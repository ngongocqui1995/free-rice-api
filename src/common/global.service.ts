import { Injectable } from "@nestjs/common";
import { Browser } from "puppeteer";
import * as moment from "moment";

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
    global.system = {
      freeMem: 0, 
      totalMem: 0, 
      freeDisk: 0, 
      totalDisk: 0
    }
    global.job = '-1';
  }

  setJob = (value: String) => {
    return global.job = value;
  }

  getJob = () => {
    return global.job;
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