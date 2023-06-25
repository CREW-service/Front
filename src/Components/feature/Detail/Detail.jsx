import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import DOMPurify from "dompurify"; // DOMPurify 라이브러리 가져오기
import AuthApi from "shared/api";
import { personTypeAtom, boatAtom } from "Recoil/recoilAtoms";

import { useRecoilState } from "recoil";
import Captaindetail from "./Captaindetail";
import Crewdetail from "./Crewdetail";
import Otherpeople from "./Otherpeople";

function Detail() {
  const [renderTrigger, setRenderTrigger] = useState(false);

  const [cookies] = useCookies(["authorization"]);
  const config = {
    headers: {
      // 쿠키를 헤더에 추가
      authorization: cookies.authorization,
    },
  };

  const { id } = useParams();

  const [boat, setBoat] = useRecoilState(boatAtom);

  const [personType, setPersonType] = useRecoilState(personTypeAtom);

  const [isLoading, setIsLoading] = useState(true);

  const fetchBoat = async () => {
    try {
      const { data } = await AuthApi.getBoatDetail(id, config);
      // console.log("data", data);
      setBoat(data);
      setPersonType(data.personType);
      console.log("data", data);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching post:", error);
      setIsLoading(false);
    }
  };

  const renderTriggerHandler = () => {
    setRenderTrigger(!renderTrigger);
  };

  useEffect(() => {
    fetchBoat();
  }, [renderTrigger]);

  let componentToRender;

  if (isLoading) {
    componentToRender = <div>Loading...</div>;
  } else if (personType === "captain") {
    componentToRender = (
      <Captaindetail
        boat={boat}
        boatId={id}
        renderTriggerHandler={renderTriggerHandler}
      />
    );
  } else if (personType === "crew") {
    componentToRender = (
      <Crewdetail
        boat={boat}
        boatId={id}
        renderTriggerHandler={renderTriggerHandler}
      />
    );
  } else {
    componentToRender = <Otherpeople boat={boat} />;
  }

  return <div>{componentToRender}</div>;
}

export default Detail;
