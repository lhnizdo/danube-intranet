import Clear from "./clear";
import { Link } from "../routes";

let dateFormat = require('dateformat');

function getItemContent(item, key, className, link) {
    if (item === null || item[key] === null) {
        return <span className={className}>&nbsp;</span>;
    }

    let value = item[key];

    // 2018-02-01T00:00:00.000Z
    if (/\d{4}-\d{2}-\d{2}.*/.test(value)) {
        value = dateFormat(new Date(value), "dd.mm.yyyy");
    }

    const ItemTag = `${(link && link.key === key) ? 'a' : 'span'}`;

    if (key.indexOf("image") > -1) {
        return <ItemTag key={key + Math.random()} className={className}><img src={"static/" + value} /></ItemTag>
    } else if (key === "attention") {
        return <ItemTag key={key + Math.random()} className={className}
                        style={{backgroundColor: (value === "critical" ? "red" : (value === "warning" ? "orange" : "none"))}}><img
            width="100%" style={{display: "inline"}} src="static/exclamation-mark.png"/></ItemTag>
    } else if (key.substring(0, 2) !== "__") {
        return <ItemTag key={key + Math.random()} className={className + " searchable"}>{value}</ItemTag>
    }

    return null;
}

function processItem(item, key, prefix, link) {
    if (item === null && key === null) {
        return <span>&nbsp;</span>;
    }

    if (key.indexOf('/') > -1) {
        let keyParts = key.split('/');

        if (keyParts.length > 1) {
            return processItem(item[keyParts[0]], keyParts[1], keyParts[0] + '-', link);
        }

        return null;
    }

    const className = (prefix + key).replace(/_/g, '-');
    const content = getItemContent(item, key, className, link);

    if (link && link.key === key) {
        const params = {};
        params["uuid"] = item[link.param];

        return (<Link route={link.route} params={params}>{content}</Link>);
    }

    return  content;
}

const OverviewList = (props) => {
    let keys = [];

    if (props.whitelist && props.whitelist.length > 0) {
        keys = props.whitelist;
    } else {
        keys = Object.keys(props.items[0]);
    }

    let link = null;

    if (props.link && props.link.key && props.link.param && props.link.route) {
        link = props.link;
    }

    return [
        <div key={Math.random()} className="list-content">
            {props.items.map(item => (<div key={Math.random()} className="list-item">
                {keys.map(key => processItem(item, key, '', link))}
            </div>))}
            <style global jsx>{`
                .list .list-content {
                    width: calc(98% - 73px);
                    border-top: 1px solid #b2b2b2;
                    border-bottom: 1px solid #b2b2b2;
                    float: right;
                }
                .list .list-content .list-item span,
                .list .list-content .list-item a {
                    display: inline-block;
                    margin: 1% 3%;
                    height: 2em;
                    line-height: 2em;
                    vertical-align: middle;
                }
                .list .list-content .list-item a {
                    color: #ffffff;
                }
                .list.six-col .list-content .list-item span,
                .list.six-col .list-content .list-item a {
                    margin: 1%;
                }
                .list .list-content .list-item .name {
                    width: 15%;
                }
                .list .list-content .list-item .project-id {
                    width: 15%;
                }
                .list .list-content .list-item .person-image {
                    width: 28px;
                    margin-right: 5px !important;
                }
                .list .list-content .list-item .person-image img {
                    width: 100%;
                    border-radius: 50%;
                    margin: 0;
                    vertical-align: middle;
                }
                .list .list-content .list-item .person-name {
                    width: 17.3%;
                    margin-left: 0 !important;
                }
                .list .list-content .list-item .email {
                    width: 20%;
                }
                .list .list-content .list-item .owner-full-name,
                .list .list-content .list-item .assigned-full-name {
                    width: 20%;
                }
                .list.four-col .list-content .list-item .owner-first-name,
                .list.four-col .list-content .list-item .owner-last-name,
                .list.four-col .list-content .list-item .assigned-first-name,
                .list.four-col .list-content .list-item .assigned-last-name {
                    width: 7%;
                }
                .list.six-col .list-content .list-item .owner-first-name,
                .list.six-col .list-content .list-item .owner-last-name,
                .list.six-col .list-content .list-item .assigned-first-name,
                .list.six-col .list-content .list-item .assigned-last-name {
                    width: 10%;
                }
                .list.three-col .list-content .list-item .first-name,
                .list.three-col .list-content .list-item .last-name {
                    width: 15%;
                }
                .list.six-col .list-content .list-item .status-description {
                    border: 1px solid #ffffff;
                    text-align: center;
                    width: 23%;
                }
                .list.five-col .list-content .list-item .status-description {
                    border: 1px solid #ffffff;
                    text-align: center;
                    width: 20%;
                }
                .list.four-col .list-content .list-item .status-description {
                    border: none;
                    text-align: left;
                    width: 23%;
                }
                .list .list-content .list-item .due-date {
                    width: 8%;
                }
                .list .list-content .list-item .start-date {
                    width: 8%;
                }
                .list .list-content .date-finished {
                    padding-left: 15%;
                    width: 8%;
                }
                .list.six-col .list-content .list-item .attention {
                    height: 1.5em;
                    width: 1.5em;
                    border-radius: 50%;
                }
                .list .list-content .list-item .attention img#attention {
                    display: none;
                }
            `}</style>
        </div>,
        <Clear key={Math.random()} />
    ]
};

export default OverviewList;