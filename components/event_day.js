const EventDay = (props) => {
    let index = props.index ? props.index : 0;
    let dayWidth = parseInt(props.dayWidth);
    let left = (index * dayWidth) - 1;

    return (<div className={"event" + (props.temporary ? " temporary" : "")}>
        <style jsx>{`
            .event {
                position: absolute;
                left: ${left}px;
                top: ${65 - dayWidth}px;
                width: ${(dayWidth * 2) - 1}px;
                height: ${(dayWidth * 2) - 1}px;
                border-radius: ${dayWidth}px;
                border: 1px solid #ffffff;
                background-color: #00FF21;
                opacity: 0.5;
            }
            .event.temporary {
                background-color: #9D9D9D;
            }
        `}</style>
    </div>);
};

export default EventDay;