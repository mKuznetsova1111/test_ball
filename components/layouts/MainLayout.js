import React, {useMemo} from 'react';
import {header} from "../../constants/copyright";
import {node} from "prop-types";
import ModalProvider from "../baseComponents/controllers/modalController/ModalProvider";
import Preloader from "../baseComponents/gui/preloader/Preloader";

export default function MainLayout({children}) {
  return (
    <ModalProvider
      aliases={useMemo(() => ({
        // infoModal: {Modal: InfoModal, props: {message: "Lorem ipsum"}}
      }), [])}
    >
      <Preloader/>
      <div className={'main-container'}>
        <div className={'content-wrapper'}>{children}</div>
      </div>
    </ModalProvider>
  )
}

MainLayout.propTypes = {
  children: node,
};
