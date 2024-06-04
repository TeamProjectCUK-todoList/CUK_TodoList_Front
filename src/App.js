import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import Event from './Event';
import AddEvent from './AddEvent';
import MyCalendar from './components/Calendar';
import { Paper, List, Container, Grid, Button, AppBar, Toolbar, Typography, Box, IconButton, ListItem, ListItemText } from "@material-ui/core";
import { ArrowBack, ArrowForward } from '@material-ui/icons';
import './App.css';
import { call, signout } from './service/ApiService';
import { format, addDays, startOfMonth, differenceInDays, startOfToday } from 'date-fns';
import { toDate, toZonedTime } from 'date-fns-tz';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      eventItems: [],
      loading: true,
      date: new Date(),
      todoDates: [],
      eventDates: [],
      allEventItems: [],  // 모든 이벤트를 저장
      activeStartDate: startOfMonth(new Date())
    };
  }

  // Todo 관련
  addTodo = (item) => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    const newItem = { ...item, date: formattedDate };
    call("/todo", "POST", newItem).then(() => this.loadTodosByDate(date));
  }

  deleteTodo = (item) => {
    call("/todo", "DELETE", item).then(() => this.loadTodosByDate(this.state.date));
  }

  updateTodo = (item) => {
    call("/todo", "PUT", item).then(() => this.loadTodosByDate(this.state.date));
  }

  // Event 관련  
  addEvent = (item) => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    const newItem = { ...item, date: formattedDate };
    call("/event", "POST", newItem).then(() => {
      this.loadEventsByDate(date);
      this.loadEvents();
    });
  }

  deleteEvent = (item) => {
    call("/event", "DELETE", item).then(() => {
      this.loadEventsByDate(this.state.date);
      this.loadEvents();
    });
  }

  updateEvent = (item) => {
    call("/event", "PUT", item).then(() => {
      this.loadEventsByDate(this.state.date);
      this.loadEvents();
    });
  }

  componentDidMount() {
    this.loadTodosByDate(this.state.date);
    this.loadEvents();
    this.loadEventsByDate(this.state.date);
  }

  handleDateChange = (days) => {
    this.setState((prevState) => {
      const newDate = addDays(prevState.date, days);
      this.loadTodosByDate(newDate);
      this.loadEventsByDate(newDate);
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
    }, () => {
      this.loadTodosByDate(date);
      this.loadEventsByDate(date);
    });
  }

  // Todo 관련
  loadTodosByDate = (date) => {
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/todo/${formattedDate}`, "GET", null).then((response) =>
      this.setState({ todoItems: response.data, loading: false })
    );

    call(`/todo`, "GET", null).then((response) => {
      const todoDates = response.data.map(todo => {
        const localDate = toZonedTime(todo.date, 'UTC');
        return format(localDate, 'yyyy-MM-dd');
      });
      this.setState({ todoDates });
    });
  }

  // 특정 날짜의 이벤트 로드
  loadEventsByDate = (date) => {
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/event/${formattedDate}`, "GET", null).then((response) =>
      this.setState({ eventItems: response.data, loading: false })
    );
  }

  // 모든 이벤트 로드
  loadEvents = () => {
    call(`/event`, "GET", null).then((response) => {
      this.setState({ allEventItems: response.data, loading: false });
      const eventDates = response.data.map(event => {
        const localDate = toZonedTime(event.date, 'UTC');
        return format(localDate, 'yyyy-MM-dd');
      });
      this.setState({ eventDates });
    });
  }

  // Calculate D-day for events
  calculateDDays = () => {
    const { allEventItems } = this.state;
    const today = startOfToday();
    return allEventItems
      .filter(event => event.done) // done이 true인 이벤트만 필터링
      .map(event => {
        const eventDate = new Date(event.date);
        const dDay = differenceInDays(eventDate, today);
        return { ...event, dDay };
      })
      .sort((a, b) => a.dDay - b.dDay); // D-day 기준으로 정렬
  }

  render() {
    const { date, todoItems, eventItems, loading, todoDates, eventDates, activeStartDate } = this.state;
    const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;

    // Calculate D-days for events
    const dDayEvents = this.calculateDDays();

    // Todo 관련
    const todoList = todoItems.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {todoItems.map((item, idx) => (
            <Todo item={item} key={item.id} delete={this.deleteTodo} update={this.updateTodo} />
          ))}
        </List>
      </Paper>
    );

    // Event 관련
    const eventList = eventItems.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {eventItems.map((item, idx) => (
            <Event item={item} key={item.id} delete={this.deleteEvent} update={this.updateEvent} />
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

    // D-day list for events
    const dDayList = dDayEvents.length > 0 && (
      <Paper style={{ margin: 16 }}>
        <List>
          {dDayEvents.map((event, idx) => (
            <ListItem key={event.id}>
              <ListItemText primary={`${event.title}: D-${event.dDay}`} />
            </ListItem>
          ))}
        </List>
      </Paper>
    );

    // Todo 관련
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
                  eventDates={eventDates} 
                  activeStartDate={activeStartDate} 
                />
                {dDayList}
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
                <AddTodo add={this.addTodo} />
                <div className='TodoList'>{todoList}</div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    );

    // Event 관련
    const eventListPage = (
      <div>
        <Container maxWidth="md">
          <Box mt={4}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
              </Grid>
              <Grid item xs={12} md={8}>
                <AddEvent add={this.addEvent} />
                <div className='EventList'>{eventList}</div>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    );

    const loadingPage = <h1>로딩중...</h1>
    const contentTodo = loading ? loadingPage : todoListPage;
    const contentEvent = loading ? loadingPage : eventListPage;

    return (
      <div className="App">
        {contentTodo}
        {contentEvent}
      </div>
    );
  }
}

export default App;
