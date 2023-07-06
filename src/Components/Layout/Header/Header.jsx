import React from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import Alarmdropdown from "Components/feature/Alarm/Alarmdropdown";
import Menu from "Components/feature/Menu/Menu";
import LOGO from "imgs/logo.png";

function Header() {
  const navigate = useNavigate();

  const onClickLogo = () => {
    navigate("/main");
  };

  return (
    <StContainer>
      <Menu />
      <StLogobox onClick={onClickLogo}>
        <StLogoImg src={LOGO} alt="LOGO" />
      </StLogobox>
      <Alarmdropdown />
    </StContainer>
  );
}

export default Header;

const StContainer = styled.div`
  display: flex;
  width: 100%;
  height: 64px;
  padding: 4px 20px;
  justify-content: center;
  align-items: center;
  gap: 64px;
  flex-shrink: 0;

  background: var(--gr-white, #fff);

  /* shadow1-appbar */
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.15);
`;

const StLogobox = styled.div`
  width: 86px;
  height: 31px;
  flex-grow: 0;
  font-family: ELAND Nice;
  font-size: 28px;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: center;
  color: #30a2ff;
`;

const StLogoImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
