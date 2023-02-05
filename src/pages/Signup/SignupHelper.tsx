import { useSignup } from '../../context/signup-context';
import YourProfile from './YourProfile';

export default function SignupHelper() {
  const { whichPart } = useSignup();
  if (whichPart === 0) {
    return <YourProfile />;
  }
  return <></>;
}
