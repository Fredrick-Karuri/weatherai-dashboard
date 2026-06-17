
export type WeatherResponse = {
  location?: string;
  temp?: number;
  temp_c?: number;
  condition?: string;
  summary?: string;
};

export type HourlyResponse = {
  hours?: { time: string; temp: number }[];
};
