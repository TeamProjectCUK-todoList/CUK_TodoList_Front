import React from "react";
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton, withStyles } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import './App.css';

// CSS 변수 값을 가져오는 함수
const getCSSVariableValue = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable);

// Custom styled Checkbox
const CustomCheckbox = withStyles({
  root: {
    color: getCSSVariableValue('--secondary-color').trim(), // 기본 상태 테두리 색상
    '&:hover': {
      backgroundColor: getCSSVariableValue('--checkbox-hover-bg').trim(), // 마우스 커서가 체크박스 위에 위치했을 때
    },
  },
  checked: {
    color: `${getCSSVariableValue('--checked-bg-color').trim()} !important`, // 체크된 상태의 테두리 색상
  },
  indeterminate: {
    color: getCSSVariableValue('--default-white').trim(),
  },
})((props) => <Checkbox color="default" {...props} />);

class Todo extends React.Component {
  constructor(props) {
    super(props);
    this.state = { item: props.item, readOnly: true };
    this.delete = props.delete;
    this.update = props.update;
  }

  deleteEventHandler = () => {
    this.delete(this.state.item);
  }

  offReadOnlyMode = () => {
    this.setState({ readOnly: false });
  }

  enterKeyEventHandler = (e) => {
    if (e.key === "Enter") {
      this.setState({ readOnly: true });
      this.update(this.state.item);
    }
  }

  editEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.title = e.target.value;
    this.setState({ item: thisItem });
  }

  checkboxEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.done = !thisItem.done;
    this.setState({ readOnly: true });
    this.update(this.state.item);
  }

  render() {
    const item = this.state.item;
    return (
      <ListItem>
        <CustomCheckbox
          checked={item.done}
          onChange={this.checkboxEventHandler}
        />
        <ListItemText>
          <InputBase
            inputProps={{ "aria-label": "naked", readOnly: this.state.readOnly }}
            type="text"
            id={item.id}
            name={item.id}
            value={item.title}
            multiline={true}
            fullWidth={true}
            onClick={this.offReadOnlyMode}
            onChange={this.editEventHandler}
            onKeyPress={this.enterKeyEventHandler}
            style={{ textDecoration: item.done ? 'line-through' : 'none' }}
          />
        </ListItemText>

        <ListItemSecondaryAction>
          <IconButton aria-label="delete" onClick={this.deleteEventHandler}>
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Todo;
