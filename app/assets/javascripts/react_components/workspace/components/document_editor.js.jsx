var DocumentEditor = React.createClass({
  AUTOSAVE_TIMER: null,

  getInitialState: function() {
    return {
      documentID: this.props.documentID,
      content: this.props.content,
      title: this.props.title
    };
  },

  shouldComponentUpdate: function(nextProps, nextState) {
    if (nextProps.documentID !== this.props.documentID) {
      this.setState({
        content: nextProps.content,
        title: nextProps.title
      });
    }

    return true;
  },

  url: function() {
    var id;
    if (this.props.documentID) {
      id = "/" + this.props.documentID;
    } else {
      id = "";
    }
    return this.props.url + id;
  },

  method: function() {
    return this.props.documentID ? "PUT" : "POST";
  },

  saveDocument: function() {
    $.ajax({
      url: this.url(),
      method: this.method(),
      data: {
        document: {
          title: this.state.title,
          content: this.state.content
        }
      },
      dataType: "json",
      success: function(data) {
        document.getElementById("autosave-indicator").innerHTML = "Changes Saved";
        if (!this.props.documentID) {
          this.setState({
            documentID: data.id
          });
        }
      }.bind(this),
      error: function(xhr, status, err) {
        console.log(err);
      }
    });
  },

  handleChange: function(e) {
    e.preventDefault();

    this.setState({
      content: this.refs.content.value,
      title: this.refs.title.value
    });

    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    document.getElementById("autosave-indicator").innerHTML = "Saving Changes...";

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveDocument();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 2000);
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
              value={this.state.title}
              onChange={this.handleChange}
              ref="title" />
          </div>
          <div className="uk-form-row">
            <textarea
              className="uk-width-1-1"
              name="document[content]"
              value={this.state.content}
              onChange={this.handleChange}
              ref="content"></textarea>
          </div>
        </form>
      </div>
    );
  }
});
