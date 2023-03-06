import { createContext, useContext, useEffect, useState } from 'react';
import { AppProp, SignupObject, ModifiedSignupObject } from '../types';

type signupContextType = {
  formData: SignupObject;
  whichPart: number;
  updatePart: (part: number) => void;
  percentageCompleted: number;
  partTitle: string;
  isNextDisabled: boolean;
  updateIsNextDisabled: (bool: boolean) => void;
  updateFormData: (updatedObject: ModifiedSignupObject) => void;
};

const formDefaultData: SignupObject = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  phone: '',
  seed: '',
  stripe: '',
  backgroundColor: '',
  isEmailVerified: false,
};

const signupContextDefaultValues: signupContextType = {
  formData: formDefaultData,
  whichPart: 0,
  updatePart: (part: number) => {},
  percentageCompleted: 0,
  partTitle: '',
  isNextDisabled: true,
  updateIsNextDisabled: (bool: boolean) => {},
  updateFormData: (updatedObject: ModifiedSignupObject) => {},
};
export const SignupContext = createContext<signupContextType>(
  signupContextDefaultValues
);
SignupContext.displayName = 'SignupContext';

function SignupProvider(props: AppProp) {
  const partTitles = ['Your Profile', 'Accept terms and conditions'];
  const [formData, setFormData] = useState<SignupObject>(formDefaultData);
  const [whichPart, setwhichPart] = useState<number>(0);
  const [partTitle, setPartTitle] = useState<string>(partTitles[whichPart]);
  const [percentageCompleted, setpercentageCompleted] = useState<number>(
    Math.floor((whichPart / 2) * 100)
  );
  const [isNextDisabled, setisNextDisabled] = useState<boolean>(true);
  const updatePart = (part: number) => {
    setwhichPart(part);
    setPartTitle(partTitles[part]);
    setpercentageCompleted(Math.floor((part / 2) * 100));
  };
  const updateFormData = (updatedObject: ModifiedSignupObject) => {
    setFormData({ ...formData, ...updatedObject });
  };
  const updateIsNextDisabled = (bool: boolean) => {
    setisNextDisabled(bool);
  };

  const ifValidFormData = () => {
    let key: keyof typeof formData;
    for (key in formData) {
      if (formData[key] === '') {
        setisNextDisabled(false);
        return;
      }
    }
    setisNextDisabled(false);
  };
  useEffect(() => {
    ifValidFormData();
  }, [formData]);
  return (
    <SignupContext.Provider
      value={{
        formData,
        updateFormData,
        whichPart,
        updatePart,
        percentageCompleted,
        partTitle,
        isNextDisabled,
        updateIsNextDisabled,
      }}
      {...props}
    ></SignupContext.Provider>
  );
}
function useSignup() {
  const context = useContext(SignupContext);
  if (context === undefined) {
    throw new Error(`useAuth must be used within a AuthProvider`);
  }
  return context;
}
export { SignupProvider, useSignup };
