import { StorageKeys } from "../enums/storageKeys";
import LoggingService from "./logging.service";
export default class StorageService {
    private static service: StorageService;

    public static getInstance() {
        if (!this.service) {
            this.service = new StorageService();
        }

        return this.service;
    }

    private loggingService = LoggingService.getInstance();

    public saveData = async (key: StorageKeys, value: any) => {
        this.loggingService.echo("Save data ", key, { [key]: value }, "save");
        chrome.storage.local.set({ [key]: value })
        await this.printAllData();
    }

    public getData = async (key: StorageKeys) => {
        var res = await chrome.storage.local.get(key);
        this.loggingService.echo(`Getting data for ${key}`, key, res)
        return res[key];
    }

    public exportData = async () => {
        var items = await chrome.storage.local.get(null)
        var allKeys = Object.keys(items);
        var obj: any = [];
        allKeys.map(x => {
            obj.push({ [x]: items[x] })
        })
        // this.loggingService.echo("CURRENT STORAGE VALUES", null, obj, "success")
        return obj;
    }

    public printAllData = async () => {
        var items = await chrome.storage.local.get(null)
        var allKeys = Object.keys(items);
        var obj: any = [];
        allKeys.map(x => {
            obj.push({ [x]: items[x] })
        })
        this.loggingService.echo("CURRENT STORAGE VALUES", null, obj, "success")
    }
}
