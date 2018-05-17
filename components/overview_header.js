import Clear from "./clear";

const searchList = (event) => {
    const input = event.target;

    let i, j, project, span;
    let found = 0;
    let search = input.value.toUpperCase();
    let id = input.name;
    let list = document.getElementById(id);
    
    project = list.querySelectorAll(".list-item");

    for (i = 0; i < project.length; i++) {
        span = project[i].querySelectorAll(".searchable");

        for (j = 0; j<span.length; j++) {
            if (!search || span[j].innerHTML.toUpperCase().indexOf(search) > -1) {
                // span[j].style.display = "inline-block";
                // span[j].style.fontWeight = "bold";
                found = 1;
            } else {
                // span[j].style.display = "none";
                // span[j].style.fontWeight = "normal";
            }
        }

        if (found) {
            project[i].style.display = "block";
            found = 0;
        } else {
            project[i].style.display = "none";
        }
    }
};

const OverviewHeader = (props) => (
    [
        <div key={Math.random()} className="list-header-with-image">
            <span className="clearfix list-icon">
                <img src={"/static/" + props.image} />
            </span>
            <div className="list-header">
                <span className="list-title">{props.title}</span>
                <span className="search-list">
                    <input type="text" name={props.id} onKeyUp={searchList} placeholder="Search for..." title="Type in what are you searching for." />
                </span>
                <Clear/>
                {props.columns.map(column => (<span key={Math.random()} className={column.className}>{column.title}</span>))}
            </div>
            <style global jsx>{`
                .list .list-header-with-image {
                    width: 100%;
                    font-size: 0.8em;
                    color: #ccc;
                    float: right;
                }
                .list .list-header-with-image .list-icon {
                    width: 73px;
                    float: left;
                    margin: 1% 2% 0 0;
                }
                .list .list-header-with-image .list-icon img {
                    width: 100%;
                    border-radius: 50%;
                }
                .list .list-header {
                    width: calc(98% - 73px);
                    float: right;
                }
                .list .list-header .list-title {
                    height: 1.3em;
                    font-size: 1.8em;
                    color: #ffffff;
                    width: 63%;
                    display: inline-block;
                }
                .list .list-header .search-list {
                    height: 1.3em;
                    display: table-cell;
                    vertical-align: middle;
                    font-size: 1.8em;
                    width: 230px;
                    float: right;
                    margin-right: 0;
                    background: url("/static/search-icon.png") top left no-repeat;
                    background-size: auto 1.3em;
                }
                .list .list-header .search-list input {
                    font-size: 0.8em;
                    line-height: 1em;
                    height: 1.6em;
                    padding: 0 1em;
                    width: 160px;
                    float: right;
                    border: none;
                    border: solid 1px #ccc;
                    border-radius: 15px;
                }
                .list .list-header span {
                    display: inline-block;
                    margin: 1% 3%;
                }
                .list.six-col .list-header span {
                    margin: 1%;
                }
                .list .list-header .name {
                    width: 15%;
                }
                .list .list-header .project-id {
                    width: 15%;
                }
                .list .list-header .person {
                    width: 20%;
                }
                .list .list-header .status {
                    width: 23%;
                }
                .list.five-col .list-header .status {
                    width: 20%;
                }
                .list .list-header .due-date {
                    padding-left: 2px;
                    width: 8%;
                }
                .list .list-header .date-finished {
                    padding-left: 15%;
                    width: 8%;
                }
                .list .list-header .attention {
                    width: 2%;
                }
                .list .list-header .email {
                    width: 20%;
                }
                .list .list-header .first-name {
                    width: 15%;
                }
                .list .list-header .last-name {
                    width: 15%;
                }
            `}</style>
        </div>,
        <Clear key={Math.random()} />
    ]
);

export default OverviewHeader;