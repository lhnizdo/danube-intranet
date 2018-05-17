import React from 'react';
import Layout from "../components/layout";

export default () => {
    return (
        <Layout>
            <div className="center">
                <form action="/login" method="post">
                    <input type="text" name="email" placeholder="email" />
                    <input type="password" name="password" placeholder="password" />
                    <input type="submit" name="login" value="Login" />
                </form>
            </div>
        </Layout>
    );
};