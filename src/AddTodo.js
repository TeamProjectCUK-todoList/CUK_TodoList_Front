import React from "react";
import { TextField, Button, Box, makeStyles } from "@material-ui/core";
import './App.css';

// CSS 변수를 가져오는 함수
const getCSSVariableValue = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

const useStyles = makeStyles({
    underline: {
        '&:before': {
            borderBottom: `1px solid ${getCSSVariableValue('--secondary-color')}`, // 기본 언더라인 색상
        },
        '&:hover:not(.Mui-disabled):before': {
            borderBottom: `2px solid ${getCSSVariableValue('--default-black')}`, // 호버 시 언더라인 색상
        },
        '&:after': {
            borderBottom: `2px solid ${getCSSVariableValue('--primary-color')}`, // 포커스 시 언더라인 색상
        },
    },
});

class AddTodo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { title: "" },
            isButtonDisabled: true,
            isHovered: false
        };
        this.add = props.add;
    }

    onInputChange = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({
            item: thisItem,
            isButtonDisabled: e.target.value.trim() === "",
        });
    }

    onButtonClick = () => {
        this.add(this.state.item);
        this.setState({
            item: { title: "" },
            isButtonDisabled: true,
        });
    }

    enterKeyEventHandler = (e) => {
        if (e.key === 'Enter' && !this.state.isButtonDisabled) {
            this.onButtonClick();
        }
    }

    handleMouseEnter = () => {
        this.setState({ isHovered: true });
    }

    handleMouseLeave = () => {
        this.setState({ isHovered: false });
    }

    render() {
        const classes = this.props.classes;
        const { isButtonDisabled, isHovered } = this.state;
        
        const buttonClass = isButtonDisabled
            ? 'button-disabled'
            : (isHovered ? 'button-hovered' : 'button-enabled');

        return (
            <Box display="flex" justifyContent="center" margin={2}>
                <Box display="flex" alignItems="center" style={{ width: '100%', maxWidth: 600 }}>
                    <TextField
                        placeholder="Add Todo here"
                        onChange={this.onInputChange}
                        value={this.state.item.title}
                        InputProps={{
                            classes: {
                                underline: classes.underline,
                            },
                        }}
                        onKeyPress={this.enterKeyEventHandler}
                        style={{ flex: 1, marginRight: 8 }}
                    />
                    <Button
                        className={buttonClass}
                        variant="outlined"
                        onClick={this.onButtonClick}
                        disabled={this.state.isButtonDisabled}
                        onMouseEnter={this.handleMouseEnter}
                        onMouseLeave={this.handleMouseLeave}
                    >
                        +
                    </Button>
                </Box>
            </Box>
        );
    }
}

export default function WrappedAddTodo(props) {
    const classes = useStyles();
    return <AddTodo {...props} classes={classes} />;
}
