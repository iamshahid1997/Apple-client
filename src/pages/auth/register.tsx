import Head from 'next/head';
import Link from 'next/link';
import React, { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { HiAtSymbol, HiFingerPrint, HiOutlineUser } from 'react-icons/hi';
import { useFormik } from 'formik';
import { register_validate } from '../../lib/validate';
import { useMutation } from '@apollo/client';
import { REGISGTER_USER } from '../../queries';
import { signIn, useSession } from 'next-auth/react';
import Button from '@/components/Button';

function Register() {
  const { status } = useSession();
  const [signupError, setSignupError] = useState('');
  const [registerUser, { data, loading, error }] = useMutation(REGISGTER_USER);
  const formik = useFormik({
    initialValues: {
      username: '',
      email: '',
      password: '',
    },
    validate: (values) => register_validate(values),
    onSubmit,
  });

  async function onSubmit(values: any) {
    registerUser({
      variables: {
        registerInput: {
          username: values.username,
          email: values.email,
          password: values.password,
        },
      },
      onCompleted: (data) => {
        data.registerUser.code === 200 &&
          signIn('credentials', {
            id: data.registerUser.user._id,
            token: data.registerUser.user.token,
            callbackUrl: `${window.location.origin}`,
          });
        data.registerUser.code === 403 &&
          setSignupError(data.registerUser.message);
        !data && setSignupError('Something went wrong');
      },
    });
  }

  if (loading) return <h1>Loading...</h1>;
  if (error) return <div>{error.message}</div>;
  return (
    status === 'unauthenticated' && (
      <Layout>
        <Head>
          <title>Register</title>
        </Head>
        <section className='w-5/6 mx-auto flex flex-col gap-10'>
          <div className=''>
            <h1 className='text-gray-800 text-4xl font-bold py-4'>
              Keep Posting
            </h1>
            <p className='w-3/4 mx-auto text-gray-400'>
              Welcome to our webite.
            </p>
          </div>
          <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
            <div
              className={`${
                formik.errors.username && formik.touched.username
                  ? 'border-rose-500'
                  : ''
              } input_group`}
            >
              <input
                type='text'
                placeholder='Username'
                className='input_text'
                {...formik.getFieldProps('username')}
              />
              <span className='icon flex items-center px-4 text-gray-400 text-xl'>
                <HiOutlineUser />
              </span>
            </div>
            {formik.errors.username && formik.touched.username ? (
              <span className='flex justify-start text-rose-500 text-sm -mt-3'>
                {formik.errors.username}
              </span>
            ) : null}
            <div
              className={`${
                formik.errors.email && formik.touched.email
                  ? 'border-rose-500'
                  : ''
              } input_group`}
            >
              <input
                type='email'
                placeholder='Email'
                className='input_text'
                {...formik.getFieldProps('email')}
              />
              <span className='icon flex items-center px-4 text-gray-400 text-xl'>
                <HiAtSymbol />
              </span>
            </div>
            {formik.errors.email && formik.touched.email ? (
              <span className='flex justify-start text-rose-500 text-sm -mt-3'>
                {formik.errors.email}
              </span>
            ) : null}
            <div
              className={`${
                formik.errors.password && formik.touched.password
                  ? 'border-rose-500'
                  : ''
              } input_group`}
            >
              <input
                type='password'
                placeholder='Password'
                className='input_text'
                {...formik.getFieldProps('password')}
              />
              <span className='icon flex items-center px-4 text-gray-400 text-xl'>
                <HiFingerPrint />
              </span>
            </div>
            {formik.errors.password && formik.touched.password ? (
              <span className='flex justify-start text-rose-500 text-sm -mt-3'>
                {formik.errors.password}
              </span>
            ) : null}
            <div className='input_button'>
              <Button loading={loading} title='Register' width='w-full' />
            </div>
          </form>
          <p className='text-rose-500'>{signupError}</p>
          <div>
            <p className='text-center text-gray-400'>
              Already have an account?{' '}
            </p>
            <Link href='/auth/signin'>
              <p className='text-blue-700'>Sign In</p>
            </Link>
          </div>
        </section>
      </Layout>
    )
  );
}

export default Register;
