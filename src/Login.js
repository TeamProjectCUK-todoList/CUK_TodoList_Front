import React from "react";
import { signin, googleSignin } from "./service/ApiService";
import { Button, TextField, Grid, Link, Container, Typography, Paper } from "@material-ui/core";
import GoogleIcon from './images/google-logo.png'; // 구글 아이콘 이미지 경로 설정
import './Login.css'; // 스타일 파일 추가

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleGoogleSignin = this.handleGoogleSignin.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get("email");
        const password = data.get("password");

        // 널 값 처리
        if ((email === "") || (password === "")) {
            alert("아이디 및 비밀번호를 확인해주세요");
        } else {
            signin({ email: email, password: password, provider: "LOCAL"})
                .then((response) => {
                    console.log("Login successful:", response);
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    this.setState({ error: '로그인 정보가 올바르지 않습니다.' });
                });
        }
    }

    handleGoogleSignin() {
        googleSignin()
            .then((response) => {
                alert("Google Login URL return Success", response);
            })
            .catch((error) => {
                console.error("Google Signin error:", error);
                this.setState({ error: '구글 로그인 중 오류가 발생했습니다.' });
            });
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <Paper elevation={3} style={{ padding: "50px" }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Typography component="h1" variant="h5" style={{ fontWeight: "bold", marginBottom: "16px" }} align="left">
                                로그인
                            </Typography>
                        </Grid>
                    </Grid>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일 주소"
                                    name="email"
                                    autoComplete="email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="password"
                                    label="패스워드"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                />
                            </Grid>
                            {this.state.error && (
                                <Grid item xs={12}>
                                    <Typography color="error" variant="body2">
                                        {this.state.error}
                                    </Typography>
                                </Grid>
                            )}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                >
                                    로그인
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                    <Grid container spacing={2} style={{ marginTop: "5px" }}>
                        <Grid item xs={12}>
                            <Button
                                className="google-btn"
                                onClick={this.handleGoogleSignin}
                                fullWidth
                                variant="contained"
                            >
                                <img src={GoogleIcon} alt="Google Icon" className="google-icon" />
                                Sign in with Google
                            </Button>
                        </Grid>
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                계정이 없습니까? 여기서 가입하세요.
                            </Link>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        );
    }
}

export default Login;
