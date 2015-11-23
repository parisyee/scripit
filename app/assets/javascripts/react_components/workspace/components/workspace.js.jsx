var Workspace = React.createClass({
  getInitialState: function() {
    return {
      documents: this.props.documents_data,
      currentDocument: {}
    };
  },

  handleDocumentSelect: function(document) {
    this.setState({ currentDocument: document });
  },

  render: function() {
    return (
      <div className="workspace uk-grid uk-margin-top">
        <DocumentList
          onDocumentSelect={this.handleDocumentSelect}
          documents={this.state.documents} />
        <DocumentEditor
          documentID={this.state.currentDocument.id}
          content={this.state.currentDocument.content}
          title={this.state.currentDocument.title}
          url="/api/v1/documents" />
      </div>
    );
  }
});
