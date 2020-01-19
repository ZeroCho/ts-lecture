export {}
declare global {
    interface Window {
        hello: string;
    }
    interface Error {
        code?: any;
    }
}
