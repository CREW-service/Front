import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Alerticon from "imgs/alret_ic_1.png";
import Alerthaveicon from "imgs/alret_ic_2.png";
import { isLoginAtom } from "Recoil/recoilAtoms";
import { useRecoilValue } from "recoil";
import { io } from "socket.io-client";

const getAuthorizationCookieValue = () => {
  const name = "authorization=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(";");

  for (let i = 0; i < cookieArray.length; i += 1) {
    let cookie = cookieArray[i];
    while (cookie.charAt(0) === " ") {
      cookie = cookie.substring(1);
    }
    if (cookie.indexOf(name) === 0) {
      return cookie.substring(name.length, cookie.length);
    }
  }
  return null;
};

const socket = io(process.env.REACT_APP_BACKEND_SERVER_URL, {
  withCredentials: true,
  extraHeaders: {
    authorization: getAuthorizationCookieValue() || "",
  },
});

function Alarmdropdown() {
  const [alarms, setAlarms] = useState([]);
  const [haveAlarms, setHaveAlarms] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const recoilIsLogin = useRecoilValue(isLoginAtom);
  const isLogin = recoilIsLogin || !!getAuthorizationCookieValue();
  // const socket = useSocket();
  
  const haveAlarmHandler = () => {
    const result = alarms.length > 0;
    return result;
  };

  useEffect(() => {
    if(!isLogin) {
      setAlarms([])
    }

    if(isLogin&&!socket.connected){
      socket.on("connect", async () => {
        socket.emit("alarms");
      });

      socket.on("alarmList", async (data) => {
        const alarm = await data.data;
        setAlarms(alarm);
      });
    }

    return () => {
      socket.off("disconnect");
    };
  },[isLogin]);

  useEffect(() => {
    setHaveAlarms(haveAlarmHandler());
  }, [alarms]);

  const modalHandler = () => {
    setShowModal(!showModal);
  };

  const alarmReadHandler = async (alarmId) => {
    if (!socket.connected) {
      socket.once("connect", () => {
        socket.emit("alarms");
      });
    }

    socket.emit("alarmRead", alarmId);

  };

  return (
      <StAlarmButton type="button" onClick={modalHandler}>
        <StImg src={haveAlarms ? Alerthaveicon : Alerticon} alt="알림 아이콘" />
        {showModal && haveAlarms ? (
          <StModalOverlay>
            <StModalContainer>
              {alarms?.map((alarm) => (
                <StAlarmTextBox key={alarm.alarmId} isRead={alarm.isRead}>
                  <StAlarmText
                    type="button"
                    onClick={() => alarmReadHandler(alarm.alarmId)}
                  >
                    {alarm.message}
                  </StAlarmText>
                </StAlarmTextBox>
              ))}
            </StModalContainer>
          </StModalOverlay>
        ) : null}
      </StAlarmButton>
  );
}

export default Alarmdropdown;

const StAlarmButton = styled.button`
  padding: 0;
  background: #fff;
  border: 0;
  position: relative;

  width: 44px;
  height: 44px;
`;

const StModalOverlay = styled.div`
  margin-top: 5px;
  position: absolute;
  top: 115%;
  /* left: 100%; */
  right: -75%;
  /* bottom: 0; */
  background-color: rgba(255, 255, 255, 0);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 228px;
  z-index: 1000;
`;

const StModalContainer = styled.div`
  border-radius: 10px;
  width: 210px;
  max-height: 280px;
  overflow-y: auto;
  padding: 16px;
  background: #fff;
  box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column-reverse;
`;

const StAlarmTextBox = styled.div`
  margin: 8px 0 4px 0;
  min-height: 34px;
  border-bottom: solid 1px #b1dcff;
  color: var(--gr-black, #222);
  text-overflow: ellipsis;
  /* white-space: nowrap; */

  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  /* Body/M */
  font-size: 14px;
  font-family: Pretendard;
  font-weight: 500;
  line-height: 20px;
`;

const StAlarmText = styled.button`
  border: 0;
  background: rgba(255, 255, 255, 0); /* 투명한 백그라운드 컬러 */
`;

const StImg = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
