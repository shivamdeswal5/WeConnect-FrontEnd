'use client';

import React from 'react';
import { Box, Button, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '@/firebase/firebase';

interface SignUpFormInputs {
  name: string;
  email: string;
  password: string;
}

const SignUpForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<SignUpFormInputs>();
  const router = useRouter();

  const onSubmit = async (data: SignUpFormInputs) => {
    try {
      // Create user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const user = userCredential.user;

      // Update Firebase display name
      await updateProfile(user, { displayName: data.name });

      const token = await user.getIdToken();

      const userData = {
        uid: user.uid,
        name: data.name,
        email: user.email || '',
        photoURL: user.photoURL || '',
      };

      // Sync to NestJS backend
      await fetch('http://localhost:4000/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      });

      // Store locally
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', token);

      toast.success(`Welcome, ${data.name}`);
      router.push('/dashboard');
    } catch (err) {
      toast.error('Signup failed');
      console.error(err);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8 }}>
      <Typography variant="h5" mb={3}>Sign Up</Typography>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TextField
          fullWidth label="Name" margin="normal"
          {...register('name', { required: 'Name is required' })}
          error={!!errors.name} helperText={errors.name?.message}
        />
        <TextField
          fullWidth label="Email" margin="normal"
          {...register('email', { required: 'Email is required' })}
          error={!!errors.email} helperText={errors.email?.message}
        />
        <TextField
          fullWidth label="Password" type="password" margin="normal"
          {...register('password', { required: 'Password is required' })}
          error={!!errors.password} helperText={errors.password?.message}
        />
        <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
          Create Account
        </Button>
      </form>
    </Box>
  );
};

export default SignUpForm;
