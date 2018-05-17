import Link from 'next/link';

import gql from 'graphql-tag';

import LayoutWithData from '../components/layout_with_data';
import Overview from "../components/overview";

const runningApplicationsQuery = gql`
    query runningApplicationsQuery {
        running_applications
    }
`;

const applicationsOnHoldQuery = gql`
    query applicationsOnHoldQuery {
        applications_on_hold
    }
`;

const completedApplicationsQuery = gql`
    query completedApplicationsQuery {
        completed_applications
    }
`;

export const runningApplications = [
    {
        className: "name",
        title: "Project Name"
    },
    {
        className: "project-id",
        title: "Project ID"
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
        className: "due-date",
        title: "Due Date"
    },
    {
        className: "",
        title: ""
    }
];

export const applicationsOnHold = [
    {
        className: "name",
        title: "Project Name"
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
        className: "due-date",
        title: "Due Date"
    }
];

export const completedApplications = [
    {
        className: "name",
        title: "Project Name"
    },
    {
        className: "person",
        title: "Person"
    },
    {
        className: "due-date",
        title: "Due Date"
    },
    {
        className: "date-finished",
        title: "Date Finished"
    },
];

export default () => (
    <LayoutWithData>
        <div className="center">
            <Overview title="Running Applications" id="runningApplications" columns={runningApplications}
                      query={runningApplicationsQuery} dataKey="running_applications" dataProperty="items"
                      whitelist={['name', 'project_id', 'owner/full_name', 'status/description', 'due_date']}
                      link={{key: 'name', param: 'uuid', route: 'edit-application'}}
                      image="running-applications.png">
                <Link href="/add-application">
                    <a className="add-new">Start New Application</a>
                </Link>
            </Overview>
            <Overview title="Applications On Hold" id="applicationsOnHold" columns={applicationsOnHold}
                      query={applicationsOnHoldQuery} dataKey="applications_on_hold" dataProperty="items"
                      whitelist={['name', 'owner/full_name', 'status/description', 'due_date']}
                      link={{key: 'name', param: 'uuid', route: 'edit-application'}}
                      image="newest-service-entries.png" />
            <Overview title="Completed Applications" id="completedApplications" columns={completedApplications}
                      query={completedApplicationsQuery} dataKey="completed_applications" dataProperty="items"
                      whitelist={['name', 'owner/full_name', 'due_date', 'date_finished']}
                      image="newest-service-entries.png"/>
        </div>
    </LayoutWithData>
);