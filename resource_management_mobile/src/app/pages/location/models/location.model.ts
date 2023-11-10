export interface locationResponse {
    statusCode: number,
    data: {
        locationInfo: locationData[],
        locationCount: number
    },
    message: string
}

export interface locationData {
    Location_ID: number,
    Description: string
}