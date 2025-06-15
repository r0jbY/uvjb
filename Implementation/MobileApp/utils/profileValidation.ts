export type FormErrors = {
  firstName: boolean;
  lastName: boolean;
  email: boolean;
  phoneNumber: boolean;
  address: boolean;
};

export type FormValidationResult =
  | { valid: true }
  | { valid: false; errors: FormErrors; message: string };

export const validateProfile = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  role: string;
  active: boolean
}): FormValidationResult => {
  const localErrors: FormErrors = {
    firstName: data.firstName.trim() === '',
    lastName: data.lastName.trim() === '',
    email: data.email.trim() === '',
    phoneNumber: data.phoneNumber.trim() === '',
    address: data.address.trim() === '',
  };

  const isEmailValid   = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email);
  const isPhoneValid   = /^\+?[0-9\s\-()]{6,20}$/.test(data.phoneNumber);
  const isNameValid    = (n: string) => /^[a-zA-Zà-ÿÀ-ß'’ -]{2,60}$/.test(n.trim());
  const isAddressValid = (a: string) => a.trim().length > 5;

  if (Object.values(localErrors).some(Boolean)) {
    return { valid: false, errors: localErrors, message: 'Please fill in all required fields.' };
  }
  if (!isNameValid(data.firstName))   return { valid: false, errors: localErrors, message: 'Please enter a valid first name.' };
  if (!isNameValid(data.lastName))    return { valid: false, errors: localErrors, message: 'Please enter a valid last name.'  };
  if (!isEmailValid)                  return { valid: false, errors: localErrors, message: 'Please enter a valid email.'       };
  if (!isPhoneValid)                  return { valid: false, errors: localErrors, message: 'Please enter a valid phone.'       };
  if (!isAddressValid(data.address))  return { valid: false, errors: localErrors, message: 'Please enter a valid address.'     };

  return { valid: true };
};
