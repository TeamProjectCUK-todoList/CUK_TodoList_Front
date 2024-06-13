import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { call } from './service/ApiService'; // ApiService의 call 함수를 가져옵니다.

const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = decodeURIComponent(params.get('name'));
    const email = params.get('googleEmail');

    alert("namen: " + name);
    alert("email: " + email);

    if (name && email) {
      alert("지금이니??????????????????????")
      // 서버에 토큰 검증 요청
      call("/api/validGoogleToken", "POST", { name, email })
        .then((response) => {
            if (response.token) {
                alert("새로운 토큰까지 받아왔니?")
                // local 스토리지에 토큰 저장
                localStorage.setItem("GOOGLE_ACCESS_TOKEN", response.token);
                // token이 존재하는 경우 todo 화면으로 리디렉트
                window.location.href = "/";
            }
           else {
            alert("반환은 했어?")
            console.error("Invalid token received.");
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Token validation error:", error);
          navigate("/login");
        });
    } else {
      console.error("No token or email found in URL");
      navigate("/login");
    }
  }, [location, navigate]);

  return (
    <div>
      <h2>Processing Google Login...</h2>
    </div>
  );
};

export default GoogleCallback;