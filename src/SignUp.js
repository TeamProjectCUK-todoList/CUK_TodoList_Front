import React from "react";
import { Button, TextField, Link, Grid, Container, Typography, Paper } from "@material-ui/core";
import { signup } from "./service/ApiService";

class SignUp extends React.Component {
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
        const username = data.get("username");
        const email = data.get("email");
        const password = data.get("password");

        // 널 값 처리
        if ((username === "") || (email === "") || (password === "")) {
            alert("올바른 값을 입력해주세요.");
        } else {
            signup({ email: email, username: username, password: password })
                .then((response) => {
                    window.location.href = "/login";
                })
                .catch((error) => {
                    console.error("SignUp ERROR:", error);
                    this.setState({ error: '회원 가입 중 오류가 발생했습니다.' });
                });
        }
    }

    render() {
        return (
            <Container component="main" maxWidth="xs" style={{ marginTop: "8%" }}>
                <Paper elevation={3} style={{ padding: "50px" }}>
                    <form noValidate onSubmit={this.handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Typography component="h1" variant="h5" style={{ fontWeight: "bold", marginBottom: "16px" }} align="left">
                                    계정 생성
                                </Typography>
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="username"
                                    name="username"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="username"
                                    label="사용자 이름"
                                    autoFocus
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="email"
                                    name="email"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="이메일 주소"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="password"
                                    name="password"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="password"
                                    label="패스워드"
                                    type="password"
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
                                    계정 생성
                                </Button>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/login" variant="body2">
                                    이미 계정이 있습니까? 로그인 하세요.
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        );
    }
}

export default SignUp;
