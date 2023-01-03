export interface Suburb {
    blockId: string;
    subName: string;
    municipalityId: number;
}

export interface Municipality {
    Suburbs: Suburb[];
}

export interface StageInfoModel {
    blockId: number;
    stage: number;
    dayOfMonth: Date;
    start: string;
    end: string;
}