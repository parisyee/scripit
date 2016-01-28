import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";

export default class Section extends React.Component {
  static propTypes = {
    section: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.state = { section: props.section };
    this.AUTOSAVE_TIMER = null;

    _.bindAll(this, "handleChange");
  };

  buildSection() {
    return {
      title: this.state.section.title,
      notes: this.state.section.notes
    };
  };

  handleChange() {
    const section = this.state.section;
    section.title = this.refs.title.value;
    section.notes = this.refs.notes.value;
    this.setState({ section: section }, this.queueAutosave);
  };

  queueAutosave() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").html("Unsaved Changes");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveSection();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  };

  saveSection() {
    $("#autosave-indicator").html("Saving Changes...");

    $.ajax({
      url: this.props.section.url,
      method: "PUT",
      data: { section: this.buildSection() },
      dataType: "json",
      beforeSend: ((xhr) => {
        xhr.setRequestHeader(
          'X-CSRF-Token',
          $('meta[name=csrf-token]').attr('content')
        );
      }),
      success: ((data) => {
        $("#autosave-indicator").html("Changes Saved");
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
      }
    });
  };

  render() {
    return(
      <div>
        <input
          name="section[title]"
          ref="title"
          onInput={this.handleChange}
          defaultValue={this.state.section.title} />
        <textarea
          name="section[notes]"
          ref="notes"
          onInput={this.handleChange}
          defaultValue={this.state.section.notes}></textarea>
      </div>
    );
  }
}

