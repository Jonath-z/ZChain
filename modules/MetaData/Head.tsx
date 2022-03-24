import React from 'react'
import Head from 'next/head';

interface IProps{
  content: string
}

const MetaData = ({content}: IProps) => {
  return (
    <Head>
      <meta name="description" content={content} />
    </Head>
  );
}

export default MetaData;