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

const showAll = (element) => {
    let overview = document.getElementById(element.name);

    if (overview) {
        let searchLists = overview.getElementsByClassName("search-list");

        if (searchLists && searchLists.length > 0) {
            for (let i = 0; i < searchLists[0].children.length; i++) {
                let input = searchLists[0].children[i];

                if (input && input.name === element.name) {
                    input.value = "";
                    searchList({target: input});

                    return;
                }
            }
        }
    }
};

const OverviewButtons = (props) => (
    [
        <div key={Math.random()} className="after-list">
            {props.children}
            {!props.hideShowAllButton ? <button className="butt-show-all" name={props.id} onClick={(event) => showAll(event.target)}>Show All</button> : null}
            <style global jsx>{`
                .after-list {
                    width: 96%;
                    float: right;
                }
                a.add-new {
                    text-decoration: none;
                    line-height: 1.4;
                    background-color: #3c3c3b;
                    background: url("static/add-new.png") no-repeat 5% 50%;
                    background-size: 1em 1em;
                    color: white;
                    padding: 0.5% 1%;
                    padding-left: 3em;
                    margin: 1%;
                    float: left;
                    border: none;
                    border: solid 2px #9D9D9D;
                    border-radius: 10px;
                }
                a.add-new:hover {
                    background-color: #565656;
                }
                .butt-show-all {
                    cursor: pointer;
                    background-color: #3c3c3b;
                    color: white;
                    line-height: 1.4;
                    padding: 0.5% 1%;
                    margin: 1%;
                    float: right;
                    border: none;
                    border: solid 2px #9D9D9D;
                    border-radius: 10px;
                }
                .butt-show-all:hover {
                    background-color: #565656;
                }
            `}</style>
        </div>,
        <Clear key={Math.random()} />
    ]
);

export default OverviewButtons;