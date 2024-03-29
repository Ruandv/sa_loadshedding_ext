
import eskomApi from "./service/eskom.service"
import LoggingService from "./service/logging.service";
import { Suburb } from "./interfaces/userDetails";
import StorageService from "./service/storage.service";
import { StorageKeys } from "./enums/storageKeys";
import { MessageTypes } from "./enums/messageTypes";
import SaLoadsheddingService from "./service/sa-loadshedding.service";

const eskomapi = eskomApi.getInstance();
const saLoadshedding = SaLoadsheddingService.getInstance();
var loggingService = LoggingService.getInstance();
var storageService = StorageService.getInstance();

function getRandomToken() {
    // E.g. 8 * 32 = 256 bits token
    var randomPool = new Uint8Array(32);
    crypto.getRandomValues(randomPool);
    var hex = '';
    for (var i = 0; i < randomPool.length; ++i) {
        hex += randomPool[i].toString(16);
    }
    return hex;
}
// Check whether new version is installed
if (typeof chrome.runtime.onInstalled !== 'undefined') {
    chrome.runtime.onInstalled.addListener(async (details) => {

        let status = "existing";
        const prevVersion = details.previousVersion ? details.previousVersion : '';
        const timestamp = new Date().toLocaleString();
        var token = getRandomToken();

        if (details.reason === "install") {
            status = MessageTypes.INSTALLED;
        } else if (details.reason === "update") {
            const newVersion = chrome.runtime.getManifest().version;
            if (prevVersion !== newVersion) {
                storageService.saveData(StorageKeys.showWhatsNew, true)
                storageService.saveData(StorageKeys.lastSelectedTab, "whatsNew");
                if (newVersion === "2.0.20") {
                }
            }
            token = await storageService.getData(StorageKeys.userToken)
            status = MessageTypes.UPDATED;
        }
        await storageService.saveData(StorageKeys.userToken, token)
        loggingService.LogToServer(status as MessageTypes, { message: status });
        chrome.runtime.setUninstallURL(`${LoggingService.getBase()}?userToken=${token}`);
        chrome.alarms.create("SyncStatus", { periodInMinutes: 20 })
        if (status === MessageTypes.INSTALLED) {
            chrome.tabs.create({ 'url': 'chrome://extensions/?options=' + chrome.runtime.id });
            storageService.saveData(StorageKeys.installedDate, timestamp)
            storageService
                .saveData(StorageKeys.suburbList, [] as Array<Suburb>);
            storageService.saveData(StorageKeys.defaultDays, 5);
        }
        else {
            storageService.saveData(StorageKeys.lastUpdated, timestamp)
        }
        await eskomapi.getStatus().then((status) => {
            if (status === 'NaN') {
                //     //go to the server and see if you can get the stage from there.
                //     saLoadshedding.getStatus().then(x => {
                //         storageService.saveData(StorageKeys.currentStage, x)
                //         updateIcon(x);
                //     })
            }
            else {
                storageService.saveData(StorageKeys.currentStage, status)
            }
        }).catch(err => loggingService.echo(err.message, null, null, "error"))
    });
}

chrome.alarms.onAlarm.addListener((x) => {
    switch (x.name) {
        case "SyncStatus":
            eskomapi.getStatus().then((status) => {
                if (status === 'NaN') {
                    //go to the server and see if you can get the stage from there.
                    // saLoadshedding.getStatus().then(x => {
                    //     storageService.saveData(StorageKeys.currentStage, x)
                    //     updateIcon(status);
                    // })
                }
                else {
                    storageService.saveData(StorageKeys.currentStage, status)
                    updateIcon(status);
                }
            }).catch(err => console.error(err))
            break;
        default:
            loggingService.echo(`You have an alarm that does nothing (${x.name})`, null, null, "warning")
    }
}

)
async function updateIcon(stageValue: number) {
    if (stageValue === undefined || stageValue < 0) {
        stageValue = 0;
    }

    chrome.action.setIcon({ path: `/images/${stageValue}.png` }, () => { /* ... */ });
}
export { }
