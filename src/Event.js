import React from "react";
import { ListItem, ListItemText, InputBase, Switch, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import DeleteOutlined from "@material-ui/icons/DeleteOutlined";

class Event extends React.Component {
  constructor(props) {
    super(props);
    this.state = { item: props.item, readOnly: true };  // 매개변수 item의 변수/값을 item에 대입
    this.delete = props.delete;
    this.update = props.update;
  }

  deleteEventHandler = () => {
    this.delete(this.state.item);
  }

  offReadOnlyMode = () => {
    this.setState({ readOnly: false }, () => {
      console.log("ReadOnly?", this.state.readOnly)
    });
  }

  enterKeyEventHandler = (e) => {
    if (e.key === "Enter") {
      this.setState({ readOnly: true })
      this.update(this.state.item);
    }
  }

  editEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.title = e.target.value;
    this.setState({ item: thisItem });
  }

  switchEventHandler = (e) => {
    const thisItem = this.state.item;
    thisItem.done = !thisItem.done;
    this.setState({ readOnly: true });
    this.update(this.state.item);
  }

  render() {
    const item = this.state.item;
    return (
      <ListItem>
        <Switch
          checked={item.done}
          onChange={this.switchEventHandler}
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
          />
        </ListItemText>

        <ListItemSecondaryAction>
          <IconButton aria-label="Delete"
            onClick={this.deleteEventHandler}>
            <DeleteOutlined />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }
}

export default Event;
