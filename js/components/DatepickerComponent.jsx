import React from 'react';


class DateUtilitiesClass {
    pad(value, length) {
        while (value.length < length)
            value = "0" + value;
        return value;
    }

    clone(date){
        return new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(),
            date.getMinutes(), date.getSeconds(), date.getMilliseconds());
    }

    toStringWithHour(date) {
        return date.getFullYear() + "-" + this.pad((date.getMonth()+1).toString(), 2) +
            "-" + this.pad(date.getDate().toString(), 2) + " " + this.toAMPMFormat(date);
    }

    toString(date) {
        return date.getFullYear() + "-" + this.pad((date.getMonth()+1).toString(), 2) +
            "-" + this.pad(date.getDate().toString(), 2);
    }

    toMonthAndYearString(date){
        let months = [
            "January", "February", "March",
            "April", "May", "June",
            "July", "August", "September",
            "October", "November", "December"
        ];
        return months[date.getMonth()] + " " + date.getFullYear();
    }

    isSameDay(first, second) {
        return first.getFullYear() === second.getFullYear() &&
            first.getMonth() === second.getMonth() &&
            first.getDate() === second.getDate();
    }

    isBefore(first, second) {
        return first.getTime() < second.getTime();
    }

    isAfter(first, second) {
        return first.getTime() > second.getTime();
    }

    toDayOfMonthString(date) {
        return DateUtilities.pad(date.getDate().toString());
    }

    moveToDayOfWeek(date, dayOfWeek) {
        while (date.getDay() !== dayOfWeek)
            date.setDate(date.getDate()-1);
        return date;
    }

    toAMPMFormat(date) {
        let hours = [12, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
            date_hour = date.getHours();
        return hours[(date_hour % 12)] + ":00 " + ((date_hour < 12) ? "AM" : "PM");
    }
}

let DateUtilities = new DateUtilitiesClass();

class MonthHeader extends React.Component{
    constructor(props){
        super(props);
        this.move = this.move.bind(this);
        this.enable = this.enable.bind(this);
        this.state = {
            view: DateUtilities.clone(this.props.view),
            enabled: true
        };
    }

    render() {
        let enabled = this.state.enabled;
        return React.createElement("div", {className: "month-header"},
            React.createElement("i", {className: (enabled ? "" : " disabled"), onClick: this.moveBackward.bind(this)},
                String.fromCharCode(9664)),
            React.createElement("span", null, DateUtilities.toMonthAndYearString(this.state.view)),
            React.createElement("i", {className: (enabled ? "" : " disabled"), onClick: this.moveForward.bind(this)},
                String.fromCharCode(9654))
        );
    }

    moveBackward() {
        let view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth()-1);
        this.move(view, false);
    }

    moveForward() {
        let view = DateUtilities.clone(this.state.view);
        view.setMonth(view.getMonth()+1);
        this.move(view, true);
    }

    move(view, isForward) {
        if (!this.state.enabled)
            return;

        this.setState({
            view: view,
            enabled: false
        });

        this.props.onMove(view, isForward);
    }

    enable() {
        this.setState({ enabled: true });
    }
}

class WeekHeader extends React.Component{
    render() {
        return React.createElement("div", {className: "week-header"},
            React.createElement("span", null, "Sun"),
            React.createElement("span", null, "Mon"),
            React.createElement("span", null, "Tue"),
            React.createElement("span", null, "Wed"),
            React.createElement("span", null, "Thu"),
            React.createElement("span", null, "Fri"),
            React.createElement("span", null, "Sat")
        );
    }
}

class Week extends React.Component{

    render() {
        let days = this.buildDays(this.props.start);
        let days_elements = [];
        for (let i = 0; i < days.length; i++) {
            let current_day = days[i];
            days_elements.push(
                React.createElement("div",
                    {
                        key: i,
                        onClick: this.onSelect.bind(this, current_day),
                        className: this.getDayClassName(current_day)
                    },
                    DateUtilities.toDayOfMonthString(current_day))
            )
        }

        return React.createElement("div", {className: "week"}, days_elements);
    }

    buildDays(start) {
        let days = [DateUtilities.clone(start)],
            clone = DateUtilities.clone(start);

        for (let i = 1; i <= 6; i++) {
            clone = DateUtilities.clone(clone);
            clone.setDate(clone.getDate()+1);
            days.push(clone);
        }
        return days;
    }

    isOtherMonth(day) {
        return this.props.month !== day.month();
    }

    getDayClassName(day) {
        let className = "day";
        if (DateUtilities.isSameDay(day, new Date()))
            className += " today";
        if (this.props.month !== day.getMonth())
            className += " other-month";
        if (this.props.selected && DateUtilities.isSameDay(day, this.props.selected))
            className += " selected";
        if (this.isDisabled(day))
            className += " disabled";
        return className;
    }

    onSelect(day) {
        if (!this.isDisabled(day))
            this.props.onSelect(day);
    }

    isDisabled(day) {
        let minDate = this.props.minDate,
            maxDate = this.props.maxDate;

        return (minDate && DateUtilities.isBefore(day, minDate)) || (maxDate && DateUtilities.isAfter(day, maxDate));
    }
}

class Weeks extends React.Component {
    constructor(props){
        super(props);
        this.onTransitionEnd = this.onTransitionEnd.bind(this);
        this.moveTo = this.moveTo.bind(this);
        this.state = {
            view: DateUtilities.clone(this.props.view),
            other: DateUtilities.clone(this.props.view),
            sliding: null
        };
    }

    componentDidMount() {
        this.refs.current.addEventListener("transitionend", this.onTransitionEnd.bind(this));
    }

    render() {
        return React.createElement("div", {className: "weeks"},
            React.createElement("div", {ref: "current", className: "current" +
            (this.state.sliding ? (" sliding " + this.state.sliding) : "")},
                this.renderWeeks(this.state.view)
            ),

            React.createElement("div", {ref: "other", className: "other" +
            (this.state.sliding ? (" sliding " + this.state.sliding) : "")},
                this.renderWeeks(this.state.other)
            )
        );
    }

    onTransitionEnd(){
        this.setState({
            sliding: null,
            view: DateUtilities.clone(this.state.other)
        });

        this.props.onTransitionEnd();
    }

    getWeekStartDates(view) {
        view.setDate(1);
        view = DateUtilities.moveToDayOfWeek(DateUtilities.clone(view), 0);

        let current = DateUtilities.clone(view);
        current.setDate(current.getDate()+7);

        var starts = [view],
            month = current.getMonth();

        while (current.getMonth() === month) {
            starts.push(DateUtilities.clone(current));
            current.setDate(current.getDate()+7);
        }

        return starts;
    }

    moveTo(view, isForward) {
        this.setState({
            sliding: isForward ? "left" : "right",
            other: DateUtilities.clone(view)
        });
    }

    renderWeeks(view) {
        let starts = this.getWeekStartDates(view),
            month = starts[1].getMonth();
        let starts_elements = [];
        for (let i = 0; i < starts.length; i++) {
            let start = starts[i];
            starts_elements.push(
                <Week key={i} start={start} month={month} selected={this.props.selected}
                      onSelect={this.props.onSelect.bind(this)} minDate={this.props.minDate}
                      maxDate={this.props.maxDate} />
            );
        }
        return starts_elements;
    }
}

class Hours extends React.Component {

    constructor(props){
        super(props);
        this.move = this.move.bind(this);
        this.state = {
            view: DateUtilities.clone(this.props.view),
            enabled: true
        };
    }

    render() {
        let enabled = this.state.enabled;
        return React.createElement("div", {className: "month-header"},
            React.createElement("i", {className: (enabled ? "" : " disabled"), onClick: this.moveBackward.bind(this)},
                String.fromCharCode(9664)),
            React.createElement("span", null, DateUtilities.toAMPMFormat(this.state.view)),
            React.createElement("i", {className: (enabled ? "" : " disabled"), onClick: this.moveForward.bind(this)},
                String.fromCharCode(9654))
        );
    }

    moveBackward() {
        let view = DateUtilities.clone(this.state.view);
        view.setHours(view.getHours()-1);
        this.move(view, false);
    }

    moveForward() {
        let view = DateUtilities.clone(this.state.view);
        view.setHours(view.getHours()+1);
        this.move(view, true);
    }

    move(view, isForward) {
        this.setState({
            view: view
        });
        this.props.onTimeChange(view);
    }

    enable() {
        this.setState({ enabled: true });
    }
}

class Calendar extends React.Component {

    onMove(view, isForward) {
        this._weeks.moveTo(view, isForward);
    }

    onTransitionEnd() {
        this._monthHeader.enable();
    }

    render() {

        let class_name = "calendar" + (this.props.visible ? " visible" : "");
        return React.createElement("div", {className: class_name},
            <MonthHeader ref={(mh) => { this._monthHeader = mh }} view={this.props.view}
                         onMove={this.onMove.bind(this)} />,
            <WeekHeader />,
            <Weeks ref={(weeks) => {this._weeks = weeks}} view={this.props.view} selected={this.props.selected}
                   onTransitionEnd={this.onTransitionEnd.bind(this)} onSelect={this.props.onSelect.bind(this)}
                   minDate={this.props.minDate} maxDate={this.props.maxDate} />

            );
    }
}

class DatepickerComponent extends React.Component{

    constructor(props) {
        super(props);
        this.setMinDate = this.setMinDate.bind(this);
        this.setMaxDate = this.setMaxDate.bind(this);
        this.onSelect = this.onSelect.bind(this);
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.onTimeChange = this.onTimeChange.bind(this);

        let def = this.props.selected || new Date();
        this.state = {
            view: DateUtilities.clone(def),
            selected: DateUtilities.clone(def),
            selected_time: DateUtilities.clone(def),
            minDate: null,
            maxDate: null,
            visible: false
        }
    }

    componentDidMount(){
        document.addEventListener('click', this.handleClick.bind(this));
    }

    render(){
        return(
            React.createElement("div", {className: "ardp-date-picker"},
            React.createElement(
                "input", {
                    type: "text", className: "date-picker-trigger form-input", readOnly: true,
                    value: DateUtilities.toString(this.state.selected), onClick: this.show.bind(this),
                    name: 'date', id: 'date'
                }),
            <Calendar visible={this.state.visible} view={this.state.view} selected={this.state.selected}
                      onSelect={this.onSelect.bind(this)} minDate={this.state.minDate} maxDate={this.state.maxDate}
                      onTimeChange={this.onTimeChange.bind(this)}/>

            )
        );
    }

    handleClick(e){
        if (this.state.visible
            && e.target.className !== "date-picker-trigger"
            && !this.parentsHaveClassName(e.target, "date-picker")) {

            this.hide();
        }
    }

    parentsHaveClassName(element, className) {
        let parent = element;
        while (parent) {
            if (parent.className && parent.className.indexOf(className) > -1)
                return true;
            parent = parent.parentNode;
        }
    }

    setMinDate(date) {
        this.setState({ minDate: date });
    }

    setMaxDate(date) {
        this.setState({ maxDate: date });
    }

    onSelect(day) {
        let selected_date = day;
        selected_date.setHours(this.state.selected_time.getHours());
        this.setState({ selected: selected_date });
        this.props.onSelect(selected_date);
        this.hide();
    }

    show() {
        this.setState({ visible: true });
    }

    hide() {
        this.setState({ visible: false });
    }

    onTimeChange(date) {
        this.setState({ selected_time: date });
    }
}

export default DatepickerComponent;