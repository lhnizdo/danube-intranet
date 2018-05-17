import Link from 'next/link';

import gql from 'graphql-tag';

import LayoutWithData from '../components/layout_with_data';
import Overview from "../components/overview";

const getApplicationsQuery = gql`
    query getApplicationsQuery {
        applications
    }
`;

export const columns = [
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

export default () => (
    <LayoutWithData>
        <div className="center">
            <Overview title="All applications" id="newestServiceEntries" columns={columns}
                      query={getApplicationsQuery} dataKey="applications" dataProperty="items"
                      whitelist={['name', 'project_id', 'owner/full_name', 'status/description', 'due_date']}
                      link={{key: 'name', param: 'uuid', route: 'edit-application'}}
                      image="newest-service-entries.png">
                <Link href="/add-application">
                    <a className="add-new">Start New Application</a>
                </Link>
            </Overview>
        </div>
    </LayoutWithData>
);