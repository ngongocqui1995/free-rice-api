import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GlobalService } from 'src/common/global.service';
import { Page } from 'puppeteer';
import * as moment from 'moment';
import axios from 'axios';
import to from 'await-to-js';

const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
puppeteer.default.use(StealthPlugin());

const configPuppeterr: any = {
  args: ["--disable-gpu", "--no-sandbox", "--disable-setuid-sandbox", "--start-maximized"],
  // linux: yum install chromium
  // executablePath: "/usr/bin/chromium-browser",
  headless: true,
  ignoreHTTPSErrors: true,
  defaultViewport: null,
};
const hostDB = 'https://free-rice-database.herokuapp.com';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger('Cronjob');

  constructor(
    private globalService: GlobalService,
  ) {}
    
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary() {
    const { status } = this.globalService.getRunJobVocabulary();
    if (!status && this.globalService.getJob() == '0') {
      console.log("Chạy job-------------------------------------------------");
      this.globalService.setRunJobVocabulary({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau10@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary1() {
    const { status } = this.globalService.getRunJobVocabulary1();
    if (!status && this.globalService.getJob() == '1') {
      console.log("Chạy job 1-------------------------------------------------");
      this.globalService.setRunJobVocabulary1({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary1({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau12@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary1({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary1();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary1();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary1({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary2() {
    const { status } = this.globalService.getRunJobVocabulary2();
    if (!status && this.globalService.getJob() == '2') {
      console.log("Chạy job 2-------------------------------------------------");
      this.globalService.setRunJobVocabulary2({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary2({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau13@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary2({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary2();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary2();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary2({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary3() {
    const { status } = this.globalService.getRunJobVocabulary3();
    if (!status && this.globalService.getJob() == '3') {
      console.log("Chạy job 3-------------------------------------------------");
      this.globalService.setRunJobVocabulary3({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary3({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau14@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary3({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary3();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary3();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary3({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary4() {
    const { status } = this.globalService.getRunJobVocabulary4();
    if (!status && this.globalService.getJob() == '4') {
      console.log("Chạy job 4-------------------------------------------------");
      this.globalService.setRunJobVocabulary4({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary4({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau15@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary4({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary4();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary4();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary4({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary5() {
    const { status } = this.globalService.getRunJobVocabulary5();
    if (!status && this.globalService.getJob() == '5') {
      console.log("Chạy job 5-------------------------------------------------");
      this.globalService.setRunJobVocabulary5({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary5({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau16@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary5({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary5();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary5();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary5({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary6() {
    const { status } = this.globalService.getRunJobVocabulary6();
    if (!status && this.globalService.getJob() == '6') {
      console.log("Chạy job 6-------------------------------------------------");
      this.globalService.setRunJobVocabulary6({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary6({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau17@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary6({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary6();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary6();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary6({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary7() {
    const { status } = this.globalService.getRunJobVocabulary7();
    if (!status && this.globalService.getJob() == '7') {
      console.log("Chạy job 7-------------------------------------------------");
      this.globalService.setRunJobVocabulary7({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary7({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau18@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary7({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary7();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary7();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary7({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary8() {
    const { status } = this.globalService.getRunJobVocabulary8();
    if (!status && this.globalService.getJob() == '8') {
      console.log("Chạy job 8-------------------------------------------------");
      this.globalService.setRunJobVocabulary8({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary8({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau19@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);
            
            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary8({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary8();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary8();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary8({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary9() {
    const { status } = this.globalService.getRunJobVocabulary9();
    if (!status && this.globalService.getJob() == '9') {
      console.log("Chạy job 9-------------------------------------------------");
      this.globalService.setRunJobVocabulary9({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary9({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau20@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary9({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary9();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary9();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary9({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary10() {
    const { status } = this.globalService.getRunJobVocabulary10();
    if (!status && this.globalService.getJob() == '10') {
      console.log("Chạy job 10-------------------------------------------------");
      this.globalService.setRunJobVocabulary10({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary10({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau21@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary10({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary10();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary10();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary10({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary11() {
    const { status } = this.globalService.getRunJobVocabulary11();
    if (!status && this.globalService.getJob() == '11') {
      console.log("Chạy job 11-------------------------------------------------");
      this.globalService.setRunJobVocabulary11({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary11({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau26@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary11({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary11();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary11();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary11({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary12() {
    const { status } = this.globalService.getRunJobVocabulary12();
    if (!status && this.globalService.getJob() == '12') {
      console.log("Chạy job 12-------------------------------------------------");
      this.globalService.setRunJobVocabulary12({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary12({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau27@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary12({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary12();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary12();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary12({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary13() {
    const { status } = this.globalService.getRunJobVocabulary13();
    if (!status && this.globalService.getJob() == '13') {
      console.log("Chạy job 13-------------------------------------------------");
      this.globalService.setRunJobVocabulary13({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary13({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau28@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary13({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary13();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary13();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary13({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary14() {
    const { status } = this.globalService.getRunJobVocabulary14();
    if (!status && this.globalService.getJob() == '14') {
      console.log("Chạy job 14-------------------------------------------------");
      this.globalService.setRunJobVocabulary14({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary14({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau32@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary14({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary14();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary14();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary14({ status: false, browser: null });
    }
  }

  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary15() {
    const { status } = this.globalService.getRunJobVocabulary15();
    if (!status && this.globalService.getJob() == '15') {
      console.log("Chạy job 15-------------------------------------------------");
      this.globalService.setRunJobVocabulary15({ status: true });

      try {
        const browser = await puppeteer.launch(configPuppeterr);
        this.globalService.setRunJobVocabulary15({ browser });

        const page: Page = await browser.newPage();
        await page.setBypassCSP(true);
        await page.goto('https://freerice.com/profile-login', {waitUntil: 'load', timeout: 60000});
        await page.waitForXPath("//*[normalize-space(text())='Save']", { timeout: 10000 });
        const saveBtn = await page.$x("//*[normalize-space(text())='Save']");
        await page.evaluate((el) => el?.click(), saveBtn[0]);
        
        await page.waitForSelector("input[name='username']", { timeout: 10000 });
        await page.type("input[name='username']", 'tranphanchau39@gmail.com');
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", 'kissmenow');
        await page.waitForXPath("//*[normalize-space(text())='Log in']", { timeout: 10000 });
        const loginBtn = await page.$x("//*[normalize-space(text())='Log in']");
        await page.evaluate((el) => el?.click(), loginBtn[0]);
        await page.waitForNavigation({ timeout: 60000 });
        
        await page.goto('https://freerice.com/categories/english-vocabulary', {waitUntil: 'load', timeout: 60000});
        let questionOld, answerTextOld;
        do {
          await page.waitForXPath("//div[contains(@class, 'card-title')]", { timeout: 10000 });
          const question = await page.$x("//div[contains(@class, 'card-title')]");
          const questionText = await page.evaluate((el) => el?.textContent, question[0]);
          if (questionText === questionOld) continue;

          const answers = await page.evaluate((el) => {
            const result = [];
            const list = document.querySelectorAll('div.card-button');
            
            for (let i=0; i<list.length; i++) {
              result.push(list[i].textContent);
            }
            return result;
          });

          if (questionText) {
            let findAnswer, err;
            do {
              [err, findAnswer] = await to(axios.get(`${hostDB}/vocabulary?filter=question||$eq||${questionText}&filter=answer||$in||${answers.join(',')}`));
            } while (err?.message);

            const { data } : { data: any[] } = findAnswer;
            if (data?.length > 0) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${data[0].answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${data[0].answer}"]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);
            } else {
              console.log("Chưa tìm thấy câu trả lời!");
  
              // tự đánh câu trả lời
              await page.waitForXPath(`//div[contains(@class, 'card-button')]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//div[contains(@class, 'card-button')]`);
              await page.evaluate((el) => el?.click(), answerBtn[0]);

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText) {
                console.log("Đã thêm 1 từ vựng!");
  
                await to(axios.post(`${hostDB}/vocabulary`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
            }
          }
          questionOld = questionText;
          this.globalService.setRunJobVocabulary15({ status: true });
          await page.waitForTimeout(2500);
        } while (true);
      } catch (err) {
        this.logger.log({handleVocabulary: err.message});
        const {browser} = this.globalService.getRunJobVocabulary15();
        if (browser) await browser.close();
      }
      const {browser} = this.globalService.getRunJobVocabulary15();
      if (browser?.process() != null) browser?.process().kill('SIGINT');
      this.globalService.setRunJobVocabulary15({ status: false, browser: null });
    }
  }

  @Cron("*/20 * * * *")
  async handleVocabularyClose() {
    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary1();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary1({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary2();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary2({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary3();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary3({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary4();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary4({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary5();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary5({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary6();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary6({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary7();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary7({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary8();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary8({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary9();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary9({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary10();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary10({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary11();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary11({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary12();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary12({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary13();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary13({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary14();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary14({ status: false, browser: null });
      }
    }

    if (true) {
      const { browser } = this.globalService.getRunJobVocabulary15();

      if (browser) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary15({ status: false, browser: null });
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleVocabularyError() {
    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary1();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary1({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary2();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary2({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary3();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary3({ status: false, browser: null });
      }
    }
	
	if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary4();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary4({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary5();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary5({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary6();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary6({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary7();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary7({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary8();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary8({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary9();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary9({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary10();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary10({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary11();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary11({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary12();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary12({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary13();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary13({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary14();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary14({ status: false, browser: null });
      }
    }

    if (true) {
      const { updatedAt, browser } = this.globalService.getRunJobVocabulary15();

      if (browser && (moment().valueOf() - moment(updatedAt).valueOf()) > 300000) {
        if (browser) await browser.close();
        if (browser?.process() != null) browser?.process().kill('SIGINT');
        this.globalService.setRunJobVocabulary15({ status: false, browser: null });
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCallHeroku() {
    await to(axios.get('https://free-rice-api.herokuapp.com/job/0'));
    await to(axios.get('https://free-rice-api-1.herokuapp.com/job/1'));
    await to(axios.get('https://free-rice-api-2.herokuapp.com/job/2'));
    await to(axios.get('https://free-rice-api-3.herokuapp.com/job/3'));
    await to(axios.get('https://free-rice-api-4.herokuapp.com/job/4'));
    await to(axios.get('https://free-rice-api-5.herokuapp.com/job/5'));
    await to(axios.get('https://free-rice-api-6.herokuapp.com/job/6'));
    await to(axios.get('https://free-rice-api-7.herokuapp.com/job/7'));
    await to(axios.get('https://free-rice-api-8.herokuapp.com/job/8'));
    await to(axios.get('https://free-rice-api-9.herokuapp.com/job/9'));
    await to(axios.get('https://free-rice-api-10.herokuapp.com/job/10'));
    await to(axios.get('https://free-rice-api-11.herokuapp.com/job/11'));
    await to(axios.get('https://free-rice-api-12.herokuapp.com/job/12'));
    await to(axios.get('https://free-rice-api-13.herokuapp.com/job/13'));
    await to(axios.get('https://free-rice-api-14.herokuapp.com/job/14'));
    await to(axios.get('https://free-rice-api-15.herokuapp.com/job/15'));
  }
}
