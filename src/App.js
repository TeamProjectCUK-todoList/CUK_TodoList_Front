import React from 'react';
import Todo from './Todo';
import AddTodo from './AddTodo';
import Event from './Event';
import AddEvent from './AddEvent';
import MyCalendar from './components/Calendar';
import { Paper, List, Container, Grid, AppBar, Toolbar, Typography, Box, Button, IconButton, ListItem, ListItemText, Divider, Tooltip } from "@material-ui/core";
import { ArrowBack, ArrowForward, Delete as DeleteIcon } from '@material-ui/icons';
import './App.css';
import { call, signout } from './service/ApiService';
import { format, addDays, startOfMonth, differenceInDays, startOfToday } from 'date-fns';
import { toDate, toZonedTime } from 'date-fns-tz';
import ErrorBoundary from './ErrorBoundary';
import DDayIcon from './images/d_day_icon.png'; // D-Day 아이콘
import TodoIcon from './images/todo_icon.png'; // To-do 아이콘
import EventIcon from './images/event_icon.png'; // Event 아이콘

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todoItems: [],
      eventItems: [],
      loading: true,
      date: new Date(),
      activeStartDate: startOfMonth(new Date()),
      allEventItems: []
    };
  }

  // Todo 관련
  addTodo = (item) => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    const newItem = { ...item, date: formattedDate };
    call("/todo", "POST", newItem)
      .then(() => this.loadTodosByDate(date))
      .catch((error) => console.error("Failed to add todo:", error));
  }

  deleteTodo = (item) => {
    call("/todo", "DELETE", item)
      .then(() => this.loadTodosByDate(this.state.date))
      .catch((error) => console.error("Failed to delete todo:", error));
  }

  updateTodo = (item) => {
    call("/todo", "PUT", item)
      .then(() => this.loadTodosByDate(this.state.date))
      .catch((error) => console.error("Failed to update todo:", error));
  }

  deleteTodosByDate = () => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/todo/date/${formattedDate}`, "DELETE", null)
      .then(() => this.loadTodosByDate(date))
      .catch((error) => console.error("Failed to delete todos by date:", error));
  }

  // Event 관련  
  addEvent = (item) => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    const newItem = { ...item, date: formattedDate };
    call("/event", "POST", newItem)
      .then(() => {
        this.loadEventsByDate(date);
        this.loadEvents();
      })
      .catch((error) => console.error("Failed to add event:", error));
  }

  deleteEvent = (item) => {
    call("/event", "DELETE", item)
      .then(() => {
        this.loadEventsByDate(this.state.date);
        this.loadEvents();
      })
      .catch((error) => console.error("Failed to delete event:", error));
  }

  updateEvent = (item) => {
    call("/event", "PUT", item)
      .then(() => {
        this.loadEventsByDate(this.state.date);
        this.loadEvents();
      })
      .catch((error) => console.error("Failed to update event:", error));
  }

  deleteEventsByDate = () => {
    const { date } = this.state;
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/event/date/${formattedDate}`, "DELETE", null)
      .then(() => {
        this.loadEventsByDate(date);
        this.loadEvents();
      })
      .catch((error) => console.error("Failed to delete events by date:", error));
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
    call(`/todo/${formattedDate}`, "GET", null)
      .then((response) => this.setState({ todoItems: response.data, loading: false }))
      .catch((error) => console.error("Failed to load todos:", error));

    call(`/todo`, "GET", null)
      .then((response) => {
        const todoDates = response.data.map(todo => {
          const localDate = toZonedTime(todo.date, 'UTC');
          return format(localDate, 'yyyy-MM-dd');
        });
        this.setState({ todoDates });
      })
      .catch((error) => console.error("Failed to load todo dates:", error));
  }

  // 특정 날짜의 이벤트 로드
  loadEventsByDate = (date) => {
    const utcDate = toDate(date, { timeZone: 'UTC' });
    const formattedDate = format(utcDate, 'yyyy-MM-dd');
    call(`/event/${formattedDate}`, "GET", null)
      .then((response) => this.setState({ eventItems: response.data, loading: false }))
      .catch((error) => console.error("Failed to load events:", error));
  }

  // 모든 이벤트 로드
  loadEvents = () => {
    call(`/event`, "GET", null)
      .then((response) => {
        this.setState({ allEventItems: response.data, loading: false });
        const eventDates = response.data.map(event => {
          const localDate = toZonedTime(event.date, 'UTC');
          return format(localDate, 'yyyy-MM-dd');
        });
        this.setState({ eventDates });
      })
      .catch((error) => console.error("Failed to load all events:", error));
  }

  // Calculate D-day for events
  calculateDDays = () => {
    const { allEventItems = [] } = this.state; // allEventItems가 undefined일 경우 빈 배열을 사용
    const today = startOfToday();
    return allEventItems
      .filter(event => event.done) // done이 true인 이벤트만 필터링
      .map(event => {
        const eventDate = new Date(event.date);
        const dDay = differenceInDays(eventDate, today);
        return { ...event, dDay: dDay === 0 ? 'DAY' : dDay }; // 0일일 때 "DAY"로 표시
      })
      .sort((a, b) => a.dDay - b.dDay || (a.dDay === 'DAY' ? -1 : 1)); // D-day 기준으로 정렬
  }

  render() {
    const { date, todoItems, eventItems, loading, activeStartDate } = this.state;
    const formattedDate = `${date.getFullYear()}년 ${String(date.getMonth() + 1).padStart(2, '0')}월 ${String(date.getDate()).padStart(2, '0')}일`;

    const totalTodos = todoItems.length;
    const doneTodos = todoItems.filter(item => item.done).length;

    const totalEvents = eventItems.length;
  
    // Calculate D-days for events
    const dDayEvents = this.calculateDDays();
  
    // Todo 관련
    const todoList = todoItems.length > 0 && (
      <List>
        {todoItems.map((item, idx) => (
          <Todo item={item} key={item.id} delete={this.deleteTodo} update={this.updateTodo} />
        ))}
      </List>
    );
  
    // Event 관련
    const eventList = eventItems.length > 0 && (
      <List>
        {eventItems.map((item, idx) => (
          <Event item={item} key={item.id} delete={this.deleteEvent} update={this.updateEvent} />
        ))}
      </List>
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
      
      <Box style={{ margin: 16, width: '100%' }}>
        <Divider style={{ margin: '5px 0' }} />
        <Box className="section-title" style={{ margin: 5}}>
          <img src={DDayIcon} alt="icon" className="icon" />
          <Typography variant="h6" className="section-title-text">D-DAY</Typography>
        </Box>
        <List>
          {dDayEvents.map((event, idx) => (
            <ListItem key={event.id}>
              <ListItemText primary={`${event.title}: D-${event.dDay}`} />
            </ListItem>
          ))}
        </List>
      </Box>
    );
  
    const todoEventListPage = (
      <div>
        {navigationBar}
        <Container maxWidth="md">
          <Box mt={4}>
            <Grid container spacing={2}>
             {/* 캘린더 */} 
              <Grid item xs={12} md={6}>
                <Paper style={{ padding: 16, minHeight: '817px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <MyCalendar 
                    date={date} 
                    onDateChange={this.handleCalendarDateChange} 
                    activeStartDate={activeStartDate} 
                  />
              
                {/* D-Day 리스트 */}                  
                  {dDayList}
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper style={{ padding: 16, marginBottom: 16, height: 'auto', overflowY: 'auto', position: 'relative' }}>
                {/* 현재 날짜 */}
                  <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                    <IconButton onClick={() => this.handleDateChange(-1)}>
                      <ArrowBack />
                    </IconButton>
                    <Typography variant="h6" style={{ margin: '0 16px', whiteSpace: 'nowrap' }}>{formattedDate}</Typography>
                    <IconButton onClick={() => this.handleDateChange(1)}>
                      <ArrowForward />
                    </IconButton>
                  </Box>
                  <Box className="section-title">
                    <img src={TodoIcon} alt="icon" className="icon" />
                    <Typography variant="h6" className="section-title-text">TO-DO</Typography>
                  </Box>
                  <AddTodo add={this.addTodo} />
                {/* To-do 리스트 */}
                  <Box style={{ minHeight: '280px', overflowY: 'auto' }}>
                    {todoList}
                  </Box>

                  <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                  {/* To-do 진행 상황*/}
                    <Box ml="25px"> 
                      <Typography variant="body2" className="status-text">
                        Total: {totalTodos} Done: {doneTodos}
                      </Typography>
                    </Box>
                  {/* To-do 전체 삭제 */}
                    <Box mr="15px"> 
                      <Tooltip title="Delete All">
                        <IconButton
                          className="expandable-button"
                          onClick={this.deleteTodosByDate}
                        >
                          <DeleteIcon style={{ color: '#808080' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                {/* 구분선 */}
                  <Divider style={{ margin: '5px 0' }} />
                  <Box className="section-title">
                    <img src={EventIcon} alt="icon" className="icon" />
                    <Typography variant="h6" className="section-title-text">EVENT</Typography>
                  </Box>
                  <AddEvent add={this.addEvent} />
                {/* Event 리스트 */}
                  <Box style={{ minHeight: '150px', overflowY: 'auto' }}>
                    {eventList}
                  </Box>
                {/* Event 리스트 갯수 */}
                  <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box ml="25px"> 
                      <Typography variant="body2" className="status-text">
                        Total: {totalEvents}
                      </Typography>
                    </Box>
                  {/* Event 전체 삭제 */}
                    <Box mr="15px"> 
                      <Tooltip title="Delete All">
                        <IconButton
                          className="expandable-button"
                          onClick={this.deleteEventsByDate}
                        >
                          <DeleteIcon style={{ color: '#808080' }} />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </div>
    );
  
    const loadingPage = <h1>로딩중...</h1>
    const contentTodoEvent = loading ? loadingPage : todoEventListPage;
  
    return (
      <div className="App">
        <ErrorBoundary>
          {contentTodoEvent}
        </ErrorBoundary>
      </div>
    );
  }
}

export default App;
