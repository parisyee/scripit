var DocumentList = React.createClass({
  render: function() {
    var onDocumentSelect = this.props.onDocumentSelect;

    listItemNodes = this.props.documents.map(function(document){
      return (
        <DocumentListItem
          onDocumentSelect={onDocumentSelect}
          document={document} />
      );
    });

    return (
      <div className="document-list">
        {listItemNodes}
      </div>
    );
  }
});

var DocumentListItem = React.createClass({
  handleClick: function(e) {
    e.preventDefault();
    this.props.onDocumentSelect(this.props.document);
  },

  render: function() {
    return (
      <div className="document-list-item">
        <a href="javascript:void()" onClick={this.handleClick}>
          ID: {this.props.document.id} - TITLE: {this.props.document.title}
        </a>
      </div>
    );
  }
});
