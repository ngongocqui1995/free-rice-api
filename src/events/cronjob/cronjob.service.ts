import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GlobalService } from 'src/common/global.service';
import { Connection, In } from 'typeorm';
import { Page } from 'puppeteer';
import { VocabularyService } from 'src/modules/vocabulary/vocabulary.service';
import { Vocabulary } from 'src/modules/vocabulary/entities/vocabulary.entity';
import * as moment from 'moment';

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

@Injectable()
export class CronjobService {
  private readonly logger = new Logger('Cronjob');

  constructor(
    private connection: Connection,
    private globalService: GlobalService,
    private vocabularyService: VocabularyService
  ) {}
    
  @Cron(CronExpression.EVERY_5_SECONDS)
  async handleVocabulary() {
    const { status } = this.globalService.getRunJobVocabulary();
    if (!status) {
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
            const findAnswer = await this.vocabularyService.findOne({ where: { question: questionText, answer: In(answers) } });
            if (findAnswer) {
              console.log("Tìm thấy câu trả lời.");
  
              await page.waitForXPath(`//*[normalize-space(text())="${findAnswer.answer}"]`, { timeout: 10000 });
              const answerBtn = await page.$x(`//*[normalize-space(text())="${findAnswer.answer}"]`);
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
  
                await this.vocabularyService.createBase({
                  question: String(questionText).trim(),
                  answer: String(answerText).trim()
                } as Vocabulary);

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
}
