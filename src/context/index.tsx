import { AuthProvider } from './auth-context';
import { AppProp } from '../types';
import { BrowserRouter } from 'react-router-dom';
export const AppProviders = (props: AppProp) => {
  return (
    <BrowserRouter>
      <AuthProvider>{props.children}</AuthProvider>
    </BrowserRouter>
  );
};
