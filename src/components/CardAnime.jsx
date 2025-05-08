import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip
} from '@mui/material';

function CardAnime({ anime, modoDetalhe = false, onClick }) {
  if (!anime) return null;
  const info = anime.attributes;

  return (
    <Card
      onClick={onClick}
      sx={{
        width: modoDetalhe ? '100%' : 320,
        bgcolor: '#1a1a1a',
        display: 'flex',
        flexDirection: modoDetalhe ? 'row' : 'column',
        gap: 2,
        p: 2,
        alignItems: modoDetalhe ? 'flex-start' : 'left',
        cursor: onClick ? 'pointer' : 'default',
        color: '#fff',
      }}
    >
      {info.posterImage?.medium && (
        <CardMedia
          component="img"
          image={info.posterImage.medium}
          alt={info.titles.en_jp}
          sx={{
            width: modoDetalhe ? 220 : '100%',
            height: modoDetalhe ? 330 : 420, 
            objectFit: 'cover', 
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
            border: '1px solid rgba(255,255,255,0.05)',
            backgroundColor: '#000'
          }}
        />
      )}

      <CardContent sx={{ flex: 1, textAlign: modoDetalhe ? 'left' : 'center' }}>
        <Typography
          variant={modoDetalhe ? 'h4' : 'h6'}
          color="primary"
          gutterBottom
          noWrap={!modoDetalhe}
        >
          {info.titles.en_jp}
        </Typography>

        <Typography variant="body2" color="#fff" sx={{ textAlign: 'left' }}>
          <strong>Início:</strong> {info.startDate || '—'}
        </Typography>
        <Typography variant="body2" color="#fff" mb={modoDetalhe ? 2 : 0} sx={{ textAlign: 'left' }}>
          <strong>Fim:</strong> {info.endDate || '—'}
        </Typography>

        {modoDetalhe && (
          <>
            <Typography variant="body2" color="#fff" paragraph>
              {info.synopsis || 'Sem sinopse disponível.'}
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {info.averageRating && (
                <Chip label={`Rating: ${info.averageRating}%`} size="small" color="primary" />
              )}
              {info.episodeCount && (
                <Chip label={`Eps: ${info.episodeCount}`} size="small" color="primary" />
              )}
            </Box>
          </>
        )}
      </CardContent>
    </Card>
  );
}

export default CardAnime;
