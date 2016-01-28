import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";
import Section from "./section";

export default class ScreenplayEditor extends React.Component {
  static propTypes = {
    screenplay: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    this.AUTOSAVE_TIMER = null;
    this.state = { screenplay: this.props.screenplay };

    _.bindAll(this, "handleChange");
  };

  screenplayTitle() {
    return (
      this.state.screenplay.title || "Untitled"
    );
  };

  buildScreenplay() {
    return { title: this.state.screenplay.title };
  };

  handleChange() {
    const screenplay = this.state.screenplay;
    screenplay.title = this.refs.title.value;
    this.setState({ screenplay: screenplay }, this.queueAutosave);
  };

  queueAutosave() {
    if (this.AUTOSAVE_TIMER) {
      clearTimeout(this.AUTOSAVE_TIMER);
    }

    $("#autosave-indicator").html("Unsaved Changes");

    this.AUTOSAVE_TIMER = setTimeout(function() {
      this.saveScreenplay();
      this.AUTOSAVE_TIMER = null;
    }.bind(this), 1750);
  };

  saveScreenplay() {
    $("#autosave-indicator").html("Saving Changes...");

    $.ajax({
      url: this.props.screenplay.url,
      method: "PUT",
      data: { screenplay: this.buildScreenplay() },
      dataType: "json",
      success: ((data) => {
        $("#autosave-indicator").html("Changes Saved");
      }).bind(this),
      error: (xhr, status, err) => {
        console.log(err);
      }
    });
  };

  sectionNode() {
    if (this.state.screenplay.sections.length > 0) {
      return (
        <Section section={this.state.screenplay.sections[0]} />
      );
    }
  };

  render() {
    return (
      <div className="screenplay-editor">
        <input
          className="uk-margin-left uk-width-7-10"
          defaultValue={this.screenplayTitle()}
          name="screenplay[title]"
          onChange={this.handleChange}
          ref="title" />
        {this.sectionNode()}
      </div>
    );
  };
}
