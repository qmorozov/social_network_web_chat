import Head from 'next/head';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

interface IDocumentHead {
  title?: string;
  description?: string;
  keywords?: string | string[];
  image?: string;
}

const DocumentHead: React.FC<IDocumentHead> = ({
  title,
  description,
  keywords,
  image
}) => {
  const router = useRouter();
  const [location, setLocation] = useState('');

  useEffect(() => {
    setLocation(window.location.href);
  }, [router]);

  return (
    <Head>
      <title>{[title, 'chat'].filter(Boolean).join(' ')}</title>
      {description && (
        <>
          <meta name="twitter:description" content={description} />
          <meta name="description" content={description} />
          <meta property="og:description" content={description} />
        </>
      )}
      <meta itemProp="name" content={title} />
      <meta name="og:title" content={title} />
      <meta name="twitter:title" content={title} />
      <meta name="og:type" content="website" />
      <meta property="og:url" content={location} />

      {image && (
        <>
          <meta itemProp="image" content={image} />
          <meta name="image" content={image} />
          <meta name="og:image" content={image} />
          <meta name="twitter:image" content={image} />
        </>
      )}
      {keywords && (
        <meta
          name="keywords"
          content={Array.isArray(keywords) ? keywords.join(', ') : keywords}
        />
      )}
    </Head>
  );
};

export default DocumentHead;
