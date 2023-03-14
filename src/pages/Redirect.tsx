import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/auth-context';

export default function Redirect() {
  const { token } = useAuth();
  if (!token) return <Navigate to={'/login'} />;
  else return <Navigate to={'/meet'} />;
}
