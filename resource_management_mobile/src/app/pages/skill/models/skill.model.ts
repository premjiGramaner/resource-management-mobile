import { BaseResponce, skill } from 'src/app/core/base-model/base.model';

export interface skillResponce extends BaseResponce {
    data: {
        skillCount?: number;
        skillInfo: skill[];
    };
}

export interface skillPostResponce extends BaseResponce {
    data: {
        skillInfo: {
            category: string;
            description: string;
            skill_id?: number;
        };
    };
}

export interface skillData extends skill {
    id?: number;
}
