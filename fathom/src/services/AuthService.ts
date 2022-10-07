import IAuthService from "./interfaces/IAuthService";

export default class AuthService implements IAuthService {
  async authenticate(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
