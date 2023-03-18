import Head from 'next/head';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Layout from '../../components/layout/Layout';
import { HiAtSymbol, HiFingerPrint } from 'react-icons/hi';
import { useFormik } from 'formik';
import login_validate from '../../lib/validate';
import { useMutation } from '@apollo/client';
import { signIn } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import Router from 'next/router';
import { USER_LOGIN } from '../../queries';
import Button from '@/components/Button';
import Image from 'next/image';

function Signin({}) {
  const { status, data: session } = useSession();
  console.log(session, status);
  const [loginError, setLoginError] = useState('');

  const [loginUser, { data, loading, error }] = useMutation(USER_LOGIN);
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validate: (values) => login_validate(values),
    onSubmit,
  });

  async function onSubmit(values: any) {
    loginUser({
      variables: {
        loginInput: {
          email: values.email,
          password: values.password,
        },
      },
      onCompleted: (data) => {
        data.loginUser.code === 200 &&
          signIn('credentials', {
            id: data.loginUser.user._id,
            token: data.loginUser.user.token,
          });
        data.loginUser.code === 404 && setLoginError(data.loginUser.message);
        data.loginUser.code === 401 && setLoginError(data.loginUser.message);
        !data && setLoginError('Something went wrong');
      },
    });

    if (loading) return <p></p>;
    if (error) return <p>{error.message}</p>;
  }
  return (
    status === 'unauthenticated' && (
      <Layout>
        <Head>
          <title>Login</title>
          <link rel='icon' href='/apple.ico' />
        </Head>
        <section className='w-5/6 mx-auto flex flex-col gap-10'>
          <div className=''>
            <div className='flex space-x-4 items-center justify-center'>
              <div className='relative h-10 w-5 cursor-pointer opacity-75 transition hover:opacity-100'>
                <img
                  src='https://rb.gy/vsvv2o'
                  // layout='fill'
                  // objectFit='contain'
                  className='object-contain'
                  alt={''}
                />
              </div>
              <h1 className='text-gray-800 text-4xl font-bold py-4'>Apple</h1>
            </div>

            <p className='w-3/4 mx-auto text-gray-400'>
              Welcome to our webite.
            </p>
          </div>
          <form className='flex flex-col gap-5' onSubmit={formik.handleSubmit}>
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
              <Button loading={loading} title='Login' width='w-full' />
            </div>
          </form>
          <p className='text-rose-500'>{loginError}</p>
          <div>
            <p className='text-center text-gray-400'>
              Don't have an account yet?{' '}
            </p>
            <Link href='/auth/register'>
              <p className='text-blue-700'>Register</p>
            </Link>
          </div>
        </section>
      </Layout>
    )
  );
}

export default Signin;
