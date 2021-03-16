import fetch from "node-fetch";

export const getLatLongFromAddress = async (address: string) => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.GOOGLE_API_KEY}`
    );
    if (!response.ok) {
      return false;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message);
    return false;
  }
};
