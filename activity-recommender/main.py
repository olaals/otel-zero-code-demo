from fastapi import FastAPI
from pydantic import BaseModel

from recommender import get_recommendations

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
    result = get_recommendations(
        temperature=weather.temperature,
        apparent_temperature=weather.apparent_temperature,
        weather_code=weather.weather_code,
        wind_speed=weather.wind_speed,
        precipitation=weather.precipitation,
        is_day=weather.is_day,
    )
    return Recommendation(**result)


@app.get("/health")
def health():
    return {"status": "healthy"}
