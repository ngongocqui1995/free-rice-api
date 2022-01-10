import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GlobalService } from '../../common/global.service';
import { Browser, Page } from 'puppeteer';
import axios from 'axios';
import to from 'await-to-js';

const moment = require('moment');
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
const hostDB = 'https://free-rice-database.vercel.app';

@Injectable()
export class CronjobService {
  private readonly logger = new Logger('Cronjob');

  constructor(
    private globalService: GlobalService,
  ) {}
    
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary() {
    const { status } = this.globalService.getRunJobVocabulary();
    const { index, username, password } = this.globalService.getJob();
    if (!status) {
      console.log(`Chạy job ${index}-------------------------------------------------`);
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
        await page.type("input[name='username']", username);
        await page.waitForSelector("input[name='password']", { timeout: 10000 });
        await page.type("input[name='password']", password);
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

              let answerText;
              do {
                await page.waitForXPath("//div[contains(@class, 'correct')]", { timeout: 120000 });
                const answer = await page.$x("//div[contains(@class, 'correct')]");
                answerText = await page.evaluate((el) => el?.textContent, answer[0]);
              } while (answerText === answerTextOld);
  
              if (answerText !== data[0].answer) {
                console.log("Cập nhật 1 từ vựng!");
  
                await to(axios.patch(`${hostDB}/vocabulary/${data[0].id}`, {
                  "question": questionText,
                  "answer": answerText
                }));

                answerTextOld = answerText;
              }
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
    await to(axios.get('https://free-rice-api-16.herokuapp.com/job/16'));
    await to(axios.get('https://free-rice-api-17.herokuapp.com/job/17'));
    await to(axios.get('https://free-rice-api-18.herokuapp.com/job/18'));
    await to(axios.get('https://free-rice-api-19.herokuapp.com/job/19'));
    await to(axios.get('https://free-rice-api-20.herokuapp.com/job/20'));
    await to(axios.get('https://free-rice-api-21.herokuapp.com/job/21'));
    await to(axios.get('https://free-rice-api-22.herokuapp.com/job/22'));
    await to(axios.get('https://free-rice-api-23.herokuapp.com/job/23'));
    await to(axios.get('https://free-rice-api-24.herokuapp.com/job/24'));
    await to(axios.get('https://free-rice-api-25.herokuapp.com/job/25'));
    await to(axios.get('https://free-rice-api-26.herokuapp.com/job/26'));
    await to(axios.get('https://free-rice-api-27.herokuapp.com/job/27'));
    await to(axios.get('https://free-rice-api-28.herokuapp.com/job/28'));
    await to(axios.get('https://free-rice-api-29.herokuapp.com/job/29'));
    await to(axios.get('https://free-rice-api-30.herokuapp.com/job/30'));
    await to(axios.get('https://free-rice-api-31.herokuapp.com/job/31'));
  }
}
