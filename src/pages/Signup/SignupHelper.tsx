import { useSignup } from '../../context/signup-context';
import AcceptTCs from './AcceptTCs';
import VoiceAndFaceVerify from './VoiceAndFaceVerify';
import YourProfile from './YourProfile';

export default function SignupHelper() {
  const { whichPart } = useSignup();
  if (whichPart === 0) {
    return <YourProfile />;
  } else if (whichPart === 1) {
    return <AcceptTCs />;
  }
  return <></>;
}
