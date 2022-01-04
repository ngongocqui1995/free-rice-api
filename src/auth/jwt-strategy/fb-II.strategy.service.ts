import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from "passport-facebook";

@Injectable()
export class FacebookStrategyII extends PassportStrategy(Strategy, "facebookII") {
  constructor() {
    super({
      clientID: process.env.FB_APP_ID_II,
      clientSecret: process.env.FB_APP_SECRET_II,
      callbackURL: `${process.env.SERVER_REDIRECT_URL}facebook/app-2/redirect`,
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