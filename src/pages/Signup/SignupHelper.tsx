import { useSignup } from '../../context/signup-context';
import AcceptTCs from './AcceptTCs';
import FacerSetup from './FaceSetup';
import VoiceSetup from './VoiceSetup';
import YourProfile from './YourProfile';

export default function SignupHelper() {
  const { whichPart } = useSignup();
  if (whichPart === 0) {
    return <YourProfile />;
  } else if (whichPart === 2) {
    return <AcceptTCs />;
  } else if (whichPart === 1) {
    return <FacerSetup />;
  }
  // else if (whichPart === 2) {
  //   return <VoiceSetup />;
  // }
  return <></>;
}
