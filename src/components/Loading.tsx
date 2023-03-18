import React from 'react';
import Lottie from 'lottie-react';
import loadingAnimation from '../../public/assets/loadingAnimation.json';

function Loading() {
  return (
    <div className='w-screen h-screen flex justify-center items-center bg-darkBackground'>
      <div className='w-32 h-32'>
        <Lottie
          animationData={loadingAnimation}
          loop={true}
          height={100}
          width={100}
        />
      </div>
    </div>
  );
}

export default Loading;
