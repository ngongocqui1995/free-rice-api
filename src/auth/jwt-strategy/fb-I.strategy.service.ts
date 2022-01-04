import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategyI extends PassportStrategy(Strategy, "facebookI") {
  constructor() {
    super({
      clientID: process.env.FB_APP_ID_I,
      clientSecret: process.env.FB_APP_SECRET_I,
      callbackURL: `${process.env.SERVER_REDIRECT_URL}facebook/app-1/redirect`,
    });
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: (err: any, user: any, info?: any) => void
  ): Promise<any> {
    const payload = {
      profile,
      accessToken,
      refreshToken,
    };

    done(null, payload);
  }
}