var Workspace = React.createClass({
  getInitialState: function() {
    return {
      documents: this.props.documents_data,
      currentDocument: {
        id: null,
        sections: [
          {
            title: "",
            notes: "",
            elements: [
              {
                type: "heading",
                text: "INT. MILENIUM FRUIT & GROCERY - NIGHT"
              }
            ],
          }
        ],
        title: ""
      }
    };
  },

  handleDocumentSelect: function(document) {
    this.setState({
      currentDocument: {
        id: document.id,
        title: document.title,
        sections: JSON.parse(document.content)
      }
    });
  },

  uniqueId: function() {
    return "document-editor-" + new Date();
  },

  render: function() {
    return (
      <div className="workspace uk-grid uk-margin-top">
        <DocumentList
          onDocumentSelect={this.handleDocumentSelect}
          documents={this.state.documents} />
        <ScriptEditor
          key={this.uniqueId()}
          document={this.state.currentDocument}
          url="/api/v1/documents" />
      </div>
    );
  }
});
