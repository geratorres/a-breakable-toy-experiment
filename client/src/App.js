import React, { Component } from 'react';
import './styles/App.css';
//TODO import only components css used
import 'antd/dist/antd.css';

import { connect } from "react-redux";

import { fetchContactsAction, deleteContactAction } from "./actions/contactActions";

import { Row, Col } from 'antd';
import { Table } from 'antd';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { title: 'Name', dataIndex: 'firstName', key: 'firstName', },
        { title: 'Last Name', dataIndex: 'lastName', key: 'lastName', },
        { title: 'Company', dataIndex: 'company', key: 'company', },
        { title: 'Phone Number', dataIndex: 'phoneNumber', key: 'phoneNumber', },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        {
          title: 'Action', key: 'action',
          render: (text, record) => (<a onClick={this.onContactDelete.bind(this, record._id)}>Delete</a>),
        }
      ],
      contacts: []
    };
  }

  componentWillMount() {
    const { dispatch, contactsPager } = this.props;

    dispatch(fetchContactsAction(contactsPager));
  }

  componentDidUpdate(prevProps) {
    const { contacts } = this.props;

    if (contacts != prevProps.contacts) {
      const parsedContacts = contacts.map((contact, index) => {
        return Object.assign({}, contact, { key: index });
      });

      this.setState({ contacts: parsedContacts });
    }
  }

  onPagerChange(page, pageSize) {
    const { dispatch } = this.props;

    dispatch(fetchContactsAction({ pager: { page } }));
  }

  onContactDelete(id) {
    const { dispatch } = this.props;

    dispatch(deleteContactAction(id));
  }

  render() {
    const { contactsPager, isFetching } = this.props;
    const { columns, contacts: data } = this.state;

    return (
      <Table columns={columns} dataSource={data}
        pagination={{ ...contactsPager, onChange: this.onPagerChange.bind(this) }}
        loading={isFetching}
      />
    );
  }
}

const mapStateToProps = state => {
  return {
    contacts: state.contacts,
    contactsPager: state.pager
  };
};

export default connect(mapStateToProps)(App);
