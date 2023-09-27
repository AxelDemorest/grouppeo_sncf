import React, {useEffect, useState} from 'react';
import styled from 'styled-components';

const SideModal = ({ children, isShowing, onClose }) => {

    useEffect(() => {
        if (isShowing) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'visible';
        };
    }, [isShowing]);

    return (
        <>
            <Modal isShowing={isShowing}>
                <Content>
                    <Close onClick={onClose}>X</Close>
                    <Body>
                        {children}
                    </Body>
                </Content>
            </Modal>
            <Overlay isShowing={isShowing} />
        </>
    );
};

const Modal = styled.div`
  position: fixed;
  width: 600px;
  top: 0;
  bottom: 0;
  background: #fff;
  right: ${props => props.isShowing ? '0' : '-600px'};
  transition: right 0.3s ease-out;
  z-index: 1000;
`;

const Content = styled.div`
  height: 100%;
  overflow-y: auto;
`;

const Close = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 28px;
  height: 28px;
  background: #fff;
  border-radius: 3px;
  border: 1px solid lightgray;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const Body = styled.div`
  padding: 30px;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: ${props => props.isShowing ? '1' : '0'};
  visibility: ${props => props.isShowing ? 'visible' : 'hidden'};
  transition: 0.3s ease-out;
  z-index: 999;
`;

export default SideModal;
