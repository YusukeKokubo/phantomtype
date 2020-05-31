import React from 'react'
import NextDocument from 'next/document'
import { Html, Head, Main, NextScript } from 'next/document'

export default class Document extends NextDocument {
  render() {
    return (
      <Html lang='en'>
        <Head />
        <body className='bg-black text-white'>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}