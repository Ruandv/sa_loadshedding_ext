export interface Suburb {
    blockId: string;
    subName: string;
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