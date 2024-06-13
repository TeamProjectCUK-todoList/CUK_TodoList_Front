import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { call } from './service/ApiService'; // ApiService의 call 함수를 가져옵니다.
import './GoogleCallback.css';
const GoogleCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = decodeURIComponent(params.get('name'));
    const email = params.get('googleEmail');

    // alert("namen: " + name);
    // alert("email: " + email);

    if (name && email) {
    
      // 서버에 토큰 검증 요청
      call("/api/validGoogleToken", "POST", { name, email })
        .then((response) => {
            if (response.token) {
                console.log("새로운 토큰까지 받아왔다.")
                // local 스토리지에 토큰 저장
                localStorage.setItem("ACCESS_TOKEN", response.token);
                localStorage.setItem("userId", response.id);
                // token이 존재하는 경우 todo 화면으로 리디렉트
                window.location.href = "/";
            }
           else {
            console.log("새로운 토큰 못 받았다.")
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
    <div className="loading-container">
      <div className="spinner"></div>
      <h2 className="loading-text">구글 로그인 중입니다</h2>
    </div>
  );
};

export default GoogleCallback;