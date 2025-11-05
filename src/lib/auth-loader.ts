import { redirect } from 'react-router-dom';
import { getCurrentUser } from '@/services/auth/auth.service';

export const authLoader = async () => {
  try {
    // Try to get current user - cookies are sent automatically
    await getCurrentUser();
    return null; // User is authenticated
  } catch (error) {
    // User is not authenticated or cookies expired
    throw redirect('/login');
  }
};

export const publicLoader = async () => {
  try {
    // Check if user is already authenticated
    await getCurrentUser();
    // If successful, user is logged in - redirect to dashboard
    throw redirect('/');
  } catch (error) {
    // User is not authenticated - proceed to public route
    return null;
  }
};