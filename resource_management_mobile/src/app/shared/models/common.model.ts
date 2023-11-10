export interface statusResponse {
    statusCode: number,
    data: {
        statusInfo: statusData[],
    },
    message: string
}

export interface statusData {
    status_id: number,
    status_type: string,
    description: string
}

export interface stageResponse {
    statusCode: number,
    data: {
        stageInfo: stageData[],
    },
    message: string
}

export interface stageData {
    stage_id: number,
    description: string
}