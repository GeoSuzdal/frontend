import axios from "axios";

const apiEndpoint = import.meta.env.VITE_GEODATA_ENDPOINT;

export async function getGeoJSONData () {
    let query = `${apiEndpoint}/api/v1/geojson/`
    console.log(query)
    let result = await axios.get(query)
    console.log(result.data)
    return result.data.geojson_obj
}