import React from 'react';
import { Card, CardMedia, CardContent, Typography, Box } from '@mui/material';

function CardAnime({ anime, modoDetalhe = false, onClick }) {
  if (!anime) return null;
  const info = anime.attributes;

  return (
    <Card
      sx={{
        bgcolor: '#000',
        color: '#fff',
        display: 'flex',
        flexDirection: modoDetalhe ? 'row' : 'column',
        gap: 2,
        p: 2,
        alignItems: 'center',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {info.posterImage?.medium && (
        <CardMedia
          component="img"
          image={info.posterImage.medium}
          alt={info.titles.en_jp}
          sx={{
            width: modoDetalhe ? 200 : '100%',
            height: modoDetalhe ? 300 : 200,
            objectFit: 'cover',
            borderRadius: 2,
          }}
        />
      )}
      <CardContent sx={{ flex: 1 }}>
        <Typography variant="h5" color="primary">
          {info.titles.en_jp}
        </Typography>
        {info.synopsis && modoDetalhe && (
          <Typography variant="body2" mt={2}>
            {info.synopsis}
          </Typography>
        )}
        {info.startDate && (
          <Typography variant="body1">
            <strong>Início:</strong> {info.startDate}
          </Typography>
        )}
        {info.endDate && (
          <Typography variant="body1">
            <strong>Fim:</strong> {info.endDate}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default CardAnime;
