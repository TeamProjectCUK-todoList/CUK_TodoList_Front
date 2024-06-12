import React from "react";
import { TextField, Button, Box } from "@material-ui/core";
import './App.css';

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

export default AddTodo;


