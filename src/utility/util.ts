export const isValidURL = (url : string) =>{
    try {
      new URL(url);
      return true;
    } catch (error) {
      return false;
    }
  }

export const getAddressFromLatLng = async (longitude : number, latitude : number) : Promise<NominatimReverseResponse> => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`;
  const resp  = await fetch(url)
  return await resp.json()
}

export interface NominatimReverseResponse {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  lat: string;
  lon: string;
  display_name: string;
  address: {
    city?: string;
    county?: string;
    state?: string;
    postcode?: string;
    country: string;
    country_code: string;
    // Additional fields may exist depending on the location
    [key: string]: string | undefined; // Allow for dynamic keys
  };
  boundingbox: [string, string, string, string];
}