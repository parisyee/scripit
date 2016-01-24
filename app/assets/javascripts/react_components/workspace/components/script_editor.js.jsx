var ScriptEditor = React.createClass({
  AUTOSAVE_TIMER: null,

  getInitialState: function() {
    return {
      document: {
        id: this.props.document.id,
        title: this.props.document.title,
        sections: JSON.parse(this.props.document.content)
      }
    };
  },

  bindTextareaResizer: function() {
  },

  url: function() {
    return this.props.url + "/" + this.state.document.id;
  },

  requestMethod: function() {
    return this.state.document.id ? "PUT" : "POST";
  },

  buildDocument: function() {
    return {
      title: this.state.document.title,
      content: JSON.stringify(this.state.document.sections)
    };
  },

  saveDocument: function() {
    $.ajax({
      url: this.url(),
      method: this.requestMethod(),
      data: { document: this.buildDocument() },
      dataType: "json",
      success: function(data) {
        $("#autosave-indicator").html("Changes Saved");
        if (!this.props.document.id) {
          var document = this.state.document;
          document.id = data.id;
          this.setState({ document: document });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  queueAutosave: function() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").html("Saving Changes...");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveDocument();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 2000);
  },

  handleDocumentDetailsChange: function() {
    var document = this.state.document;
    document.title = this.refs.title.value;
    this.setState({ document: document }, this.queueAutosave);
  },

  handleSectionChange: function(index, section) {
    this.setState(function(oldState) {
      var document = oldState.document;
      document.sections.splice(index, 1, section);

      return { document: document };
    }, this.queueAutosave);
  },

  render: function() {
    return (
      <div className="document-editor uk-height-1-1">
        <form className="uk-form uk-margin-bottom uk-margin-top">
          <input
            className="uk-margin-left uk-width-7-10"
            style={ { border: "none" } }
            type="text"
            name="document[title]"
            value={this.state.document.title}
            onChange={this.handleDocumentDetailsChange}
            ref="title" />
          <span
            className="uk-width-2-10 uk-margin-left"
            id="autosave-indicator"
            style={ { background: "orange" } }>
          </span>
        </form>
        <SectionList
          style={ { height: "90%" } }
          documentId={this.state.document.id}
          sections={this.state.document.sections}
          onSectionChange={this.handleSectionChange} />
      </div>
    );
  }
});
