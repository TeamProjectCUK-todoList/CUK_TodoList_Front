import React from "react";
import { signin } from "./service/ApiService";
import { Button, TextField, Grid, Link, Container, Typography } from "@material-ui/core";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: ''
        };
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();
        const data = new FormData(event.target);
        const email = data.get("email");
        const password = data.get("password");
        
        console.log("로그인");
        // 널 값 처리
        if ((email === "") || (password === "")) {
            alert("아이디 및 비밀번호를 확인해주세요");
        } else {
            signin({ email: email, password: password })
                .then((response) => {
                    console.log("Login successful:", response);
                })
                .catch((error) => {
                    console.error("Login error:", error);
                    this.setState({ error: '로그인 정보가 올바르지 않습니다.' });
                });
        }
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <Grid container spacing={2}>
                    <Typography component="h1" variant="h5">
                        로그인
                    </Typography>
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
                        <Grid item>
                            <Link href="/signup" variant="body2">
                                계정이 없습니까? 여기서 가입하세요.
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </Container>
        );
    }
}

export default Login;
