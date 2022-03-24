import React from 'react'
import Head from 'next/head';

interface IProps{
  content: string
  title: string
}

const MetaData = ({content, title}: IProps) => {
  return (
    <Head>
      <meta name="description" content={content} />
      <title>{title}</title>
    </Head>
  );
}

export default MetaData;