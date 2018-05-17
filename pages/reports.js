import gql from 'graphql-tag';

import LayoutWithData from '../components/layout_with_data';
import Overview from "../components/overview";

const getTasksQuery = gql`
    query getTasksQuery {
        tasks_including_status_and_user
    }
`;

export const columns = [
    {
        className: "due-date",
        title: "Start Date"
    },
    {
        className: "name",
        title: "Task Name"
    },
    {
        className: "person",
        title: "Person"
    },
    {
        className: "status",
        title: "Status"
    },
    {
        className: "duration",
        title: "Duration"
    }
];

export default () => {
    return (
        <LayoutWithData>
            <div className="center">
                <Overview title="Current tasks" id="currentTasks" columns={columns}
                          query={getTasksQuery} dataKey="tasks_including_status_and_user" dataProperty="items"
                          whitelist={['start_date', 'name', 'assigned/full_name', 'status/description', 'duration']}
                          link={{key: 'name', param: 'application_uuid', route: 'edit-application'}}
                          image="running-applications.png" />
            </div>
        </LayoutWithData>
    );
};