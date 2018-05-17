import DayRange from './day_range';

const Week = (props) => (
    <DayRange startDate={props.startDate} numberOfDays="7" />
);

export default Week;