var ScreenplayEditor = React.createClass({
  AUTOSAVE_TIMER: null,

  getInitialState: function() {
    return {
      screenplay: {
        id: this.props.screenplay.id,
        title: this.props.screenplay.title,
        sections: JSON.parse(this.props.screenplay.content)
      }
    };
  },

  bindTextareaResizer: function() {
  },

  url: function() {
    return this.props.url + "/" + this.state.screenplay.id;
  },

  requestMethod: function() {
    return this.state.screenplay.id ? "PUT" : "POST";
  },

  buildScreenplay: function() {
    return {
      title: this.state.screenplay.title,
      content: JSON.stringify(this.state.screenplay.sections)
    };
  },

  saveScreenplay: function() {
    $.ajax({
      url: this.url(),
      method: this.requestMethod(),
      data: { screenplay: this.buildScreenplay() },
      dataType: "json",
      success: function(data) {
        $("#autosave-indicator").html("Changes Saved");
        if (!this.props.screenplay.id) {
          var screenplay = this.state.screenplay;
          screenplay.id = data.id;
          this.setState({ screenplay: screenplay });
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
      this.saveScreenplay();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 2000);
  },

  handleScreenplayDetailsChange: function() {
    var screenplay = this.state.screenplay;
    screenplay.title = this.refs.title.value;
    this.setState({ screenplay: screenplay }, this.queueAutosave);
  },

  handleSectionChange: function(index, section) {
    this.setState(function(oldState) {
      var screenplay = oldState.screenplay;
      screenplay.sections.splice(index, 1, section);

      return { screenplay: screenplay };
    }, this.queueAutosave);
  },

  render: function() {
    return (
      <div className="uk-height-1-1">
        <form className="uk-form uk-margin-bottom uk-margin-top">
          <input
            className="uk-margin-left uk-width-7-10"
            style={ { border: "none" } }
            type="text"
            name="screenplay[title]"
            value={this.state.screenplay.title}
            onChange={this.handleScreenplayDetailsChange}
            ref="title" />
          <span
            className="uk-width-2-10 uk-margin-left"
            id="autosave-indicator"
            style={ { background: "orange" } }>
          </span>
        </form>
        <ScreenplaySectionList
          style={ { height: "90%" } }
          screenplayId={this.state.screenplay.id}
          sections={this.state.screenplay.sections}
          onSectionChange={this.handleSectionChange} />
      </div>
    );
  }
});
