import { Municipality, StageInfoModel } from "../interfaces/userDetails";
import LoggingService from './logging.service';
export default class RuanService {

    private static service: RuanService;
    private loggingService = LoggingService.getInstance();

    private baseUrl = "https://eskom-calendar-api.azurewebsites.net/api/Eskom";
    // private baseUrl = "https://localhost:44373/api/Eskom";

    private myHeaders = new Headers({
        //"accept": "application/json",
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PATCH, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Origin, Content-Type, X-Auth-Token',
        "content-type": "application/json",
    });

    public getSuburbData = async (suburbId: number): Promise<Municipality> => {
        try {
            const municipalityRequest = new Request(`${this.baseUrl}/GetSuburbList/?municipalityId=${suburbId}`, {
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

    public getSchedule = async (blockId: string, stage: number, days: number,municipalityId:number): Promise<StageInfoModel[]> => {
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

    public static getInstance() {
        if (!this.service) {
            this.service = new RuanService();
        }

        return this.service;
    }
}
