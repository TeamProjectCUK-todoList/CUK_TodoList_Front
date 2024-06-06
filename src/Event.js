import React from "react";
import { ListItem, ListItemText, InputBase, Checkbox, ListItemSecondaryAction, IconButton } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

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
        <Checkbox
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

export default Event;
