import React from "react";
import { ListItem, ListItemText, InputBase, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import { Toggle } from "@fluentui/react";
import CloseIcon from "@material-ui/icons/Close";
import './App.css';

// CSS 변수 값을 가져오는 함수
const getCSSVariableValue = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable).trim();

class Event extends React.Component {
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

  toggleEventHandler = (e, checked) => {
    const thisItem = this.state.item;
    thisItem.done = checked;
    this.setState({ item: thisItem });
    this.update(this.state.item);
  }

  render() {
    const item = this.state.item;
    const toggleStyles = {
      root: {
        marginBottom: '8px',
      },
      pill: {
        backgroundColor: item.done ? getCSSVariableValue('--checked-bg-color') : getCSSVariableValue('--toggle-default-bg'),
        borderColor: item.done ? getCSSVariableValue('--checked-bg-color') : getCSSVariableValue('--toggle-default-bg'),
        ':hover': {
          backgroundColor: item.done ? getCSSVariableValue('--toggle-hover-bg') : getCSSVariableValue('--secondary-color'),
          borderColor: item.done ? getCSSVariableValue('--toggle-hover-bg') : getCSSVariableValue('--secondary-color'),
        },
      },
      thumb: {
        backgroundColor: item.done ? getCSSVariableValue('--default-white') : getCSSVariableValue('--default-white'),
        borderColor: item.done ? getCSSVariableValue('--default-white') : getCSSVariableValue('--default-white'),
      },
    };

    return (
      <ListItem>
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
          />
        </ListItemText>
        <div style={{ marginRight: '16px', marginTop: '8px' }}>
          <Toggle
            styles={toggleStyles}
            checked={item.done}
            onChange={this.toggleEventHandler}
          />
        </div>
        <ListItemSecondaryAction>
          <IconButton aria-label="delete" onClick={this.deleteEventHandler}>
            <CloseIcon />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Event;
