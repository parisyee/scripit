var Workspace = React.createClass({
  getInitialState: function() {
    return {
      documents: this.props.documents_data,
      currentDocument: {
        id: null,
        elements: [{type: "heading", text: "INT. MILENIUM FRUIT & GROCERY - NIGHT"}],
        title: ""
      }
    };
  },

  handleDocumentSelect: function(document) {
    this.setState({
      currentDocument: {
        id: document.id,
        title: document.title,
        elements: JSON.parse(document.content)
      }
    });
  },

  render: function() {
    return (
      <div className="workspace uk-grid uk-margin-top">
        <DocumentList
          onDocumentSelect={this.handleDocumentSelect}
          documents={this.state.documents} />
        <ScriptEditor
          documentID={this.state.currentDocument.id}
          elements={this.state.currentDocument.elements}
          title={this.state.currentDocument.title}
          url="/api/v1/documents" />
      </div>
    );
  }
});
