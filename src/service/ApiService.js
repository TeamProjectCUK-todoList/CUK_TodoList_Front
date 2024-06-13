import { API_BASE_URL } from "../app-config";

export function call(api, method, request) {
    let headers = new Headers({
        "Content-Type": "application/json",
    });

    const accessToken = localStorage.getItem("LOCAL_ACCESS_TOKEN");
    if (accessToken) {
        headers.append("Authorization", "Bearer " + accessToken);
    }

    let options = {
        headers: headers,
        method: method,
    };
    if (request) {
        options.body = JSON.stringify(request);
    }

    return fetch(API_BASE_URL + api, options)
        .then((response) => {
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.indexOf("application/json") !== -1) {
                return response.json().then((json) => {
                    if (!response.ok) {
                        return Promise.reject(json);
                    }
                    return json;
                });
            } else {
                return response.text().then((text) => {
                    if (!response.ok) {
                        return Promise.reject({ status: response.status, message: response.statusText });
                    }
                    return text;
                });
            }
        })
        .catch((error) => {
            alert("403 error???!")
            console.error("API call error:", error);
            if (error.status === 403) {
                window.location.href = "/login";
            }
            return Promise.reject(error);
        });
}

// 로컬 회원 로그인을 위한 API 서비스 메소드 signin
export function signin(userDTO) {
    return call("/auth/signin", "POST", userDTO)
        .then((response) => {
            if (response.token) {
                // local 스토리지에 토큰 저장
                localStorage.setItem("LOCAL_ACCESS_TOKEN", response.token);
                // token이 존재하는 경우 todo 화면으로 리디렉트
                window.location.href = "/";
            }
        })
        .catch((error) => {
            console.error("Signin ERROR:", error);
            alert("로그인 정보가 올바르지 않습니다.");
            return Promise.reject(error);
        });
}

// 로컬 회원 가입 요청
export function signup(userDTO) {
    return call("/auth/signup", "POST", userDTO)
        .then((response) => {
            if (response.id) {
                window.location.href = "/";
            }
        })
        .catch((error) => {
            console.error("Signup ERROR:", error);
            alert("회원 가입 중 오류가 발생했습니다.");
            return Promise.reject(error);
        });
}

// 구글 로그인 요청
export function googleSignin() {
    return call("/api/v1/oauth2/google", "POST")
        .then((response) => {
            if (typeof response === 'string') {
                console.error("Google Login URL return Sueccess", response);
                // 구글 로그인 URL로 리디렉트
                window.location.href = response;
                return Promise.resolve(response);
            } else {
                console.error("Google Signin ERROR: Invalid response type", response);
                alert("구글 로그인 중 오류가 발생했습니다.");
            }
        })
        .catch((error) => {
            console.error("Google Signin ERROR:", error);
            alert("구글 로그인 중 오류가 발생했습니다.");
            return Promise.reject(error);
        });
}

// 로그아웃
export function signout() {
    // local 스토리지에서 토큰 삭제
    localStorage.removeItem("ACCESS_TOKEN");
    window.location.href = "/login";
}
