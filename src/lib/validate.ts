export default function login_validate(values: {
  email: string;
  password: string | string[];
}) {
  const errors: any = {};

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 5 || values.password.length > 20) {
    errors.password = 'Must be greater than 5 and less than 20 characters long';
  } else if (values.password.includes(' ')) {
    errors.password = 'Invalid Password';
  }

  return errors;
}

export function register_validate(values: {
  username: string | string[];
  email: string;
  password: string | string[];
}) {
  const errors: any = {};

  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.includes(' ')) {
    errors.username = 'Invalid Username';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) {
    errors.email = 'Invalid email address';
  }

  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 5 || values.password.length > 20) {
    errors.password = 'Must be greater than 5 and less than 20 characters long';
  } else if (values.password.includes(' ')) {
    errors.password = 'Invalid Password';
  }

  return errors;
}
