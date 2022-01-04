export interface LoginRsp {
  readonly token: string;
  readonly message: Promise<any>;
}