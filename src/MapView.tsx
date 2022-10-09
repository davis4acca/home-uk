import React, { FC } from 'react';
import { css } from '@emotion/react';
import Map from 'react-map-gl';

export const MapView: FC = () => {
  return (
    <Map
      attributionControl={false}
      initialViewState={{
        longitude: -100,
        latitude: 40,
        zoom: 3.5
      }}
      style={{ width: '100%', height: '100%' }}
      mapboxAccessToken='pk.eyJ1Ijoidml0YWx5eCIsImEiOiJjajh6d3lqc3MyMXphMndxYTBvbjQyOGlsIn0.mAyh4lIwEISLk--bfoT0FA'
      mapStyle='mapbox://styles/mapbox/streets-v9'
    />
  );
};