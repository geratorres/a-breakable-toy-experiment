import React, { Component } from 'react';
import { connect } from "react-redux";

import { Table } from 'antd';

import { fetchContactsAction, deleteContactAction } from "../actions/contactActions";

class ContactsTable extends Component {
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
      ]
    };
  }

  componentWillMount() {
    const { dispatch, contactsPager } = this.props;

    dispatch(fetchContactsAction({ pager: contactsPager }));
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
    const { contactsPager, isFetching, contacts } = this.props;
    const { columns } = this.state;

    const parsedContacts = contacts.map((contact, index) => {
      return Object.assign({}, contact, { key: index });
    });

    return (
      <Table columns={columns} dataSource={parsedContacts}
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

export default connect(mapStateToProps)(ContactsTable);
