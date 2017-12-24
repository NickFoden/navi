import React, { Component } from 'react'
import './Users.css'

class Users extends Component {
    render() {
        let nav = this.props.nav

        return (
            <div className="Users">
                <div className="Users-content">
                    {   nav.child
                        ? (nav.child.content && React.createElement(nav.child.content, { nav: nav.child }))
                        : (nav.content && React.createElement(nav.content, { nav: nav.child }))
                    }
                </div>
            </div>
        );
    }
}


class UserDetails extends Component {
    render() {
        return <div><h2>User #{this.props.nav.params.id}</h2></div>
    }
}

export default {
    meta: {
        title: 'Users',
        wrapper: Users,
    },

    getContent: () => import('./UserList').then(m => m.default),

    children: {
        '/:id': Promise.resolve({
            meta: {
                title: 'User details',
            },

            params: ['id'],

            getContent: () => Promise.resolve(UserDetails),
        }),
    },
}