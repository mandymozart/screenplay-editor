/** @jsxImportSource @emotion/react */
import React from "react";
import styled from "@emotion/styled";
import { Button, Menu } from "../asciicore-ui";

// Styled components
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const ModalContainer = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: white;
  padding: 0.3rem 0.5rem;
  z-index: 1000;
  box-shadow: 11px 11px 0px 0px rgba(0, 0, 0, 1);
`;

// ModalMenu Component
const ModalMenu = ({ menu, isVisible, onClose }) => {
  if (!isVisible) return null;

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <>
      <Overlay onClick={handleClose} />
      <ModalContainer>
        <Menu menu={menu} /><br />
        <Button onClick={handleClose}>Close</Button>
      </ModalContainer>
    </>
  );
};

export default ModalMenu;
