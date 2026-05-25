import logging

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from recommender import get_recommendations

# Set root logger to DEBUG so logs reach the OTel LoggingHandler
# (added by opentelemetry-instrument auto-instrumentation).
# Don't use basicConfig(force=True) as it removes the OTel handler.
logging.getLogger().setLevel(logging.DEBUG)
logger = logging.getLogger(__name__)

app = FastAPI(title="Activity Recommender", version="1.0.0")


class WeatherInput(BaseModel):
    temperature: float
    apparent_temperature: float
    weather_code: int
    wind_speed: float
    precipitation: float
    is_day: int


class Recommendation(BaseModel):
    activities: list[str]
    clothing: list[str]
    summary: str


@app.post("/api/recommendations", response_model=Recommendation)
def recommend(weather: WeatherInput) -> Recommendation:
    logger.info(
        "Received recommendation request: temp=%.1f, feels_like=%.1f, weather_code=%d, wind=%.1f, precip=%.1f, is_day=%d",
        weather.temperature,
        weather.apparent_temperature,
        weather.weather_code,
        weather.wind_speed,
        weather.precipitation,
        weather.is_day,
    )

    if weather.temperature < 0:
        logger.error(
            "Temperature %.1f°C is below 0 — sub-zero recommendations not implemented",
            weather.temperature,
        )
        raise HTTPException(
            status_code=501,
            detail="Activity recommendations for temperatures below 0°C are not yet implemented",
        )

    result = get_recommendations(
        temperature=weather.temperature,
        apparent_temperature=weather.apparent_temperature,
        weather_code=weather.weather_code,
        wind_speed=weather.wind_speed,
        precipitation=weather.precipitation,
        is_day=weather.is_day,
    )
    recommendation = Recommendation(**result)

    logger.info(
        "Returning %d activities and %d clothing items",
        len(recommendation.activities),
        len(recommendation.clothing),
    )

    return recommendation


@app.get("/health")
def health():
    logger.debug("Health check called")
    return {"status": "healthy"}
