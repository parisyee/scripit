import React, { PropTypes } from "react";
import classNames from "classnames";

export default React.createClass({
  propTypes: {
    active: PropTypes.bool.isRequired,
    index: PropTypes.number.isRequired,
    onSectionSelect: PropTypes.func.isRequired,
    section: PropTypes.object.isRequired
  },

  handleSectionSelect: function() {
    this.props.onSectionSelect(this.props.index);
  },

  listItemClasses: function() {
    return classNames(
      "section-list-item",
      { active: this.props.active }
    );
  },

  sectionTitle: function() {
    return (
      this.props.section.title || `Section ${this.props.index + 1}`
    );
  },

  render: function() {
    return(
      <a
        className={this.listItemClasses()}
        onClick={this.handleSectionSelect}
      >
        {this.sectionTitle()}
      </a>
    );
  }
})

