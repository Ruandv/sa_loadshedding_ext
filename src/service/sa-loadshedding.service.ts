import { Municipality, StageInfoModel } from "../interfaces/userDetails";
import LoggingService from './logging.service';
export default class SaLoadsheddingService {

    private static service: SaLoadsheddingService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://sa-loadshedding-api.azurewebsites.net/api/Eskom";
    // private baseUrl = "https://localhost:44373/api/Eskom";

    private myHeaders = new Headers({
        //"accept": "application/json",
        'Access-Control-Allow-Origin': "*",
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        'Token': navigator.userAgent.toString(),
        "content-type": "application/json",
    });
    public searchSuburbData = async (municipalityId: number, searchValue: string) => {
        try {
            const municipalityRequest = new Request(`${this.baseUrl}/FindSuburb/?municipalityId=${municipalityId}&suburbname=${searchValue}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            return fetch(municipalityRequest)
                .then(x => x.json())
                .then(d => {
                    var m: Municipality = {} as Municipality;
                    m.Suburbs = d;
                    return m;
                });
        } catch (ex) {
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public getSuburbData = async (provinceId: number, municipality: number): Promise<Municipality> => {
        try {
            const municipalityRequest = new Request(`${this.baseUrl}/GetSuburbList/?provinceId=${provinceId}&municipalityId=${municipality}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            return fetch(municipalityRequest)
                .then(x => x.json())
                .then(d => {
                    var m: Municipality = {} as Municipality;
                    m.Suburbs = d;
                    return m;
                });
        } catch (ex) {
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public getSchedule = async (blockId: string, stage: number, days: number, municipalityId: number): Promise<StageInfoModel[]> => {
        const stageInfoRequest = new Request(`${this.baseUrl}/GetSchedule?blockId=${blockId}&days=${days}&stage=${stage}&municipalityId=${municipalityId}`, {
            method: 'Get',
            mode: 'cors',
            headers: this.myHeaders,
            cache: 'default',
            body: undefined
        })
        return fetch(stageInfoRequest)
            .then(x => {
                return x.json()
            })
            .then(d => {
                return d;
            })
            .catch((err) => {
                console.error("FETCH ERROR : " + err.message)
                this.loggingService.echo("Fetch Error", err.message, null, "error")
                throw err;
            });
    }

    public getMunicipalityList = async (provinceId: number): Promise<Municipality[]> => {
        try {
            const municipalityListRequest = new Request(`${this.baseUrl}/GetMunicipalityList?provinceId=${provinceId}`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            debugger;
            return fetch(municipalityListRequest)
                .then(x => {
                    return x.json()
                })
                .then(d => {
                    return d;
                })
                .catch((err) => {
                    console.error("FETCH ERROR : " + err.message)
                    this.loggingService.echo("Fetch Error", err.message, null, "error")
                    throw err;
                });
        } catch (ex) {
            debugger;
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public getStatus = async(): Promise<number>=>{
        try {
            const getStatusRequest = new Request(`${this.baseUrl}/GetStatus`, {
                method: 'Get',
                mode: 'cors',
                headers: this.myHeaders,
                cache: 'default',
                body: undefined
            })
            debugger;
            return fetch(getStatusRequest)
                .then(x => {
                    return x.json()
                })
                .then(d => {
                    return d;
                })
                .catch((err) => {
                    console.error("FETCH ERROR : " + err.message)
                    this.loggingService.echo("Fetch Error", err.message, null, "error")
                    throw err;
                });
        } catch (ex) {
            debugger;
            this.loggingService.echo("Fetch Error", (ex as any).message, null, "error")
            throw ex;
        }
    }

    public static getInstance() {
        if (!this.service) {
            this.service = new SaLoadsheddingService();
        }

        return this.service;
    }
}
