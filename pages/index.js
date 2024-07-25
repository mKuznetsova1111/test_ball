import React from 'react';
import PageDescription from "../components/baseComponents/head/pageDescription/PageDescription";
import defaultPage from "../constants/page-description";
import Main from "../components/main/Main";
import {useSetData} from "../hooks/useLoadContent";

export default function Home() {
  useSetData();

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
