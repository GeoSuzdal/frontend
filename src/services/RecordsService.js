import axios from "axios";

const apiEndpoint = import.meta.env.VITE_GEODATA_ENDPOINT;

export async function getPointData (record_id) {
    let query = `${apiEndpoint}/api/v1/records/${record_id}`
    let result = await axios.get(query).catch((e) => {
        return {}
    })
    switch (result.status) {
        case 200:
            return result.data
        default:
            return {}
    }
}