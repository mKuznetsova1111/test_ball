import React from 'react';
import PageDescription from "../components/baseComponents/head/pageDescription/PageDescription";
import defaultPage from "../constants/page-description";
import Main from "../components/main/Main";
import {useLoadContent} from "../hooks/useLoadContent";

export default function Home() {
  useLoadContent();

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
