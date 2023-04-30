
export interface Suburb {
    blockId: string;
    name: string;
    municipalityId: number;
}
export interface Province {
    ProvinceId: number;
    ProvinceName: string;
    Municipalities: Municipality[];
}
export interface Municipality {
    Value: number;
    Text: string;
    Suburbs: Suburb[];
}

export interface StageInfoModel {
    blockId: number;
    stage: number;
    dayOfMonth: Date;
    start: string;
    end: string;
}