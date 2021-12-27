import axios from "axios";

export const reverseGeocode = async (longitude: any, latitude: any) => {
  const res = await axios.get(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitude},${latitude}.json?language=en&access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`
  );

  const { data } = res ?? {};
  const { features } = data ?? {};
  const { place_name } = features && features[0];
  //console.log(place_name?.split(", ").splice(-3).join(", "));
  return place_name?.split(", ").splice(-3).join(", ");
};
