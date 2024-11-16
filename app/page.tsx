"use client";

import { Box, Typography, Grid, Paper } from '@mui/material';
import LightbulbIcon from '@mui/icons-material/Lightbulb';

export default function Home() {
  return (
    <Box sx={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      p: 2
    }}>
      <Typography variant="h2" component="h1" sx={{ mb: 10 }}>
        ChatGPT
      </Typography>

      <Grid container spacing={2} sx={{ maxWidth: 'lg', justifyContent: 'center' }}>
        <Grid item xs={12} sm={4}>
          <Paper sx={{ p: 2, textAlign: 'center' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 2.5 }}>
              <LightbulbIcon sx={{ fontSize: 32, mb: 1 }} />
              <Typography variant="h6">Examples</Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                "Explain quantum computing in simple terms"
              </Paper>
              <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                "Got any creative ideas for a 10 year old's birthday?"
              </Paper>
              <Paper sx={{ p: 2, bgcolor: 'action.hover' }}>
                "How do I make an HTTP request in Javascript?"
              </Paper>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
