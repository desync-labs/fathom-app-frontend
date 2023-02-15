export default interface IAuthService{
    authenticate(): Promise<void>;
}