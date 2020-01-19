declare module 'connect-flash' {
    global {
      namespace Express {
        interface Request {
          flash(): { [key: string]: string[] };
  
          flash(message: string): any;
  
          flash(event: string, message: string): void;
        }
      }
    }
  
    import express = require('express');
  
    function flash(): express.RequestHandler;
  
    export default flash;
  }
  