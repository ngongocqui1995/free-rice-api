import { Injectable } from "@nestjs/common";
import { Browser } from "puppeteer";
import * as moment from "moment";

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