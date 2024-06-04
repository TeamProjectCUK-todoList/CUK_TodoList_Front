import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import MyCalendar from './components/Calendar';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, Box, IconButton } from "@material-ui/core";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import './App.css';
import { call, signout } from './service/ApiService';
import { format, addDays, startOfMonth } from 'date-fns';
import { toDate, toZonedTime } from 'date-fns-tz';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      loading: true,
      date: new Date(),
      todoDates: [],
      activeStartDate: startOfMonth(new Date())
    };
  }

  add = (item) => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    const newItem = { ...item, date: formattedDate };
    call("/todo", "POST", newItem).then(() => this.loadTodosByDate(date));
  }

  delete = (item) => {
    call("/todo", "DELETE", item).then(() => this.loadTodosByDate(this.state.date));
  }

  update = (item) => {
    call("/todo", "PUT", item).then(() => this.loadTodosByDate(this.state.date));
  }

  componentDidMount() {
    this.loadTodosByDate(this.state.date);
  }

  handleDateChange = (days) => {
    this.setState((prevState) => {
      const newDate = addDays(prevState.date, days);
      this.loadTodosByDate(newDate);
      return { 
        date: newDate, 
        activeStartDate: startOfMonth(newDate) 
      };
    });
  }

  handleCalendarDateChange = (date) => {
    this.setState({ 
      date,
      activeStartDate: startOfMonth(date) 
    }, () => this.loadTodosByDate(date));
  }

  loadTodosByDate = (date) => {
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/todo/${formattedDate}`, "GET", null).then((response) =>
      this.setState({ items: response.data, loading: false })
    );

    call(`/todo`, "GET", null).then((response) => {
      const todoDates = response.data.map(todo => {
        const localDate = toZonedTime(todo.date, 'UTC');
        return format(localDate, 'yyyy-MM-dd');
      });
      this.setState({ todoDates });
    });
  }

  render() {
    const { date, items, loading, todoDates, activeStartDate } = this.state;
    const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;

    const todoItems = items.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {items.map((item, idx) => (
            <Todo item={item} key={item.id} delete={this.delete} update={this.update} />
          ))}
        </List>
      </Paper>
    );

    const navigationBar = (
      <AppBar position='static'>
        <Toolbar>
          <Grid justify="space-between" container>
            <Grid item>
              <Typography variant='h6'>오늘의 할일</Typography>
            </Grid>
            <Grid item>
              <Button color="inherit" onClick={signout}>logout</Button>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar>
    );

    const todoListPage = (
      <div>
        {navigationBar}
        <Container maxWidth="md">
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <MyCalendar 
                  date={date} 
                  onDateChange={this.handleCalendarDateChange} 
                  todoDates={todoDates} 
                  activeStartDate={activeStartDate} 
                />
              </Grid>
              <Grid item xs={12} md={8}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                  <IconButton onClick={() => this.handleDateChange(-1)}>
                    <ArrowBack />
                  </IconButton>
                  <Typography variant="h6">{formattedDate}</Typography>
                  <IconButton onClick={() => this.handleDateChange(1)}>
                    <ArrowForward />
                  </IconButton>
                </Box>
                <AddTodo add={this.add} />
                <div className='TodoList'>{todoItems}</div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    );

    const loadingPage = <h1>로딩중...</h1>
    const content = loading ? loadingPage : todoListPage;

    return (
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
