import axios from "axios";

export const geocodeAddress = async (address) => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    console.error("Google Maps API key não encontrada no .env");
    return null;
  }

  const url = "https://maps.googleapis.com/maps/api/geocode/json";

  try {
    const response = await axios.get(url, {
      params: {
        address: address,
        key: apiKey,
      },
    });

    const data = response.data;

    if (data.status === "OK") {
      const { lat, lng } = data.results[0].geometry.location;
      return { latitude: lat, longitude: lng };
    } else {
      console.error("Erro na geocodificação:", data.status);
      return null;
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    return null;
  }
};
