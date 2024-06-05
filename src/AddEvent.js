import React from "react";
import { TextField, Button, Box } from "@material-ui/core";

class AddEvent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            item: { title: "" },
            isButtonDisabled: true, // 널 값 처리  
        };
        this.add = props.add;
    }

    onInputChange = (e) => {
        const thisItem = this.state.item;
        thisItem.title = e.target.value;
        this.setState({
            item: thisItem,
            isButtonDisabled: e.target.value.trim() === "", // 널 값 처리
        });
    }

    onButtonClick = () => {
        this.add(this.state.item);
        this.setState({
            item: { title: "" },
            isButtonDisabled: true, // 널 값 처리
        });
    }

    enterKeyEventHandler = (e) => {
        if (e.key === 'Enter' && !this.state.isButtonDisabled) { // 널 값 처리
            this.onButtonClick();
        }
    }

    render() {
        return (
            <Box display="flex" justifyContent="center" margin={2}>
                <Box display="flex" alignItems="center" style={{ width: '100%', maxWidth: 600 }}>
                    <TextField
                        placeholder="Add Event here"
                        onChange={this.onInputChange}
                        value={this.state.item.title}
                        onKeyPress={this.enterKeyEventHandler}
                        style={{ flex: 1, marginRight: 8 }} // flex로 확장하고 오른쪽 마진 추가
                    />
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={this.onButtonClick}
                        disabled={this.state.isButtonDisabled} // 널 값 처리
                    >
                        +
                    </Button>
                </Box>
            </Box>
        );
    }
}

export default AddEvent;



