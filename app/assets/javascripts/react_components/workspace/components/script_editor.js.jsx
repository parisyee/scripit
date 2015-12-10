var ScriptEditor = React.createClass({
  AUTOSAVE_TIMER: null,

  getInitialState: function() {
    return { document: this.props.document };
  },

  // shouldComponentUpdate: function(nextProps, nextState) {
  //   if (nextProps.document.id !== this.state.document.id) {
  //     this.setState({ document: nextProps.document });
  //     this.forceUpdate();
  //   }

  //   return true;
  // },

  url: function() {
    var id;
    if (this.state.document.id) {
      id = "/" + this.state.document.id;
    } else {
      id = "";
    }
    return this.props.url + id;
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

  sectionList: function() {
    console.log("EDITOR - state.document.sections: %o", this.state.document.sections);
    return (
      <SectionList
        documentId={this.state.document.id}
        sections={this.state.document.sections}
        onSectionChange={this.handleSectionChange} />
    );
  },

  render: function() {
    return (
      <div className="document-editor uk-width-2-3">
        <div id="autosave-indicator"></div>
        <form className="uk-form">
          <div className="uk-form-row">
            <input
              className="uk-width-1-1"
              type="text"
              name="document[title]"
              value={this.state.document.title}
              onChange={this.handleDocumentDetailsChange}
              ref="title" />
          </div>
        </form>
        {this.sectionList()}
      </div>
    );
  }
});
