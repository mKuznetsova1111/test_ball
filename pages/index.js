import React from 'react';
import PageDescription from "../components/baseComponents/head/pageDescription/PageDescription";
import defaultPage from "../constants/page-description";
import Main from "../components/main/Main";

export default function Home() {

  return (
    <div className="container">
      <PageDescription {...defaultPage}/>
      <Main/>
    </div>
  );
}

export async function getStaticProps() {
  return {
    props: {},
  };
}
