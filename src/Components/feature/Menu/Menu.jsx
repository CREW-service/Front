import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Modal from "react-modal";
import AuthApi from "shared/api";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { isLoginAtom } from "Recoil/recoilAtoms";
import { useRecoilState } from "recoil";
import MENUICON from "imgs/menu_ic.png";
import Kakaologin from "Components/feature/Kakaologin/Kakaologin";

function Menu() {
  const [isLogin, setIsLogin] = useRecoilState(isLoginAtom);
  const [cookies, , removeCookie] = useCookies(["authorization"]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isOutsideClicked, setIsOutsideClicked] = useState(false);

  const navigate = useNavigate();

  const logOutHandler = async () => {
    try {
      const { data } = await AuthApi.logOut();
      removeCookie("authorization"); // Remove the 'authorization' cookie
      setIsLogin(false);
      alert("로그아웃 했습니다.");
      navigate("/");
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

  const handleOutsideClick = (e) => {
    if (e.target === e.currentTarget) {
      setIsOutsideClicked(true);
    }
  };

  const handleClick = () => {
    window.open(
      "http://7z0w1.channel.io",
      "_blank",
      'rel="noopener noreferrer"'
    );
  };

  useEffect(() => {
    if (isOutsideClicked) {
      closeLoginModal();
      setIsOutsideClicked(false);
    }
  }, [isOutsideClicked]);

  useEffect(() => {
    if (!cookies.authorization) {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [cookies]);

  const handleButtonClick = () => {
    setIsModalOpen(!isModalOpen);
  };

  const openLoginModal = () => {
    setIsModalOpen(false);
    setIsLoginModalOpen(true);
  };

  const closeLoginModal = () => {
    setIsLoginModalOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {isModalOpen && (
        <StModalOverlay isOpen={isModalOpen} onClick={handleOutsideClick}>
          <StModalContainer>
            {isLogin ? (
              <StModalButton type="button" onClick={logOutHandler}>
                로그아웃
              </StModalButton>
            ) : (
              <StModalButton type="button" onClick={openLoginModal}>
                로그인
              </StModalButton>
            )}
            <StModalButton type="button" onClick={handleClick}>
              문의하기
            </StModalButton>
          </StModalContainer>
        </StModalOverlay>
      )}
      <StMenuButton type="button" onClick={handleButtonClick}>
        <StImg src={MENUICON} alt="메뉴 아이콘" />
      </StMenuButton>
      <Modal
        isOpen={isLoginModalOpen}
        onRequestClose={closeLoginModal}
        contentLabel="로그인"
        style={loginModalStyes}
      >
        {/* 새로운 모달 내용 */}
        <Kakaologin closeLoginModal={closeLoginModal} />
      </Modal>
    </div>
  );
}

const StMenuButton = styled.button`
  background: #fff;
  border: 0;
  width: 50px;
  height: 50px;
`;

const StImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  position: relative;
`;

const StModalOverlay = styled.div`
  position: absolute;
  top: 100%;
  left: -72%;
  /* right: 100%; */
  /* bottom: 0; */
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 228px;
  z-index: 700;

  /* 클릭 이벤트 처리 */
  pointer-events: ${({ isOpen }) => (isOpen ? "auto" : "none")};
`;

const loginModalStyes = {
  content: {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    border: "none",
    borderRadius: "10px",
    background: "#FFF",
    boxShadow: "0px 0px 6px 0px rgba(0, 0, 0, 0.2)",
    width: "300px",
    height: "264px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000, // Added z-index property
  },
};

const StModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* justify-content: center; */

  background: #fff;
  /* box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2); */
  height: calc(100vh - 120px);
  z-index: 800;
`;

const StModalButton = styled.button`
  width: 200px;
  padding: 20px 0 0 0;
  background: #fff;
  border: 0;

  color: var(--gr-black, #222);
  text-align: center;

  /* Title/L */
  font-size: 22px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 28px;

  /* border-top: 1px solid #989797; */
`;

export default Menu;
