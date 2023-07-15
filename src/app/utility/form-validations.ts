export const validateName = (data: string): boolean => {
  const reg = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return false;
    }
  }
  return true;
}

export const nameValidations = (data: string, controller: string) => {
  const reg = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `${controller} Special characters are not allowed`;
    }
  } else {
    return `Please enter your ${controller}`;
  }
  return '';
}

export const paypalFieldValidations = (data: string, controller: string) => {
  const reg = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `${controller} Special characters are not allowed`;
    }
  } else {
    return `Field can not be empty ${controller}`;
  }
  return '';
}

export const titleValidations = (data: string, controller: string) => {
  const reg = /^[A-Za-z0-9 ._-]+([A-Za-z0-9 ._-]+)*$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `${controller} special characters are not allowed`;
    }
  } else {
    return `Please enter the ${controller}`;
  }
  return '';
}

export const linkedinValidations = (data: string, controller: string) => {
  const reg = /https:\/\/[a-z]{2,3}\.linkedin\.com\/(mwlite\/|m\/)?([a-z]{2,5})\/[a-zA-Z0-9_.-]+\/?/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `Please enter the linkedIn url in this format: https://www.linkedin.com/in/user id/`;
    }
  } else {
    return `Please enter the link for your linkedIn profile`;
  }
  return '';
}


export const descriptionValidations = (data: string, controller: string) => {
  if (!data) {
    return `Please enter ${controller}`;
  }
  return '';
}

export const emailCompanyValidations = (data: string, controller: string) => {
  const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/g;
  data = data || '';
  const checkEmail = data.includes('gmail.com')
    || data.includes('yahoo.com')
    || data.includes('hotmail.com')
    || data.includes('outlook.com')
    || data.includes('yahoo.co.uk')
    || data.includes('yahoo.co.in')
    || data.includes('mail.com')
    || data.includes('live.in')
    || data.includes('live.com')
  if (data) {
    if (!reg.test(data.trim())) {
      if (checkEmail) {
        return `Please enter your work email`;
      } else {
        return `Please enter your proper work email`;
      }
    } else if (checkEmail) {
      return `Please enter your work email`;
    }
  } else {
    return `Please enter your ${controller}`;
  }
  return '';

}

export const normalPasswordValidations = (data: string, controller: string): any => {
  const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `${controller} should contain atleast one upper letter, one lower letter, one number and one special character. It should be between 6 and 16 characters`;
    } else {
      return "Please enter your password";
    }
  }
}

export const passwordValidations = (data: string, controller: string): any => {
  const reg = /^(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
  // /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/
  const numberReg = /(?=.*[0-9])/
  const upperCaseReg = /(?=.*[A-Z])/
  const lowerCaseReg = /(?=.*[a-z])/
  const specialCharReg = /(?=.*[!@#$%^&*])/
  var isresult: any = { number: true, upper: true, lower: true, specialChar: true, strLength: true };
  // 
  if (data) {
    if (numberReg.test(data.trim())) {
      isresult.number = false;
      // return `${controller} should contain atleast one upper letter, one lower letter, one number and one special character. It should be between 6 and 16 characters`;
    }
    if (upperCaseReg.test(data.trim())) {
      isresult.upper = false;
    }
    if (lowerCaseReg.test(data.trim())) {
      isresult.lower = false;
    }
    if (specialCharReg.test(data.trim())) {
      isresult.specialChar = false;
    }
    if (data.trim().length >= 6 && data.trim().length <= 16) {
      isresult.strLength = false;
    }
    return isresult;
  } else {
    return isresult;
  }
}

export const emialValidations = (data: string, controller: string) => {
  const reg = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w+)+$/g;
  if (data) {
    if (!reg.test(data.trim())) {
      return `Enter proper ${controller}`;
    }
  } else {
    return `Please enter your ${controller}`;
  }
  return '';
}

export const mobileNumberValidations = (data: string, controller: string) => {
  const reg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `The mobile number entered is not valid. Please check and enter the valid mobile number ${controller}`;
    }
  } else {
    return `Please enter ${controller}`;
  }
  return '';
}


export const allCountryMobileNumberValidations = (data: string, controller: string) => {
  const reg = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `The mobile number entered is not valid. Please check and enter the valid mobile number ${controller}`;
    }
  } else {
    return `Please enter ${controller}`;
  }
  return '';
}

export const numberValidations = (data: string, controller: string) => {
  const reg = /^[0-9]$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `The mobile number entered is not valid. Please check and enter the valid mobile number numbers only`;
    }
  } else {
    return `Please enter ${controller}`;
  }
  return '';
}

export const cardExpValidations = (data: string, controller: string) => {
  const reg = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
  if (data) {
    if (!reg.test(data.trim())) {
      return `Please enter MM/YY format`;
    }
  } else {
    return `Please enter ${controller}`;
  }
  return '';
}

export const countryCodeValidations = (data: string, controller: string) => {
  const reg = /^(\+?\d{1,3}|\d{1,4})$/
  if (data) {
    if (!reg.test(data.trim())) {
      return `The country code entered is not valid. Please check and enter the relevant country code`;
    }
  } else {
    return `Please enter ${controller}`;
  }
  return '';
}

