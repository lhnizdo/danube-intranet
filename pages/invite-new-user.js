import React from 'react';
import Layout from "../components/layout";

export default () => {
    return (
        <Layout>
            <div className="center">
                <form action="/invite-new-user" method="post">
                    <input type="text" name="email" placeholder="email" />
                    <input type="text" name="first_name" placeholder="first name" />
                    <input type="text" name="last_name" placeholder="last name" />
                    <label htmlFor="role">Is manager?</label>
                    <input type="checkbox" id="role" value="manager" name="role" />
                    <input type="submit" name="invite" value="Invite" />
                </form>
            </div>
        </Layout>
    );
};