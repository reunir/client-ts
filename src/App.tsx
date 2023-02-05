import React, { useEffect } from 'react';
import { useAuth } from './context/auth-context';
import { setAxiosDefault, setToken } from './axiosDefault';
import Loading from './components/Loading';
import { Route, Routes } from 'react-router-dom';
import NotFound from './pages/404';
import { SignupProvider } from './context/signup-context';
import { setUserAvatar } from './utils/generateAvatar';
import Meet from './pages/Meet';
import useUIMode from './hooks/setMode';
import MeetOutlet from './pages/MeetOutlet';
import Global from './components/Global';
import JoinMeet from './pages/JoinMeet';
import MeetMiddleware from './pages/MeetMiddleware';

const Signup = React.lazy(() => import('./pages/Signup'));
const Login = React.lazy(() => import('./pages/Login'));
const Redirect = React.lazy(() => import('./pages/Redirect'));
function App() {
  const { token, getUserData, user } = useAuth();
  setAxiosDefault();
  useUIMode();
  useEffect(() => {
    if (token) {
      setToken(token);
      getUserData();
    }
  }, []);
  return (
    <React.Suspense
      fallback={
        <div>
          <Loading />
        </div>
      }
    >
      {!token ? (
        <Routes>
          <Route element={<Global />}>
            <Route path="/login" element={<Login />} />
            <Route
              path="/signup"
              element={
                <SignupProvider>
                  <Signup />
                </SignupProvider>
              }
            />
            <Route path="*" element={<Redirect />} />
          </Route>
        </Routes>
      ) : (
        <Routes>
          <Route element={<Global />}>
            <Route path="/login" element={<Redirect />} />
            <Route path="/signup" element={<Redirect />} />
            <Route path="/meet" element={<JoinMeet />} />
            <Route element={<MeetOutlet />}>
              <Route path="/meet/__join/:id" element={<MeetMiddleware />} />
              <Route path="/meet/:id" element={<Meet />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </React.Suspense>
  );
}

export default App;
