"use client";

import React from "react";
import { signIn } from "next-auth/react";
import { Box, Button, Container, Stack } from '@mui/material';
import { styled } from '@mui/material/styles';

const LogoImage = styled('img')({
  width: '24rem',
  height: 'auto',
});

const LoginContainer = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

function Login() {
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <LoginContainer>
      <Container maxWidth="sm">
        <Stack spacing={4} alignItems="center">
          <LogoImage
            src="https://drive.google.com/uc?export=download&id=1mxgawX_xUIKrIgiOpOb1MTwt8l2fXTaL"
            alt="logo"
          />
          <Button
            variant="contained"
            onClick={() => signIn("google")}
            size="large"
            sx={{
              fontSize: '1.875rem',
              fontWeight: 'bold',
              animation: 'pulse 2s infinite',
              '@keyframes pulse': {
                '0%, 100%': {
                  opacity: 1,
                },
                '50%': {
                  opacity: 0.7,
                },
              },
            }}
          >
            Sign In to use ChatGPT
          </Button>
          
          {isDevelopment && (
            <Button
              variant="outlined"
              onClick={() => signIn("development")}
              size="large"
            >
              Development Login (No Auth)
            </Button>
          )}
        </Stack>
      </Container>
    </LoginContainer>
  );
}

export default Login;
