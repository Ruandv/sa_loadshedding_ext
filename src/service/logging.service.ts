import { MessageTypes } from "../enums/messageTypes";
import { StorageKeys } from "../enums/storageKeys";
import { MyHeaders } from "../shared/common.headers";
import StorageService from "./storage.service";

export default class LoggingService {
  private static service: LoggingService;
  private static storageService: StorageService;
  private static appVersion: string;
  private static baseUrl = "https://sa-loadshedding-api.azurewebsites.net/api/Logging";
  //private static baseUrl = "https://localhost:44373/api/logging";

  public static getInstance() {
    if (!this.service) {
      this.service = new LoggingService();
      this.storageService = StorageService.getInstance();
      this.appVersion = chrome.runtime.getManifest().version;
    }

    return this.service;
  }

  public static getBase() {
    return this.baseUrl;
  }

  public echo(msg: string, str?: any, obj?: any, type?: 'warning' | 'error' | 'success' | 'save') {
    let strStyle = 'display:inline-block;background:#f1f3f7;color:black;padding:5px;margin:0 0 0 5px;border-radius:5px;';
    let style = 'display:inline-block;background:#ccd0da;color:black;padding:5px;border-radius:5px;';
    if (type === 'warning') {
      style = 'display:inline-block;background:#ffe000;color:black;padding:5px;border-radius:5px;';
    } else if (type === 'error') {
      style = 'display:inline-block;background:#c52525;color:white;padding:5px;border-radius:5px;';
    } else if (type === 'success') {
      style = 'display:inline-block;background:#7aa76b;color:white;padding:5px;border-radius:5px;';
    } else if (type === 'save') {
      style = 'display:inline-block;background:rgb(0, 106, 183);color:white;padding:5px;border-radius:5px;';
    }
    if (str) {
      console.log(
        `%c${msg}%c${str}`,
        style,
        strStyle
      );
    }
    if (obj) {
      console.log(
        `%c${msg}`,
        style,
        obj
      );
    }
    if (!str && !obj) {
      console.log(
        `%c${msg}`,
        style
      );
    }
  }

  public LogToServer(messageType: MessageTypes, msg: any) {
    try {

      LoggingService.storageService.getData(StorageKeys.userToken).then(t => {
        msg['userToken'] = t;
        msg['appVersion'] = LoggingService.appVersion;
        var requestMessage = {
          messageType: messageType,
          message: JSON.stringify(msg)
        }
        try {
          const loggingRequest = new Request(`${LoggingService.baseUrl}`, {
            method: 'Post',
            mode: 'cors',
            headers: MyHeaders.enableCors,
            cache: 'default',
            body: JSON.stringify(requestMessage)
          })
          return fetch(loggingRequest).then(async (res) => {
            var val = await res.text();
            return (parseInt(val) - 1).toString();
        });
        } catch (ex) {
          LoggingService.service.echo("Fetch Error", (ex as any).message, null, "error")
          throw ex;
        }
      })
    } catch (ex) {
      LoggingService.service.echo("LOG TO SERVER Error", (ex as any).message, null, "error")
      throw ex;
    }
  }
}