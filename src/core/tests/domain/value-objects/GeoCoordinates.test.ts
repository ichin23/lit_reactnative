
import { GeoCoordinates } from "../../../domain/value-objects/GeoCoordinates";

describe("GeoCoordinates", () => {
  it("should create valid geo coordinates", () => {
    const lat = 40.7128;
    const lon = -74.0060;
    const coords = GeoCoordinates.create(lat, lon);
    expect(coords).toBeInstanceOf(GeoCoordinates);
    expect(coords.latitude).toBe(lat);
    expect(coords.longitude).toBe(lon);
  });

  it("should throw an error for invalid latitude", () => {
    const invalidLat = 91;
    const lon = -74.0060;
    expect(() => GeoCoordinates.create(invalidLat, lon)).toThrow("Invalid geo coordinates");
  });

  it("should throw an error for invalid longitude", () => {
    const lat = 40.7128;
    const invalidLon = -181;
    expect(() => GeoCoordinates.create(lat, invalidLon)).toThrow("Invalid geo coordinates");
  });
});
