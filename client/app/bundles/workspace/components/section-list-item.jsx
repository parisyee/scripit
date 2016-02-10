import React, { PropTypes } from "react";
import $ from "jquery";
import _ from "lodash";

export default class SectionListItem extends React.Component {
  static propTypes = {
    index: PropTypes.number.isRequired,
    onSectionSelect: PropTypes.func.isRequired,
    section: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    _.bindAll(this, "handleSectionSelect");
  };

  handleSectionSelect() {
    this.props.onSectionSelect(this.props.index);
  };

  sectionTitle() {
    return (
      this.props.section.title || `Section ${this.props.index + 1}`
    );
  };

  render() {
    return(
      <a
        href="javascript:void()"
        className="section-list-item"
        onClick={this.handleSectionSelect}>
        {this.sectionTitle()}
      </a>
    );
  };
};

