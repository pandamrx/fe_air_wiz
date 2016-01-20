import React from 'react';
import ReactDOM from 'react-dom';
import DatepickerComponent from './components/DatepickerComponent.jsx';


ReactDOM.render(<DatepickerComponent onSelect={(e) => {console.log(e)}}/>, document.getElementById('datepicker'));