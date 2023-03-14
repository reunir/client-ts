import React, { useEffect } from "react";
import { useAuth } from "./context/auth-context";
import { setAxiosDefault, setToken } from "./axiosDefault";
import Loading from "./components/Loading";
import { Route, Routes } from "react-router-dom";
import NotFound from "./pages/404";
import { SignupProvider } from "./context/signup-context";
import { setUserAvatar } from "./utils/generateAvatar";
import Meet from "./pages/Meet";
import useUIMode from "./hooks/setMode";
import MeetOutlet from "./pages/MeetOutlet";
import Global from "./components/Global";
import JoinMeet from "./pages/JoinMeet";
import CreateMeetMiddleware from "./pages/CreateMeetMiddleware";
import JoinMeetMiddleware from "./pages/JoinMeetMiddleware";
import Whiteboard from "./pages/Whiteboard";

const Signup = React.lazy(() => import("./pages/Signup"));
const Login = React.lazy(() => import("./pages/Login"));
const Redirect = React.lazy(() => import("./pages/Redirect"));
function App() {
  const { token, getUserData, user } = useAuth();
  useUIMode();
  useEffect(() => {
    setAxiosDefault();
    if (token) {
      console.log(token);
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
            <Route path="/wb" element={<Whiteboard />} />
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
              <Route
                path="/meet/__create/"
                element={<CreateMeetMiddleware />}
              />
              <Route path="/meet/__join" element={<JoinMeetMiddleware />} />
              <Route path="/meet/:id" element={<Meet />} />
            </Route>
            <Route path="/" element={<Redirect />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      )}
    </React.Suspense>
  );
}

export default App;
